import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Paper,
    Box,
    Grid,
    Typography,
} from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginPageSideImage from '../../assets/LoginPageSideImage.png';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/features/userDataSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        let { identifier, password } = formData;
        await dispatch(loginUser({ identifier, password })).unwrap();
        navigate('/');
    };
    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${LoginPageSideImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In GPT4Test
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleLogin}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="identifier"
                            label="Email Address or Username"
                            name="identifier"
                            autoFocus
                            onChange={handleChange}
                            value={formData.identifier}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot-password" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginPage;
