// reducers.ts
import bulkConversionSlice from '@/pages/user-mode/code-conversion/module/bulk.conversion.slice';

import {combineReducers} from '@reduxjs/toolkit';

import appReducer from './slices/app.slice';
import assistantSlice from './slices/assistant.slice';
import authUserSlice from './slices/auth.user.slice';
// Import your slice/reducer
// import AppSlice from './slices/AppSlice';
import codeConversionReducer from './slices/code-conversion.slice';
import codeEditorSlice from './slices/code-editor.slice';
import codeGenerationSlice from './slices/code-generation.slice';
import codeRefactorSlice from './slices/code-refactor-slice';
import codingStandardSlice from './slices/coding-standard.slice';
import compilerSlice from './slices/compiler.slice';
import domainExpertSlice from './slices/domain-expert.slice';
import explorepacktabSlice from './slices/explorepacktab.slice';
import modalDataSlice from './slices/import-coding-standard-dialog.slice';
import {codingStandardIndexReducer} from './slices/import-coding-standard-dialog.slice';
import languageOnboardingSlice from './slices/language-onboarding.slice';
import modularTestFile from './slices/modular-test-file.slice';
import mypacktabSlice from './slices/mypacktab.slice';
import projectAnalysisSlice from './slices/project-analysis.slice';
import repositorySlice from './slices/repository.slice';
import codeUpgradeSlice from './slices/code-upgrade-slice';
import selectProjectSlice from './slices/select.project.slice';
import AiAssistantChatSlice from './slices/aiAssitantChat';
import { passwordReducer } from "./slices/passwordManagerSlice";
import newLanguageOnboardingSlice from './slices/langauge-onboarding-new.slice';
import sdlcUpdateFeatureReducer from "./slices/sdlcUpdateFeatureSlice"
import stackModSlice from "./slices/stack-mod.slice"
import languageGroupMappingSlice from "./slices/language-selection.slice"
// Import your slice/reducer
import tabsReducer from './slices/tab.slice';
// import counterReducer from './counterSlice'; // Import your slice/reducer
import zipFolderReducer from './slices/zip-folder.slice';
import appmodAssistantsReducer from './slices/appmod-assistants.slice'
// import tabsReducerDomainExpert from './slices/tabSliceDomainExpert'; // Import your slice/reducer
const rootReducer = combineReducers({
	zipFolderData: zipFolderReducer,
	tabs: tabsReducer,
	codeConversionSlice: codeConversionReducer,
	codeUpgradeSlice: codeUpgradeSlice,
	domainExpert: domainExpertSlice,
	codeGenerationSlice: codeGenerationSlice,
	codeRefactorSlice: codeRefactorSlice,
	modularFile: modularTestFile,
	codingStandard: codingStandardSlice,
	auth: authUserSlice,
	repositoryData: repositorySlice,
	// assistants: assistantSlice,
	assistants:appmodAssistantsReducer,
	moduleConversionSlice: bulkConversionSlice,
	// tabsDomainExpert: tabsReducerDomainExpert,
	// Add more reducers as needed,
	codeEditor: codeEditorSlice,
	repository: repositorySlice,
	projectAnalysis: projectAnalysisSlice,
	app: appReducer,
	languageOnboarding: languageOnboardingSlice,
	compilerSlice: compilerSlice,
	linkedProject: selectProjectSlice,
	modalData: modalDataSlice,
	codingStandardIndex: codingStandardIndexReducer,
	mypackMarketPlace: mypacktabSlice,
	explorepackMarketPlace: explorepacktabSlice,
	aiAssistantChat: AiAssistantChatSlice,
	passwrod: passwordReducer,
	newLanguageOnboardingSlice: newLanguageOnboardingSlice,
	sdlcUpdateFeaturePayload: sdlcUpdateFeatureReducer,
	stackModSlice:stackModSlice,
	languageGroupMappingSlice:languageGroupMappingSlice
});

export default rootReducer;
