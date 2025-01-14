import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state?.common);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};


export default ProtectedRoute;