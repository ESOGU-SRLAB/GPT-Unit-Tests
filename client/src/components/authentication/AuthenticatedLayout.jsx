import Sidebar from '../../components/Sidebar';
import { useState } from 'react';
import FloatingButtonLeft from '../FloatingButtonLeft';

const AuthenticatedLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {!isSidebarOpen && <FloatingButtonLeft onClick={toggleSidebar} />}
            <Sidebar open={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {children}
        </>
    );
};

export default AuthenticatedLayout;
