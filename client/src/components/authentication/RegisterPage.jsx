import {
    Avatar,
    Button,
    TextField,
    Link,
    Paper,
    Box,
    Grid,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RegisterPageSideImage from '../../assets/RegisterPageSideImage.png';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/features/userDataSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
    });
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        let { username, email, password, passwordRepeat } = formData;
        await dispatch(registerUser({ username, email, password })).unwrap();
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
                    backgroundImage: `url(${RegisterPageSideImage})`,
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
                    <Avatar sx={{ m: 1, bgcolor: '#653589' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up GPT4Test
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleRegister}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                            onChange={handleChange}
                            value={formData.username}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange}
                            value={formData.email}
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="passwordRepeat"
                            label="Password Repeat"
                            type="password"
                            id="password-repeat"
                            autoComplete="current-password"
                            onChange={handleChange}
                            value={formData.passwordRepeat}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#7edd2a' }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent={'flex-end'}>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {'Already have an account? Sign In'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default RegisterPage;
