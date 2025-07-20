// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// children: the protected page component (e.g. Dashboard)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
