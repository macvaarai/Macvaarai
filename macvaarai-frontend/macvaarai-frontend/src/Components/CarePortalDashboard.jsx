import React, { useState, useEffect } from 'react';
import { LogOut, Zap, AlertCircle, CheckCircle, BarChart3, Settings, Lock, Mail, Eye, EyeOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AI_MODELS } from '../data/models';
import ModelDiagnosticChatbot from './ModelDiagnosticChatbotClean';

const CarePortalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allocatedModels, setAllocatedModels] = useState([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Get care type and details from localStorage
  const careOrgType = localStorage.getItem('careOrgType') || 'hospital';
  const careOrgId = localStorage.getItem('careOrgId');
  const careName = localStorage.getItem('orgName') || localStorage.getItem('careOrgName') || 'Care Portal';
  const careEmail = localStorage.getItem('careOrgEmail') || '';
  const careUsername = localStorage.getItem('orgUsername') || '';
  const orgToken = localStorage.getItem('orgToken');

  useEffect(() => {
    const fetchAllocatedModels = async () => {
      try {
        setLoading(true);
        const orgId = localStorage.getItem('orgId');

        // Try to fetch allocated models from backend
        // For now, we'll show default models allocated to the organization
        // In production, this would fetch from: GET /api/org/{orgId}/allocated-models

        // Show first 12 models as allocated by Vijay Care
        const defaultAllocatedModels = AI_MODELS.slice(0, 12);
        setAllocatedModels(defaultAllocatedModels);
      } catch (err) {
        setError('Failed to load allocated models: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!orgToken) {
      navigate('/care/login');
    } else {
      fetchAllocatedModels();
    }
  }, [navigate, orgToken]);

  const handleLogout = () => {
    localStorage.removeItem('orgToken');
    localStorage.removeItem('orgId');
    localStorage.removeItem('orgName');
    localStorage.removeItem('orgType');
    localStorage.removeItem('orgUsername');
    localStorage.removeItem('careOrgId');
    localStorage.removeItem('careOrgName');
    localStorage.removeItem('careOrgEmail');
    localStorage.removeItem('careOrgType');
    navigate('/care/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/org-auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: careUsername,
          old_password: passwordForm.oldPassword,
          new_password: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password changed successfully! Please login again.');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => handleLogout(), 2000);
      } else {
        setPasswordError(data.detail || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('Error: ' + err.message);
    }
  };

  const getColorClasses = () => {
    const colorMap = {
      hospital: { border: 'border-red-500', bg: 'bg-red-600', hover: 'hover:bg-red-700', light: 'bg-red-50', text: 'text-red-600' },
      school: { border: 'border-blue-500', bg: 'bg-blue-600', hover: 'hover:bg-blue-700', light: 'bg-blue-50', text: 'text-blue-600' },
      district: { border: 'border-purple-500', bg: 'bg-purple-600', hover: 'hover:bg-purple-700', light: 'bg-purple-50', text: 'text-purple-600' },
      police: { border: 'border-indigo-500', bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', light: 'bg-indigo-50', text: 'text-indigo-600' },
      women: { border: 'border-pink-500', bg: 'bg-pink-600', hover: 'hover:bg-pink-700', light: 'bg-pink-50', text: 'text-pink-600' },
      office: { border: 'border-amber-500', bg: 'bg-amber-600', hover: 'hover:bg-amber-700', light: 'bg-amber-50', text: 'text-amber-600' }
    };
    return colorMap[careOrgType] || colorMap.hospital;
  };

  const getOrgTypeLabel = () => {
    const labels = {
      hospital: '🏥 Hospital',
      school: '🎓 School',
      district: '📍 District',
      police: '🚔 Police',
      women: '👩 Women Organization',
      office: '🏢 Office'
    };
    return labels[careOrgType] || 'Organization';
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Header */}
      <div className={`${colors.bg} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">
                {careOrgType === 'hospital' && '🏥'}
                {careOrgType === 'school' && '🎓'}
                {careOrgType === 'district' && '📍'}
                {careOrgType === 'police' && '🚔'}
                {careOrgType === 'women' && '👩'}
                {careOrgType === 'office' && '🏢'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{careName}</h1>
                <p className="text-white/80 text-sm">{getOrgTypeLabel()} Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-6 border-t border-white/20 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 font-semibold transition ${activeTab === 'dashboard' ? 'border-b-2 border-white' : 'text-white/70 hover:text-white'}`}
            >
              <BarChart3 className="inline mr-2" size={18} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`pb-3 font-semibold transition ${activeTab === 'models' ? 'border-b-2 border-white' : 'text-white/70 hover:text-white'}`}
            >
              <Zap className="inline mr-2" size={18} /> AI Models
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 font-semibold transition ${activeTab === 'settings' ? 'border-b-2 border-white' : 'text-white/70 hover:text-white'}`}
            >
              <Settings className="inline mr-2" size={18} /> Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`${colors.light} border-2 ${colors.border} rounded-lg p-6 text-center`}>
                <div className={`text-4xl font-bold ${colors.text} mb-2`}>{allocatedModels.length}</div>
                <p className="text-gray-700 font-semibold">AI Models Available</p>
              </div>
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">12</div>
                <p className="text-gray-700 font-semibold">Active Today</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <p className="text-gray-700 font-semibold">Uptime</p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <p className="text-gray-700 font-semibold">Support Available</p>
              </div>
            </div>

            {/* Welcome Card */}
            <div className={`${colors.light} border-2 ${colors.border} rounded-lg p-8`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>Welcome, {careName}!</h2>
              <div className="space-y-3 text-gray-700">
                <p>✓ You have access to {allocatedModels.length} AI diagnostic models</p>
                <p>✓ All systems are operational and ready to use</p>
                <p>✓ Your organization data is securely stored in Supabase</p>
                <p>✓ Visit the "AI Models" tab to start using diagnosis tools</p>
              </div>
            </div>

            {/* Organization Info */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{borderColor: colors.bg.split('-')[1]}}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Organization Name</p>
                  <p className="text-lg font-semibold text-gray-800">{careName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Type</p>
                  <p className="text-lg font-semibold text-gray-800">{getOrgTypeLabel()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-800">{careEmail}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Username</p>
                  <p className="text-lg font-semibold text-gray-800">{careUsername}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI MODELS TAB */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-lg font-bold text-red-900">Error</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-6 text-lg">Loading AI Models...</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className={`${colors.light} border-2 ${colors.border} rounded-lg p-6`}>
                  <h2 className={`text-xl font-bold ${colors.text} mb-2`}>AI Models Allocated by Vijay Care</h2>
                  <p className="text-gray-700">
                    You have access to {allocatedModels.length} professional AI diagnostic models allocated by Vijay Care for your organization. Use these models for patient analysis and early disease detection.
                  </p>
                </div>

                {/* Models Grid - 4 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {allocatedModels.map((model) => (
                    <div
                      key={model.id}
                      className={`bg-white rounded-lg shadow-md hover:shadow-xl p-6 border-2 ${colors.border} hover:bg-gray-50 transform hover:scale-105 transition`}
                    >
                      <div className="text-5xl mb-4 text-center">{model.icon}</div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{model.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                      <button
                        onClick={() => setSelectedModel(model)}
                        className={`w-full ${colors.bg} ${colors.hover} text-white py-2 rounded-lg font-semibold text-sm transition cursor-pointer`}
                      >
                        Use Model
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Model Diagnostic Chatbot - Same as Vijay Care Portal */}
            {selectedModel && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
                <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="absolute top-4 right-4 z-10 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition"
                  >
                    <X size={24} />
                  </button>

                  {/* Model Diagnostic Chatbot Component */}
                  <ModelDiagnosticChatbot
                    modelType={selectedModel.id}
                    modelName={selectedModel.name}
                    modelIcon={selectedModel.icon}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4" style={{borderColor: colors.bg.split('-')[1]}}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>

              <div className="space-y-6">
                {/* Organization Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Organization Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <label className="text-gray-600 text-sm">Organization Name</label>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{careName}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">Organization Type</label>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{getOrgTypeLabel()}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">Email Address</label>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{careEmail}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">Username</label>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{careUsername}</p>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Security</h3>
                    {!showPasswordChange && (
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className={`${colors.bg} ${colors.hover} text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition`}
                      >
                        <Lock size={18} /> Change Password
                      </button>
                    )}
                  </div>

                  {showPasswordChange && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      {passwordError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="font-semibold text-red-800">Error</p>
                            <p className="text-red-700 text-sm">{passwordError}</p>
                          </div>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="font-semibold text-green-800">Success!</p>
                            <p className="text-green-700 text-sm">{passwordSuccess}</p>
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showOldPassword ? 'text' : 'password'}
                              placeholder="Enter current password"
                              value={passwordForm.oldPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-3 top-2.5 text-gray-500"
                            >
                              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder="Enter new password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-2.5 text-gray-500"
                            >
                              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button
                            type="submit"
                            className={`${colors.bg} ${colors.hover} text-white px-8 py-2 rounded-lg font-semibold transition`}
                          >
                            Update Password
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordChange(false);
                              setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                              setPasswordError('');
                            }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-2 rounded-lg font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarePortalDashboard;
