import React, { useState, useEffect } from 'react';
import { LogOut, BarChart3, Building2, Users, Settings, Plus } from 'lucide-react';

const OrganizationAdminDashboard = ({ onLogout }) => {
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({
    total_hospitals: 0,
    total_patients: 0,
    total_beds: 0,
    total_doctors: 0
  });
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    const orgName = localStorage.getItem('orgName');
    const orgLogo = localStorage.getItem('orgLogo');

    if (orgId) {
      setOrgId(orgId);
      setOrgName(orgName);
      setOrgLogo(orgLogo);
      fetchOrgData(orgId);
    }
  }, []);

  const fetchOrgData = async (id) => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const statsRes = await fetch(`${apiUrl}/org/${id}/dashboard-stats`);
      const statsData = await statsRes.json();
      if (statsData.status === 'success') {
        setStats({
          total_hospitals: statsData.total_hospitals,
          total_patients: statsData.total_patients,
          total_beds: statsData.total_beds,
          total_doctors: statsData.total_doctors
        });
      }

      // Fetch hospitals
      const hospRes = await fetch(`${apiUrl}/org/${id}/hospitals`);
      const hospData = await hospRes.json();
      if (hospData.status === 'success') {
        setHospitals(hospData.hospitals);
      }
    } catch (err) {
      console.error('Error fetching org data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orgAdminToken');
    localStorage.removeItem('orgId');
    localStorage.removeItem('orgName');
    localStorage.removeItem('orgLogo');
    onLogout();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'hospitals', label: 'Hospitals', icon: '🏥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {orgLogo && (
              <img
                src={orgLogo}
                alt={orgName}
                className="h-16 w-auto object-contain bg-white p-2 rounded-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{orgName}</h1>
              <p className="text-blue-100">Organization Admin Portal</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 overflow-x-auto px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-blue-600'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

            {/* Statistics Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_hospitals}</div>
                <div className="text-blue-100 mt-2">Total Hospitals</div>
              </div>

              <div className="bg-green-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_patients}</div>
                <div className="text-green-100 mt-2">Total Patients</div>
              </div>

              <div className="bg-purple-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_beds}</div>
                <div className="text-purple-100 mt-2">Total Beds</div>
              </div>

              <div className="bg-orange-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_doctors}</div>
                <div className="text-orange-100 mt-2">Total Doctors</div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Organization Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Name:</span>
                    <span className="text-gray-800 font-semibold">{orgName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hospitals:</span>
                    <span className="text-gray-800 font-semibold">{stats.total_hospitals}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <Plus size={20} />
                    Add Hospital
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <Users size={20} />
                    Manage Admins
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <BarChart3 size={20} />
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOSPITALS TAB */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Hospitals</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition">
                <Plus size={20} />
                Add Hospital
              </button>
            </div>

            {hospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    {hospital.logo_url && (
                      <img
                        src={hospital.logo_url}
                        alt={hospital.name}
                        className="h-12 w-auto object-contain mb-4"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{hospital.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>📍 {hospital.address}</p>
                      <p>📞 {hospital.phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-gray-600 text-xs">BEDS</p>
                        <p className="text-2xl font-bold text-blue-600">{hospital.beds}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-gray-600 text-xs">PATIENTS</p>
                        <p className="text-2xl font-bold text-green-600">{hospital.patients}</p>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                      Manage Hospital
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg text-center">
                <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No hospitals yet. Add your first hospital to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
            <div className="bg-white p-12 rounded-lg text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Analytics coming soon...</p>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Organization Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                    Update Settings
                  </button>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationAdminDashboard;
