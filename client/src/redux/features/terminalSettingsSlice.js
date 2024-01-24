import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000/api/users';

export const fetchExecutionTerminalSettingsFromDB = createAsyncThunk(
    'terminalSettings/fetchExecutionTerminalSettingsFromDB',
    async (_, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;

        try {
            const response = await axios.get(
                `${BASE_URL}/executionTerminalSettings/getExecutionTerminalSettings/${userIdentifier}`
            );
            return {
                executionTerminalSettings:
                    response.data.executionTerminalSettings,
            };
        } catch (error) {
            toast.error(
                `Error fetching execution terminal settings: ${error.message}`
            );
            throw error;
        }
    }
);

export const fetchSpecialCommandTerminalSettingsFromDB = createAsyncThunk(
    'terminalSettings/fetchSpecialCommandTerminalSettingsFromDB',
    async (_, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;

        try {
            const response = await axios.get(
                `${BASE_URL}/specialCommandTerminalSettings/getSpecialCommandTerminalSettings/${userIdentifier}`
            );
            return {
                specialCommandTerminalSettings:
                    response.data.specialCommandTerminalSettings,
            };
        } catch (error) {
            toast.error(
                `Error fetching special command terminal settings: ${error.message}`
            );
            throw error;
        }
    }
);

export const saveExecutionTerminalSettingsToDB = createAsyncThunk(
    'terminalSettings/saveExecutionTerminalSettingsToDB',
    async (_, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;
        const currentSettings =
            getState().terminalSettings.executionTerminalSettings;

        const updatedSettings = {
            themes: { ...currentSettings.themes }, // Merge existing themes
            selectedThemeName: currentSettings.selectedThemeName, // Preserve selected theme name
        };

        try {
            await axios.post(
                `${BASE_URL}/executionTerminalSettings/updateExecutionTerminalSettings`,
                {
                    userIdentifier,
                    settings: updatedSettings,
                }
            );
            return updatedSettings;
        } catch (error) {
            toast.error(
                `Error saving execution terminal settings: ${error.message}`
            );
            throw error;
        }
    }
);

export const saveSpecialCommandTerminalSettingsToDB = createAsyncThunk(
    'terminalSettings/saveSpecialCommandTerminalSettingsToDB',
    async (_, { getState }) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;
        const currentSettings =
            getState().terminalSettings.specialCommandTerminalSettings;

        const updatedSettings = {
            themes: { ...currentSettings.themes }, // Merge existing themes
            selectedThemeName: currentSettings.selectedThemeName, // Preserve selected theme name
        };

        try {
            await axios.post(
                `${BASE_URL}/specialCommandTerminalSettings/updateSpecialCommandTerminalSettings`,
                {
                    userIdentifier,
                    settings: updatedSettings,
                }
            );
            return updatedSettings;
        } catch (error) {
            toast.error(
                `Error saving special command terminal settings: ${error.message}`
            );
            throw error;
        }
    }
);

const initialState = {
    executionTerminalSettings: {
        themes: {
            light: {
                themeBGColor: '#f5f5f5',
                themeToolbarColor: '#eeeeee',
                themeColor: '#212121',
                themePromptColor: '#00e676',
            },
            dark: {
                themeBGColor: '#757575',
                themeToolbarColor: '#424242',
                themeColor: '#fafafa',
                themePromptColor: '##e0e0e0',
            },
        },
        selectedThemeName: 'light',
    },
    specialCommandTerminalSettings: {
        themes: {
            light: {
                themeBGColor: '#f5f5f5',
                themeToolbarColor: '#eeeeee',
                themeColor: '#212121',
                themePromptColor: '#00e676',
            },
        },
        selectedThemeName: 'light',
    },
};

const terminalSettingsSlice = createSlice({
    name: 'terminalSettings',
    initialState,
    reducers: {
        setExecutionTerminalSelectedThemeName: (state, action) => {
            const themeName = action.payload;
            if (state.executionTerminalSettings.themes[themeName]) {
                state.executionTerminalSettings.selectedThemeName = themeName;
                toast.success(`Theme changed to: ${themeName}`);
            } else {
                toast.error(`Theme '${themeName}' does not exist`);
            }
        },
        setSpecialCommandTerminalSelectedThemeName: (state, { payload }) => {
            if (state.specialCommandTerminalSettings.themes[payload]) {
                state.specialCommandTerminalSettings.selectedThemeName =
                    payload;
                toast.success(`Theme changed to: ${payload}`);
            } else {
                toast.error(`Theme '${payload}' does not exist`);
            }
        },
        addThemeToExecutionTerminalThemes: (
            state,
            { payload: { themeName, theme } }
        ) => {
            if (!state.executionTerminalSettings.themes[themeName]) {
                state.executionTerminalSettings.themes[themeName] = theme;
                toast.success(`Theme '${themeName}' added successfully`);
            } else {
                toast.error(`Theme '${themeName}' already exists`);
            }
        },
        addThemeToSpecialCommandTerminalThemes: (
            state,
            { payload: { themeName, theme } }
        ) => {
            if (!state.specialCommandTerminalSettings.themes[themeName]) {
                state.specialCommandTerminalSettings.themes[themeName] = theme;
                toast.success(`Theme '${themeName}' added successfully`);
            } else {
                toast.error(`Theme '${themeName}' already exists`);
            }
        },
        removeThemeFromExecutionTerminalThemes: (state, { payload }) => {
            if (state.executionTerminalSettings.themes[payload]) {
                delete state.executionTerminalSettings.themes[payload];
                toast.success(`Theme '${payload}' removed successfully`);
            } else {
                toast.error(`Theme '${payload}' does not exist`);
            }
        },
        removeThemeFromSpecialCommandTerminalThemes: (state, { payload }) => {
            if (state.specialCommandTerminalSettings.themes[payload]) {
                delete state.specialCommandTerminalSettings.themes[payload];
                toast.success(`Theme '${payload}' removed successfully`);
            } else {
                toast.error(`Theme '${payload}' does not exist`);
            }
        },
        resetTerminalSettings: (state) => {
            state.executionTerminalSettings =
                initialState.executionTerminalSettings;
            state.specialCommandTerminalSettings =
                initialState.specialCommandTerminalSettings;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchExecutionTerminalSettingsFromDB.fulfilled,
                (state, action) => {
                    state.executionTerminalSettings =
                        action.payload.executionTerminalSettings;
                }
            )
            .addCase(
                fetchSpecialCommandTerminalSettingsFromDB.fulfilled,
                (state, action) => {
                    state.specialCommandTerminalSettings =
                        action.payload.specialCommandTerminalSettings;
                }
            )
            .addCase(
                saveExecutionTerminalSettingsToDB.fulfilled,
                (state, action) => {
                    state.executionTerminalSettings = action.payload;
                }
            )
            .addCase(
                saveSpecialCommandTerminalSettingsToDB.fulfilled,
                (state, action) => {
                    state.specialCommandTerminalSettings = action.payload;
                }
            );
    },
});

export const {
    setExecutionTerminalSelectedThemeName,
    setSpecialCommandTerminalSelectedThemeName,
    addThemeToExecutionTerminalThemes,
    addThemeToSpecialCommandTerminalThemes,
    removeThemeFromExecutionTerminalThemes,
    removeThemeFromSpecialCommandTerminalThemes,
    resetTerminalSettings,
} = terminalSettingsSlice.actions;

export default terminalSettingsSlice.reducer;
