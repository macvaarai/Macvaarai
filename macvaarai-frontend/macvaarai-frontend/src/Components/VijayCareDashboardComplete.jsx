import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, Copy, CheckCircle, Building2, Users, BarChart3, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModelDiagnosticChatbot from './ModelDiagnosticChatbot';

const VijayCareDashboardComplete = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hospitals, setHospitals] = useState([]);
  const [subscribedModels, setSubscribedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  const [hospitalForm, setHospitalForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
    admin_name: '', admin_email: '', num_doctors: 0, num_beds: 0, allocated_models: []
  });

  const apiUrl = 'http://localhost:8000';
  const navigate = useNavigate();
  const orgName = 'Vijay Care';
  const orgToken = localStorage.getItem('orgToken') || 'ORG_VIJAY_CARE_6E1455EE';

  const allModels = [
    { id: 'eye', name: 'Eye Disease', icon: '👁️', price: '$$$$$' },
    { id: 'covid', name: 'COVID-19', icon: '🦠', price: '$$$$$' },
    { id: 'diabetes', name: 'Diabetes', icon: '💉', price: '$$$$$' },
    { id: 'pneumonia', name: 'Pneumonia', icon: '🫁', price: '$$$$$' },
    { id: 'ecg', name: 'ECG', icon: '❤️', price: '$$$$$' },
    { id: 'stroke', name: 'Stroke', icon: '🧠', price: '$$$$$' },
    { id: 'colorectal', name: 'Colorectal', icon: '🏥', price: '$$$$$' },
    { id: 'oral', name: 'Oral Cancer', icon: '🦷', price: '$$$$$' },
    { id: 'lung', name: 'Lung', icon: '🫁', price: '$$$$$' }
  ];

  useEffect(() => {
    fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const orgRes = await fetch(`${apiUrl}/admin/organizations`);
      const orgData = await orgRes.json();

      if (orgData.status === 'success') {
        const vijayOrg = orgData.organizations.find(o => o.name === 'Vijay Care');
        if (vijayOrg) {
          let models = vijayOrg.subscribed_models || [];
          if (typeof models === 'string') {
            try { models = JSON.parse(models); } catch { models = []; }
          }
          setSubscribedModels(models);
        }
      }

      const hospitalsRes = await fetch(`${apiUrl}/admin/hospitals`);
      const hospitalsData = await hospitalsRes.json();
      if (hospitalsData.status === 'success') {
        setHospitals(hospitalsData.hospitals || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const simpleCopy = (token, id) => {
    const el = document.createElement('textarea');
    el.value = token;
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

      // Add all required fields
      formData.append('name', hospitalForm.name || '');
      formData.append('email', hospitalForm.email || '');
      formData.append('phone', hospitalForm.phone || '');
      formData.append('address', hospitalForm.address || '');
      formData.append('city', hospitalForm.city || '');
      formData.append('state', hospitalForm.state || '');
      formData.append('zip_code', hospitalForm.zip_code || '');
      formData.append('admin_name', hospitalForm.admin_name || '');
      formData.append('admin_email', hospitalForm.admin_email || '');
      formData.append('num_doctors', hospitalForm.num_doctors || 0);
      formData.append('num_beds', hospitalForm.num_beds || 0);
      formData.append('subscribed_models', JSON.stringify(hospitalForm.allocated_models || []));

      const url = editingId ? `${apiUrl}/admin/hospitals/${editingId}` : `${apiUrl}/admin/hospitals`;
      const method = editingId ? 'PUT' : 'POST';

      console.log(`[${method}] ${url}`, {
        name: hospitalForm.name,
        models: hospitalForm.allocated_models,
        editingId
      });

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      console.log('Response:', data);

      if (data.status === 'success' || data.message) {
        alert(editingId ? '✅ Hospital Updated!' : '✅ Hospital Added!');
        setHospitalForm({ name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', admin_name: '', admin_email: '', num_doctors: 0, num_beds: 0, allocated_models: [] });
        setEditingId(null);
        setShowHospitalForm(false);
        fetchOrgData();
      } else {
        alert('Error: ' + (data.detail || data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteHospital = async (hospital_id) => {
    if (!window.confirm('Delete?')) return;
    try {
      const response = await fetch(`${apiUrl}/admin/hospitals/${hospital_id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Deleted!');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-yellow-400 text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-yellow-900 to-gray-900 text-white shadow-2xl border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/logos/Vijay.jpeg" alt="Logo" className="h-16 w-16 rounded-full border-4 border-yellow-500 object-cover" />
              <div>
                <h1 className="text-4xl font-bold text-yellow-400">VIJAY CARE</h1>
                <p className="text-yellow-300">Healthcare Portal</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="bg-gray-800 border-b-2 border-yellow-500 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'hospitals', label: 'Hospitals', icon: Building2 },
            { id: 'models', label: 'Models', icon: Zap },
            { id: 'staff', label: 'Staff', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-4 border-b-3 font-bold transition ${activeTab === tab.id ? 'border-yellow-500 text-yellow-400 bg-gray-700' : 'border-transparent text-gray-400 hover:text-yellow-400'}`}>
                <Icon size={20} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-yellow-400">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
                <Building2 size={40} className="mb-2 text-blue-400" />
                <p className="text-sm text-gray-300">Hospitals</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{hospitals.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
                <Zap size={40} className="mb-2 text-yellow-400" />
                <p className="text-sm text-gray-300">Models</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{subscribedModels.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-green-500">
                <Users size={40} className="mb-2 text-green-400" />
                <p className="text-sm text-gray-300">Status</p>
                <p className="text-4xl font-bold text-green-400 mt-2">Active</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
                <BarChart3 size={40} className="mb-2 text-purple-400" />
                <p className="text-sm text-gray-300">Plan</p>
                <p className="text-4xl font-bold text-purple-400 mt-2">Premium</p>
              </div>
            </div>
          </div>
        )}

        {/* HOSPITALS */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-yellow-400">Hospitals</h2>
              <button onClick={() => setShowHospitalForm(!showHospitalForm)} className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-bold">
                <Plus size={20} /> Add Hospital
              </button>
            </div>

            {showHospitalForm && (
              <div className="bg-gray-800 rounded-lg border-2 border-yellow-500 p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">{editingId ? 'Edit' : 'Add'} Hospital & Allocate Models</h3>
                <form onSubmit={handleAddHospital} className="space-y-6">
                  {/* Hospital Details */}
                  <div>
                    <h4 className="text-lg font-bold text-yellow-300 mb-3">Hospital Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Hospital Name *" value={hospitalForm.name} onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" required />
                      <input type="email" placeholder="Hospital Email" value={hospitalForm.email} onChange={(e) => setHospitalForm({...hospitalForm, email: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="tel" placeholder="Hospital Phone" value={hospitalForm.phone} onChange={(e) => setHospitalForm({...hospitalForm, phone: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="text" placeholder="Address" value={hospitalForm.address} onChange={(e) => setHospitalForm({...hospitalForm, address: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="text" placeholder="City" value={hospitalForm.city} onChange={(e) => setHospitalForm({...hospitalForm, city: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="text" placeholder="State" value={hospitalForm.state} onChange={(e) => setHospitalForm({...hospitalForm, state: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="text" placeholder="ZIP Code" value={hospitalForm.zip_code} onChange={(e) => setHospitalForm({...hospitalForm, zip_code: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="number" placeholder="Doctors Count" value={hospitalForm.num_doctors} onChange={(e) => setHospitalForm({...hospitalForm, num_doctors: parseInt(e.target.value) || 0})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="number" placeholder="Hospital Beds" value={hospitalForm.num_beds} onChange={(e) => setHospitalForm({...hospitalForm, num_beds: parseInt(e.target.value) || 0})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <input type="text" placeholder="Admin Name" value={hospitalForm.admin_name} onChange={(e) => setHospitalForm({...hospitalForm, admin_name: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                      <input type="email" placeholder="Admin Email" value={hospitalForm.admin_email} onChange={(e) => setHospitalForm({...hospitalForm, admin_email: e.target.value})} className="border-2 border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400" />
                    </div>
                  </div>

                  {/* Model Allocation */}
                  <div>
                    <h4 className="text-lg font-bold text-yellow-300 mb-3">📊 Allocate Your Models to This Hospital</h4>
                    <p className="text-gray-400 text-sm mb-3">Select which of your {subscribedModels.length} models this hospital can access:</p>
                    <div className="bg-gray-700 rounded-lg p-4 border border-yellow-500">
                      <div className="grid grid-cols-2 gap-3">
                        {allModels
                          .filter(m => subscribedModels.includes(m.id))
                          .map(model => (
                            <label key={model.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-600 p-2 rounded transition">
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
                              <span className="text-sm font-semibold text-white">{model.icon} {model.name}</span>
                            </label>
                          ))}
                      </div>
                      <p className="text-yellow-300 text-sm mt-3 font-semibold">
                        ✅ {hospitalForm.allocated_models.length} models selected for this hospital
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">Save Hospital</button>
                    <button type="button" onClick={() => {
                      setShowHospitalForm(false);
                      setEditingId(null);
                      setHospitalForm({ name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', admin_name: '', admin_email: '', num_doctors: 0, num_beds: 0, allocated_models: [] });
                    }} className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              {hospitals.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No hospitals added yet. Click "Add Hospital" to create one.
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {hospitals.map((h) => (
                    <div key={h.id} className="bg-gray-700 rounded-lg p-6 border-l-4 border-yellow-500">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-yellow-300 text-sm font-semibold">Hospital Name</p>
                          <p className="text-white font-bold text-lg">{h.name}</p>
                        </div>
                        <div>
                          <p className="text-yellow-300 text-sm font-semibold">Email</p>
                          <p className="text-gray-300">{h.email}</p>
                        </div>
                        <div>
                          <p className="text-yellow-300 text-sm font-semibold">Location</p>
                          <p className="text-gray-300">{h.city}, {h.state}</p>
                        </div>
                        <div>
                          <p className="text-yellow-300 text-sm font-semibold">Access Token</p>
                          <button onClick={() => simpleCopy(h.access_token, h.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">
                            {copiedToken === h.id ? '✓ Copied' : 'Copy Token'}
                          </button>
                        </div>
                      </div>

                      {/* Allocated Models */}
                      <div className="mb-4">
                        <p className="text-yellow-300 text-sm font-semibold mb-2">📊 Allocated Models ({(h.subscribed_models || []).length})</p>
                        <div className="flex flex-wrap gap-2">
                          {(h.subscribed_models || []).length > 0 ? (
                            (h.subscribed_models || []).map(modelId => {
                              const model = allModels.find(m => m.id === modelId);
                              return model ? (
                                <span key={modelId} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                  {model.icon} {model.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-gray-400 text-sm">No models allocated</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(h.id);
                            setHospitalForm({
                              ...h,
                              allocated_models: h.subscribed_models || []
                            });
                            setShowHospitalForm(true);
                          }}
                          className="text-green-400 hover:text-green-300 font-bold flex items-center gap-1"
                        >
                          <Edit2 size={18} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(h.id || h.hospital_id)}
                          className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                        >
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODELS */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">Subscribed Models ({subscribedModels.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allModels.filter(m => subscribedModels.includes(m.id)).map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 hover:border-yellow-500 hover:bg-gray-700 transition cursor-pointer transform hover:scale-105"
                >
                  <div className="text-5xl mb-3">{model.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-yellow-400">{model.price}</span>
                    <span className="text-sm font-bold text-green-400">✓ Active</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-3">Click to analyze image</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAFF */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">Staff Management</h2>
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
              <p className="text-gray-300">Staff management features coming soon...</p>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">Settings</h2>
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 border-l-4 border-yellow-500">
              <div className="flex items-center gap-6 mb-6">
                <img src="/logos/Vijay.jpeg" alt="Vijay" className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover" />
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400">Organization Info</h3>
                  <p className="text-gray-400">Manage your organization</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-yellow-300 font-semibold">Organization</p>
                  <p className="text-xl font-bold text-white mt-1">{orgName}</p>
                </div>
                <div>
                  <p className="text-yellow-300 font-semibold">Access Token</p>
                  <div className="flex gap-2 mt-2 bg-gray-700 p-3 rounded">
                    <input type="text" value={orgToken} readOnly className="flex-1 bg-gray-600 border border-gray-500 px-3 py-2 rounded text-sm text-gray-300" />
                    <button onClick={() => simpleCopy(orgToken, 'org')} className="bg-yellow-600 text-white px-4 py-2 rounded font-bold">
                      {copiedToken === 'org' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHATBOT MODAL */}
      {selectedModel && (
        <ModelDiagnosticChatbot
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
};

export default VijayCareDashboardComplete;
