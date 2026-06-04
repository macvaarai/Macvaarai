import React, { useState, useEffect } from "react";
import AdminLoginPage from "./AdminLoginPage";
import HeroAdminDashboardNew from "./HeroAdminDashboardNew";
import HospitalAdminDashboard from "./HospitalAdminDashboard";

const AdminDashboardWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already logged in (from localStorage)
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    const adminId = localStorage.getItem("adminId");

    if (token && role && adminId) {
      setIsLoggedIn(true);
      setAdminData({
        role,
        admin_id: adminId,
        hospital_id: localStorage.getItem("hospitalId"),
        name: localStorage.getItem("adminName") || "Admin",
        token,
      });
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (data) => {
    setAdminData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminId");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("adminName");
    setIsLoggedIn(false);
    setAdminData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render appropriate dashboard based on role
  if (adminData.role === "hero_admin") {
    return <HeroAdminDashboardNew onLogout={handleLogout} adminData={adminData} />;
  } else if (adminData.role === "hospital_admin") {
    return <HospitalAdminDashboard onLogout={handleLogout} adminData={adminData} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Unauthorized access level</p>
    </div>
  );
};

export default AdminDashboardWrapper;
