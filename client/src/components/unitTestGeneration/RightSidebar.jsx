import { useState, useEffect } from 'react';
import {
    Box,
    SwipeableDrawer,
    List,
    ListItem,
    Typography,
    Divider,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateSettings,
    saveModelSettingsToDB,
} from '../../redux/features/modelSettingsSlice';
import { toast } from 'react-toastify';

const RightSidebar = ({ open, toggleSidebar }) => {
    const dispatch = useDispatch();
    const savedSettings = useSelector((state) => state.modelSettings);
    const [settings, setSettings] = useState(savedSettings);
    useEffect(() => {
        setSettings(savedSettings);
    }, [savedSettings]);

    const parametersMinMaxValues = {
        temperature: [0, 2],
        topP: [0, 1],
        frequencyPenalty: [0, 2],
        presencePenalty: [0, 2],
    };

    const handleSettingsChange = (prop) => (event) => {
        if (prop === 'modelSelection') {
            setSettings({
                ...settings,
                modelSelection: event.target.value,
                maxLength: modelNameMaxLengthPairs[event.target.value],
            });
        } else if (prop === 'maxLength') {
            let newValue;
            try {
                newValue = parseInt(event.target.value);
            } catch (error) {
                toast.warning('Max Length must be integer number!');
                return;
            }
            const [minValue, maxValue] = [
                0,
                modelNameMaxLengthPairs[settings.modelSelection],
            ];
            if (newValue >= minValue && newValue <= maxValue) {
                setSettings({ ...settings, maxLength: newValue });
                return;
            }
            toast.warning(
                `Max Length value must be in [${minValue}, ${maxValue}] boundaries for ${settings.modelSelection} model`
            );
        } else {
            const [minValue, maxValue] = parametersMinMaxValues[prop];
            const newValue = parseFloat(event.target.value);

            if (newValue >= minValue && newValue <= maxValue) {
                setSettings({ ...settings, [prop]: newValue });
                return;
            }
            toast.warning(
                `${prop} value must be in [${minValue}, ${maxValue}] boundaries!`
            );
        }
    };

    const [currentInput, setCurrentInput] = useState('');

    const handleInputChange = (event) => {
        setCurrentInput(event.target.value);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            const newItem = currentInput.trim();
            if (newItem && settings.stopSequences.length < 4) {
                setSettings({
                    ...settings,
                    stopSequences: [...settings.stopSequences, newItem],
                });
                setCurrentInput('');
            }
            event.preventDefault(); // Prevent form submission if it's part of a form
        }
    };

    const handleDeleteChip = (chipToDelete) => () => {
        setSettings({
            ...settings,
            stopSequences: settings.stopSequences.filter(
                (chip) => chip !== chipToDelete
            ),
        });
    };

    const handleSliderChange = (prop) => (event, newValue) => {
        setSettings({ ...settings, [prop]: newValue });
    };

    const modelsList = [
        'gpt-3.5-turbo-16k-0613',
        'gpt-3.5-turbo-16k',
        'gpt-3.5-turbo-1106',
        'gpt-3.5-turbo-0613',
        'gpt-3.5-turbo-0301',
        'gpt-3.5-turbo',
    ];

    const modelNameMaxLengthPairs = {
        'gpt-3.5-turbo-16k-0613': 16384,
        'gpt-3.5-turbo-16k': 16384,
        'gpt-3.5-turbo-1106': 4095,
        'gpt-3.5-turbo-0613': 4095,
        'gpt-3.5-turbo-0301': 4095,
        'gpt-3.5-turbo': 4095,
    };

    const handleCloseSidebar = () => {
        dispatch(updateSettings(settings));
        dispatch(saveModelSettingsToDB(settings));
        toggleSidebar();
    };

    return (
        <SwipeableDrawer
            anchor="right"
            open={open}
            onClose={handleCloseSidebar}
            onOpen={toggleSidebar}
        >
            <Box sx={{ width: 500 }} role="presentation">
                <Typography variant="h6" sx={{ p: 2 }}>
                    Model Settings
                </Typography>
                <Divider />
                <List>
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel id="model-selection-label">
                                Model
                            </InputLabel>
                            <Select
                                labelId="model-select-label"
                                id="model-select"
                                value={settings.modelSelection}
                                label="Model"
                                onChange={handleSettingsChange(
                                    'modelSelection'
                                )}
                            >
                                {modelsList.map((modelName, index) => (
                                    <MenuItem value={modelName} key={index}>
                                        {modelName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>

                    <ListItem>
                        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Temperature"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={settings.temperature}
                                    onChange={handleSettingsChange(
                                        'temperature'
                                    )}
                                    inputProps={{
                                        step: 0.01,
                                    }}
                                    sx={{ width: '50%' }}
                                />
                                <Slider
                                    value={Number(settings.temperature)}
                                    onChange={handleSliderChange('temperature')}
                                    aria-labelledby="temperature-slider"
                                    color="warning"
                                    min={0}
                                    max={2}
                                    step={0.01}
                                />
                            </Box>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Max Length"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={settings.maxLength}
                                    onChange={handleSettingsChange('maxLength')}
                                    inputProps={{
                                        step: 1,
                                    }}
                                    sx={{ width: '50%' }}
                                />
                                <Slider
                                    value={Number(settings.maxLength)}
                                    onChange={handleSliderChange('maxLength')}
                                    aria-labelledby="max-length-slider"
                                    color="success"
                                    min={0}
                                    max={
                                        modelNameMaxLengthPairs[
                                            settings.modelSelection
                                        ]
                                    }
                                    step={1}
                                />
                            </Box>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                    mb: 1,
                                }}
                            >
                                {settings.stopSequences.map((chip, index) => (
                                    <Chip
                                        key={index}
                                        label={chip}
                                        color="info"
                                        onDelete={handleDeleteChip(chip)}
                                    />
                                ))}
                            </Box>
                            <TextField
                                label="Stop Sequences"
                                type="text"
                                variant="outlined"
                                value={currentInput}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Enter values and press Enter"
                            />
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Top P"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={settings.topP}
                                    onChange={handleSettingsChange('topP')}
                                    inputProps={{
                                        step: 0.01,
                                    }}
                                    sx={{ width: '50%' }}
                                />
                                <Slider
                                    value={Number(settings.topP)}
                                    onChange={handleSliderChange('topP')}
                                    aria-labelledby="top-p-slider"
                                    color="info"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </Box>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Freq. Penalty"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={settings.frequencyPenalty}
                                    onChange={handleSettingsChange(
                                        'frequencyPenalty'
                                    )}
                                    inputProps={{
                                        step: 0.01,
                                    }}
                                    sx={{ width: '50%' }}
                                />
                                <Slider
                                    value={Number(settings.frequencyPenalty)}
                                    onChange={handleSliderChange(
                                        'frequencyPenalty'
                                    )}
                                    aria-labelledby="frequency-penalty-slider"
                                    color="error"
                                    min={0}
                                    max={2}
                                    step={0.01}
                                />
                            </Box>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Pres. Penalty"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={settings.presencePenalty}
                                    onChange={handleSettingsChange(
                                        'presencePenalty'
                                    )}
                                    inputProps={{
                                        step: 0.01,
                                    }}
                                    sx={{ width: '50%' }}
                                />
                                <Slider
                                    value={Number(settings.presencePenalty)}
                                    onChange={handleSliderChange(
                                        'presencePenalty'
                                    )}
                                    aria-labelledby="presence-penalty-slider"
                                    color="secondary"
                                    min={0}
                                    max={2}
                                    step={0.01}
                                />
                            </Box>
                        </FormControl>
                    </ListItem>
                </List>
            </Box>
        </SwipeableDrawer>
    );
};

export default RightSidebar;
