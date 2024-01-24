import { ReactTerminal, TerminalContextProvider } from 'react-terminal';
import { useSelector } from 'react-redux';

const SpecialCommandTerminal = () => {
    const specialCommandTerminalSettings = useSelector(
        (state) => state.terminalSettings.specialCommandTerminalSettings
    );
    let { themes, selectedThemeName } = specialCommandTerminalSettings;

    const outputEditorContent = useSelector(
        (state) => state.editorContents.outputEditorContent.editorContent
    );

    const commands = {
        npx: (args) => {
            const commandType = args.split(' ')[0];
            switch (commandType) {
                case 'download':
                    const fileName = 'output.py';
                    const blob = new Blob([outputEditorContent], {
                        type: 'text/python',
                    });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.style.display = 'none';

                    document.body.appendChild(a);

                    a.click();

                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    return 'File have been downloaded successfully!';
            }
        },
    };

    return (
        <TerminalContextProvider>
            <ReactTerminal
                // showControlBar={false}
                themes={themes}
                theme={selectedThemeName}
                prompt="$"
                commands={commands}
                errorMessage="Command does not exist!"
            />
        </TerminalContextProvider>
    );
};

export default SpecialCommandTerminal;
