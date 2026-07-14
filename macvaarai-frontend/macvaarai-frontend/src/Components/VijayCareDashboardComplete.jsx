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
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [editingDistrictId, setEditingDistrictId] = useState(null);
  const [editingPoliceId, setEditingPoliceId] = useState(null);
  const [editingWomenId, setEditingWomenId] = useState(null);
  const [editingOfficeId, setEditingOfficeId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // Sort models: Heart & ENT on top, others below
  const sortModelsByPriority = (models) => {
    const heartEntModels = models.filter(m => m.name.includes('Heart') || m.name.includes('Ear') || m.name.includes('Nose') || m.name.includes('Throat'));
    const otherModels = models.filter(m => !m.name.includes('Heart') && !m.name.includes('Ear') && !m.name.includes('Nose') && !m.name.includes('Throat'));
    return [...heartEntModels, ...otherModels];
  };

  // Sort models for School: Nutrition models on top, then ENT, then others
  const sortSchoolModels = (models) => {
    const nutritionModels = models.filter(m => m.name.includes('Vitamin') || m.name.includes('Iron') || m.name.includes('Magnesium'));
    const entModels = models.filter(m => m.name.includes('Ear') || m.name.includes('Nose'));
    const otherModels = models.filter(m => !m.name.includes('Vitamin') && !m.name.includes('Iron') && !m.name.includes('Magnesium') && !m.name.includes('Ear') && !m.name.includes('Nose'));
    return [...nutritionModels, ...entModels, ...otherModels];
  };

  const [hospitalForm, setHospitalForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
    admin_name: '', admin_email: '', num_doctors: 0, num_beds: 0, allocated_models: [],
    username: '', password: ''
  });

  const [schools, setSchools] = useState([
    { id: 1, name: 'Greenwood School', email: 'admin@greenwood.com', city: 'Chennai', contact_name: 'Mr. Kumar', members: 500 }
  ]);
  const [districts, setDistricts] = useState([
    { id: 1, name: 'Chennai District', email: 'admin@chennai-district.gov', city: 'Chennai', contact_name: 'Dr. Rajesh', members: 50000 }
  ]);
  const [policeOrgs, setPoliceOrgs] = useState([
    { id: 1, name: 'Chennai Police', email: 'admin@chennaipol.gov', city: 'Chennai', contact_name: 'Commissioner', members: 5000 }
  ]);
  const [womenOrgs, setWomenOrgs] = useState([
    { id: 1, name: 'Women Empowerment Centre', email: 'admin@womencentre.org', city: 'Chennai', contact_name: 'Ms. Priya', members: 1000 }
  ]);
  const [offices, setOffices] = useState([
    { id: 1, name: 'Vijay Care HQ', email: 'hq@vijaycare.com', city: 'Chennai', contact_name: 'Manager', members: 200 }
  ]);

  const [profile, setProfile] = useState({
    name: 'Vijay Care Admin',
    email: 'admin@vijaycare.com',
    phone: '+91-9000000002',
    organization: 'Vijay Care',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showDistrictForm, setShowDistrictForm] = useState(false);
  const [showPoliceForm, setShowPoliceForm] = useState(false);
  const [showWomenForm, setShowWomenForm] = useState(false);
  const [showOfficeForm, setShowOfficeForm] = useState(false);

  const [partnerForm, setPartnerForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
    contact_name: '', contact_email: '', members: 0, allocated_models: [],
    username: '', password: '',
    vitaminDeficiency: false, ironDeficiency: false, magnesiumDeficiency: false,
    calciumDeficiency: false, proteinMalnutrition: false, stunting: false, wasting: false,
    anemia: false, rickets: false, malaria: false, dengue: false, diarrhea: false,
    respiratoryInfection: false, typhoid: false, measles: false, polio: false
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

      if (orgData.status === 'success' && orgData.organizations && Array.isArray(orgData.organizations)) {
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
    localStorage.removeItem('vijayToken');
    localStorage.removeItem('vijayOrgName');
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
              <img src="/logos/Vijay.jpeg" alt="Vijay Care Logo" className="h-16 w-16 rounded-full border-4 border-yellow-500 object-cover" />
              <div>
                <h1 className="text-4xl font-bold text-yellow-400">VIJAY CARE AI</h1>
                <p className="text-yellow-300">AI-Driven Early Disease Detection & Identification</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/logos/Macvaar.jpg" alt="Macvaar AI" className="h-12 w-12 rounded-full border-2 border-yellow-500 object-cover" />
                <div className="text-right">
                  <p className="text-xs text-yellow-300">Powered by</p>
                  <p className="text-sm font-bold text-yellow-400">MacvaarAI</p>
                </div>
              </div>
            </div>
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
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-yellow-400">Government Health Statistics</h2>
              <button onClick={() => setActiveTab('dashboard')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-bold">All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
                <Building2 size={40} className="mb-2 text-blue-400" />
                <p className="text-sm text-gray-300">Hospitals AI</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{hospitals.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-cyan-500">
                <Users size={40} className="mb-2 text-cyan-400" />
                <p className="text-sm text-gray-300">Schools AI</p>
                <p className="text-4xl font-bold text-cyan-400 mt-2">{schools.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-green-500">
                <BarChart3 size={40} className="mb-2 text-green-400" />
                <p className="text-sm text-gray-300">Districts AI</p>
                <p className="text-4xl font-bold text-green-400 mt-2">{districts.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-red-500">
                <Users size={40} className="mb-2 text-red-400" />
                <p className="text-sm text-gray-300">Police AI</p>
                <p className="text-4xl font-bold text-red-400 mt-2">{policeOrgs.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
                <Zap size={40} className="mb-2 text-yellow-400" />
                <p className="text-sm text-gray-300">AI Models</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{subscribedModels.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-pink-500">
                <Users size={40} className="mb-2 text-pink-400" />
                <p className="text-sm text-gray-300">Women Orgs AI</p>
                <p className="text-4xl font-bold text-pink-400 mt-2">{womenOrgs.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-indigo-500">
                <Building2 size={40} className="mb-2 text-indigo-400" />
                <p className="text-sm text-gray-300">Offices AI</p>
                <p className="text-4xl font-bold text-indigo-400 mt-2">{offices.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-orange-500">
                <Users size={40} className="mb-2 text-orange-400" />
                <p className="text-sm text-gray-300">Total Orgs</p>
                <p className="text-4xl font-bold text-orange-400 mt-2">{schools.length + districts.length + policeOrgs.length + womenOrgs.length + offices.length + hospitals.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* HOSPITALS */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-yellow-400">🏥 Hospital AI</h2>
              <button onClick={() => setShowHospitalForm(!showHospitalForm)} className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-bold">
                <Plus size={20} /> Add Hospital
              </button>
            </div>

            {showHospitalForm && (
              <div className="bg-gray-800 rounded-lg border-2 border-yellow-500 p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-8">
              {/* LEFT SIDE: HOSPITAL DETAILS */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-yellow-500/30 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-600 p-2 rounded-lg">
                    <span className="text-lg">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300">Hospital Details</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-yellow-300 text-xs font-semibold mb-1">Hospital Name *</label>
                    <input type="text" placeholder="Enter hospital name" value={hospitalForm.name} onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">Email *</label>
                      <input type="email" placeholder="Email" value={hospitalForm.email} onChange={(e) => setHospitalForm({...hospitalForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">Phone *</label>
                      <input type="tel" placeholder="Phone" value={hospitalForm.phone} onChange={(e) => setHospitalForm({...hospitalForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-yellow-300 text-xs font-semibold mb-1">Address *</label>
                    <input type="text" placeholder="Full address" value={hospitalForm.address} onChange={(e) => setHospitalForm({...hospitalForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">City</label>
                      <input type="text" placeholder="City" value={hospitalForm.city} onChange={(e) => setHospitalForm({...hospitalForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">State</label>
                      <input type="text" placeholder="State" value={hospitalForm.state} onChange={(e) => setHospitalForm({...hospitalForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">ZIP Code</label>
                      <input type="text" placeholder="ZIP" value={hospitalForm.zip_code} onChange={(e) => setHospitalForm({...hospitalForm, zip_code: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">Doctors</label>
                      <input type="number" placeholder="0" value={hospitalForm.num_doctors} onChange={(e) => setHospitalForm({...hospitalForm, num_doctors: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-yellow-300 text-xs font-semibold mb-1">Beds</label>
                      <input type="number" placeholder="0" value={hospitalForm.num_beds} onChange={(e) => setHospitalForm({...hospitalForm, num_beds: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-yellow-300 text-xs font-semibold mb-1">Admin Name</label>
                    <input type="text" placeholder="Admin name" value={hospitalForm.admin_name} onChange={(e) => setHospitalForm({...hospitalForm, admin_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-yellow-300 text-sm font-semibold mb-2">Admin Email</label>
                    <input type="email" placeholder="Admin email" value={hospitalForm.admin_email} onChange={(e) => setHospitalForm({...hospitalForm, admin_email: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-yellow-500 focus:outline-none transition" />
                  </div>
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <p className="text-yellow-300 text-sm font-semibold mb-3">🔐 Dashboard Login</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-yellow-300 text-xs font-semibold mb-1">Username *</label>
                        <input type="text" placeholder="Username" value={hospitalForm.username || ''} onChange={(e) => setHospitalForm({...hospitalForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-yellow-300 text-xs font-semibold mb-1">Password *</label>
                        <input type="password" placeholder="Password" value={hospitalForm.password || ''} onChange={(e) => setHospitalForm({...hospitalForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-yellow-300 text-sm font-bold">Selected Models: {hospitalForm.allocated_models.length}</p>
                    <button onClick={() => {if(editingId) {const updatedHospitals = hospitals.map(h => h.id === editingId ? {...hospitalForm, id: editingId} : h); setHospitals(updatedHospitals); setEditingId(null);} else {setHospitals([...hospitals, {...hospitalForm, id: Date.now()}]); } setShowHospitalForm(false); setHospitalForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', admin_name: '', admin_email: '', num_doctors: 0, num_beds: 0, allocated_models: []});}} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded font-bold">{editingId ? 'Update' : 'Add'} Hospital</button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: AI MODELS GRID (2 COLUMNS) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-yellow-300">📚 SELECT AI MODELS</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
                  {sortModelsByPriority(allModels).map(model => (
                    <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-yellow-500 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={hospitalForm.allocated_models.includes(model.id)}
                        onChange={(e) => setHospitalForm({...hospitalForm, allocated_models: e.target.checked ? [...hospitalForm.allocated_models, model.id] : hospitalForm.allocated_models.filter(m => m !== model.id)})}
                        className="rounded mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-yellow-300">{model.icon} {model.name}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* HOSPITALS LIST */}
            {hospitals.length > 0 && (
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-4 shadow-lg">
                  <h3 className="text-2xl font-bold text-white">📋 Added Hospitals ({hospitals.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hospitals.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-yellow-500/30 hover:border-yellow-500 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-300">🏥 {item.name}</h3>
                          <p className="text-yellow-400 text-sm font-semibold">{item.admin_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingId(item.id); setHospitalForm({...item}); setShowHospitalForm(true);}} className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setHospitals(hospitals.filter(h => h.id !== item.id))} className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 p-2 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span>📧</span>{item.email}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📱</span>{item.phone}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📍</span>{item.address}, {item.city}</div>
                        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
                          <div className="flex gap-4">
                            <p className="text-yellow-400 font-bold">⚕️ {item.num_doctors} Doctors</p>
                            <p className="text-yellow-400 font-bold">🛏️ {item.num_beds} Beds</p>
                          </div>
                        </div>
                        <div className="text-yellow-400 font-bold pt-2">📚 {(item.allocated_models || []).length} models allocated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {/* LEFT SIDE: SCHOOL DETAILS */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-blue-500/30 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <input type="text" placeholder="School Name" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                    <input type="tel" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                  </div>
                  <input type="text" placeholder="Address" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                    <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                    <input type="number" placeholder="Students" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                  </div>
                  <input type="text" placeholder="Principal/Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                  <input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Username" value={partnerForm.username} onChange={(e) => setPartnerForm({...partnerForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                      <input type="password" placeholder="Password" value={partnerForm.password} onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <button onClick={() => {if(editingSchoolId) {const updatedSchools = schools.map(s => s.id === editingSchoolId ? {...partnerForm, id: editingSchoolId} : s); setSchools(updatedSchools); setEditingSchoolId(null);} else {setSchools([...schools, {...partnerForm, id: Date.now()}]); } setShowSchoolForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: [], username: '', password: '', vitaminDeficiency: false, ironDeficiency: false, magnesiumDeficiency: false, calciumDeficiency: false, proteinMalnutrition: false, stunting: false, wasting: false, anemia: false, rickets: false, diarrhea: false, respiratoryInfection: false, typhoid: false, measles: false, polio: false});}} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-bold">{editingSchoolId ? 'Update' : 'Add'} School</button>
                </div>
              </div>

              {/* RIGHT SIDE: AI MODELS & HEALTH CONDITIONS */}
              <div className="space-y-3">
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {sortSchoolModels(allModels).map(model => (
                      <label key={model.id} className="flex items-start gap-2 p-2 bg-gray-800 rounded border border-gray-500 hover:border-blue-500 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={partnerForm.allocated_models.includes(model.id)}
                          onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})}
                          className="rounded mt-0.5 w-3 h-3"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-blue-300">{model.icon} {model.name}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Other AI</h3>
                  <div className="space-y-2 bg-gray-700 p-3 rounded border border-gray-600">
                    <div>
                      <p className="text-blue-200 text-xs font-semibold mb-1">Deficiencies:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.vitaminDeficiency || false} onChange={(e) => setPartnerForm({...partnerForm, vitaminDeficiency: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Vitamin</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.ironDeficiency || false} onChange={(e) => setPartnerForm({...partnerForm, ironDeficiency: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Iron</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.magnesiumDeficiency || false} onChange={(e) => setPartnerForm({...partnerForm, magnesiumDeficiency: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Magnesium</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.calciumDeficiency || false} onChange={(e) => setPartnerForm({...partnerForm, calciumDeficiency: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Calcium</span></label>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-semibold mb-1">Malnutrition:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.proteinMalnutrition || false} onChange={(e) => setPartnerForm({...partnerForm, proteinMalnutrition: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Protein</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.stunting || false} onChange={(e) => setPartnerForm({...partnerForm, stunting: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Stunting</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.wasting || false} onChange={(e) => setPartnerForm({...partnerForm, wasting: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Wasting</span></label>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-semibold mb-1">Blood & Bone:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.anemia || false} onChange={(e) => setPartnerForm({...partnerForm, anemia: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Anemia</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.rickets || false} onChange={(e) => setPartnerForm({...partnerForm, rickets: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Rickets</span></label>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-semibold mb-1">Infectious Diseases:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.diarrhea || false} onChange={(e) => setPartnerForm({...partnerForm, diarrhea: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Diarrhea</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.respiratoryInfection || false} onChange={(e) => setPartnerForm({...partnerForm, respiratoryInfection: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Respiratory</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.typhoid || false} onChange={(e) => setPartnerForm({...partnerForm, typhoid: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Typhoid</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.measles || false} onChange={(e) => setPartnerForm({...partnerForm, measles: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Measles</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={partnerForm.polio || false} onChange={(e) => setPartnerForm({...partnerForm, polio: e.target.checked})} className="rounded w-3 h-3" /><span className="text-blue-100 text-xs">Polio</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            )}

            {/* SCHOOLS LIST */}
            {schools.length > 0 && (
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 shadow-lg">
                  <h3 className="text-2xl font-bold text-white">📋 Added Schools ({schools.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {schools.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-blue-500/30 hover:border-blue-500 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-blue-300">🎓 {item.name}</h3>
                          <p className="text-cyan-300 text-sm font-semibold">{item.contact_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingSchoolId(item.id); setPartnerForm({...item}); setShowSchoolForm(true);}} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setSchools(schools.filter(s => s.id !== item.id))} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span>📧</span>{item.email}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📱</span>{item.phone}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📍</span>{item.address}, {item.city}</div>
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mt-3">
                          <p className="text-cyan-400 font-bold text-lg">👥 {item.members} Students</p>
                        </div>
                        {(item.vitaminDeficiency || item.ironDeficiency || item.magnesiumDeficiency || item.calciumDeficiency || item.proteinMalnutrition || item.stunting || item.wasting || item.anemia || item.rickets || item.diarrhea || item.respiratoryInfection || item.typhoid || item.measles || item.polio) && (
                          <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3 mt-3">
                            <p className="text-cyan-300 font-bold text-sm mb-2">🏥 Health Issues Addressed:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.vitaminDeficiency && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Vitamin</span>}
                              {item.ironDeficiency && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Iron</span>}
                              {item.magnesiumDeficiency && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Mag</span>}
                              {item.calciumDeficiency && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Calcium</span>}
                              {item.proteinMalnutrition && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Protein</span>}
                              {item.stunting && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Stunting</span>}
                              {item.wasting && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Wasting</span>}
                              {item.anemia && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Anemia</span>}
                              {item.rickets && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Rickets</span>}
                              {item.diarrhea && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Diarrhea</span>}
                              {item.respiratoryInfection && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Resp</span>}
                              {item.typhoid && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Typhoid</span>}
                              {item.measles && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Measles</span>}
                              {item.polio && <span className="bg-cyan-600/40 text-cyan-200 px-2 py-1 rounded text-xs">Polio</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500">
                <div className="grid grid-cols-2 gap-8">
              {/* LEFT SIDE: DISTRICT DETAILS */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-green-500/30 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <span className="text-lg">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-green-300">District Details</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-green-300 text-xs font-semibold mb-1">District Name *</label>
                    <input type="text" placeholder="Enter district name" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-green-300 text-xs font-semibold mb-1">Email *</label>
                      <input type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-green-300 text-xs font-semibold mb-1">Phone *</label>
                      <input type="tel" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-green-300 text-xs font-semibold mb-1">Address *</label>
                    <input type="text" placeholder="Full address" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-green-300 text-xs font-semibold mb-1">City</label>
                      <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-green-300 text-xs font-semibold mb-1">State</label>
                      <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-green-300 text-xs font-semibold mb-1">Population</label>
                      <input type="number" placeholder="0" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-green-300 text-xs font-semibold mb-1">Collector/Contact Name</label>
                    <input type="text" placeholder="Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-green-300 text-sm font-semibold mb-2">Contact Email</label>
                    <input type="email" placeholder="Contact email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-green-500 focus:outline-none transition" />
                  </div>
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <p className="text-green-300 text-sm font-semibold mb-3">🔐 Dashboard Login</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-green-300 text-xs font-semibold mb-1">Username *</label>
                        <input type="text" placeholder="Username" value={partnerForm.username || ''} onChange={(e) => setPartnerForm({...partnerForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-green-300 text-xs font-semibold mb-1">Password *</label>
                        <input type="password" placeholder="Password" value={partnerForm.password || ''} onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-green-500 focus:outline-none transition" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-green-300 text-sm font-bold">Selected Models: {partnerForm.allocated_models.length}</p>
                    <button onClick={() => {if(editingDistrictId) {const updatedDistricts = districts.map(d => d.id === editingDistrictId ? {...partnerForm, id: editingDistrictId} : d); setDistricts(updatedDistricts); setEditingDistrictId(null);} else {setDistricts([...districts, {...partnerForm, id: Date.now()}]); } setShowDistrictForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: [], username: '', password: ''});}} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-bold">{editingDistrictId ? 'Update' : 'Add'} District</button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: AI MODELS GRID (2 COLUMNS) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-300">📚 SELECT AI MODELS</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
                  {sortModelsByPriority(allModels).map(model => (
                    <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-green-500 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={partnerForm.allocated_models.includes(model.id)}
                        onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})}
                        className="rounded mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-green-300">{model.icon} {model.name}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* DISTRICTS LIST */}
            {districts.length > 0 && (
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 shadow-lg">
                  <h3 className="text-2xl font-bold text-white">📋 Added Districts ({districts.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {districts.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-green-500/30 hover:border-green-500 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-green-300">📍 {item.name}</h3>
                          <p className="text-green-400 text-sm font-semibold">{item.contact_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingDistrictId(item.id); setPartnerForm({...item}); setShowDistrictForm(true);}} className="bg-green-600/20 hover:bg-green-600/40 text-green-400 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setDistricts(districts.filter(d => d.id !== item.id))} className="bg-green-600/20 hover:bg-green-600/40 text-green-400 p-2 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span>📧</span>{item.email}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📱</span>{item.phone}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📍</span>{item.address}, {item.city}</div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 mt-3">
                          <p className="text-green-400 font-bold text-lg">👥 {item.members} Population</p>
                        </div>
                        <div className="text-green-400 font-bold pt-2">📚 {(item.allocated_models || []).length} models allocated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-500">
                <div className="grid grid-cols-2 gap-8">
              {/* LEFT SIDE: POLICE DETAILS */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-red-500/30 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-600 p-2 rounded-lg">
                    <span className="text-lg">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-300">Police Details</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-red-300 text-xs font-semibold mb-1">Police Department *</label>
                    <input type="text" placeholder="Enter department name" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-red-300 text-xs font-semibold mb-1">Email *</label>
                      <input type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-red-300 text-xs font-semibold mb-1">Phone *</label>
                      <input type="tel" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-red-300 text-xs font-semibold mb-1">Address *</label>
                    <input type="text" placeholder="Full address" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-red-300 text-xs font-semibold mb-1">City</label>
                      <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-red-300 text-xs font-semibold mb-1">State</label>
                      <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-red-300 text-xs font-semibold mb-1">Officers</label>
                      <input type="number" placeholder="0" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-red-300 text-xs font-semibold mb-1">Chief/Contact Name</label>
                    <input type="text" placeholder="Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-red-300 text-sm font-semibold mb-2">Contact Email</label>
                    <input type="email" placeholder="Contact email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-red-500 focus:outline-none transition" />
                  </div>
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <p className="text-red-300 text-sm font-semibold mb-3">🔐 Dashboard Login</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-red-300 text-xs font-semibold mb-1">Username *</label>
                        <input type="text" placeholder="Username" value={partnerForm.username || ''} onChange={(e) => setPartnerForm({...partnerForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-red-300 text-xs font-semibold mb-1">Password *</label>
                        <input type="password" placeholder="Password" value={partnerForm.password || ''} onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-red-500 focus:outline-none transition" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-red-300 text-sm font-bold">Selected Models: {partnerForm.allocated_models.length}</p>
                    <button onClick={() => {if(editingPoliceId) {const updatedPolice = policeOrgs.map(p => p.id === editingPoliceId ? {...partnerForm, id: editingPoliceId} : p); setPoliceOrgs(updatedPolice); setEditingPoliceId(null);} else {setPoliceOrgs([...policeOrgs, {...partnerForm, id: Date.now()}]); } setShowPoliceForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: [], username: '', password: []});}} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded font-bold">{editingPoliceId ? 'Update' : 'Add'} Police</button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: AI MODELS GRID (2 COLUMNS) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-300">📚 SELECT AI MODELS</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
                  {sortModelsByPriority(allModels).map(model => (
                    <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-red-500 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={partnerForm.allocated_models.includes(model.id)}
                        onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})}
                        className="rounded mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-300">{model.icon} {model.name}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* POLICE LIST */}
            {policeOrgs.length > 0 && (
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 shadow-lg">
                  <h3 className="text-2xl font-bold text-white">📋 Added Police ({policeOrgs.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {policeOrgs.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-red-500/30 hover:border-red-500 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-red-300">👮 {item.name}</h3>
                          <p className="text-red-400 text-sm font-semibold">{item.contact_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingPoliceId(item.id); setPartnerForm({...item}); setShowPoliceForm(true);}} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setPoliceOrgs(policeOrgs.filter(p => p.id !== item.id))} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span>📧</span>{item.email}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📱</span>{item.phone}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📍</span>{item.address}, {item.city}</div>
                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 mt-3">
                          <p className="text-red-400 font-bold text-lg">👥 {item.members} Officers</p>
                        </div>
                        <div className="text-red-400 font-bold pt-2">📚 {(item.allocated_models || []).length} models allocated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-pink-500">
                <div className="grid grid-cols-2 gap-8">
              {/* LEFT SIDE: WOMEN DETAILS */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-pink-500/30 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-600 p-2 rounded-lg">
                    <span className="text-lg">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-pink-300">Women Organization Details</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-pink-300 text-xs font-semibold mb-1">Organization Name *</label>
                    <input type="text" placeholder="Enter organization name" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-pink-300 text-xs font-semibold mb-1">Email *</label>
                      <input type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-pink-300 text-xs font-semibold mb-1">Phone *</label>
                      <input type="tel" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-pink-300 text-xs font-semibold mb-1">Address *</label>
                    <input type="text" placeholder="Full address" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-pink-300 text-xs font-semibold mb-1">City</label>
                      <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-pink-300 text-xs font-semibold mb-1">State</label>
                      <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-pink-300 text-xs font-semibold mb-1">Members</label>
                      <input type="number" placeholder="0" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-pink-300 text-xs font-semibold mb-1">Director/Contact Name</label>
                    <input type="text" placeholder="Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-pink-300 text-sm font-semibold mb-2">Contact Email</label>
                    <input type="email" placeholder="Contact email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-pink-500 focus:outline-none transition" />
                  </div>
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <p className="text-pink-300 text-sm font-semibold mb-3">🔐 Dashboard Login</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-pink-300 text-xs font-semibold mb-1">Username *</label>
                        <input type="text" placeholder="Username" value={partnerForm.username || ''} onChange={(e) => setPartnerForm({...partnerForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-pink-300 text-xs font-semibold mb-1">Password *</label>
                        <input type="password" placeholder="Password" value={partnerForm.password || ''} onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-pink-500 focus:outline-none transition" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-pink-300 text-sm font-bold">Selected Models: {partnerForm.allocated_models.length}</p>
                    <button onClick={() => {if(editingWomenId) {const updatedWomen = womenOrgs.map(w => w.id === editingWomenId ? {...partnerForm, id: editingWomenId} : w); setWomenOrgs(updatedWomen); setEditingWomenId(null);} else {setWomenOrgs([...womenOrgs, {...partnerForm, id: Date.now()}]); } setShowWomenForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: [], username: '', password: ''});}} className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded font-bold">{editingWomenId ? 'Update' : 'Add'} Women Org</button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: AI MODELS GRID (2 COLUMNS) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-pink-300">📚 SELECT AI MODELS</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
                  {sortModelsByPriority(allModels).map(model => (
                    <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-pink-500 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={partnerForm.allocated_models.includes(model.id)}
                        onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})}
                        className="rounded mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-pink-300">{model.icon} {model.name}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* WOMEN LIST */}
            {womenOrgs.length > 0 && (
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl p-4 shadow-lg">
                  <h3 className="text-2xl font-bold text-white">📋 Added Women Organizations ({womenOrgs.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {womenOrgs.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-pink-500/30 hover:border-pink-500 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-pink-300">👩 {item.name}</h3>
                          <p className="text-pink-400 text-sm font-semibold">{item.contact_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingWomenId(item.id); setPartnerForm({...item}); setShowWomenForm(true);}} className="bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setWomenOrgs(womenOrgs.filter(w => w.id !== item.id))} className="bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 p-2 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span>📧</span>{item.email}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📱</span>{item.phone}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📍</span>{item.address}, {item.city}</div>
                        <div className="bg-pink-600/20 border border-pink-500/30 rounded-lg p-3 mt-3">
                          <p className="text-pink-400 font-bold text-lg">👥 {item.members} Members</p>
                        </div>
                        <div className="text-pink-400 font-bold pt-2">📚 {(item.allocated_models || []).length} models allocated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-indigo-500">
                <div className="grid grid-cols-2 gap-8">
              {/* LEFT SIDE: OFFICE DETAILS */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-indigo-500/30 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <span className="text-lg">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-indigo-300">Office Details</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-indigo-300 text-xs font-semibold mb-1">Office Name *</label>
                    <input type="text" placeholder="Enter office name" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-indigo-300 text-xs font-semibold mb-1">Email *</label>
                      <input type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-xs font-semibold mb-1">Phone *</label>
                      <input type="tel" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-indigo-300 text-xs font-semibold mb-1">Address *</label>
                    <input type="text" placeholder="Full address" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-indigo-300 text-xs font-semibold mb-1">City</label>
                      <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-xs font-semibold mb-1">State</label>
                      <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-xs font-semibold mb-1">Employees</label>
                      <input type="number" placeholder="0" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-indigo-300 text-xs font-semibold mb-1">Manager/Contact Name</label>
                    <input type="text" placeholder="Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-indigo-300 text-sm font-semibold mb-2">Contact Email</label>
                    <input type="email" placeholder="Contact email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-indigo-500 focus:outline-none transition" />
                  </div>
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <p className="text-indigo-300 text-sm font-semibold mb-3">🔐 Dashboard Login</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-indigo-300 text-xs font-semibold mb-1">Username *</label>
                        <input type="text" placeholder="Username" value={partnerForm.username || ''} onChange={(e) => setPartnerForm({...partnerForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-indigo-300 text-xs font-semibold mb-1">Password *</label>
                        <input type="password" placeholder="Password" value={partnerForm.password || ''} onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-indigo-500 focus:outline-none transition" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-indigo-300 text-sm font-bold">Selected Models: {partnerForm.allocated_models.length}</p>
                    <button onClick={() => {if(editingOfficeId) {const updatedOffices = offices.map(o => o.id === editingOfficeId ? {...partnerForm, id: editingOfficeId} : o); setOffices(updatedOffices); setEditingOfficeId(null);} else {setOffices([...offices, {...partnerForm, id: Date.now()}]); } setShowOfficeForm(false); setPartnerForm({name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '', contact_name: '', contact_email: '', members: 0, allocated_models: [], username: '', password: ''});}} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded font-bold">{editingOfficeId ? 'Update' : 'Add'} Office</button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: AI MODELS GRID (2 COLUMNS) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-indigo-300">📚 SELECT AI MODELS</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
                  {sortModelsByPriority(allModels).map(model => (
                    <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-indigo-500 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={partnerForm.allocated_models.includes(model.id)}
                        onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})}
                        className="rounded mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-indigo-300">{model.icon} {model.name}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* OFFICES LIST */}
            {offices.length > 0 && (
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-4 shadow-lg">
                  <h3 className="text-2xl font-bold text-white">📋 Added Offices ({offices.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offices.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-indigo-500/30 hover:border-indigo-500 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-indigo-300">🏢 {item.name}</h3>
                          <p className="text-indigo-400 text-sm font-semibold">{item.contact_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingOfficeId(item.id); setPartnerForm({...item}); setShowOfficeForm(true);}} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setOffices(offices.filter(o => o.id !== item.id))} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 p-2 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span>📧</span>{item.email}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📱</span>{item.phone}</div>
                        <div className="flex items-center gap-2 text-gray-300"><span>📍</span>{item.address}, {item.city}</div>
                        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-3 mt-3">
                          <p className="text-indigo-400 font-bold text-lg">👥 {item.members} Employees</p>
                        </div>
                        <div className="text-indigo-400 font-bold pt-2">📚 {(item.allocated_models || []).length} models allocated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODELS */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">AI Medical Models</h2>
            <p className="text-gray-400 text-lg mb-6">All {allModels.length} Available AI Diagnostic Models</p>

            {/* Single Grid - All Models (Heart & ENT at top) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortModelsByPriority(allModels).map((model, index) => {
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
            <h2 className="text-3xl font-bold text-yellow-400">Settings & Profile</h2>

            {/* Vijay Profile */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
              <div className="flex items-center gap-6 mb-6">
                <img src="/logos/Vijay.jpeg" alt="Vijay" className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover" />
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">Vijay Profile</h3>
                  <p className="text-gray-400">Manage your personal details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-yellow-300 font-semibold block mb-2">Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white" />
                </div>
                <div>
                  <label className="text-yellow-300 font-semibold block mb-2">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white" />
                </div>
                <div>
                  <label className="text-yellow-300 font-semibold block mb-2">Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white" />
                </div>
                <div>
                  <label className="text-yellow-300 font-semibold block mb-2">Organization</label>
                  <input type="text" value={profile.organization} disabled className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-gray-400" />
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6 mt-6">
                <h4 className="text-lg font-bold text-yellow-400 mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-yellow-300 font-semibold block mb-2">Old Password</label>
                    <input type="password" value={profile.oldPassword} onChange={(e) => setProfile({...profile, oldPassword: e.target.value})} className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white" />
                  </div>
                  <div>
                    <label className="text-yellow-300 font-semibold block mb-2">New Password</label>
                    <input type="password" value={profile.newPassword} onChange={(e) => setProfile({...profile, newPassword: e.target.value})} className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white" />
                  </div>
                  <div>
                    <label className="text-yellow-300 font-semibold block mb-2">Confirm Password</label>
                    <input type="password" value={profile.confirmPassword} onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})} className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white" />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => alert('Profile updated successfully!')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold">Save Changes</button>
                  <button onClick={() => alert('Password changed successfully!')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold">Update Password</button>
                </div>
              </div>
            </div>

            {/* LOGOUT SECTION */}
            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg shadow-lg p-8 border-l-4 border-red-500">
              <div className="flex items-center gap-6 mb-6">
                <div className="bg-red-600 p-4 rounded-full">
                  <LogOut size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-300">Logout</h3>
                  <p className="text-red-200">Sign out of your account</p>
                </div>
              </div>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition">
                Logout Now
              </button>
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
