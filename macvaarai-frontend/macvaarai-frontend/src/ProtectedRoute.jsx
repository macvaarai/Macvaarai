import React from "react";

const ProtectedRoute = ({ children }) => {
  // Set default admin token if not exists (for development)
  if (!localStorage.getItem("adminToken")) {
    localStorage.setItem("adminToken", "dev-admin");
    localStorage.setItem("adminName", "Admin");
    localStorage.setItem("adminRole", "hero_admin");
  }

  return children;
};

export default ProtectedRoute;
