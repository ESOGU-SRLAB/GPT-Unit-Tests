import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, Grid, Typography, Box } from '@mui/material';
import NotFoundSVG from './NotFoundSVG';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <NotFoundSVG
                                style={{ width: '100%', maxHeight: '400px' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 20,
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Oops! Page Not Found!
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                We can't seem to find the page you're looking
                                for.
                            </Typography>
                            <Button
                                variant="contained"
                                color="warning"
                                sx={{
                                    borderRadius: 0,
                                }}
                                onClick={() => navigate('/')}
                            >
                                Go Home
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
