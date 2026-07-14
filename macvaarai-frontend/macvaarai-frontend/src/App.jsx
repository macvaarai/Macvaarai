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
import HospitalAdminPortal from "./Components/HospitalAdminPortal.jsx";
import HospitalTokenLogin from "./Components/HospitalTokenLogin.jsx";
import OrganizationLogin from "./Components/OrganizationLogin.jsx";
import OrganizationDashboard from "./Components/OrganizationDashboard.jsx";
import DynamicOrgLogin from "./Components/DynamicOrgLogin.jsx";
import OrganizationPortalDashboard from "./Components/OrganizationPortalDashboard.jsx";
import OrganizationTokenVerification from "./Components/OrganizationTokenVerification.jsx";
import VijayCareDashboardComplete from "./Components/VijayCareDashboardComplete.jsx";
import VijayLoginPage from "./Components/VijayLoginPage.jsx";
import MasterCheckAILoginPage from "./Components/MasterCheckAILoginPage.jsx";
import UnifiedCareLogin from "./Components/UnifiedCareLogin.jsx";
import CarePortalDashboard from "./Components/CarePortalDashboard.jsx";

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

  if (!vijayToken || !vijayOrgName) {
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

        {/* 🔹 INDIVIDUAL ORGANIZATION URLS - DISABLED (using direct org routes instead) */}
        {/* <Route path="/:orgSlug-org/login" element={<OrganizationLogin />} /> */}

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
                    <Route path="/" element={<Navigate to="/admin/login" replace />} />
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
        {/* ADMIN PORTAL - Consolidated single admin dashboard */}
        <Route path="/superadmin/login" element={<AdminLogin />} />
        <Route
          path="/superadmin/dashboard"
          element={
            <NewAdminWrapper>
              <AdminDashboard />
            </NewAdminWrapper>
          }
        />

        <Route
          path="/org-admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/org-admin/dashboard"
          element={
            <NewAdminWrapper>
              <AdminDashboard />
            </NewAdminWrapper>
          }
        />

        <Route
          path="/org/dashboard"
          element={
            <OrgAdminWrapper>
              <AdminDashboard />
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

        {/* 🔹 Vijay Care AI - Token Login (Simple) */}
        <Route path="/vijay-care/login" element={<VijayLoginPage />} />

        <Route
          path="/vijay-care/dashboard"
          element={
            <VijayCareDashboardWrapper>
              <VijayCareDashboardComplete />
            </VijayCareDashboardWrapper>
          }
        />

        {/* 🔹 MasterCheckAI - Same as Vijay Care with MasterCheckAI branding */}
        <Route path="/mastercheckAI/login" element={<MasterCheckAILoginPage />} />

        <Route
          path="/mastercheckAI/dashboard"
          element={
            <VijayCareDashboardWrapper>
              <VijayCareDashboardComplete />
            </VijayCareDashboardWrapper>
          }
        />

        {/* Modi Care AI Organization - Orange */}
        <Route
          path="/modi-care/login"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
              <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-orange-500">
                <div className="text-center mb-6">
                  <img src="/logos/Modi.jpeg" alt="Modi Care AI Logo" className="h-20 w-20 rounded-full border-4 border-orange-500 mx-auto object-cover mb-4" />
                  <h2 className="text-3xl font-bold text-orange-400 mb-2">Modi Care AI</h2>
                  <p className="text-gray-400">AI-Driven Early Disease Detection & Identification</p>
                </div>
                <input
                  type="password"
                  placeholder="Enter access token"
                  id="modiToken"
                  className="w-full border-2 border-gray-600 rounded-lg px-4 py-3 mb-4 bg-gray-700 text-white placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const token = document.getElementById('modiToken').value;
                      if (token === 'ORG_MD24R5Y2') {
                        localStorage.setItem('modiToken', token);
                        localStorage.setItem('modiOrgName', 'Modi Care AI');
                        localStorage.setItem('orgToken', token);
                        localStorage.setItem('orgName', 'Modi Care AI');
                        window.location.href = '/modi-care/dashboard';
                      } else {
                        alert('Invalid token');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const token = document.getElementById('modiToken').value;
                    if (token === 'ORG_COVID_RESPONSE_TE') {
                      localStorage.setItem('modiToken', token);
                      localStorage.setItem('modiOrgName', 'Modi Care AI');
                      localStorage.setItem('orgToken', token);
                      localStorage.setItem('orgName', 'Modi Care AI');
                      window.location.href = '/modi-care/dashboard';
                    } else {
                      alert('Invalid token');
                    }
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Login
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">Powered by MacvaarAI</p>
              </div>
            </div>
          }
        />

        <Route
          path="/modi-care/dashboard"
          element={
            <div>
              <VijayCareDashboardComplete />
            </div>
          }
        />

        {/* BJP Care AI Organization - Orange */}
        <Route
          path="/bjp-care/login"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
              <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-orange-500">
                <div className="text-center mb-6">
                  <img src="/logos/BJP.jpeg" alt="BJP Care AI Logo" className="h-20 w-20 rounded-full border-4 border-orange-500 mx-auto object-cover mb-4" />
                  <h2 className="text-3xl font-bold text-orange-400 mb-2">BJP Care AI</h2>
                  <p className="text-gray-400">AI-Driven Early Disease Detection & Identification</p>
                </div>
                <input
                  type="password"
                  placeholder="Enter access token"
                  id="bjpToken"
                  className="w-full border-2 border-gray-600 rounded-lg px-4 py-3 mb-4 bg-gray-700 text-white placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const token = document.getElementById('bjpToken').value;
                      if (token === 'ORG_BJ24Q7Z8') {
                        localStorage.setItem('bjpToken', token);
                        localStorage.setItem('bjpOrgName', 'BJP Care AI');
                        localStorage.setItem('orgToken', token);
                        localStorage.setItem('orgName', 'BJP Care AI');
                        window.location.href = '/bjp-care/dashboard';
                      } else {
                        alert('Invalid token');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const token = document.getElementById('bjpToken').value;
                    if (token === 'ORG_PREMIER_HEALTHCAR') {
                      localStorage.setItem('bjpToken', token);
                      localStorage.setItem('bjpOrgName', 'BJP Care AI');
                      localStorage.setItem('orgToken', token);
                      localStorage.setItem('orgName', 'BJP Care AI');
                      window.location.href = '/bjp-care/dashboard';
                    } else {
                      alert('Invalid token');
                    }
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Login
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">Powered by MacvaarAI</p>
              </div>
            </div>
          }
        />

        <Route
          path="/bjp-care/dashboard"
          element={
            <div>
              <VijayCareDashboardComplete />
            </div>
          }
        />

        {/* CBN Care AI Organization */}
        <Route
          path="/cbn-care/login"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
              <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-yellow-500">
                <div className="text-center mb-6">
                  <img src="/logos/CBN.jpg" alt="CBN Care AI Logo" className="h-20 w-20 rounded-full border-4 border-yellow-500 mx-auto object-cover mb-4" />
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">CBN Care AI</h2>
                  <p className="text-gray-400">AI-Driven Early Disease Detection & Identification</p>
                </div>
                <input
                  type="password"
                  placeholder="Enter access token"
                  id="cbnToken"
                  className="w-full border-2 border-gray-600 rounded-lg px-4 py-3 mb-4 bg-gray-700 text-white placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const token = document.getElementById('cbnToken').value;
                      if (token === 'ORG_CB24M3W6') {
                        localStorage.setItem('cbnToken', token);
                        localStorage.setItem('cbnOrgName', 'CBN Care AI');
                        localStorage.setItem('orgToken', token);
                        localStorage.setItem('orgName', 'CBN Care AI');
                        window.location.href = '/cbn-care/dashboard';
                      } else {
                        alert('Invalid token');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const token = document.getElementById('cbnToken').value;
                    if (token === 'ORG_DIAGNOSTIC_EXCELL') {
                      localStorage.setItem('cbnToken', token);
                      localStorage.setItem('cbnOrgName', 'CBN Care AI');
                      localStorage.setItem('orgToken', token);
                      localStorage.setItem('orgName', 'CBN Care AI');
                      window.location.href = '/cbn-care/dashboard';
                    } else {
                      alert('Invalid token');
                    }
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Login
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">Powered by MacvaarAI</p>
              </div>
            </div>
          }
        />

        <Route
          path="/cbn-care/dashboard"
          element={
            <div>
              <VijayCareDashboardComplete />
            </div>
          }
        />

        {/* TDP Care AI Organization - Yellow */}
        <Route
          path="/tdp-care/login"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
              <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-yellow-500">
                <div className="text-center mb-6">
                  <img src="/logos/Vijay.jpeg" alt="TDP Care AI Logo" className="h-20 w-20 rounded-full border-4 border-yellow-500 mx-auto object-cover mb-4" />
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">TDP Care AI</h2>
                  <p className="text-gray-400">AI-Driven Early Disease Detection & Identification</p>
                </div>
                <input
                  type="password"
                  placeholder="Enter access token"
                  id="tdpToken"
                  className="w-full border-2 border-gray-600 rounded-lg px-4 py-3 mb-4 bg-gray-700 text-white placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const token = document.getElementById('tdpToken').value;
                      if (token === 'ORG_TD24L8V4') {
                        localStorage.setItem('tdpToken', token);
                        localStorage.setItem('tdpOrgName', 'TDP Care AI');
                        localStorage.setItem('orgToken', token);
                        localStorage.setItem('orgName', 'TDP Care AI');
                        window.location.href = '/tdp-care/dashboard';
                      } else {
                        alert('Invalid token');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const token = document.getElementById('tdpToken').value;
                    if (token === 'ORG_TDP_CARE_HEALTH') {
                      localStorage.setItem('tdpToken', token);
                      localStorage.setItem('tdpOrgName', 'TDP Care AI');
                      localStorage.setItem('orgToken', token);
                      localStorage.setItem('orgName', 'TDP Care AI');
                      window.location.href = '/tdp-care/dashboard';
                    } else {
                      alert('Invalid token');
                    }
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Login
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">Powered by MacvaarAI</p>
              </div>
            </div>
          }
        />

        <Route
          path="/tdp-care/dashboard"
          element={
            <div>
              <VijayCareDashboardComplete />
            </div>
          }
        />

        {/* 🔹 ADMIN LOGIN - Fresh New Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <NewAdminWrapper>
              <AdminDashboard />
            </NewAdminWrapper>
          }
        />

        {/* UNIFIED CARE PORTALS */}
        <Route path="/care/login" element={<UnifiedCareLogin />} />
        <Route path="/care/dashboard" element={<CarePortalDashboard />} />

        {/* Legacy routes - redirect to unified care portal */}
        <Route path="/hospital/login" element={<Navigate to="/care/login" replace />} />
        <Route path="/hospital/portal" element={<Navigate to="/care/dashboard" replace />} />
        <Route path="/school/login" element={<Navigate to="/care/login" replace />} />
        <Route path="/school/portal" element={<Navigate to="/care/dashboard" replace />} />
        <Route path="/district/login" element={<Navigate to="/care/login" replace />} />
        <Route path="/district/portal" element={<Navigate to="/care/dashboard" replace />} />
        <Route path="/police/login" element={<Navigate to="/care/login" replace />} />
        <Route path="/police/portal" element={<Navigate to="/care/dashboard" replace />} />
        <Route path="/women/login" element={<Navigate to="/care/login" replace />} />
        <Route path="/women/portal" element={<Navigate to="/care/dashboard" replace />} />
        <Route path="/office/login" element={<Navigate to="/care/login" replace />} />
        <Route path="/office/portal" element={<Navigate to="/care/dashboard" replace />} />
      </Routes>
  );
};

export default App;