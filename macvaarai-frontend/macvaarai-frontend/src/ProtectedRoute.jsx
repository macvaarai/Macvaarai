import React, { useState } from "react";
import SignInForm from "./Components/SignInForm";
import SignUpForm from "./Components/SignUpForm";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [showSignUp, setShowSignUp] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        {/* 🔹 Logo + Team heading */}
        <div className="text-center mb-8">
          <div className="mx-auto w-28 h-28 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">❤️ Bharat Health-AI</h1>
          <h2 className="text-2xl font-semibold">AI Manager</h2>
          <p className="text-gray-400">Powered by Macvaar AI</p>
        </div>

        {/* 🔹 Welcome message */}
        <h2 className="mb-6 text-xl font-medium">Welcome to MacvaarAI</h2>

        {/* 🔹 Custom Sign in / Sign up forms */}
        {showSignUp ? (
          <SignUpForm onSwitch={() => setShowSignUp(false)} />
        ) : (
          <SignInForm
            onSwitch={() => setShowSignUp(true)}
            onLogin={() => setIsAuthenticated(true)}
          />
        )}
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
