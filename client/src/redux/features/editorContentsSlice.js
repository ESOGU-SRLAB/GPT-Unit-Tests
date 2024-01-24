import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const saveTestExecutionResultsToDB = createAsyncThunk(
    'editorContents/saveTestExecutionResultsToDB',
    async (executionResult, { getState, dispatch, rejectWithValue }) => {
        try {
            // Update the execution results in the state first
            const state = getState().editorContents;
            dispatch(updateExecutionResults(executionResult));

            // Now prepare data for the API call
            const data = {
                testGenerationHistoryId: state.testGenerationHistoryId,
                currentTestGenerationElementId:
                    state.currentTestGenerationElementId,
                executionResults: executionResult,
            };

            // Make the API call
            const response = await axios.post(
                'http://localhost:5000/api/users/testGenerationHistories/saveTestExecutionResults',
                data
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for saving test generation results
export const saveTestGenerationResults = createAsyncThunk(
    'editorContents/saveTestGenerationResults',
    async (_, { getState, rejectWithValue }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;
        const state = getState().editorContents; // Replace 'editorContents' with the actual slice name if different
        const dateTimestamp = Date.now();

        const { modelSettings } = getState();

        const data = {
            userIdentifier,
            dateTimestamp,
            focalCode: state.inputEditorContent.editorContent,
            testCode: state.outputEditorContent.editorContent,
            testGenerationHistoryId: state.testGenerationHistoryId,
            modelSettings,
        };
        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/testGenerationHistories/saveTestGenerationResults',
                data
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    testGenerationCountInCurrentSession: 0,
    testGenerationHistoryId: '',
    currentTestGenerationElementId: '',
    inputEditorContent: {
        editorContent:
            '# type your code here\ndef addNumbers(number1, number2):\n    return number1 + number2',
    },
    outputEditorContent: {
        editorContent: '# AI generated code will appear here',
    },
    generationDateTimestamp: '',
    isExecuted: false,
    executionResults: '',
};

export const editorContentsSlice = createSlice({
    name: 'editorContents',
    initialState,
    reducers: {
        updateInputEditorContent: (state, action) => {
            const editorContent = action.payload;
            state.inputEditorContent.editorContent = editorContent;
        },
        updateOutputEditorContent: (state, action) => {
            const editorContent = action.payload;
            state.outputEditorContent.editorContent = editorContent;
        },
        updateExecutionResults: (state, action) => {
            const executionResults = action.payload;
            state.executionResults = executionResults;
            state.isExecuted = true;
        },
        createNewSession: (state, action) => {
            state.testGenerationHistoryId =
                initialState.testGenerationHistoryId;
            state.currentTestGenerationElementId =
                initialState.currentTestGenerationElementId;
            state.inputEditorContent = initialState.inputEditorContent;
            state.outputEditorContent = initialState.outputEditorContent;
            state.generationDateTimestamp =
                initialState.generationDateTimestamp;
            state.isExecuted = initialState.isExecuted;
            state.executionResults = initialState.executionResults;
            state.testGenerationCountInCurrentSession =
                initialState.testGenerationCountInCurrentSession;
        },
        resetEditorContents: (state) => {
            state.testGenerationCountInCurrentSession =
                initialState.testGenerationCountInCurrentSession;
            state.testGenerationHistoryId =
                initialState.testGenerationHistoryId;
            state.currentTestGenerationElementId =
                initialState.currentTestGenerationElementId;
            state.inputEditorContent = initialState.inputEditorContent;
            state.outputEditorContent = initialState.outputEditorContent;
            state.generationDateTimestamp =
                initialState.generationDateTimestamp;
            state.isExecuted = initialState.isExecuted;
            state.executionResults = initialState.executionResults;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveTestGenerationResults.fulfilled, (state, action) => {
                state.testGenerationHistoryId =
                    action.payload.testGenerationHistoryId;
                state.currentTestGenerationElementId =
                    action.payload.currentTestGenerationElementId;
                state.testGenerationCountInCurrentSession += 1;
            })
            .addCase(saveTestGenerationResults.rejected, (state, action) => {
                console.error(
                    'Failed to save test generation results:',
                    action.payload
                );
            });
    },
});

export const {
    updateInputEditorContent,
    updateOutputEditorContent,
    updateExecutionResults,
    createNewSession,
    resetEditorContents,
} = editorContentsSlice.actions;

export default editorContentsSlice.reducer;
