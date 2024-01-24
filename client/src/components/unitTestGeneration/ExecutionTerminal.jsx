import { ReactTerminal, TerminalContextProvider } from 'react-terminal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    updateOutputEditorContent,
    saveTestGenerationResults,
    saveTestExecutionResultsToDB,
    createNewSession,
} from '../../redux/features/editorContentsSlice';

import {
    increaseUnitTestGenerationSuccessCount,
    increaseUnitTestGenerationFailureCount,
    increaseUnitTestExecutionSuccessCount,
    increaseUnitTestExecutionFailureCount,
    saveUserActionsRecapDataToDB,
    fetchUserActionsRecapDataFromDB,
} from '../../redux/features/userActionsRecapSlice';
import { useEffect } from 'react';
const ExecutionTerminal = () => {
    const dispatch = useDispatch();
    const executionTerminalSettings = useSelector(
        (state) => state.terminalSettings.executionTerminalSettings
    );
    const inputEditorContent = useSelector(
        (state) => state.editorContents.inputEditorContent.editorContent
    );

    const outputEditorContent = useSelector(
        (state) => state.editorContents.outputEditorContent.editorContent
    );

    const testGenerationCountInCurrentSession = useSelector(
        (state) => state.editorContents.testGenerationCountInCurrentSession
    );

    const modelSettings = useSelector((state) => state.modelSettings);
    let { themes, selectedThemeName } = executionTerminalSettings;

    const sendExecutionRequest = async () => {
        try {
            const response = await axios.post('http://localhost:5005/execute', {
                testFunction: outputEditorContent,
            });
            const { code, executionResult } = response.data;
            if (code === '200') {
                // Dispatch the combined thunk
                dispatch(saveTestExecutionResultsToDB(executionResult));
                dispatch(increaseUnitTestExecutionSuccessCount());
                dispatch(saveUserActionsRecapDataToDB());
                return `${executionResult}`;
            } else {
                dispatch(saveTestExecutionResultsToDB(executionResult));
                dispatch(increaseUnitTestExecutionFailureCount());
                dispatch(saveUserActionsRecapDataToDB());
                return `${executionResult}`;
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const sendGenerateRequest = async () => {
        if (testGenerationCountInCurrentSession >= 5) {
            toast.error(
                'You have already reached the test generation limit of 5!'
            );
            return 'You have already reached the test generation limit of 5!';
        }
        try {
            const response = await axios.post(
                'http://localhost:5005/generate',
                {
                    focalCode: inputEditorContent,
                    modelSettings,
                }
            );
            const { code, testFunction } = response.data;
            dispatch(updateOutputEditorContent(testFunction));
            if (code === '200') {
                dispatch(saveTestGenerationResults());
                dispatch(increaseUnitTestGenerationSuccessCount());
                dispatch(saveUserActionsRecapDataToDB());
                return `${code} Generated unit test code successfully!`;
            } else {
                dispatch(saveTestGenerationResults());
                dispatch(increaseUnitTestGenerationFailureCount());
                dispatch(saveUserActionsRecapDataToDB());
                return `${code} Failed unit tese generation!`;
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Failed to generate test.';
        }
    };

    const commands = {
        npx: async (args) => {
            const commandType = args.split(' ')[0];
            switch (commandType) {
                case 'generate-test':
                    return await sendGenerateRequest();
                case 'exec-test':
                    return await sendExecutionRequest();
                case 'new-session':
                    dispatch(createNewSession());
                    toast.success('Created new session successfully!');
                    return 'Created new session successfully!';
                default:
                    return 'Command does not exist!';
            }
        },
    };
    useEffect(() => {
        dispatch(fetchUserActionsRecapDataFromDB());
    }, [dispatch]);

    return (
        <TerminalContextProvider>
            <ReactTerminal
                themes={themes}
                theme={selectedThemeName}
                prompt="$"
                commands={commands}
                errorMessage="Command does not exist!"
            />
        </TerminalContextProvider>
    );
};

export default ExecutionTerminal;
