import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.userData);
    if (!user.username || !user.userEmailAddress) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
