import React, { useState } from "react";
import SignInForm from "./Components/SignInForm";
import SignUpForm from "./Components/SignUpForm";

const ProtectedRoute = ({ children }) => {
  // Bypass authentication - go directly to dashboard
  return children;
};

export default ProtectedRoute;
