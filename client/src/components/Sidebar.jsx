import React from 'react';
import {
    Box,
    SwipeableDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '../assets/sidebarIcons/dashboard.png';
import AccountIcon from '../assets/sidebarIcons/account.png';
import EditorIcon from '../assets/sidebarIcons/editor.png';
import UnitTestIcon from '../assets/sidebarIcons/unittest.png';
import HistoryIcon from '../assets/sidebarIcons/history.png';
import TerminaIcon from '../assets/sidebarIcons/terminal.png';
import { resetUserData } from '../redux/features/userDataSlice';
import { resetEditorContents } from '../redux/features/editorContentsSlice';
import { resetEditorSettings } from '../redux/features/editorSettingsSlice';
import { resetModelSettings } from '../redux/features/modelSettingsSlice';
import { resetTerminalSettings } from '../redux/features/terminalSettingsSlice';
import { resetTestGenerationAndExecutionHistory } from '../redux/features/testGenerationAndExecutionHistorySlice';
import { resetUserActionsRecap } from '../redux/features/userActionsRecapSlice';
import { handleLogout } from '../redux/features/userDataSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogOutIcon from '../assets/sidebarIcons/logout.png';

const Sidebar = ({ open, toggleSidebar }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sidebarRoutingItems = [
        {
            primaryText: 'Dashboard',
            secondaryText:
                'Navigate to dashboard page to see your overall entities.',
            to: '/',
            image: (
                <img
                    src={DashboardIcon}
                    style={{ width: '24px', height: '24px' }}
                />
            ),
        },
        {
            primaryText: 'Unit Test Generation',
            secondaryText:
                'Write or upload your own Python code, generate unit tests & run to see the results.',
            to: '/generation',
            image: (
                <img
                    src={UnitTestIcon}
                    style={{ width: '24px', height: '24px' }}
                />
            ),
        },
        {
            primaryText: 'Editor Settings',
            secondaryText:
                'Configure your editor settings as you wish, change keyboard shortcuts, editor theme and more',
            to: '/editor-settings',
            image: (
                <img
                    src={EditorIcon}
                    style={{ width: '24px', height: '24px' }}
                />
            ),
        },
        {
            primaryText: 'Terminal Settings',
            secondaryText:
                'Configure your terminal settings as you wish, change terminal colors & more',
            to: '/terminal-settings',
            image: (
                <img
                    src={TerminaIcon}
                    style={{ width: '24px', height: '24px' }}
                />
            ),
        },
        {
            primaryText: 'Unit Test Generation History',
            secondaryText:
                'List your recent unit test codes and their execution results.',
            to: '/generation-history',
            image: (
                <img
                    src={HistoryIcon}
                    style={{ width: '24px', height: '24px' }}
                />
            ),
        },
        {
            primaryText: 'Account',
            secondaryText:
                'Navigate to account page to see & modify your personal information.',
            to: '/account',
            image: (
                <img
                    src={AccountIcon}
                    style={{ width: '24px', height: '24px' }}
                />
            ),
        },
    ];
    const onLogoutClick = () => {
        dispatch(resetUserData());
        dispatch(resetEditorContents());
        dispatch(resetEditorSettings());
        dispatch(resetModelSettings());
        dispatch(resetTerminalSettings());
        dispatch(resetTestGenerationAndExecutionHistory());
        dispatch(resetUserActionsRecap());
        dispatch(handleLogout(navigate));
    };
    return (
        <>
            <SwipeableDrawer
                anchor="left"
                open={open}
                onClose={toggleSidebar}
                onOpen={toggleSidebar}
            >
                <Box
                    role="presentation"
                    mb={5}
                    sx={{ width: isLargeScreen ? 500 : '80vw' }}
                >
                    <Box
                        sx={{
                            padding: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h5">Navigation</Typography>
                    </Box>
                    <Divider />
                    <List>
                        {sidebarRoutingItems.map((item, index) => {
                            let { primaryText, secondaryText, to, image } =
                                item;
                            return (
                                <React.Fragment key={index}>
                                    <ListItem
                                        disablePadding
                                        sx={{
                                            justifyContent: 'center',
                                            marginY: '0.75rem',
                                        }}
                                    >
                                        <RouterLink
                                            to={to}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                width: '100%',
                                                display: 'block',
                                            }}
                                        >
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    {image}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={primaryText}
                                                    secondary={secondaryText}
                                                />
                                            </ListItemButton>
                                        </RouterLink>
                                    </ListItem>
                                    {index < sidebarRoutingItems.length - 1 && (
                                        <Divider />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </List>
                    <IconButton
                        onClick={onLogoutClick}
                        sx={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '1rem',
                            width: '7rem',
                            height: '7rem',
                        }}
                    >
                        <img
                            src={LogOutIcon}
                            alt="Arrow Icon"
                            style={{
                                width: '3rem',
                                height: '3rem',
                                objectFit: 'contain',
                            }}
                        />
                    </IconButton>
                </Box>
            </SwipeableDrawer>
        </>
    );
};

export default Sidebar;
