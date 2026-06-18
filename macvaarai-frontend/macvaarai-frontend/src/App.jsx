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
import AdminDashboard from "./Components/AdminDashboard.jsx";
import AdminSignOut from "./Components/AdminSignOut.jsx";
import AdminDashboardWrapper from "./Components/AdminDashboardWrapper.jsx";
import HospitalAdminPortal from "./Components/HospitalAdminPortal.jsx";
import HospitalTokenLogin from "./Components/HospitalTokenLogin.jsx";
import OrganizationLogin from "./Components/OrganizationLogin.jsx";
import OrganizationAdminDashboard from "./Components/OrganizationAdminDashboard.jsx";
import OrganizationDashboard from "./Components/OrganizationDashboard.jsx";
import OrganizationAdminDashboardNew from "./Components/OrganizationAdminDashboardNew.jsx";
import DynamicOrgLogin from "./Components/DynamicOrgLogin.jsx";
import OrganizationPortalDashboard from "./Components/OrganizationPortalDashboard.jsx";
import OrganizationTokenVerification from "./Components/OrganizationTokenVerification.jsx";
import VijayCareDashboardComplete from "./Components/VijayCareDashboardComplete.jsx";

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

const NewAdminWrapper = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) return <Navigate to="/admin/login" replace />;
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

const OrgAdminWrapper = ({ children }) => {
  const location = useLocation();
  const orgAdminToken = localStorage.getItem("orgAdminToken");

  if (!orgAdminToken) {
    return <Navigate to="/org-admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const VijayCareDashboardWrapper = ({ children }) => {
  const location = useLocation();
  const vijayToken = localStorage.getItem("vijayToken");
  const vijayOrgName = localStorage.getItem("vijayOrgName");

  if (!vijayToken || vijayOrgName !== "Vijay Care") {
    return <Navigate to="/vijay-care/login" state={{ from: location }} replace />;
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

        {/* 🔹 INDIVIDUAL HOSPITAL URLS */}
        <Route path="/:hospitalSlug-hospital/login" element={<HospitalTokenLogin apiUrl={import.meta.env.VITE_API_URL || "http://localhost:8000"} />} />

        {/* 🔹 INDIVIDUAL ORGANIZATION URLS */}
        <Route path="/:orgSlug-org/login" element={<OrganizationLogin />} />

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

        {/* 🔹 DYNAMIC ORGANIZATION TOKEN VERIFICATION - Each org gets its own URL */}
        <Route
          path="/:orgSlug-org-admin"
          element={<OrganizationTokenVerification />}
        />

        {/* 🔹 DYNAMIC ORGANIZATION LOGIN - After token verification */}
        <Route
          path="/:orgSlug-org-admin/login"
          element={<DynamicOrgLogin />}
        />

        {/* 🔹 ORGANIZATION ADMIN - Organization-level management */}
        <Route
          path="/org-admin/login"
          element={<OrganizationLogin onLoginSuccess={(data) => {}} />}
        />

        <Route
          path="/org-admin/dashboard"
          element={
            <OrgAdminWrapper>
              <OrganizationAdminDashboard
                onLogout={() => window.location.href = '/org-admin/login'}
              />
            </OrgAdminWrapper>
          }
        />

        <Route
          path="/org/dashboard"
          element={
            <OrgAdminWrapper>
              <OrganizationAdminDashboardNew />
            </OrgAdminWrapper>
          }
        />

        <Route
          path="/org/portal"
          element={
            <OrgAdminWrapper>
              <OrganizationPortalDashboard />
            </OrgAdminWrapper>
          }
        />

        {/* 🔹 VIJAY CARE ORGANIZATION DASHBOARD - Token-based access */}
        <Route
          path="/vijay-care/login"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
              <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-yellow-500">
                <div className="text-center mb-6">
                  <img src="/logos/Vijay.jpeg" alt="Vijay Care Logo" className="h-20 w-20 rounded-full border-4 border-yellow-500 mx-auto object-cover mb-4" />
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">Vijay Care</h2>
                  <p className="text-gray-400">Healthcare Organization Portal</p>
                </div>
                <p className="text-gray-300 mb-6 text-center">Enter your organization token to access the dashboard</p>
                <input
                  type="password"
                  placeholder="Enter access token"
                  id="vijayToken"
                  className="w-full border-2 border-gray-600 rounded-lg px-4 py-3 mb-4 bg-gray-700 text-white placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const token = document.getElementById('vijayToken').value;
                      if (token === 'ORG_VIJAY_CARE_6E1455EE') {
                        localStorage.setItem('vijayToken', token);
                        localStorage.setItem('vijayOrgName', 'Vijay Care');
                        localStorage.setItem('orgToken', token);
                        localStorage.setItem('orgName', 'Vijay Care');
                        window.location.href = '/vijay-care/dashboard';
                      } else {
                        alert('Invalid token');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const token = document.getElementById('vijayToken').value;
                    if (token === 'ORG_VIJAY_CARE_6E1455EE') {
                      localStorage.setItem('vijayToken', token);
                      localStorage.setItem('vijayOrgName', 'Vijay Care');
                      localStorage.setItem('orgToken', token);
                      localStorage.setItem('orgName', 'Vijay Care');
                      window.location.href = '/vijay-care/dashboard';
                    } else {
                      alert('Invalid token');
                    }
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Login
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">Token: ORG_VIJAY_CARE_6E1455EE</p>
              </div>
            </div>
          }
        />

        <Route
          path="/vijay-care/dashboard"
          element={
            <VijayCareDashboardWrapper>
              <VijayCareDashboardComplete />
            </VijayCareDashboardWrapper>
          }
        />

        {/* 🔹 NEW ADMIN PANEL - anbu@1001 */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <NewAdminWrapper>
              <AdminDashboard />
            </NewAdminWrapper>
          }
        />
      </Routes>
  );
};

export default App;