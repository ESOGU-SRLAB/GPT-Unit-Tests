import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserActionsRecapDataFromDB } from '../../redux/features/userActionsRecapSlice';
import { useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Paper, Grid, Typography, Box } from '@mui/material';
import NoDataIcon from '../../assets/nodata.png';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const userActionsRecapData = useSelector((state) => state.userActionsRecap);

    useEffect(() => {
        dispatch(fetchUserActionsRecapDataFromDB());
    }, [dispatch]);

    // Prepare data for Nivo Pie Chart
    const generateChartData = (successCount, failureCount) => {
        const total = successCount + failureCount;
        return [
            {
                id: 'Success',
                label: 'Success',
                value: total > 0 ? (successCount / total) * 100 : 0,
                color: '#b2ff59',
            },
            {
                id: 'Failure',
                label: 'Failure',
                value: total > 0 ? (failureCount / total) * 100 : 0,
                color: '#ff1744',
            },
        ];
    };

    const testGenerationChartData = generateChartData(
        userActionsRecapData.unitTestGenerationSuccessCount,
        userActionsRecapData.unitTestGenerationFailureCount
    );

    const testExecutionChartData = generateChartData(
        userActionsRecapData.unitTestExecutionSuccessCount,
        userActionsRecapData.unitTestExecutionFailureCount
    );
    const totalCount =
        userActionsRecapData.unitTestGenerationSuccessCount +
        userActionsRecapData.unitTestGenerationFailureCount +
        userActionsRecapData.unitTestExecutionSuccessCount +
        userActionsRecapData.unitTestExecutionFailureCount;

    if (totalCount === 0) {
        // No history, render the image
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Stack items vertically
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <img
                    src={NoDataIcon}
                    alt="No history available"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: '#0d47a1',
                        mt: 5, // Adjust the margin-top for spacing between image and text
                        textAlign: 'center', // Center the text
                    }}
                >
                    You did not generate & execute any unit tests, go generate
                    it!
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: '#42a5f5',
                        mt: 5, // Adjust the margin-top for spacing between image and text
                        textAlign: 'center', // Center the text
                    }}
                >
                    Your recap charts will appear here once you generate some
                    tests!
                </Typography>
            </Box>
        );
    }

    return (
        <div>
            <Grid
                container
                justifyContent="center"
                sx={{ height: '100vh', overflowY: 'auto', mt: 7 }}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="center"
                >
                    <Paper
                        sx={{
                            height: '50vh',
                            width: '80%',
                            padding: '5vh',
                            borderRadius: 0,
                            backgroundColor: '#f5f5f5',
                            mb: 5,
                        }}
                        elevation={10}
                    >
                        <Typography variant="h6" align="center">
                            Test Generation Success & Failure Rate
                        </Typography>
                        <ResponsivePie
                            data={testGenerationChartData}
                            margin={{
                                top: 40,
                                right: 80,
                                bottom: 80,
                                left: 80,
                            }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            colors={{ datum: 'data.color' }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 0,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#999',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                },
                            ]}
                            valueFormat=">.2f"
                        />
                    </Paper>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="center"
                    sx={{ mb: 10 }}
                >
                    <Paper
                        sx={{
                            height: '50vh',
                            width: '80%',
                            padding: '5vh',
                            borderRadius: 0,
                            backgroundColor: '#f5f5f5',
                            mb: 5,
                        }}
                        elevation={10}
                    >
                        <Typography variant="h6" align="center">
                            Test Execution Success & Failure Rate
                        </Typography>
                        <ResponsivePie
                            data={testExecutionChartData}
                            margin={{
                                top: 40,
                                right: 80,
                                bottom: 80,
                                left: 80,
                            }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            colors={{ datum: 'data.color' }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 0,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#999',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                },
                            ]}
                            valueFormat=">.2f"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default DashboardPage;
