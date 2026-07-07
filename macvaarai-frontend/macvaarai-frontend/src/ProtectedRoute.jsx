import React from "react";

const ProtectedRoute = ({ children }) => {
  // Development mode - auto-login
  localStorage.setItem("adminToken", "dev-admin-session");
  localStorage.setItem("adminName", "Vijay Care Admin");
  localStorage.setItem("adminRole", "hero_admin");
  localStorage.setItem("adminEmail", "admin@vijaycare.com");

  return children;
};

export default ProtectedRoute;
