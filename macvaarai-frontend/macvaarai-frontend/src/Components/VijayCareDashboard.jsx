import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, Copy, CheckCircle, Building2, Users, BarChart3, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VijayCareDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hospitals, setHospitals] = useState([]);
  const [subscribedModels, setSubscribedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);

  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModelAllocation, setShowModelAllocation] = useState(null);

  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    num_doctors: 0,
    num_beds: 0,
    allocated_models: []
  });

  const apiUrl = 'http://localhost:8000';
  const navigate = useNavigate();

  const orgName = 'Vijay Care';
  const orgId = localStorage.getItem('orgId') || '3';
  const orgToken = localStorage.getItem('orgToken');

  useEffect(() => {
    fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      // Fetch organizations to get subscribed models
      const orgRes = await fetch(`${apiUrl}/admin/organizations`);
      const orgData = await orgRes.json();

      if (orgData.status === 'success') {
        const vijayOrg = orgData.organizations.find(o => o.name === 'Vijay Care');
        if (vijayOrg) {
          let models = vijayOrg.subscribed_models || [];
          if (typeof models === 'string') {
            try {
              models = JSON.parse(models);
            } catch {
              models = [];
            }
          }
          setSubscribedModels(models);
        }
      }

      // Fetch hospitals
      const hospitalsRes = await fetch(`${apiUrl}/admin/hospitals`);
      const hospitalsData = await hospitalsRes.json();

      if (hospitalsData.status === 'success') {
        setHospitals(hospitalsData.hospitals || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const allModels = [
    { id: 'eye', name: 'Eye Disease Detection', icon: '👁️', description: 'Detects diabetic retinopathy' },
    { id: 'covid', name: 'COVID-19 Detection', icon: '🦠', description: 'Analyzes chest X-rays' },
    { id: 'diabetes', name: 'Diabetes Prediction', icon: '💉', description: 'Predicts diabetes risk' },
    { id: 'pneumonia', name: 'Pneumonia Detection', icon: '🫁', description: 'Detects pneumonia' },
    { id: 'tb', name: 'Tuberculosis Detection', icon: '🫁', description: 'Detects TB' },
    { id: 'malaria', name: 'Malaria Detection', icon: '🦟', description: 'Identifies malaria' },
    { id: 'dengue', name: 'Dengue Detection', icon: '🦟', description: 'Detects dengue' },
    { id: 'skin', name: 'Skin Cancer Detection', icon: '🩺', description: 'Identifies skin cancer' },
    { id: 'ecg', name: 'ECG Analysis', icon: '❤️', description: 'Analyzes heart rhythm' },
    { id: 'stroke', name: 'Stroke Prediction', icon: '🧠', description: 'Predicts stroke risk' },
    { id: 'kidney', name: 'Kidney Disease', icon: '🫘', description: 'Assesses kidney disease' },
    { id: 'ear', name: 'Ear Infection', icon: '👂', description: 'Identifies ear infections' },
    { id: 'nose', name: 'Nasal Analysis', icon: '👃', description: 'Detects nasal polyps' },
    { id: 'oral', name: 'Oral Cancer', icon: '🦷', description: 'Identifies oral cancer' },
    { id: 'throat', name: 'Throat Analysis', icon: '🗣️', description: 'Analyzes throat' },
    { id: 'lung', name: 'Lung Analysis', icon: '🫁', description: 'Detects lung issues' },
    { id: 'colorectal', name: 'Colorectal Cancer', icon: '🏥', description: 'Identifies polyps' },
    { id: 'pharyngitis', name: 'Pharyngitis', icon: '🗣️', description: 'Detects pharyngitis' }
  ];

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

  const handleAddHospital = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(hospitalForm).forEach(key => {
        if (key === 'allocated_models') {
          formData.append(key, JSON.stringify(hospitalForm[key]));
        } else {
          formData.append(key, hospitalForm[key]);
        }
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
        alert(editingId ? 'Hospital updated!' : 'Hospital added to Vijay Care!');
        resetHospitalForm();
        fetchOrgData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetHospitalForm = () => {
    setHospitalForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      num_doctors: 0,
      num_beds: 0,
      allocated_models: []
    });
    setEditingId(null);
    setShowHospitalForm(false);
  };

  const handleDeleteHospital = async (hospital_id) => {
    if (!window.confirm('Delete this hospital from Vijay Care?')) return;

    try {
      const response = await fetch(`${apiUrl}/admin/hospitals/${hospital_id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Hospital deleted!');
        fetchOrgData();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orgId');
    localStorage.removeItem('orgToken');
    navigate('/');
  };

  const getSubscribedModelDetails = () => {
    return allModels.filter(m => subscribedModels.includes(m.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-900 to-orange-700">
        <div className="text-white text-2xl font-bold">Loading Vijay Care Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 to-orange-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">VIJAY CARE</h1>
              <p className="text-orange-200 mt-2 text-lg">Healthcare Organization Portal</p>
              <p className="text-orange-300 mt-1">Subscribed Models: {subscribedModels.length}/18</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-orange-200 sticky top-0 z-10 shadow">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'hospitals', label: 'Manage Hospitals', icon: Building2 },
              { id: 'models', label: 'My Models', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-3 font-bold transition ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Icon size={20} />
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
            <h2 className="text-4xl font-bold text-orange-900">Vijay Care Dashboard</h2>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 font-semibold">Registered Hospitals</p>
                    <p className="text-5xl font-bold mt-3">{hospitals.length}</p>
                  </div>
                  <Building2 size={50} className="opacity-30" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 font-semibold">Subscribed Models</p>
                    <p className="text-5xl font-bold mt-3">{subscribedModels.length}</p>
                  </div>
                  <Zap size={50} className="opacity-30" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 font-semibold">Portal Status</p>
                    <p className="text-2xl font-bold mt-3">ACTIVE</p>
                    <p className="text-sm mt-2">All Systems Operational</p>
                  </div>
                  <CheckCircle size={50} className="opacity-30" />
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscription Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 font-semibold">Organization Name</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">Vijay Care</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Total Models</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{subscribedModels.length} / 18</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Hospitals</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{hospitals.length} Active</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Status</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">Premium Member</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg flex items-center gap-3"
                >
                  <Building2 size={24} />
                  Add Hospital
                </button>
                <button
                  onClick={() => setActiveTab('models')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg flex items-center gap-3"
                >
                  <Zap size={24} />
                  View My Models
                </button>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center gap-3"
                >
                  <Users size={24} />
                  Manage Hospitals
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOSPITALS TAB */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-orange-900">Hospital Management</h2>
              <button
                onClick={() => setShowHospitalForm(!showHospitalForm)}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-bold"
              >
                <Plus size={20} />
                Add Hospital to Vijay Care
              </button>
            </div>

            {showHospitalForm && (
              <div className="bg-white rounded-lg border-2 border-orange-300 p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingId ? 'Edit Hospital' : 'Register New Hospital for Vijay Care'}
                </h3>
                <form onSubmit={handleAddHospital} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Hospital Name *" value={hospitalForm.name} onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})} className="border-2 border-gray-300 rounded-lg px-4 py-3 font-semibold" required />
                    <input type="email" placeholder="Email" value={hospitalForm.email} onChange={(e) => setHospitalForm({...hospitalForm, email: e.target.value})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                    <input type="tel" placeholder="Phone" value={hospitalForm.phone} onChange={(e) => setHospitalForm({...hospitalForm, phone: e.target.value})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                    <input type="text" placeholder="Address" value={hospitalForm.address} onChange={(e) => setHospitalForm({...hospitalForm, address: e.target.value})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                    <input type="text" placeholder="City" value={hospitalForm.city} onChange={(e) => setHospitalForm({...hospitalForm, city: e.target.value})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                    <input type="text" placeholder="State" value={hospitalForm.state} onChange={(e) => setHospitalForm({...hospitalForm, state: e.target.value})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                    <input type="number" placeholder="Doctors" value={hospitalForm.num_doctors} onChange={(e) => setHospitalForm({...hospitalForm, num_doctors: parseInt(e.target.value)})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                    <input type="number" placeholder="Beds" value={hospitalForm.num_beds} onChange={(e) => setHospitalForm({...hospitalForm, num_beds: parseInt(e.target.value)})} className="border-2 border-gray-300 rounded-lg px-4 py-3" />
                  </div>

                  {/* Model Allocation */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-300 mt-6">
                    <p className="font-bold text-gray-900 mb-3">Allocate Models to This Hospital</p>
                    <p className="text-sm text-gray-600 mb-4">Select which of your {subscribedModels.length} models this hospital can use:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {getSubscribedModelDetails().map(model => (
                        <label key={model.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hospitalForm.allocated_models.includes(model.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setHospitalForm({
                                  ...hospitalForm,
                                  allocated_models: [...hospitalForm.allocated_models, model.id]
                                });
                              } else {
                                setHospitalForm({
                                  ...hospitalForm,
                                  allocated_models: hospitalForm.allocated_models.filter(m => m !== model.id)
                                });
                              }
                            }}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm font-semibold">{model.name}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-sm text-green-700 mt-3 font-semibold">
                      {hospitalForm.allocated_models.length} models selected for this hospital
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                      {editingId ? 'Update Hospital' : 'Register Hospital'}
                    </button>
                    <button type="button" onClick={resetHospitalForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-lg font-bold">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Hospitals List */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-100 border-b-2 border-orange-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Hospital Name</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Models Access</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Access Token</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No hospitals registered yet. Click "Add Hospital" to get started!
                      </td>
                    </tr>
                  ) : (
                    hospitals.map((hospital) => (
                      <tr key={hospital.id || hospital.hospital_id} className="border-b border-gray-200 hover:bg-orange-50">
                        <td className="px-6 py-4 font-bold text-gray-900">{hospital.name}</td>
                        <td className="px-6 py-4 text-gray-700">{hospital.email}</td>
                        <td className="px-6 py-4">
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {hospital.subscribed_models?.length || 0} models
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                            <input type="text" value={hospital.access_token || ''} readOnly className="flex-1 bg-white border border-blue-300 px-2 py-1 rounded text-xs font-mono" />
                            <button onClick={() => simpleCopy(hospital.access_token, hospital.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
                              {copiedToken === hospital.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => {setEditingId(hospital.id); setHospitalForm(hospital); setShowHospitalForm(true);}} className="text-green-600 hover:text-green-800 font-bold">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDeleteHospital(hospital.id || hospital.hospital_id)} className="text-red-600 hover:text-red-800 font-bold">
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

        {/* MODELS TAB */}
        {activeTab === 'models' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-orange-900">Vijay Care Subscribed Models</h2>

            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-600">
              <p className="text-lg text-gray-700 mb-6">
                Vijay Care has access to <span className="text-2xl font-bold text-orange-600">{subscribedModels.length}</span> AI diagnostic models.
              </p>
              <p className="text-gray-600">These models can be allocated to registered hospitals to enable AI-powered diagnostics.</p>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSubscribedModelDetails().map((model) => (
                <div key={model.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-300 hover:shadow-xl transition">
                  <div className="text-4xl mb-3">{model.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{model.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-green-600">Available</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-3">Models Not Subscribed</h3>
              <p className="text-gray-700 mb-4">
                Vijay Care doesn't have access to {18 - subscribedModels.length} other models. Contact admin to add more models.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allModels.filter(m => !subscribedModels.includes(m.id)).map((model) => (
                  <div key={model.id} className="bg-gray-100 rounded p-3 text-center">
                    <p className="text-sm font-semibold text-gray-600">{model.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Not Available</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-orange-900">Organization Settings</h2>

            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Vijay Care Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 font-semibold">Organization Name</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">Vijay Care</p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Organization Token</p>
                  <div className="flex items-center gap-2 mt-3 bg-gray-50 p-3 rounded">
                    <input type="text" value={orgToken || ''} readOnly className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded font-mono text-sm" />
                    <button onClick={() => simpleCopy(orgToken, 'org-token')} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold">
                      {copiedToken === 'org-token' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-gray-600 font-semibold mb-3">Subscription Plan</p>
                  <div className="bg-orange-50 p-4 rounded border-2 border-orange-300">
                    <p className="font-bold text-orange-900">Premium Plan</p>
                    <p className="text-sm text-gray-700 mt-2">4 Diagnostic Models Included</p>
                    <ul className="text-sm text-gray-700 mt-3 space-y-1">
                      {getSubscribedModelDetails().map(m => (
                        <li key={m.id} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-600" />
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VijayCareDashboard;
