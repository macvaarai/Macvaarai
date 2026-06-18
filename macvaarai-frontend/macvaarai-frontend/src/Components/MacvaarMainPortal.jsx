import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Settings } from 'lucide-react';

const MacvaarMainPortal = ({ onLogout }) => {
  const [organizations, setOrganizations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/macvaar-admin/dashboard`);
      const data = await response.json();
      if (data.status === 'success') {
        setOrganizations(data.organizations);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalHospitals = organizations.reduce((sum, org) => sum + org.hospitals, 0);
  const totalPatients = organizations.reduce((sum, org) => sum + org.patients, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MacvaarAI Official Portal</h1>
            <p className="text-gray-600 text-sm mt-1">Healthcare System Administration</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'organizations'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Organizations
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600">{organizations.length}</div>
                <div className="text-gray-600 text-sm mt-2">Organizations</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-green-600">{totalHospitals}</div>
                <div className="text-gray-600 text-sm mt-2">Total Hospitals</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-purple-600">{totalPatients.toLocaleString()}</div>
                <div className="text-gray-600 text-sm mt-2">Total Patients</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-orange-600">12</div>
                <div className="text-gray-600 text-sm mt-2">AI Models</div>
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Organizations</h3>
              <div className="grid grid-cols-2 gap-6">
                {organizations.map((org) => (
                  <div key={org.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex gap-4">
                      {org.logo_url && (
                        <img
                          src={org.logo_url}
                          alt={org.name}
                          className="h-16 w-16 object-contain rounded-lg bg-gray-50 p-2"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{org.name}</h4>
                        <p className="text-gray-600 text-sm">Owner: {org.owner}</p>
                        <div className="flex gap-4 mt-3">
                          <span className="text-sm text-gray-600">Hospitals: <span className="font-semibold">{org.hospitals}</span></span>
                          <span className="text-sm text-gray-600">Patients: <span className="font-semibold">{org.patients.toLocaleString()}</span></span>
                        </div>
                        <span className="inline-block mt-3 bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold capitalize">
                          {org.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition">
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm font-semibold transition">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORGANIZATIONS TAB */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Organizations</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition">
                <Plus size={20} />
                Create Organization
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Organization</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Organization Name</label>
                    <input type="text" placeholder="Enter organization name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Owner Name</label>
                    <input type="text" placeholder="Enter owner name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input type="email" placeholder="Enter email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                    <input type="tel" placeholder="Enter phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Create Organization
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">System Name</label>
                  <input type="text" value="MacvaarAI" disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                  Update Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacvaarMainPortal;
