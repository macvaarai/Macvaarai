import React, { useState, useEffect } from "react";
import { Users, Building2, BarChart3, LogOut } from "lucide-react";

const HeroAdminDashboard = ({ onLogout, adminData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [hospitals, setHospitals] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states for creating hospital admin
  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);
  const [formData, setFormData] = useState({
    admin_name: "",
    admin_email: "",
    hospital_id: "",
    granted_models: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generatedAccessKey, setGeneratedAccessKey] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hospitalsRes, usersRes, appointmentsRes, modelsRes] = await Promise.all([
        fetch(`${apiUrl}/admin/hospitals`),
        fetch(`${apiUrl}/admin/users?admin_role=hero_admin`),
        fetch(`${apiUrl}/admin/appointments?admin_role=hero_admin`),
        fetch(`${apiUrl}/admin/available-models`),
      ]);

      if (hospitalsRes.ok) {
        const data = await hospitalsRes.json();
        setHospitals(data.hospitals || []);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json();
        setAppointments(data.appointments || []);
      }
      if (modelsRes.ok) {
        const data = await modelsRes.json();
        setAvailableModels(data.models || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "hospitals", label: "Hospitals", icon: "🏥" },
    { id: "hospital-admins", label: "Hospital Admins", icon: "👨‍💼" },
    { id: "users", label: "All Users", icon: "👥" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "access-logs", label: "Access Logs", icon: "📝" },
  ];

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!formData.admin_name || !formData.admin_email || !formData.hospital_id || formData.granted_models.length === 0) {
      alert("Please fill all fields and select at least one model");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/admin/hospital-admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status === "success") {
        setGeneratedAccessKey(data.access_key);
        setSuccessMessage(`Admin access granted! Access Key: ${data.access_key}`);
        setTimeout(() => {
          setShowGrantAccessModal(false);
          setFormData({ admin_name: "", admin_email: "", hospital_id: "", granted_models: [] });
          setSuccessMessage("");
          setGeneratedAccessKey("");
          fetchData();
        }, 3000);
      }
    } catch (err) {
      alert("Error granting access: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleModel = (modelId) => {
    setFormData({
      ...formData,
      granted_models: formData.granted_models.includes(modelId)
        ? formData.granted_models.filter(m => m !== modelId)
        : [...formData.granted_models, modelId]
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🔐 Hero Admin Dashboard</h1>
            <p className="text-gray-400">MacvaarAI System Administration • Logged in as {adminData?.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Hospitals</p>
                  <p className="text-3xl font-bold text-green-400">{hospitals.length}</p>
                </div>
                <Building2 className="text-green-400" size={32} />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Hospital Admins</p>
                  <p className="text-3xl font-bold text-blue-400">{admins.length}</p>
                </div>
                <Users className="text-blue-400" size={32} />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-purple-400">{users.length}</p>
                </div>
                <Users className="text-purple-400" size={32} />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Appointments Today</p>
                  <p className="text-3xl font-bold text-yellow-400">{appointments.length}</p>
                </div>
                <BarChart3 className="text-yellow-400" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Hospitals Tab */}
        {activeTab === "hospitals" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Hospitals</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                + Add Hospital
              </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hospital Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Admin</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Models</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital) => (
                      <tr key={hospital.hospital_id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="px-6 py-3">{hospital.name}</td>
                        <td className="px-6 py-3">{hospital.admin_name}</td>
                        <td className="px-6 py-3">{hospital.city}</td>
                        <td className="px-6 py-3">{hospital.subscribed_models?.length || 0} models</td>
                        <td className="px-6 py-3">
                          <span className={`${hospital.is_active ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'} px-2 py-1 rounded text-xs`}>
                            {hospital.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-3 space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                          <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-3 text-center text-gray-400">
                        No hospitals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hospital Admins Tab */}
        {activeTab === "hospital-admins" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Hospital Admins</h2>
              <button
                onClick={() => setShowGrantAccessModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                + Grant Access
              </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Admin Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hospital</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Access Level</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-3">Raj Kumar</td>
                    <td className="px-6 py-3">Apollo Hospital</td>
                    <td className="px-6 py-3">raj@apollo.com</td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-900 text-blue-400 px-2 py-1 rounded text-xs">Hospital Admin</span>
                    </td>
                    <td className="px-6 py-3 space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Manage</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Users</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">User Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hospital</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.user_id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="px-6 py-3">{user.name}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">{user.hospital_id}</td>
                        <td className="px-6 py-3">{user.joined}</td>
                        <td className="px-6 py-3">
                          <span className="bg-green-900 text-green-400 px-2 py-1 rounded text-xs">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                          <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-3 text-center text-gray-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Appointments</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hospital</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Doctor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((apt) => (
                      <tr key={apt.appointment_id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="px-6 py-3">{apt.patient_name}</td>
                        <td className="px-6 py-3">{apt.hospital_id}</td>
                        <td className="px-6 py-3">{apt.doctor}</td>
                        <td className="px-6 py-3">{apt.date_time}</td>
                        <td className="px-6 py-3">
                          <span className="bg-blue-900 text-blue-400 px-2 py-1 rounded text-xs">
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                          <button className="text-red-400 hover:text-red-300 text-sm">Cancel</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-3 text-center text-gray-400">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Access Logs Tab */}
        {activeTab === "access-logs" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">System Access Logs</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Admin</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Resource</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-3">Hero Admin</td>
                    <td className="px-6 py-3">Created Hospital Admin</td>
                    <td className="px-6 py-3">Raj Kumar - Apollo</td>
                    <td className="px-6 py-3">2026-06-02 10:30 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Grant Access Modal */}
      {showGrantAccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Grant Hospital Admin Access</h2>

            {successMessage && (
              <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-6">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleGrantAccess} className="space-y-4">
              {/* Admin Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Name</label>
                <input
                  type="text"
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                  placeholder="Dr. John Smith"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Admin Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={formData.admin_email}
                  onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                  placeholder="admin@hospital.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Hospital Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hospital</label>
                <select
                  value={formData.hospital_id}
                  onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a hospital...</option>
                  {hospitals.map((h) => (
                    <option key={h.hospital_id} value={h.hospital_id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Grant Access to Models</label>
                <div className="space-y-2 bg-gray-900 p-4 rounded border border-gray-700 max-h-48 overflow-y-auto">
                  {availableModels.length > 0 ? (
                    availableModels.map((model) => (
                      <label key={model.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.granted_models.includes(model.id)}
                          onChange={() => toggleModel(model.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-300 flex-1">{model.name}</span>
                        {model.premium && <span className="text-yellow-400 text-xs">Premium</span>}
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Loading models...</p>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-2">Select at least one model</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-end mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowGrantAccessModal(false);
                    setFormData({ admin_name: "", admin_email: "", hospital_id: "", granted_models: [] });
                    setSuccessMessage("");
                    setGeneratedAccessKey("");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-300"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold disabled:bg-gray-600"
                  disabled={submitting || formData.granted_models.length === 0}
                >
                  {submitting ? "Creating..." : "Grant Access"}
                </button>
              </div>

              {generatedAccessKey && (
                <div className="bg-blue-900 border border-blue-700 p-4 rounded mt-4">
                  <p className="text-blue-200 text-sm mb-2">Access Key Generated:</p>
                  <p className="text-blue-100 font-mono text-lg font-bold text-center">{generatedAccessKey}</p>
                  <p className="text-blue-300 text-xs mt-2 text-center">Share this key with the hospital admin</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroAdminDashboard;
