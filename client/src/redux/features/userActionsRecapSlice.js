import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserActionsRecapDataFromDB = createAsyncThunk(
    'userActionsRecapSlice/fetchUserActionsRecapDataFromDB',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { userData } = getState();
            const userIdentifier =
                userData.username || userData.userEmailAddress;

            const response = await axios.get(
                `http://localhost:5000/api/users/userActionsRecap/getUserActionsRecap/${userIdentifier}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const saveUserActionsRecapDataToDB = createAsyncThunk(
    'userActionsRecapSlice/saveUserActionsRecapDataToDB',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { userData } = getState();
            const userIdentifier =
                userData.username || userData.userEmailAddress;
            const userActionsRecapData = getState().userActionsRecap;
            const response = await axios.post(
                'http://localhost:5000/api/users/userActionsRecap/updateUserActionsRecap',
                {
                    ...userActionsRecapData,
                    userIdentifier,
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    unitTestGenerationSuccessCount: 0,
    unitTestGenerationFailureCount: 0,
    unitTestExecutionSuccessCount: 0,
    unitTestExecutionFailureCount: 0,
};

export const userActionsRecapSlice = createSlice({
    name: 'userActionsRecapSlice',
    initialState,
    reducers: {
        increaseUnitTestGenerationSuccessCount: (state, action) => {
            state.unitTestGenerationSuccessCount += 1;
        },
        increaseUnitTestGenerationFailureCount: (state, action) => {
            state.unitTestGenerationFailureCount += 1;
        },
        increaseUnitTestExecutionSuccessCount: (state, action) => {
            state.unitTestExecutionSuccessCount += 1;
        },
        increaseUnitTestExecutionFailureCount: (state, action) => {
            state.unitTestExecutionFailureCount += 1;
        },
        resetUserActionsRecap: (state) => {
            state.unitTestGenerationFailureCount =
                initialState.unitTestGenerationFailureCount;
            state.unitTestGenerationSuccessCount =
                initialState.unitTestGenerationSuccessCount;
            state.unitTestExecutionSuccessCount =
                initialState.unitTestExecutionSuccessCount;
            state.unitTestExecutionFailureCount =
                initialState.unitTestExecutionFailureCount;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchUserActionsRecapDataFromDB.fulfilled,
                (state, action) => {
                    // Assuming the action payload contains the fetched data
                    state.unitTestGenerationSuccessCount =
                        action.payload.unitTestGenerationSuccessCount;
                    state.unitTestGenerationFailureCount =
                        action.payload.unitTestGenerationFailureCount;
                    state.unitTestExecutionSuccessCount =
                        action.payload.unitTestExecutionSuccessCount;
                    state.unitTestExecutionFailureCount =
                        action.payload.unitTestExecutionFailureCount;
                }
            )
            .addCase(
                fetchUserActionsRecapDataFromDB.rejected,
                (state, action) => {
                    // You could add error handling logic here
                    // e.g., set an error field in your state
                    console.error(action.error.message);
                }
            )
            .addCase(
                saveUserActionsRecapDataToDB.fulfilled,
                (state, action) => {}
            )
            .addCase(saveUserActionsRecapDataToDB.rejected, (state, action) => {
                // Error handling for the update operation
                console.error(action.error.message);
            });
    },
});

export const {
    increaseUnitTestGenerationSuccessCount,
    increaseUnitTestGenerationFailureCount,
    increaseUnitTestExecutionSuccessCount,
    increaseUnitTestExecutionFailureCount,
    resetUserActionsRecap,
} = userActionsRecapSlice.actions;
export default userActionsRecapSlice.reducer;
