import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    navigate("/");
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <h1 className="h4 mb-0">{title || "Dashboard"}</h1>
      <button onClick={handleLogout} className="btn btn-danger btn-sm">
        Logout
      </button>
    </header>
  );
};

export default Header;
