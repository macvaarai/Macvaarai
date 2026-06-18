import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, Copy, CheckCircle, Building2, Users, BarChart3, Settings, FileText, Shield, Database, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizationGovernmentPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orgData, setOrgData] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);

  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showHealthDataForm, setShowHealthDataForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    num_doctors: 0,
    num_beds: 0,
    departments: ''
  });

  const [healthDataForm, setHealthDataForm] = useState({
    patient_name: '',
    patient_id: '',
    age: '',
    gender: '',
    blood_group: '',
    phone: '',
    hospital_id: '',
    test_date: '',
    test_type: '',
    test_result: '',
    doctor_name: '',
    notes: ''
  });

  const apiUrl = 'http://localhost:8000';
  const navigate = useNavigate();

  const orgId = localStorage.getItem('orgId');
  const orgToken = localStorage.getItem('orgToken');
  const orgName = localStorage.getItem('orgName');

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
      const [hospitalsRes] = await Promise.all([
        fetch(`${apiUrl}/admin/hospitals`)
      ]);

      if (hospitalsRes.ok) {
        const hospitalsJson = await hospitalsRes.json();
        if (hospitalsJson.status === 'success') {
          setHospitals(hospitalsJson.hospitals || []);
        }
      }

      setOrgData({
        name: orgName,
        token: orgToken,
        total_hospitals: hospitals.length,
        total_health_records: healthData.length,
        total_models: 18,
        status: 'Active'
      });

      setStats({
        totalHospitals: hospitals.length,
        totalHealthRecords: healthData.length,
        totalModels: 18,
        activeUsers: 12,
        dataProcessed: '2.5 TB'
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const simpleCopy = (token, id) => {
    const el = document.createElement('textarea');
    el.value = token;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(hospitalForm).forEach(key => {
        formData.append(key, hospitalForm[key]);
      });

      let url = `${apiUrl}/admin/hospitals`;
      let method = 'POST';

      if (editingId) {
        url = `${apiUrl}/admin/hospitals/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert(editingId ? 'Hospital updated successfully!' : 'Hospital added successfully!');
        setHospitalForm({
          name: '', email: '', phone: '', address: '', city: '', state: '',
          zip_code: '', num_doctors: 0, num_beds: 0, departments: ''
        });
        setEditingId(null);
        setShowHospitalForm(false);
        fetchOrgData();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteHospital = async (hospital_id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;

    try {
      const response = await fetch(`${apiUrl}/admin/hospitals/${hospital_id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Hospital deleted successfully!');
        fetchOrgData();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAddHealthData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/org/health-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...healthDataForm,
          org_id: orgId
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Health record added successfully!');
        setHealthDataForm({
          patient_name: '', patient_id: '', age: '', gender: '', blood_group: '',
          phone: '', hospital_id: '', test_date: '', test_type: '', test_result: '',
          doctor_name: '', notes: ''
        });
        setShowHealthDataForm(false);
        setHealthData([...healthData, data.record]);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orgId');
    localStorage.removeItem('orgToken');
    localStorage.removeItem('orgName');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-white text-xl">Loading Government Health Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{orgName}</h1>
              <p className="text-blue-200 mt-1">State Government Health Data Management System</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'hospitals', label: 'Healthcare Facilities', icon: Building2 },
              { id: 'health-data', label: 'Patient Health Records', icon: Database },
              { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp },
              { id: 'settings', label: 'Organization Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-semibold transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Government Health Portal Dashboard</h2>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Healthcare Facilities', value: stats.totalHospitals, icon: Building2, color: 'bg-blue-500' },
                { label: 'Patient Health Records', value: stats.totalHealthRecords, icon: Database, color: 'bg-green-500' },
                { label: 'Available AI Models', value: stats.totalModels, icon: TrendingUp, color: 'bg-purple-500' },
                { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'bg-orange-500' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className={`${stat.color} text-white rounded-lg p-6 shadow-lg`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">{stat.label}</p>
                        <p className="text-4xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <Icon size={40} className="opacity-30" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Organization Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Organization Information</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Organization Name</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{orgName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Facilities</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalHospitals} Hospitals</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Health Records</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalHealthRecords} Records</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Status</p>
                  <p className="text-xl font-bold text-green-600 mt-1">Active & Operational</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
                >
                  <Building2 size={20} />
                  Manage Facilities
                </button>
                <button
                  onClick={() => setActiveTab('health-data')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
                >
                  <Database size={20} />
                  Add Health Records
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
                >
                  <TrendingUp size={20} />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOSPITALS TAB */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Healthcare Facilities Management</h2>
              <button
                onClick={() => setShowHospitalForm(!showHospitalForm)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Add Facility
              </button>
            </div>

            {showHospitalForm && (
              <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {editingId ? 'Edit Healthcare Facility' : 'Add New Healthcare Facility'}
                </h3>
                <form onSubmit={handleHospitalSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Facility Name *"
                      value={hospitalForm.name}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={hospitalForm.email}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={hospitalForm.phone}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={hospitalForm.address}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={hospitalForm.city}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, city: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={hospitalForm.state}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, state: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Number of Doctors"
                      value={hospitalForm.num_doctors}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, num_doctors: parseInt(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Number of Beds"
                      value={hospitalForm.num_beds}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, num_beds: parseInt(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Departments (comma separated)"
                    value={hospitalForm.departments}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, departments: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
                    >
                      {editingId ? 'Update Facility' : 'Add Facility'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowHospitalForm(false);
                        setEditingId(null);
                        setHospitalForm({
                          name: '', email: '', phone: '', address: '', city: '', state: '',
                          zip_code: '', num_doctors: 0, num_beds: 0, departments: ''
                        });
                      }}
                      className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Hospitals List */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Facility Name</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Location</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Doctors</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Beds</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Access Token</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No healthcare facilities added yet
                      </td>
                    </tr>
                  ) : (
                    hospitals.map((hospital) => (
                      <tr key={hospital.id || hospital.hospital_id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{hospital.name}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.email}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.city}, {hospital.state}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.num_doctors || 0}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.num_beds || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                            <input
                              type="text"
                              value={hospital.access_token || ''}
                              readOnly
                              className="flex-1 bg-white border border-blue-300 px-2 py-1 rounded text-xs font-mono"
                            />
                            <button
                              onClick={() => simpleCopy(hospital.access_token, hospital.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                            >
                              {copiedToken === hospital.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(hospital.id);
                                setHospitalForm(hospital);
                                setShowHospitalForm(true);
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteHospital(hospital.id || hospital.hospital_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HEALTH DATA TAB */}
        {activeTab === 'health-data' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Patient Health Records Management</h2>
              <button
                onClick={() => setShowHealthDataForm(!showHealthDataForm)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Plus size={20} />
                Add Health Record
              </button>
            </div>

            {showHealthDataForm && (
              <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add Patient Health Record</h3>
                <form onSubmit={handleAddHealthData} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Patient Name *"
                      value={healthDataForm.patient_name}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, patient_name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Patient ID *"
                      value={healthDataForm.patient_id}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, patient_id: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={healthDataForm.age}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, age: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <select
                      value={healthDataForm.gender}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, gender: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Blood Group"
                      value={healthDataForm.blood_group}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, blood_group: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={healthDataForm.phone}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <select
                      value={healthDataForm.hospital_id}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, hospital_id: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Hospital</option>
                      {hospitals.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={healthDataForm.test_date}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, test_date: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Test Type (COVID, X-Ray, etc)"
                      value={healthDataForm.test_type}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, test_type: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Test Result"
                      value={healthDataForm.test_result}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, test_result: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={healthDataForm.doctor_name}
                      onChange={(e) => setHealthDataForm({ ...healthDataForm, doctor_name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <textarea
                    placeholder="Additional Notes"
                    value={healthDataForm.notes}
                    onChange={(e) => setHealthDataForm({ ...healthDataForm, notes: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    rows="3"
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
                    >
                      Add Health Record
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHealthDataForm(false)}
                      className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Health Data Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Patient Name</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Patient ID</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Age</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Gender</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Blood Group</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Test Type</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Result</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-bold">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {healthData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No health records added yet
                      </td>
                    </tr>
                  ) : (
                    healthData.map((record, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{record.patient_name}</td>
                        <td className="px-6 py-4 text-gray-700">{record.patient_id}</td>
                        <td className="px-6 py-4 text-gray-700">{record.age}</td>
                        <td className="px-6 py-4 text-gray-700">{record.gender}</td>
                        <td className="px-6 py-4 text-gray-700">{record.blood_group}</td>
                        <td className="px-6 py-4 text-gray-700">{record.test_type}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {record.test_result}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{record.doctor_name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Analytics & Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Health Records Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Records</span>
                    <span className="font-bold text-gray-900">{healthData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Records This Month</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Processing Status</span>
                    <span className="font-bold text-green-600">100% Complete</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Facility Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Facilities</span>
                    <span className="font-bold text-gray-900">{hospitals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Active Facilities</span>
                    <span className="font-bold text-green-600">{hospitals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Data Quality</span>
                    <span className="font-bold text-gray-900">98%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Model Usage Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'COVID-19 Detection', usage: '245', color: 'bg-red-100 text-red-800' },
                  { name: 'Pneumonia Detection', usage: '189', color: 'bg-blue-100 text-blue-800' },
                  { name: 'Diabetes Prediction', usage: '156', color: 'bg-green-100 text-green-800' },
                  { name: 'Eye Disease Detection', usage: '134', color: 'bg-purple-100 text-purple-800' },
                  { name: 'Malaria Detection', usage: '98', color: 'bg-yellow-100 text-yellow-800' },
                  { name: 'TB Detection', usage: '87', color: 'bg-pink-100 text-pink-800' }
                ].map((model, idx) => (
                  <div key={idx} className={`${model.color} rounded-lg p-4`}>
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-2xl font-bold mt-2">{model.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Organization Settings</h2>

            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Organization Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-gray-700 font-semibold">Organization Name</label>
                  <p className="text-xl text-gray-900 mt-2">{orgName}</p>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold">Organization Token</label>
                  <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded">
                    <input
                      type="text"
                      value={orgToken}
                      readOnly
                      className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded font-mono text-sm"
                    />
                    <button
                      onClick={() => simpleCopy(orgToken, 'org-token')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                    >
                      {copiedToken === 'org-token' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold">Data Storage</label>
                  <p className="text-lg text-gray-900 mt-2">2.5 TB Used • 7.5 TB Available</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold">Security Settings</label>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield size={18} />
                      <span>Data Encryption: Enabled</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield size={18} />
                      <span>Access Logging: Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield size={18} />
                      <span>Compliance: HIPAA Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-yellow-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Privacy & Compliance</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>HIPAA Compliance:</strong> All patient health information is encrypted and stored securely in compliance with HIPAA regulations.
                </p>
                <p>
                  <strong>Data Retention:</strong> Health records are retained for 7 years as per government regulations.
                </p>
                <p>
                  <strong>Access Control:</strong> Role-based access control ensures only authorized personnel can view sensitive health data.
                </p>
                <p>
                  <strong>Audit Logging:</strong> All data access and modifications are logged for security and compliance purposes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationGovernmentPortal;
