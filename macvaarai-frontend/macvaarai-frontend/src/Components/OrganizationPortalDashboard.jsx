import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Users, Building2, Settings, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizationPortalDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orgData, setOrgData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const orgId = localStorage.getItem('orgId');
  const orgName = localStorage.getItem('orgName');
  const orgLogo = localStorage.getItem('orgLogo');

  useEffect(() => {
    if (!orgId) {
      navigate('/');
      return;
    }
    fetchOrgData();
  }, [activeTab]);

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const [orgRes, adminsRes, hospitalsRes] = await Promise.all([
        fetch(`${apiUrl}/org/${orgId}/details`),
        fetch(`${apiUrl}/org/${orgId}/admins`),
        fetch(`${apiUrl}/admin/hospitals?org_id=${orgId}`)
      ]);

      if (orgRes.ok) {
        const orgJson = await orgRes.json();
        if (orgJson.status === 'success') setOrgData(orgJson.organization);
      }

      if (adminsRes.ok) {
        const adminsJson = await adminsRes.json();
        if (adminsJson.status === 'success') setAdmins(adminsJson.admins || []);
      }

      if (hospitalsRes.ok) {
        const hospitalsJson = await hospitalsRes.json();
        if (hospitalsJson.status === 'success') setHospitals(hospitalsJson.hospitals || []);
      }

      setStats({
        totalAdmins: admins.length,
        totalHospitals: hospitals.length,
        totalModels: 18,
        activeStatus: 'Active'
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) {
      alert('Please fill all required fields');
      return;
    }

    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/org/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: orgId,
          name: newAdminForm.name,
          email: newAdminForm.email,
          phone: newAdminForm.phone,
          password: newAdminForm.password
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert(`Admin ${newAdminForm.name} created successfully!`);
        setNewAdminForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        setShowAdminForm(false);
        fetchOrgData();
      } else {
        alert('Error: ' + (data.message || 'Failed to create admin'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await fetch(`${apiUrl}/org/admins/${adminId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Admin deleted successfully');
        fetchOrgData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orgId');
    localStorage.removeItem('orgToken');
    localStorage.removeItem('orgName');
    localStorage.removeItem('orgEmail');
    localStorage.removeItem('orgLogo');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Official Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-b-4 border-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Organization Logo */}
              <div className="bg-white rounded-lg p-2 shadow-md">
                {orgLogo && (
                  <img
                    src={orgLogo}
                    alt={orgName}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.src = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/Macvaar.jpg`;
                    }}
                  />
                )}
              </div>

              {/* Title Section */}
              <div>
                <h1 className="text-4xl font-bold text-white">{orgName || 'Organization'}</h1>
                <p className="text-blue-100 text-lg mt-1">Healthcare Administration Portal</p>
                <p className="text-blue-200 text-sm mt-2">Official Government-Approved Healthcare Management System</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition hover:shadow-xl"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Official Style */}
      <div className="bg-white border-b-2 border-blue-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-6 font-semibold border-b-4 transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-4 px-6 font-semibold border-b-4 transition ${
                activeTab === 'admins'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Team Members
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`py-4 px-6 font-semibold border-b-4 transition ${
                activeTab === 'hospitals'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Hospitals
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`py-4 px-6 font-semibold border-b-4 transition ${
                activeTab === 'models'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              AI Diagnostic Tools
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Organization Overview</h2>
            <p className="text-gray-600 mb-8">Monitor and manage your healthcare organization's operations</p>

            {/* Stats Cards - Official Style */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border-l-4 border-blue-600 p-6 shadow-md hover:shadow-lg transition">
                <p className="text-gray-600 font-semibold text-sm mb-2">Team Members</p>
                <div className="text-4xl font-bold text-blue-600">{admins.length}</div>
                <p className="text-gray-500 text-xs mt-2">Active administrators</p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-600 p-6 shadow-md hover:shadow-lg transition">
                <p className="text-gray-600 font-semibold text-sm mb-2">Healthcare Facilities</p>
                <div className="text-4xl font-bold text-green-600">{hospitals.length}</div>
                <p className="text-gray-500 text-xs mt-2">Registered hospitals</p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-purple-600 p-6 shadow-md hover:shadow-lg transition">
                <p className="text-gray-600 font-semibold text-sm mb-2">Diagnostic Tools</p>
                <div className="text-4xl font-bold text-purple-600">18</div>
                <p className="text-gray-500 text-xs mt-2">AI Models Available</p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-500 p-6 shadow-md hover:shadow-lg transition">
                <p className="text-gray-600 font-semibold text-sm mb-2">System Status</p>
                <div className="text-lg font-bold text-green-600 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                  Operational
                </div>
                <p className="text-gray-500 text-xs mt-2">All systems active</p>
              </div>
            </div>

            {/* Organization Info - Official Style */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Organization Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Organization Name</p>
                  <p className="text-xl font-semibold text-gray-900">{orgData?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Contact Email</p>
                  <p className="text-xl font-semibold text-gray-900">{orgData?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Phone Number</p>
                  <p className="text-xl font-semibold text-gray-900">{orgData?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Location</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {orgData?.city || 'N/A'}, {orgData?.state || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Access Token Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-3">Access Token</h4>
                  <p className="text-gray-700 text-sm mb-3">This is your organization's unique access token. Use this when onboarding new users.</p>
                  <div className="bg-white border border-gray-300 rounded p-4 font-mono text-sm break-all mb-3 text-gray-800 select-all">
                    {orgData?.token}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(orgData?.token);
                      alert('Token copied to clipboard');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition inline-flex items-center gap-2"
                  >
                    Copy Token
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
                <p className="text-gray-600 mt-1">Manage organization administrators and team members</p>
              </div>
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Add Team Member
              </button>
            </div>

            {/* Create Admin Form */}
            {showAdminForm && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Add New Team Member</h3>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={newAdminForm.name}
                        onChange={(e) =>
                          setNewAdminForm({ ...newAdminForm, name: e.target.value })
                        }
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        value={newAdminForm.email}
                        onChange={(e) =>
                          setNewAdminForm({ ...newAdminForm, email: e.target.value })
                        }
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newAdminForm.phone}
                        onChange={(e) =>
                          setNewAdminForm({ ...newAdminForm, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Password *</label>
                      <input
                        type="password"
                        value={newAdminForm.password}
                        onChange={(e) =>
                          setNewAdminForm({ ...newAdminForm, password: e.target.value })
                        }
                        placeholder="Enter password"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={newAdminForm.confirmPassword}
                        onChange={(e) =>
                          setNewAdminForm({
                            ...newAdminForm,
                            confirmPassword: e.target.value
                          })
                        }
                        placeholder="Confirm password"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-md hover:shadow-lg"
                    >
                      Add Team Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdminForm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Admins List */}
            {admins.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Name</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Email</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Phone</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Role</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{admin.name}</td>
                        <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                        <td className="px-6 py-4 text-gray-700">{admin.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="text-red-600 hover:text-red-800 transition hover:bg-red-50 p-2 rounded"
                            title="Delete team member"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-md">
                <p className="text-gray-600 text-lg mb-6">No team members added yet</p>
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold inline-flex items-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  Add First Team Member
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hospitals Tab */}
        {activeTab === 'hospitals' && (
          <div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Healthcare Facilities</h2>
              <p className="text-gray-600 mt-1">View all hospitals registered under your organization</p>
            </div>

            {hospitals.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden mt-8">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Hospital Name</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Email</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Location</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Beds</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((hospital) => (
                      <tr key={hospital.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{hospital.name}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.email}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.city}, {hospital.state}</td>
                        <td className="px-6 py-4 text-gray-700 font-semibold">{hospital.beds_total || 0}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Operational
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-md mt-8">
                <p className="text-gray-600 text-lg">No hospitals registered yet</p>
              </div>
            )}
          </div>
        )}

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Diagnostic AI Tools</h2>
              <p className="text-gray-600 mt-1">Available medical diagnostic models for your organization</p>
            </div>

            {/* Pricing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white border-l-4 border-blue-600 rounded-lg p-8 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Premium Diagnostic Tools</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">$$$$</div>
                <p className="text-gray-600 mb-4">Professional-grade diagnostic models</p>
                <div className="text-sm text-gray-700">
                  <p>Eye Disease Detection, COVID-19, ECG Analysis, Skin Cancer, Tuberculosis, Stroke, Colorectal, Lung, Throat</p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-green-600 rounded-lg p-8 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Free Diagnostic Tools</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">Free</div>
                <p className="text-gray-600 mb-4">Open-source diagnostic models</p>
                <div className="text-sm text-gray-700">
                  <p>Diabetes, Pneumonia, Malaria, Dengue, Ear, Nose, Oral, Pharyngitis</p>
                </div>
              </div>
            </div>

            {/* All 16 Models */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Complete AI Model Catalog (16 Models)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Eye Disease Detection', type: 'Premium' },
                  { name: 'COVID-19 Detection', type: 'Premium' },
                  { name: 'Pneumonia Detection', type: 'Premium' },
                  { name: 'Skin Cancer Detection', type: 'Premium' },
                  { name: 'Malaria Detection', type: 'Premium' },
                  { name: 'Dengue Detection', type: 'Premium' },
                  { name: 'Diabetes Prediction', type: 'Premium' },
                  { name: 'Ear Infection', type: 'Premium' },
                  { name: 'Nasal Analysis', type: 'Premium' },
                  { name: 'Throat Analysis', type: 'Premium' },
                  { name: 'Oral Cancer', type: 'Premium' },
                  { name: 'Pharyngitis', type: 'Premium' },
                  { name: 'Colorectal', type: 'Premium' },
                  { name: 'Lung Analysis', type: 'Premium' },
                  { name: '1-Lead ECG Analysis', type: 'Premium' },
                  { name: '12-Lead ECG Analysis', type: 'Premium' }
                ].map((model, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-lg border shadow-sm hover:shadow-md transition ${
                      model.type === 'Premium'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 mb-3">{model.name}</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        model.type === 'Premium'
                          ? 'bg-orange-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {model.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationPortalDashboard;
