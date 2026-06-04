import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSignOut = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = localStorage.getItem("adminRole");
    localStorage.removeItem("adminKey");
    localStorage.removeItem("adminRole");

    if (role === "hero_admin") {
      navigate("/superadmin/login");
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
    >
      Sign Out
    </button>
  );
};

export default AdminSignOut;