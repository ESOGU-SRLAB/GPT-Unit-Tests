import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchModelSettingsFromDB = createAsyncThunk(
    'modelSettings/fetchModelSettingsFromDB',
    async (_, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;

        const response = await axios.get(
            `http://localhost:5000/api/users/modelSettings/getModelSettings/${userIdentifier}`
        );

        return response.data.modelSettings; // Assuming the settings are returned under a `settings` key
    }
);

export const saveModelSettingsToDB = createAsyncThunk(
    'modelSettings/saveModelSettingsToDB',
    async (settings, { getState }) => {
        try {
            const { userData } = getState();
            console.log(userData, settings);
            const userIdentifier =
                userData.username || userData.userEmailAddress;
            const response = await axios.post(
                'http://localhost:5000/api/users/modelSettings/updateModelSettings',
                {
                    settings,
                    userIdentifier,
                }
            );
            toast.success('Model settings save succeed!');
            return response.data;
        } catch (error) {
            toast.error(`Model settings save failed! ${error.message}`);
        }
    }
);

const initialState = {
    modelSelection: '',
    temperature: 1.04,
    maxLength: 1877,
    stopSequences: [],
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0.94,
};

export const modelSettingsSlice = createSlice({
    name: 'modelSettings',
    initialState,
    reducers: {
        updateSettings: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetModelSettings: (state) => {
            state.modelSelection = initialState.modelSelection;
            state.temperature = initialState.temperature;
            state.maxLength = initialState.maxLength;
            state.stopSequences = initialState.stopSequences;
            state.topP = initialState.topP;
            state.frequencyPenalty = initialState.frequencyPenalty;
            state.presencePenalty = initialState.presencePenalty;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchModelSettingsFromDB.fulfilled, (state, action) => {
                return { ...state, ...action.payload };
            })
            .addCase(saveModelSettingsToDB.fulfilled, (state, action) => {
                return { ...state, ...action.payload };
            });
    },
});

export const { updateSettings, resetModelSettings } =
    modelSettingsSlice.actions;

export default modelSettingsSlice.reducer;
