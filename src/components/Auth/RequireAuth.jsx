import { Navigate, Outlet } from "react-router-dom";

function RequireAuth() {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }

     
}

export default RequireAuth;