import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Tab, Box } from '@mui/material';
import Editor from '@monaco-editor/react';
import SplitPane, { Pane } from 'split-pane-react';
import { toast } from 'react-toastify';
import {
    setInputEditorOptions,
    setOutputEditorOptions,
    saveEditorSettingsToDB,
    fetchEditorSettingsFromDB,
} from '../../redux/features/editorSettingsSlice';
import editorSettingsPageEditorContents from './EditorSettingsPageEditorContents.json';

const EditorSettingsPage = () => {
    const dispatch = useDispatch();

    const [currentTab, setCurrentTab] = useState(0);

    const inputEditorOptions = useSelector(
        (state) => state.editorSettings.inputEditorOptions
    );
    const [localInputEditorOptions, setLocalInputEditorOptions] = useState({});
    const outputEditorOptions = useSelector(
        (state) => state.editorSettings.outputEditorOptions
    );
    const [localOutputEditorOptions, setLocalOutputEditorOptions] = useState();
    const settingsEditorOptions = { fontSize: 20 };

    const [inputEditorPreviewEditorContent, setInputEditorPreviewContent] =
        useState('');
    const [outputEditorPreviewEditorContent, setOutputEditorPreviewContent] =
        useState('');

    const [
        inputEditorSettingsEditorContent,
        setInputEditorSettingsEditorContent,
    ] = useState(
        JSON.stringify(inputEditorOptions, null, 2) // Format JSON for readability
    );
    const [
        outputEditorSettingsEditorContent,
        setOutputEditorSettingsEditorContent,
    ] = useState(
        JSON.stringify(outputEditorOptions, null, 2) // Format JSON for readability
    );

    useEffect(() => {
        setInputEditorSettingsEditorContent(
            JSON.stringify(inputEditorOptions, null, 2)
        );
        setOutputEditorSettingsEditorContent(
            JSON.stringify(outputEditorOptions, null, 2)
        );
    }, [inputEditorOptions, outputEditorOptions]);

    useEffect(() => {
        const modifiedInputOptions = {
            ...inputEditorOptions,
            readOnly: true,
        };
        const modifiedOutputOptions = {
            ...outputEditorOptions,
            readOnly: true,
        };

        setLocalInputEditorOptions(modifiedInputOptions);
        setLocalOutputEditorOptions(modifiedOutputOptions);
    }, [inputEditorOptions, outputEditorOptions]);

    useEffect(() => {
        setInputEditorPreviewContent(
            editorSettingsPageEditorContents.inputEditorPreviewEditorContent
        );
        setOutputEditorPreviewContent(
            editorSettingsPageEditorContents.outputEditorPreviewContent
        );
    }, []);

    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            handleSettingsEditorSave();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
        currentTab,
        inputEditorSettingsEditorContent,
        outputEditorSettingsEditorContent,
    ]);

    useEffect(() => {
        dispatch(fetchEditorSettingsFromDB());
    }, [dispatch]);
    const handleSettingsEditorSave = () => {
        try {
            let parsedContent;
            let type = currentTab === 0 ? 'input' : 'output';
            switch (currentTab) {
                case 0:
                    parsedContent = JSON.parse(
                        inputEditorSettingsEditorContent
                    );
                    dispatch(setInputEditorOptions(parsedContent));
                    dispatch(
                        saveEditorSettingsToDB({
                            settings: parsedContent,
                            type,
                        })
                    );
                    toast.success('Input editor settings saved!');
                    break;
                case 1:
                    parsedContent = JSON.parse(
                        outputEditorSettingsEditorContent
                    );
                    dispatch(setOutputEditorOptions(parsedContent));
                    dispatch(
                        saveEditorSettingsToDB({
                            settings: parsedContent,
                            type,
                        })
                    );
                    toast.success('Output editor settings saved!');
                    break;
                default:
                    break;
            }
        } catch (error) {
            toast.error('Failed to save settings: Invalid JSON');
        }
    };

    const handleInputEditorSettingsEditorContentsChange = (content) => {
        setInputEditorSettingsEditorContent(content);
    };

    const handleOutputEditorSettingsEditorContentChange = (content) => {
        setOutputEditorSettingsEditorContent(content);
    };

    const handleTabChange = (event, tabIndex) => setCurrentTab(tabIndex);

    const renderEditorPreviews = () => {
        switch (currentTab) {
            case 0:
                return (
                    <Editor
                        height="100%"
                        theme="vs-light"
                        language="python"
                        value={inputEditorPreviewEditorContent}
                        options={localInputEditorOptions}
                    />
                );
            case 1:
                return (
                    <Editor
                        height="100%"
                        theme="vs-light"
                        language="python"
                        value={outputEditorPreviewEditorContent}
                        options={localOutputEditorOptions}
                    />
                );
            default:
                return null;
        }
    };

    const [sizes, setSizes] = useState(['50%', 'auto']);

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <SplitPane split="horizontal" sizes={sizes} onChange={setSizes}>
                <Pane minSize="20%" maxSize="80%">
                    <Tabs
                        onChange={handleTabChange}
                        value={currentTab}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            overflowY: 'hidden',
                        }}
                    >
                        <Tab label="Input Editor Settings" />
                        <Tab label="Output Editor Settings" />
                    </Tabs>
                    {renderEditorPreviews()}
                </Pane>
                <Pane minSize="20%" maxSize="80%">
                    <Box height="100%" sx={{ border: '2px solid #2196f3' }}>
                        <Editor
                            height="100%"
                            theme="vs-light"
                            options={settingsEditorOptions}
                            language="json"
                            onChange={
                                currentTab === 0
                                    ? handleInputEditorSettingsEditorContentsChange
                                    : handleOutputEditorSettingsEditorContentChange
                            }
                            value={
                                currentTab === 0
                                    ? inputEditorSettingsEditorContent
                                    : outputEditorSettingsEditorContent
                            }
                        />
                    </Box>
                </Pane>
            </SplitPane>
        </Box>
    );
};

export default EditorSettingsPage;
