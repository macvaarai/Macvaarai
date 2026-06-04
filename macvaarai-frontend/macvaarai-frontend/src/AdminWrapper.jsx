import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ADMIN_KEYS = ["mac1001", "anbu1001", "bhai1001", "ai1001"];

const AdminWrapper = ({ children }) => {
  const location = useLocation();
  const key = localStorage.getItem("adminKey");

  if (!key || !ADMIN_KEYS.includes(key)) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminWrapper;
