import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestGenerationAndExecutionHistoryDataFromDB } from '../../redux/features/testGenerationAndExecutionHistorySlice';
import Editor from '@monaco-editor/react';
import {
    Box,
    Typography,
    Button,
    Modal,
    Paper,
    Tabs,
    Tab,
    Grid,
    Chip,
} from '@mui/material';
import NoDataIcon from '../../assets/nodata.png';

const CustomTerminalDisplay = ({ content }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#2d2d2d',
                color: 'white',
                padding: 2,
                fontFamily: 'monospace',
                borderRadius: '4px',
                overflowX: 'auto',
            }}
        >
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                {content}
            </Typography>
        </Box>
    );
};

const UnitTestGenerationHistoryPage = () => {
    const dispatch = useDispatch();
    const userTestGenerationAndExecutionHistory = useSelector(
        (state) =>
            state.testGenerationAndExecutionHistory.testGenerationHistories
    );

    useEffect(() => {
        const historyElementCount = 5;
        dispatch(
            fetchTestGenerationAndExecutionHistoryDataFromDB(
                historyElementCount
            )
        );
    }, [dispatch]);

    const [openModal, setOpenModal] = useState(false);
    const [selectedModelSettings, setSelectedModelSettings] = useState(null);

    const handleOpenModal = (modelSettings) => {
        setSelectedModelSettings(modelSettings);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const TabPanel = ({ children, value, index }) => {
        return value === index ? <Box sx={{ p: 1 }}>{children}</Box> : null;
    };

    const [tabValue, setTabValue] = useState({}); // Store tab values for each individualGenerationData

    const handleTabChange = (event, newValue, id) => {
        setTabValue({ ...tabValue, [id]: newValue });
    };

    const renderUserTestGenerationAndExecutionHistory = () => {
        if (userTestGenerationAndExecutionHistory.length === 0) {
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
                        You did not generate & execute any unit tests, go
                        generate it!
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
                        Your history will appear here once you generate some
                        tests!
                    </Typography>
                </Box>
            );
        }
        return userTestGenerationAndExecutionHistory.map(
            (sessionElement, sessionIndex) => (
                <Paper
                    key={sessionIndex}
                    elevation={3}
                    sx={{
                        mb: 4,
                        p: 2,
                        mx: 5,
                        mt: 5,
                        backgroundColor: '#bbdefb',
                        borderRadius: 0,
                    }}
                >
                    {sessionElement.testGenerationHistories.map(
                        (individualGenerationData, index) => {
                            const id = `session-${sessionIndex}-data-${index}`;
                            const currentTabValue = tabValue[id] || 0;

                            return (
                                <Paper
                                    key={individualGenerationData.dateTimestamp}
                                    elevation={1}
                                    sx={{ mb: 2, p: 2, borderRadius: 0 }}
                                >
                                    <Box sx={{ mb: 2 }}>
                                        <Grid
                                            container
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Grid item>
                                                <Typography variant="h6">
                                                    Date:{' '}
                                                    {new Date(
                                                        individualGenerationData.dateTimestamp
                                                    ).toLocaleString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            individualGenerationData.modelSettings
                                                        )
                                                    }
                                                >
                                                    Model Settings
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Tabs
                                        value={currentTabValue}
                                        onChange={(e, newValue) =>
                                            handleTabChange(e, newValue, id)
                                        }
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        allowScrollButtonsMobile
                                        sx={{
                                            overflowY: 'hidden',
                                        }}
                                    >
                                        <Tab label="Focal Code" />
                                        <Tab label="Test Code" />
                                        <Tab
                                            label="Execution Results"
                                            disabled={
                                                !individualGenerationData.isExecuted
                                            }
                                        />
                                    </Tabs>
                                    <TabPanel value={currentTabValue} index={0}>
                                        <Editor
                                            height="40vh"
                                            language="python"
                                            value={
                                                individualGenerationData.focalCode
                                            }
                                            options={{
                                                fontSize: 20,
                                                readOnly: true,
                                            }}
                                        />
                                    </TabPanel>
                                    <TabPanel value={currentTabValue} index={1}>
                                        <Editor
                                            height="40vh"
                                            language="python"
                                            value={
                                                individualGenerationData.testCode
                                            }
                                            options={{
                                                fontSize: 20,
                                                readOnly: true,
                                            }}
                                        />
                                    </TabPanel>
                                    <TabPanel value={currentTabValue} index={2}>
                                        <CustomTerminalDisplay
                                            content={
                                                individualGenerationData.executionResults
                                            }
                                        />
                                    </TabPanel>
                                </Paper>
                            );
                        }
                    )}
                </Paper>
            )
        );
    };
    return (
        <Box sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
            {renderUserTestGenerationAndExecutionHistory()}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        bgcolor: 'background.paper',
                        p: 4,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Model Settings
                    </Typography>
                    {selectedModelSettings && (
                        <div>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Model Selection:{' '}
                                {selectedModelSettings.modelSelection}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Temperature: {selectedModelSettings.temperature}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Maximum Length:{' '}
                                {selectedModelSettings.maxLength}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Top P: {selectedModelSettings.topP}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Frequency Penalty:{' '}
                                {selectedModelSettings.frequencyPenalty}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Presence Penalty:{' '}
                                {selectedModelSettings.presencePenalty}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Stop Sequences:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selectedModelSettings.stopSequences.map(
                                    (sequence, index) => (
                                        <Chip
                                            key={index}
                                            label={sequence}
                                            sx={{ m: 0.5 }}
                                        />
                                    )
                                )}
                            </Box>
                        </div>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default UnitTestGenerationHistoryPage;
