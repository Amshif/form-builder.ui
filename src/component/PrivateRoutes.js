import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation(); 


  console.log("PrivateRoute - Token:", token);

  if (!token) {
    localStorage.setItem("redirectTo", location.pathname);
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
