import { useEffect, useState } from 'react';

import { io, Socket } from 'socket.io-client';
import { useAuth } from './use-auth';

function useWebSocket(url: string, payload?:any, doNotConnect?:boolean) {
	const [messages, setMessages] = useState<any[]>([]);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [progress, setProgress] = useState<any>(null); // Progress of the conversion
	const { user } = useAuth();
	const gitAccessToken = user?.provider.access_token || 'null';

	useEffect(() => {
		//Return if we already have a WebSocket connection
		if(isConnected || doNotConnect) return;
		// Create a new WebSocket connection when the component mounts
		// const newSocket = new WebSocket(url);
		console.log('conversion payload:', payload);
		const socket = io(url, {
			extraHeaders: {
			  'Content-Type': 'application/json',
			  'git-access-token': gitAccessToken
			}
		  });
		// Set up event listeners for the WebSocket

		// client-side
		socket.on('connect', () => {
			console.log(socket.id); // x8WIv7-mJelg7on_ALbx
			setIsConnected(true);
			if(payload){
				socket.emit('start_application_conversion', payload);
			}
		});

		socket.on('disconnect', () => {
			console.log(socket.id); // undefined
			setIsConnected(false);
		});
		socket.on('conversion_progress', (data) => {
			// console.log('Conversion Progress:', data);
			setProgress(data);
		});

		// newSocket.onopen = () => {
		// 	console.log('WebSocket connected');
		// 	setIsConnected(true);
		// };

		// newSocket.onmessage = (event) => {
		// 	// Handle incoming messages
		// 	const newMessage = event.data;
		// 	// const newMessage = JSON.parse(event.data);
		// 	setMessages((prevMessages) => [...prevMessages, newMessage]);
		// };

		// newSocket.onclose = () => {
		// 	console.log('WebSocket closed');
		// 	setIsConnected(false);
		// };

		// Store the WebSocket instance in state
		setSocket(socket);

		// Clean up function to close the WebSocket when the component unmounts
		// return () => {
		// 	newSocket.close();
		// };
	}, [url]);

	const sendMessage = (message: { type: string; data: any }) => {
		if (socket) {
			// Send message to the WebSocket server
			socket.emit(message.type, message.data);
		}
	};

	const startConversion = ({payload}:any) => {
		if (socket) {
			socket.emit('start_application_conversion',payload);
		}
	};

	return { messages, socket, progress, startConversion, sendMessage, isConnected };
}

export default useWebSocket;
