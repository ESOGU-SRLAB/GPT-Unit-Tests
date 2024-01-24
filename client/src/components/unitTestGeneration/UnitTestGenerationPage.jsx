import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModelSettingsFromDB } from '../../redux/features/modelSettingsSlice';
import FloatingButtonRight from './FloatingButtonRight';
import RightSidebar from './RightSidebar';
import Editor from '@monaco-editor/react';
import SplitPane, { Pane } from 'split-pane-react';
import { useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditorLoadingScreen from './EditorLoadingScreen';
import { fetchEditorSettingsFromDB } from '../../redux/features/editorSettingsSlice';
import {
    fetchExecutionTerminalSettingsFromDB,
    fetchSpecialCommandTerminalSettingsFromDB,
} from '../../redux/features/terminalSettingsSlice';
import ExecutionTerminal from './ExecutionTerminal';
import SpecialCommandTerminal from './SpecialCommandTerminal';
import {
    updateInputEditorContent,
    updateOutputEditorContent,
} from '../../redux/features/editorContentsSlice';
import { toast } from 'react-toastify';

const UnitTestGenerationPage = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const dispatch = useDispatch();
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const toggleRightSidebar = () => {
        setRightSidebarOpen(!isRightSidebarOpen);
    };

    useEffect(() => {
        // Define the keydown event handler
        const handleKeyDown = (event) => {
            if (
                event.ctrlKey &&
                (event.key.toLowerCase() === 's' || event.keyCode === 83)
            ) {
                event.preventDefault();
                toast.info('We save it for you, no worries 😏');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        dispatch(fetchModelSettingsFromDB());
        dispatch(fetchEditorSettingsFromDB());
        dispatch(fetchExecutionTerminalSettingsFromDB());
        dispatch(fetchSpecialCommandTerminalSettingsFromDB());
    }, [dispatch]);

    const [editorSizes, setEditorSizes] = useState(['50%', 'auto']);
    const [terminalSizes, setTerminalSizes] = useState(['50%', 'auto']);

    const inputEditorContent = useSelector(
        (state) => state?.editorContents.inputEditorContent.editorContent
    );

    const outputEditorContent = useSelector(
        (state) => state?.editorContents.outputEditorContent.editorContent
    );

    const inputEditorOptions = useSelector(
        (state) => state?.editorSettings.inputEditorOptions
    );
    const outputEditorOptions = useSelector(
        (state) => state?.editorSettings.outputEditorOptions
    );

    const testGenerationCountInCurrentSession = useSelector(
        (state) => state?.editorContents.testGenerationCountInCurrentSession
    );
    const handleInputEditorChange = (editorContent) => {
        dispatch(updateInputEditorContent(editorContent));
    };

    const handleOutputEditorChange = (editorContent) => {
        dispatch(updateOutputEditorContent(editorContent));
    };

    return (
        <Box sx={{ minHeight: '100vh', overflowY: 'auto' }}>
            {!isRightSidebarOpen && (
                <FloatingButtonRight onClick={toggleRightSidebar} />
            )}
            <RightSidebar
                open={isRightSidebarOpen}
                toggleSidebar={toggleRightSidebar}
            />
            {isLargeScreen ? (
                // SplitPane layout for larger screens
                <Box
                    sx={{
                        height: '60vh',
                        mt: 4,
                        mr: 2,
                        ml: 2,
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', // Shadow effect
                    }}
                >
                    <SplitPane
                        split="vertical"
                        sizes={editorSizes}
                        onChange={setEditorSizes}
                    >
                        <Pane minSize="40%" maxSize="60%">
                            <Box
                                sx={{
                                    height: '100%',
                                    borderRight: '2px solid #2196f3',
                                    position: 'relative',
                                    overflow: 'hidden', // Ensure drag-and-drop works properly
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(false);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(false);

                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const content = event.target.result;
                                            // Send content to Special Command Terminal or update editor as needed
                                            console.log(content);
                                            handleInputEditorChange(content);
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                            >
                                <Editor
                                    height="100%"
                                    theme="vs-light"
                                    language="python"
                                    value={inputEditorContent}
                                    onChange={handleInputEditorChange}
                                    loading={<EditorLoadingScreen />}
                                    options={{
                                        ...inputEditorOptions,
                                        readOnly:
                                            testGenerationCountInCurrentSession >=
                                            1,
                                    }}
                                />
                            </Box>
                        </Pane>
                        <Pane minSize="40%" maxSize="60%">
                            <Editor
                                height="100%"
                                theme="vs-light"
                                language="python"
                                value={outputEditorContent}
                                onChange={handleOutputEditorChange}
                                options={outputEditorOptions}
                                loading={<EditorLoadingScreen />}
                            />
                        </Pane>
                    </SplitPane>
                </Box>
            ) : (
                // Stacked layout for smaller screens
                <Box
                    sx={{
                        mt: 4,
                        mx: 2,
                    }}
                >
                    <Box
                        sx={{
                            height: '30vh',
                            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                            position: 'relative',
                        }}
                    >
                        <Editor
                            height="100%"
                            theme="vs-light"
                            language="python"
                            value={inputEditorContent}
                            onChange={handleInputEditorChange}
                            loading={<EditorLoadingScreen />}
                            options={{
                                ...inputEditorOptions,
                                readOnly:
                                    testGenerationCountInCurrentSession >= 1,
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            height: '30vh',
                            mt: 2,
                            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                            position: 'relative',
                        }}
                    >
                        <Editor
                            height="100%"
                            theme="vs-light"
                            language="python"
                            value={outputEditorContent}
                            onChange={handleOutputEditorChange}
                            options={outputEditorOptions}
                            loading={<EditorLoadingScreen />}
                        />
                    </Box>
                </Box>
            )}
            <Box
                sx={{
                    mr: 2,
                    ml: 2,
                    mb: 2,
                    mt: 2,
                    height: '30vh',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', // Shadow effect
                }}
            >
                <SplitPane
                    split="horizontal"
                    sizes={terminalSizes}
                    onChange={setTerminalSizes}
                >
                    <Pane minSize="20%" maxSize="80%">
                        <Box
                            sx={{
                                height: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <ExecutionTerminal />
                        </Box>
                    </Pane>
                    <Pane minSize="20%" maxSize="80%">
                        <Box
                            sx={{
                                height: '100%',
                                boxSizing: 'border-box',
                                borderTop: '2px solid #2196f3',
                            }}
                        >
                            <SpecialCommandTerminal />
                        </Box>
                    </Pane>
                </SplitPane>
            </Box>
        </Box>
    );
};

export default UnitTestGenerationPage;
