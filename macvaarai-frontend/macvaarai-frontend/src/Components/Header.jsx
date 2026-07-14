// src/Components/Header.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // ✅ Hide header everywhere except home ("/")
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-blue-900 via-black to-black border-b border-blue-700">
      {/* Left Section */}
      <div>
        <div className="flex items-center space-x-3">
          <img src="/logos/Macvaar.jpg" alt="Macvaar AI" className="h-16 w-16 rounded-full border-4 border-blue-400 object-cover" />
          <div>
            <span className="font-bold text-3xl text-blue-400">
              AI Health Platform
            </span>
            <p className="text-sm text-blue-300">Intelligent Medical Diagnostics</p>
          </div>
        </div>
      </div>

      {/* Right Logo */}
      <img src="/logos/Macvaar.jpg" alt="Macvaar AI" className="h-14 w-14 rounded-full border-4 border-blue-400 object-cover" />
    </div>
  );
};

export default Header;
