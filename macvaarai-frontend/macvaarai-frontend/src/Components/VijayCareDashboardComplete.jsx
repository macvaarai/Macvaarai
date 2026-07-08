import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, Copy, CheckCircle, Building2, Users, BarChart3, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModelDiagnosticChatbot from './ModelDiagnosticChatbotClean';
import StaffManagement from './StaffManagement';
import { AI_MODELS } from '../data/models';

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

  const [schools, setSchools] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [policeOrgs, setPoliceOrgs] = useState([]);
  const [womenOrgs, setWomenOrgs] = useState([]);
  const [offices, setOffices] = useState([]);

  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showDistrictForm, setShowDistrictForm] = useState(false);
  const [showPoliceForm, setShowPoliceForm] = useState(false);
  const [showWomenForm, setShowWomenForm] = useState(false);
  const [showOfficeForm, setShowOfficeForm] = useState(false);

  const [partnerForm, setPartnerForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
    contact_name: '', contact_email: '', members: 0, allocated_models: []
  });

  const apiUrl = 'http://localhost:8000';
  const navigate = useNavigate();
  const orgName = 'Vijay Care AI';
  const orgToken = localStorage.getItem('orgToken') || 'ORG_VIJAY_CARE_6E1455EE';
  const allModels = AI_MODELS;

  useEffect(() => {
    fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const orgRes = await fetch(`${apiUrl}/admin/organizations`);
      const orgData = await orgRes.json();

      if (orgData.status === 'success') {
        const vijayOrg = orgData.organizations.find(o => o.name === 'Vijay Care AI');
        if (vijayOrg) {
          let models = vijayOrg.subscribed_models || [];
          if (typeof models === 'string') {
            try { models = JSON.parse(models); } catch { models = []; }
          }
          // If no models, set all 18 models by default
          if (!models || models.length === 0) {
            models = allModels.map(m => m.id);
          }
          setSubscribedModels(models);
        } else {
          // If organization not found, set all models by default
          setSubscribedModels(allModels.map(m => m.id));
        }
      } else {
        // If fetch fails, set all models by default
        setSubscribedModels(allModels.map(m => m.id));
      }

      const hospitalsRes = await fetch(`${apiUrl}/admin/hospitals`);
      const hospitalsData = await hospitalsRes.json();
      if (hospitalsData.status === 'success') {
        setHospitals(hospitalsData.hospitals || []);
      }
    } catch (err) {
      console.error('Error:', err);
      // Set all models by default on error
      setSubscribedModels(allModels.map(m => m.id));
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
                <h1 className="text-4xl font-bold text-yellow-400">VIJAY CARE AI</h1>
                <p className="text-yellow-300">AI-Driven Early Disease Detection & Identification</p>
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
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2">
          <button className="text-yellow-400 hover:text-yellow-300 font-bold text-xl px-2 py-4">&lt;</button>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'hospitals', label: 'Hospital AI' },
              { id: 'schools', label: 'School AI' },
              { id: 'districts', label: 'District AI' },
              { id: 'police', label: 'Police AI' },
              { id: 'women', label: 'Women AI' },
              { id: 'offices', label: 'Office AI' },
              { id: 'models', label: 'Models' },
              { id: 'staff', label: 'Staff' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-4 border-b-3 font-bold transition whitespace-nowrap ${activeTab === tab.id ? 'border-yellow-500 text-yellow-400 bg-gray-700' : 'border-transparent text-gray-400 hover:text-yellow-400'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <button className="text-yellow-400 hover:text-yellow-300 font-bold text-xl px-2 py-4">&gt;</button>
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

        {/* SCHOOLS */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-blue-400">🎓 School AI</h2>
              <button onClick={() => setShowSchoolForm(!showSchoolForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> Add School</button>
            </div>

            {showSchoolForm && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-blue-500">
                <div className="grid grid-cols-2 gap-8">
                  {/* LEFT SIDE: SCHOOL DETAILS FORM */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-blue-300">📝 SCHOOL DETAILS</h3>
                    <div className="space-y-3">
                      <input type="text" placeholder="School Name *" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="email" placeholder="Email *" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="tel" placeholder="Phone *" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="text" placeholder="Address *" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="text" placeholder="Principal/Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <input type="number" placeholder="Number of Students" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white" />
                      <div className="pt-3">
                        <p className="text-blue-300 text-sm font-bold mb-2">Selected Models: {partnerForm.allocated_models.length}</p>
                        <button onClick={() => {setSchools([...schools, {...partnerForm, id: Date.now()}]); setShowSchoolForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: []});}} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-bold">Add School</button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE: AI MODELS GRID (4 COLUMNS) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-blue-300">📚 SELECT AI MODELS</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
                      {allModels.map(model => (
                        <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-blue-500 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={partnerForm.allocated_models.includes(model.id)}
                            onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})}
                            className="rounded mt-1"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-blue-300">{model.icon} {model.name}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCHOOLS LIST */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-300">📋 Added Schools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schools.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-blue-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-300">🎓 {item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.contact_name}</p>
                      </div>
                      <button onClick={() => setSchools(schools.filter(s => s.id !== item.id))} className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>📧 {item.email}</p>
                      <p>📱 {item.phone}</p>
                      <p>📍 {item.address}, {item.city}</p>
                      <p>👥 {item.members} students</p>
                      <p className="text-blue-400 font-bold">📚 {item.allocated_models.length} models allocated</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DISTRICTS */}
        {activeTab === 'districts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-green-400">📍 District AI</h2>
              <button onClick={() => setShowDistrictForm(!showDistrictForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> Add District</button>
            </div>

            {showDistrictForm && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 space-y-6">
                <div><h3 className="text-lg font-bold text-green-300 mb-3">📚 SELECT AI MODELS</h3><div className="grid grid-cols-4 gap-2 bg-gray-700 p-3 rounded border border-gray-600 max-h-40 overflow-y-auto">{allModels.map(model => (<label key={model.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={partnerForm.allocated_models.includes(model.id)} onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})} className="rounded" />{model.name}</label>))}</div><p className="text-green-300 text-sm mt-2">Selected: {partnerForm.allocated_models.length} models</p></div><div className="border-t border-gray-600 pt-6"><h3 className="text-lg font-bold text-green-300 mb-4">📝 ENTER DISTRICT DETAILS</h3><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="District Name *" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Email *" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="tel" placeholder="Phone *" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Address *" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Collector/Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="number" placeholder="Population/Coverage" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /></div></div><button onClick={() => {setDistricts([...districts, {...partnerForm, id: Date.now()}]); setShowDistrictForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: []});}} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-bold">Add District</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {districts.map(item => (<div key={item.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500"><div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-bold text-green-300">📍 {item.name}</h3><p className="text-gray-400 text-sm">{item.contact_name}</p></div><button onClick={() => setDistricts(districts.filter(d => d.id !== item.id))} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button></div><div className="text-sm text-gray-300 space-y-1"><p>📧 {item.email}</p><p>📱 {item.phone}</p><p>📍 {item.address}, {item.city}</p><p>👥 {item.members} population</p><p className="text-green-400 font-bold">📚 {item.allocated_models.length} models</p></div></div>))}
            </div>
          </div>
        )}

        {/* POLICE */}
        {activeTab === 'police' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-red-400">👮 Police AI</h2>
              <button onClick={() => setShowPoliceForm(!showPoliceForm)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> Add Police</button>
            </div>

            {showPoliceForm && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-500 space-y-6">
                <div><h3 className="text-lg font-bold text-red-300 mb-3">📚 SELECT AI MODELS</h3><div className="grid grid-cols-4 gap-2 bg-gray-700 p-3 rounded border border-gray-600 max-h-40 overflow-y-auto">{allModels.map(model => (<label key={model.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={partnerForm.allocated_models.includes(model.id)} onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})} className="rounded" />{model.name}</label>))}</div><p className="text-red-300 text-sm mt-2">Selected: {partnerForm.allocated_models.length} models</p></div><div className="border-t border-gray-600 pt-6"><h3 className="text-lg font-bold text-red-300 mb-4">📝 ENTER POLICE DETAILS</h3><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Police Department *" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Email *" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="tel" placeholder="Phone *" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Address *" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Chief/Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="number" placeholder="Officers" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /></div></div><button onClick={() => {setPoliceOrgs([...policeOrgs, {...partnerForm, id: Date.now()}]); setShowPoliceForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: []});}} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded font-bold">Add Police</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policeOrgs.map(item => (<div key={item.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-500"><div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-bold text-red-300">👮 {item.name}</h3><p className="text-gray-400 text-sm">{item.contact_name}</p></div><button onClick={() => setPoliceOrgs(policeOrgs.filter(p => p.id !== item.id))} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button></div><div className="text-sm text-gray-300 space-y-1"><p>📧 {item.email}</p><p>📱 {item.phone}</p><p>📍 {item.address}, {item.city}</p><p>👥 {item.members} officers</p><p className="text-red-400 font-bold">📚 {item.allocated_models.length} models</p></div></div>))}
            </div>
          </div>
        )}

        {/* WOMEN */}
        {activeTab === 'women' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-pink-400">👩 Women AI</h2>
              <button onClick={() => setShowWomenForm(!showWomenForm)} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> Add Women Organization</button>
            </div>

            {showWomenForm && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-pink-500 space-y-6">
                <div><h3 className="text-lg font-bold text-pink-300 mb-3">📚 SELECT AI MODELS</h3><div className="grid grid-cols-4 gap-2 bg-gray-700 p-3 rounded border border-gray-600 max-h-40 overflow-y-auto">{allModels.map(model => (<label key={model.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={partnerForm.allocated_models.includes(model.id)} onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})} className="rounded" />{model.name}</label>))}</div><p className="text-pink-300 text-sm mt-2">Selected: {partnerForm.allocated_models.length} models</p></div><div className="border-t border-gray-600 pt-6"><h3 className="text-lg font-bold text-pink-300 mb-4">📝 ENTER WOMEN ORG DETAILS</h3><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Organization Name *" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Email *" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="tel" placeholder="Phone *" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Address *" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Director/Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="number" placeholder="Members" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /></div></div><button onClick={() => {setWomenOrgs([...womenOrgs, {...partnerForm, id: Date.now()}]); setShowWomenForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: []});}} className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded font-bold">Add Women Organization</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {womenOrgs.map(item => (<div key={item.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-pink-500"><div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-bold text-pink-300">👩 {item.name}</h3><p className="text-gray-400 text-sm">{item.contact_name}</p></div><button onClick={() => setWomenOrgs(womenOrgs.filter(w => w.id !== item.id))} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button></div><div className="text-sm text-gray-300 space-y-1"><p>📧 {item.email}</p><p>📱 {item.phone}</p><p>📍 {item.address}, {item.city}</p><p>👥 {item.members} members</p><p className="text-pink-400 font-bold">📚 {item.allocated_models.length} models</p></div></div>))}
            </div>
          </div>
        )}

        {/* OFFICES */}
        {activeTab === 'offices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-indigo-400">🏢 Office AI</h2>
              <button onClick={() => setShowOfficeForm(!showOfficeForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> Add Office</button>
            </div>

            {showOfficeForm && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-indigo-500 space-y-6">
                <div><h3 className="text-lg font-bold text-indigo-300 mb-3">📚 SELECT AI MODELS</h3><div className="grid grid-cols-4 gap-2 bg-gray-700 p-3 rounded border border-gray-600 max-h-40 overflow-y-auto">{allModels.map(model => (<label key={model.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={partnerForm.allocated_models.includes(model.id)} onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})} className="rounded" />{model.name}</label>))}</div><p className="text-indigo-300 text-sm mt-2">Selected: {partnerForm.allocated_models.length} models</p></div><div className="border-t border-gray-600 pt-6"><h3 className="text-lg font-bold text-indigo-300 mb-4">📝 ENTER OFFICE DETAILS</h3><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Office Name *" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Email *" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="tel" placeholder="Phone *" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Address *" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="text" placeholder="Manager/Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /><input type="number" placeholder="Employees" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="col-span-2 p-3 rounded bg-gray-700 border border-gray-600 text-white" /></div></div><button onClick={() => {setOffices([...offices, {...partnerForm, id: Date.now()}]); setShowOfficeForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: []});}} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded font-bold">Add Office</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map(item => (<div key={item.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-indigo-500"><div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-bold text-indigo-300">🏢 {item.name}</h3><p className="text-gray-400 text-sm">{item.contact_name}</p></div><button onClick={() => setOffices(offices.filter(o => o.id !== item.id))} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button></div><div className="text-sm text-gray-300 space-y-1"><p>📧 {item.email}</p><p>📱 {item.phone}</p><p>📍 {item.address}, {item.city}</p><p>👥 {item.members} employees</p><p className="text-indigo-400 font-bold">📚 {item.allocated_models.length} models</p></div></div>))}
            </div>
          </div>
        )}

        {/* MODELS */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">AI Medical Models</h2>
            <p className="text-gray-400 text-lg mb-6">All {allModels.length} Available AI Diagnostic Models</p>

            {/* Single Grid - All Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allModels.map((model, index) => {
                const borderColors = [
                  'border-red-500', 'border-orange-500', 'border-yellow-500', 'border-blue-500',
                  'border-cyan-500', 'border-green-500', 'border-purple-500', 'border-pink-500',
                  'border-red-600', 'border-blue-600', 'border-teal-500', 'border-indigo-500'
                ];
                const borderColor = borderColors[index % borderColors.length];

                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`bg-gray-900 rounded-xl shadow-lg p-6 border-2 ${borderColor} hover:bg-gray-800 transition cursor-pointer transform hover:scale-105`}
                  >
                    <div className="text-5xl mb-3">{model.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{model.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAFF */}
        {activeTab === 'staff' && (
          <StaffManagement />
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
