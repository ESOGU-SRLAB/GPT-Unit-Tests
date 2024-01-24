import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUserDataToLocalStorage } from '../../utils/localStorage';
import { toast } from 'react-toastify';
import axios from 'axios';

export const handleLogout = (navigate) => (dispatch) => {
    localStorage.removeItem('userData');
    navigate('/login');
};

export const updateUserCredentials = createAsyncThunk(
    'userData/updateUserCredentials',
    async (
        { newUsername, newEmailAddress, authenticationPassword },
        { getState, dispatch }
    ) => {
        const { userData } = getState();
        const userIdentifier = userData.username || userData.userEmailAddress;
        const response = await axios.post(
            'http://localhost:5000/api/auth/updateUserCredentials',
            {
                userIdentifier,
                newUsername,
                newEmailAddress,
                authenticationPassword,
            }
        );
        console.log('here', response.status);
        if (response.data.type === 'success') {
            dispatch(
                setUserData({
                    username: newUsername,
                    userEmailAddress: newEmailAddress,
                })
            );
            saveUserDataToLocalStorage({
                username: newUsername,
                userEmailAddress: newEmailAddress,
            });
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response.data.message);
        }
    }
);

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
    'userData/loginUser',
    async ({ identifier, password }, { dispatch }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                {
                    identifier,
                    password,
                }
            );

            // Dispatch action to set user data on successful login
            dispatch(
                setUserData({
                    username: response.data.username,
                    userEmailAddress: response.data.email,
                })
            );

            saveUserDataToLocalStorage({
                username: response.data.username,
                userEmailAddress: response.data.email,
            });
            toast.success('Logged in successfully');
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Unknown login error';
            toast.error(errorMessage);
        }
    }
);

// Async thunk for registering a user
export const registerUser = createAsyncThunk(
    'userData/registerUser',
    async ({ username, email, password }, { dispatch }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/register',
                {
                    username,
                    userEmailAddress: email,
                    userPassword: password,
                }
            );

            // Dispatch action to set user data on successful registration
            dispatch(
                setUserData({
                    username,
                    userEmailAddress: email,
                })
            );
            saveUserDataToLocalStorage({
                username,
                userEmailAddress: email,
            });
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Unknown registration error';
            toast.error(errorMessage);
        }
    }
);

export const userDataSlice = createSlice({
    name: 'userDataSlice',
    initialState: {
        username: null,
        userEmailAddress: null,
    },
    reducers: {
        setUserData: (state, action) => {
            let { username, userEmailAddress } = action.payload;
            [state.username, state.userEmailAddress] = [
                username,
                userEmailAddress,
            ];
        },
        resetUserData: (state) => {
            state.username = null;
            state.userEmailAddress = null;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {});
        builder.addCase(registerUser.rejected, (state, action) => {});
        builder.addCase(loginUser.fulfilled, (state, action) => {});
        builder.addCase(loginUser.rejected, (state, action) => {});
        builder.addCase(updateUserCredentials.fulfilled, (state, action) => {});
        builder.addCase(updateUserCredentials.rejected, (state, action) => {});
    },
});

export const { setUserData, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
