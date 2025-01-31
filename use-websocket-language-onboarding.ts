import {useEffect, useState} from 'react';

import toast from 'react-hot-toast';
import {VITE_AI_BASE_URL} from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import { CustomErrorToast } from '@/shared/components/atomic-components/custom-react-hot-toast';

interface IwebSocketlanguageOnboardingProps {
	url: string;
	assistantId: string;
	userId: string;
	onPipelineError?:()=>void;
}
export type ScriptType = 'compiler' | 'error_check' | 'unit_test';

interface IwebSocketResponse {
	assistant_id: string;
	status: 'in_progress' | 'completed' | 'error';
	stage?: 'compiler_check' | 'error_check' | 'unit_test'|'pipeline';
	message: string;
	progress?: number;
	timestamp: string;
	output?: string;
	logs?: string;
	compiler_script?: string;
	error_check_script?: string;
	unit_test_script?: string;
	real_time_logs?:string;
}
interface StageStatus {
	compiler_check: {
		loading: boolean;
		completed: boolean;
		output?: string;
		logs?: string;
		real_time_logs?:string;
	};
	error_check: {
		loading: boolean;
		completed: boolean;
		output?: string;
		logs?: string;
		real_time_logs?:string;
	};
	unit_test: {
		loading: boolean;
		completed: boolean;
		output?: string;
		logs?: string;
		real_time_logs?:string;
	};
  pipeline?: unknown;
	
}


export const useWebSocketLanguageOnboarding = ({url, assistantId, userId,onPipelineError}: IwebSocketlanguageOnboardingProps) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [webSocketResponse, setWebSocketResponse] = useState<IwebSocketResponse | null>(null);

	const [stateStatus, setStateStatus] = useState<StageStatus>({
		compiler_check: {loading: false, completed: false, output: '', logs: ''},
		error_check: {loading: false, completed: false, output: '', logs: ''},
		unit_test: {loading: false, completed: false, output: '', logs: ''},
	});


	useEffect(() => {
		if (!assistantId || !userId) {
			return;
		}
		if(socket) return;
		const url = `${VITE_AI_BASE_URL}/compiler/ws/testingpipeline?assistant_id=${assistantId}&user_id=${userId}`;
		const websocket = new WebSocket(url);

		websocket.addEventListener('open', () => {
			toast.success('Connected to the Appmod.ai testing environment');
			setIsConnected(true);
			setError(null);
		});

		websocket.onerror = (event) => {
			const errorMessage = (event as ErrorEvent).message;
			setError(errorMessage);
			setStateStatus((previous) => ({
				compiler_check: {...previous.compiler_check, loading: false},
				error_check: {...previous.error_check, loading: false},
				unit_test: {...previous.unit_test, loading: false}
			}));
		};

		websocket.onmessage = (event) => {
			try {
				const data: IwebSocketResponse = JSON.parse(event.data) ;

				if (data.stage === 'pipeline' && data.status === 'error') {
				
					if (websocket.readyState === WebSocket.OPEN) {
						websocket.close();
					}
					setError(data?.message);
					setStateStatus((previous)=>({
					compiler_check:{...previous.compiler_check,loading:false},
					error_check:{...previous.error_check,loading:false},
					unit_test:{...previous.unit_test,loading:false},
					pipeline:{logs:data.logs??'',output:data.output??''}
					}))
					onPipelineError?.();
					return null;
				}

				setWebSocketResponse(data);
				if (data.status == 'completed' && data.message === 'Pipeline completed successfully') {
					setStateStatus((previous) => ({
						...previous,
						[data.stage!]: {
							...(previous[data.stage!] as object),
							loading: false,
							completed: true,
							logs: data.logs,
							real_time_logs:data.real_time_logs,
							output: data.output
						}
					}));
					toast.success('All scripts have been run successfully');
					if (websocket.readyState === WebSocket.OPEN) {
						websocket.close();
					}
				}


				if (data.stage) {
					setStateStatus((previousState) => ({
						...previousState,
						[data.stage!]: {
							loading: data?.status==='in_progress',
							completed: data?.status === 'completed',
							output: data?.output ?? (previousState[data.stage!] as { output?: string }).output,
							logs: data?.logs ?? (previousState[data.stage!] as { logs?: string }).logs,
							real_time_logs:data.real_time_logs
						}
					}));
					if (data?.status === 'error') {
						setError(data?.message);
						setStateStatus((previous) => ({
							...previous,
							[data.stage!]:{
								...(previous[data.stage!] as object),
								loading: false,
								logs: data.logs ?? '',
								output: data.output ?? '',
								real_time_logs:data.real_time_logs??''
							}
						}));
						CustomErrorToast({
							message: 'Some issues might be there in the scripts. please click on open in editor to edit the scripts',
							duration: 10_000,
						});
					}
				}
			} catch (error) {
				console.log("Parse error",error);
				toast.error('Failed to parse WebSocket message:');
			}
		};

		websocket.addEventListener('close', () => {
			setIsConnected(false);
		});

		setSocket(websocket);
		return () => {
			websocket.close();
		};
	}, [url, assistantId, userId]);

	const startPipeline = () => {
		if (socket && isConnected) {
			setStateStatus({
				compiler_check: {loading: true, completed: false},
				error_check: {loading: false, completed: false},
				unit_test: {loading: false, completed: false}
			});
			setError(null);
			const data = {
				event: 'start_pipeline'
			};
			socket.send(JSON.stringify(data));
		}
	};


	const updateModifiedScript=useMutation({
		mutationFn:async({scriptType,content}:{scriptType:ScriptType,content:string})=>{
			if(!socket||!isConnected){
				console.log('Socket not connected',socket,isConnected);
				throw new Error('Socket not connected');
			}
			return new Promise((resolve,reject)=>{
				const handleScriptUpdate=(event:MessageEvent)=>{
					const response=JSON.parse(event.data);
					if(response.event==='update_script'){
						if(response.status==='success'&&response.script_type===scriptType){
							socket.removeEventListener('message',handleScriptUpdate);
							resolve(response.data);
						}else{
							socket.removeEventListener('message',handleScriptUpdate);
							reject(new Error(response.error||'Script update failed'));
						}
					}

				}
				socket?.addEventListener('message',handleScriptUpdate);
				const data={
					event:'update_script',
				payload:{
					script_type: scriptType,
					data:content
				}
				}
				try{
					socket.send(JSON.stringify(data));
				}
				catch(error){
					socket.removeEventListener('message',handleScriptUpdate);
					reject(error);
				}
			})
		},
		onError:(error)=>{
			console.log(error);
			CustomErrorToast({message:'Failed to update script',duration:5000});
		},
		onSuccess:()=>{
			toast.success('Scripts updated successfully , Please restart the pipeline', {
			duration: 6000
		});
		}
	})
	const handleUpdateScript = (scriptType: ScriptType, content: string): void => {
    updateModifiedScript.mutate({ scriptType, content });
  };

	const disconnect = () => {
		if (socket) {
			socket.close();
		}
	};

	return {
		isConnected,
		error,
		webSocketResponse,
		stateStatus,
		setStateStatus,
		startPipeline,
		disconnect,
		updateScript:handleUpdateScript,
		isUpdatingScript:updateModifiedScript.isPending,
		updateScriptError:updateModifiedScript.error
	};
};

