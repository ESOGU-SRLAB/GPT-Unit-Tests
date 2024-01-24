import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import { updateUserCredentials } from '../../redux/features/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';

const AccountPage = () => {
    const currentCredentials = useSelector((state) => state.userData);

    const [username, setUsername] = useState(currentCredentials.username);
    const [email, setEmail] = useState(currentCredentials.userEmailAddress);
    const [authenticatePassword, setAuthenticatePassword] = useState('');

    const dispatch = useDispatch();
    const handleUpdate = () => {
        // Add your logic for updating user information here
        // Make sure to validate input and handle confirmation
        const newCredentials = {
            newUsername: username,
            newEmailAddress: email,
            authenticationPassword: authenticatePassword,
        };
        dispatch(updateUserCredentials(newCredentials));
    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ flex: 1, overflowY: 'auto', height: '100vh' }}
        >
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Paper elevation={10} sx={{ p: '20px', borderRadius: 0 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: '#0d47a1',
                            mb: 5,
                            textAlign: 'center', // Center the text
                            margin: '0 auto 20px', // Add margin for spacing
                        }}
                    >
                        Update your account credentials!
                    </Typography>
                    <TextField
                        label="Username"
                        name="username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#00695c',
                            mb: 5,
                        }}
                    >
                        Please enter your new username to update your current
                        username!
                    </Typography>
                    <TextField
                        label="Email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#1565c0',
                            mb: 5,
                        }}
                    >
                        Please enter your new email address to update your
                        current email address!
                    </Typography>
                    <TextField
                        label="Authenticate Yourself!"
                        name="authenticate"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={authenticatePassword}
                        onChange={(e) =>
                            setAuthenticatePassword(e.target.value)
                        }
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#c62828',
                            mb: 5,
                        }}
                    >
                        Please enter your existing password to authenticate
                        yourself & apply changes!
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#2e7d32', borderRadius: 0 }}
                        fullWidth
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AccountPage;
