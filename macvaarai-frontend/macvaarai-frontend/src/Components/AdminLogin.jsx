import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HOSPITAL_ADMIN_KEYS = ["mac1001", "anbu1001", "bhai1001", "ai1001"];
const SUPER_ADMIN_KEY = "hero_admin_001";

const AdminLogin = () => {
  const [key, setKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdminPath = location.pathname === "/superadmin/login";

  const handleSubmit = () => {
    const trimmedKey = key.trim();

    // Check if Super Admin login
    if (isSuperAdminPath && trimmedKey === SUPER_ADMIN_KEY) {
      localStorage.setItem("adminKey", trimmedKey);
      localStorage.setItem("adminRole", "hero_admin");
      localStorage.setItem("adminId", "hero_001");
      localStorage.setItem("adminName", "Hero Admin");
      navigate("/superadmin");
    }
    // Check if Hospital Admin login
    else if (!isSuperAdminPath && HOSPITAL_ADMIN_KEYS.includes(trimmedKey)) {
      localStorage.setItem("adminKey", trimmedKey);
      localStorage.setItem("adminRole", "hospital_admin");
      localStorage.setItem("adminId", "admin_001");
      localStorage.setItem("adminName", "Dr. Raj Kumar");
      localStorage.setItem("hospitalId", "APL-001");
      navigate("/hospital");
    }
    else {
      alert("❌ Invalid Access Key!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-2">
        {isSuperAdminPath ? "🔐 Super Admin Access" : "🏥 Hospital Admin Access"}
      </h2>
      <p className="text-gray-400 mb-6 text-sm">
        {isSuperAdminPath ? "Full System Control" : "Hospital Management"}
      </p>
      <input
        type="password"
        placeholder="Enter Access Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        className="p-2 rounded text-black mb-3 w-64"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 mb-4"
      >
        Login
      </button>
      <p className="text-xs text-gray-500 mt-4">
        {isSuperAdminPath ? (
          <>Demo Key: <code className="bg-black px-2 py-1">hero_admin_001</code></>
        ) : (
          <>Demo Keys: <code className="bg-black px-2 py-1">mac1001</code></>
        )}
      </p>
    </div>
  );
};

export default AdminLogin;