import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default AuthenticatedRoute;
