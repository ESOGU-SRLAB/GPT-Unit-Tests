import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { ReactTerminal, TerminalContextProvider } from 'react-terminal';
import {
    Box,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Select,
    Grid,
    Container,
    Button,
    Typography,
} from '@mui/material';
import SplitPane from 'split-pane-react/esm/SplitPane';
import { Pane } from 'split-pane-react';
import { SketchPicker } from 'react-color';
import {
    addThemeToExecutionTerminalThemes,
    setExecutionTerminalSelectedThemeName,
    addThemeToSpecialCommandTerminalThemes,
    setSpecialCommandTerminalSelectedThemeName,
    fetchExecutionTerminalSettingsFromDB,
    fetchSpecialCommandTerminalSettingsFromDB,
    saveExecutionTerminalSettingsToDB,
    saveSpecialCommandTerminalSettingsToDB,
} from '../../redux/features/terminalSettingsSlice';
import { toast } from 'react-toastify';

const TerminalSettingsPage = () => {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState(0);
    const executionTerminalSettings = useSelector(
        (state) => state.terminalSettings.executionTerminalSettings
    );
    let [executionTerminalThemes] = [executionTerminalSettings.themes];

    const specialCommandTerminalSettings = useSelector(
        (state) => state.terminalSettings.specialCommandTerminalSettings
    );
    let [specialCommandTerminalThemes] = [
        specialCommandTerminalSettings.themes,
    ];

    const [
        executionTerminalPreviewThemeName,
        setExecutionTerminalPreviewThemeName,
    ] = useState('');
    const [
        executionTerminalPreviewThemeColors,
        setExecutionTerminalPreviewThemeColors,
    ] = useState({});

    const [
        specialTerminalPreviewThemeName,
        setSpecialTerminalPreviewThemeName,
    ] = useState('');
    const [
        specialCommandTerminalPreviewThemeColors,
        setSpecialCommandPreviewThemeColors,
    ] = useState({});

    const [sizes, setSizes] = useState(['50%', 'auto']);
    const handleTabChange = (event, tabIndex) => setCurrentTab(tabIndex);
    const [previewThemeName, setPreviewThemeName] = useState('');

    useEffect(() => {
        dispatch(fetchExecutionTerminalSettingsFromDB());
        dispatch(fetchSpecialCommandTerminalSettingsFromDB());
    }, [dispatch]);

    const renderTerminalPreviews = () => {
        switch (currentTab) {
            case 0:
                return (
                    <TerminalContextProvider>
                        <ReactTerminal
                            themes={executionTerminalThemes}
                            theme={executionTerminalPreviewThemeName}
                            prompt="$"
                            enableInput={false}
                            welcomeMessage="This is your execution terminal preview, select a theme to preview or add new themes!"
                        />
                    </TerminalContextProvider>
                );
            case 1:
                return (
                    <TerminalContextProvider>
                        <ReactTerminal
                            themes={specialCommandTerminalThemes}
                            theme={specialTerminalPreviewThemeName}
                            prompt="$"
                            enableInput={false}
                            welcomeMessage="This is your special command terminal preview, select a theme to preview or add new themes!"
                        />
                    </TerminalContextProvider>
                );
        }
    };

    const renderThemeNames = () => {
        const themes =
            currentTab === 0
                ? executionTerminalThemes
                : specialCommandTerminalThemes;

        return Object.keys(themes).map((themeName, index) => (
            <MenuItem key={index} value={themeName}>
                {themeName}
            </MenuItem>
        ));
    };

    const handleThemeSelectionChange = (event) => {
        const selectedThemeName = event.target.value;
        switch (currentTab) {
            case 0:
                setExecutionTerminalPreviewThemeName(selectedThemeName);

                break;
            case 1:
                setSpecialTerminalPreviewThemeName(selectedThemeName);
                break;
        }
    };

    const handleThemeColorChange = (colorType) => (color) => {
        switch (currentTab) {
            case 0:
                setExecutionTerminalPreviewThemeColors((prevColors) => ({
                    ...prevColors,
                    [colorType]: color.hex,
                }));
                break;
            case 1:
                setSpecialCommandPreviewThemeColors((prevColors) => ({
                    ...prevColors,
                    [colorType]: color.hex,
                }));
                break;
        }
    };

    const renderColorPickers = () => {
        const themeColors = !currentTab
            ? executionTerminalPreviewThemeColors
            : specialCommandTerminalPreviewThemeColors;

        return (
            <Grid container spacing={2} justifyContent="center">
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        Background Color
                    </Typography>
                    <SketchPicker
                        color={themeColors.themeBGColor}
                        onChangeComplete={handleThemeColorChange(
                            'themeBGColor'
                        )}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        Toolbar Color
                    </Typography>
                    <SketchPicker
                        color={themeColors.themeToolbarColor}
                        onChangeComplete={handleThemeColorChange(
                            'themeToolbarColor'
                        )}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        Text Color
                    </Typography>
                    <SketchPicker
                        color={themeColors.themeColor}
                        onChangeComplete={handleThemeColorChange('themeColor')}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        Prompt Color
                    </Typography>
                    <SketchPicker
                        color={themeColors.themePromptColor}
                        onChangeComplete={handleThemeColorChange(
                            'themePromptColor'
                        )}
                    />
                </Grid>
            </Grid>
        );
    };

    const handlePreviewThemeNameChange = (event) => {
        setPreviewThemeName(event.target.value);
    };

    const handleSelectColorTheme = async () => {
        const themeName =
            currentTab === 0
                ? executionTerminalPreviewThemeName
                : specialTerminalPreviewThemeName;

        if (currentTab === 0) {
            dispatch(setExecutionTerminalSelectedThemeName(themeName));
            dispatch(
                saveExecutionTerminalSettingsToDB(executionTerminalSettings)
            );
        } else {
            dispatch(setSpecialCommandTerminalSelectedThemeName(themeName));
            dispatch(
                saveSpecialCommandTerminalSettingsToDB(
                    specialCommandTerminalSettings
                )
            );
        }
    };

    const handleAddColorTheme = () => {
        const themeName = previewThemeName;
        if (themeName.trim().length === 0) {
            toast.warning('Theme name cannot be empty or only spaces!');
            return;
        }
        switch (currentTab) {
            case 0:
                dispatch(
                    addThemeToExecutionTerminalThemes({
                        themeName,
                        theme: executionTerminalPreviewThemeColors,
                    })
                );
                dispatch(
                    saveExecutionTerminalSettingsToDB(executionTerminalSettings)
                );

                break;
            case 1:
                dispatch(
                    addThemeToSpecialCommandTerminalThemes({
                        themeName,
                        theme: specialCommandTerminalPreviewThemeColors,
                    })
                );
                dispatch(
                    saveSpecialCommandTerminalSettingsToDB(
                        specialCommandTerminalSettings
                    )
                );
                break;
        }
    };

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <SplitPane split="horizontal" sizes={sizes} onChange={setSizes}>
                <Pane minSize="0%" maxSize="100%">
                    <Box height="100%" mx={1} my={1}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                overflowY: 'hidden',
                            }}
                        >
                            <Tab label="Execution Terminal Settings" />
                            <Tab label="Special Command Terminal Settings" />
                        </Tabs>
                        {renderTerminalPreviews()}
                    </Box>
                </Pane>
                <Pane minSize="0%" maxSize="100%">
                    <Box
                        height="100%"
                        mx={1}
                        sx={{
                            borderTop: '2px solid #2196f3',
                            overflowY: 'auto',
                        }}
                    >
                        <Container>
                            <Box mt={2}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'primary.main',
                                    }}
                                >
                                    Select color theme to preview & press add
                                    theme to apply
                                </Typography>
                                <Select
                                    value={
                                        !currentTab
                                            ? executionTerminalPreviewThemeName
                                            : specialTerminalPreviewThemeName
                                    }
                                    onChange={handleThemeSelectionChange}
                                    fullWidth
                                >
                                    {renderThemeNames()}
                                </Select>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    mt={2}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{
                                            width: '100%',
                                            padding: '10px 20px',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            mt: 2,
                                            mb: 10,
                                        }}
                                        onClick={handleSelectColorTheme}
                                    >
                                        Apply Selected Theme
                                    </Button>
                                </Box>
                            </Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mt: 2,
                                    fontWeight: 'bold',
                                    color: 'secondary.main',
                                }}
                            >
                                Please name your theme below, select your colors
                                and press add theme button
                            </Typography>
                            <TextField
                                label="Theme Name"
                                value={previewThemeName}
                                onChange={handlePreviewThemeNameChange}
                                fullWidth
                            />
                            <Box mt={2}>{renderColorPickers()}</Box>
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        width: '95%',
                                        padding: '10px 20px',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        mt: 5,
                                        mb: 10,
                                    }}
                                    onClick={handleAddColorTheme}
                                >
                                    Add Theme
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </Pane>
            </SplitPane>
        </Box>
    );
};

export default TerminalSettingsPage;
