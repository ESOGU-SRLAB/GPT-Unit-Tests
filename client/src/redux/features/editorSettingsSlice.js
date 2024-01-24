import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEditorSettingsFromDB = createAsyncThunk(
    'editorSettings/fetchEditorSettingsFromDB',
    async (_, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;

        const response = await axios.get(
            `http://localhost:5000/api/users/editorSettings/getEditorSettings/${userIdentifier}`
        );

        return {
            inputEditorSettings: response.data.inputEditorSettings,
            outputEditorSettings: response.data.outputEditorSettings,
        };
    }
);

export const saveEditorSettingsToDB = createAsyncThunk(
    'editorSettings/saveEditorSettingsToDB',
    async ({ settings, type }, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;
        const response = await axios.post(
            'http://localhost:5000/api/users/editorSettings/updateEditorSettings',
            {
                settings,
                type,
                userIdentifier,
            }
        );
        return { settings, type };
    }
);

const initialState = {
    inputEditorOptions: {
        fontSize: 20,
        readOnly: false,
    },
    outputEditorOptions: {
        fontSize: 20,
        readOnly: true,
    },
};
const editorSettingsSlice = createSlice({
    name: 'editorSettings',
    initialState,
    reducers: {
        setInputEditorOptions: (state, action) => {
            state.inputEditorOptions = action.payload;
        },
        setOutputEditorOptions: (state, action) => {
            state.outputEditorOptions = action.payload;
        },
        resetEditorSettings: (state) => {
            state.inputEditorOptions = initialState.inputEditorOptions;
            state.outputEditorOptions = initialState.outputEditorOptions;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditorSettingsFromDB.fulfilled, (state, action) => {
                state.inputEditorOptions =
                    action.payload.inputEditorSettings || {};
                state.outputEditorOptions =
                    action.payload.outputEditorSettings || {};
            })
            .addCase(saveEditorSettingsToDB.fulfilled, (state, action) => {
                const { settings, type } = action.payload;
                if (type === 'input') {
                    state.inputEditorOptions = settings;
                } else if (type === 'output') {
                    state.outputEditorOptions = settings;
                }
            });
    },
});

export const {
    setInputEditorOptions,
    setOutputEditorOptions,
    resetEditorSettings,
} = editorSettingsSlice.actions;

export default editorSettingsSlice.reducer;
