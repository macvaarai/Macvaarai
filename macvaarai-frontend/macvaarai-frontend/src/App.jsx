import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import ChatSessionView from "./Components/ChatSessionView.jsx";
import ExploreMoreAI from "./Components/ExploreMoreAI.jsx";
import AppointmentHistory from "./Components/AppointmentHistory.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import AdminLogin from "./Components/AdminLogin.jsx";
import AdminSignOut from "./Components/AdminSignOut.jsx";
import AdminDashboardWrapper from "./Components/AdminDashboardWrapper.jsx";
import HospitalAdminPortal from "./Components/HospitalAdminPortal.jsx";
import HospitalTokenLogin from "./Components/HospitalTokenLogin.jsx";

const HospitalAdminWrapper = ({ children }) => {
  const role = localStorage.getItem("adminRole");

  if (role !== "hospital_admin") {
    return <Navigate to="/hospital/login" replace />;
  }

  return children;
};

// ✅ Allowed admin keys for Hospital Admins
const ADMIN_KEYS = ["mac1001", "anbu1001", "bhai1001", "ai1001"];

// ✅ Super Admin keys (Hero Admin only)
const SUPER_ADMIN_KEY = "hero_admin_001";

const AdminWrapper = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem("adminRole");
  const key = localStorage.getItem("adminKey");

  if (role === "hospital_admin" && (!key || !ADMIN_KEYS.includes(key))) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const SuperAdminWrapper = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem("adminRole");
  const key = localStorage.getItem("adminKey");

  if (role !== "hero_admin" || key !== SUPER_ADMIN_KEY) {
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const [allChats, setAllChats] = useState([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [email, setEmail] = useState(""); // ✅ store logged in email

  return (
    <Routes>
        {/* 🔹 GENERAL USERS - Public medical diagnosis platform */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden bg-black text-white">
                <Sidebar
                  allChats={allChats}
                  setAllChats={setAllChats}
                  activeChatId={activeChatId}
                  setActiveChatId={setActiveChatId}
                />

                <div className="flex flex-col flex-1 min-h-0">
                  <Header />
                  <Routes>
                    <Route path="/" element={<ExploreMoreAI />} />
                    <Route
                      path="/chat/:chatId"
                      element={
                        <ChatSessionView
                          allChats={allChats}
                          setAllChats={setAllChats}
                          isAiResponding={isAiResponding}
                          setIsAiResponding={setIsAiResponding}
                          activeChatId={activeChatId}
                          setActiveChatId={setActiveChatId}
                          handleStreamComplete={() =>
                            setIsAiResponding(false)
                          }
                        />
                      }
                    />
                    <Route
                      path="/card/:cardPath"
                      element={
                        <ChatSessionView
                          allChats={allChats}
                          setAllChats={setAllChats}
                          isAiResponding={isAiResponding}
                          setIsAiResponding={setIsAiResponding}
                          activeChatId={activeChatId}
                          setActiveChatId={setActiveChatId}
                          handleStreamComplete={() =>
                            setIsAiResponding(false)
                          }
                        />
                      }
                    />
                    <Route path="/appointments" element={<AppointmentHistory />} />

                    {/* ✅ Profile route */}
                    <Route
                      path="/profile"
                      element={
                        <ProfilePage
                          email={email}
                          onDelete={() => {
                            localStorage.clear();
                            window.location.href = "/";
                          }}
                        />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 🔹 HOSPITAL ADMIN - New Hospital Admin Portal */}
        <Route
          path="/hospital"
          element={
            <HospitalAdminWrapper>
              <HospitalAdminPortal
                onLogout={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminRole");
                  localStorage.removeItem("adminId");
                  localStorage.removeItem("hospitalId");
                  localStorage.removeItem("adminName");
                  window.location.href = "/hospital/login";
                }}
                adminData={{
                  role: localStorage.getItem("adminRole"),
                  admin_id: localStorage.getItem("adminId"),
                  hospital_id: localStorage.getItem("hospitalId"),
                  name: localStorage.getItem("adminName"),
                }}
              />
            </HospitalAdminWrapper>
          }
        />

        <Route path="/hospital/login" element={<HospitalTokenLogin apiUrl={import.meta.env.VITE_API_URL || "http://localhost:8000"} />} />

        <Route
          path="/admin/*"
          element={
            <AdminWrapper>
              <div className="flex h-screen overflow-hidden bg-black text-white">
                <Sidebar
                  allChats={allChats}
                  setAllChats={setAllChats}
                  activeChatId={activeChatId}
                  setActiveChatId={setActiveChatId}
                />
                <div className="flex flex-col flex-1 min-h-0">
                  <Header />
                  <div className="p-2">
                    <AdminSignOut />
                  </div>
                  <Routes>
                    <Route path="/" element={<ExploreMoreAI />} />
                    <Route
                      path="chat/:chatId"
                      element={
                        <ChatSessionView
                          allChats={allChats}
                          setAllChats={setAllChats}
                          isAiResponding={isAiResponding}
                          setIsAiResponding={setIsAiResponding}
                          activeChatId={activeChatId}
                          setActiveChatId={setActiveChatId}
                          handleStreamComplete={() =>
                            setIsAiResponding(false)
                          }
                        />
                      }
                    />
                    <Route
                      path="card/:cardPath"
                      element={
                        <ChatSessionView
                          allChats={allChats}
                          setAllChats={setAllChats}
                          isAiResponding={isAiResponding}
                          setIsAiResponding={setIsAiResponding}
                          activeChatId={activeChatId}
                          setActiveChatId={setActiveChatId}
                          handleStreamComplete={() =>
                            setIsAiResponding(false)
                          }
                        />
                      }
                    />
                    <Route path="appointments" element={<AppointmentHistory />} />
                  </Routes>
                </div>
              </div>
            </AdminWrapper>
          }
        />

        {/* 🔹 SUPER ADMIN (HERO ADMIN) - Full system control */}
        <Route path="/superadmin/login" element={<AdminLogin />} />

        <Route
          path="/superadmin/*"
          element={
            <SuperAdminWrapper>
              <AdminDashboardWrapper />
            </SuperAdminWrapper>
          }
        />
      </Routes>
  );
};

export default App;