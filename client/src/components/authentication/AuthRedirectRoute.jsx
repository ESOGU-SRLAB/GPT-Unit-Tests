import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRedirectRoute = ({ children }) => {
    const user = useSelector((state) => state.userData);
    if (user && user.username) {
        return <Navigate to="/" />;
    }
    return children;
};

export default AuthRedirectRoute;
