import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, Copy, CheckCircle, Building2, Users, BarChart3, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MASTERCHECK_MODULES } from '../data/modules';
import { AI_MODELS, WORKING_MODELS, getModelsByModule } from '../data/models';
import ModelDiagnosticChatbot from './ModelDiagnosticChatbotClean';

const MasterCheckAIDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [organizations, setOrganizations] = useState({});
  const [subscribedModels, setSubscribedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);
  const [showForms, setShowForms] = useState({});
  const [editingIds, setEditingIds] = useState({});
  const [selectedModel, setSelectedModel] = useState(null);
  const tabsRef = React.useRef(null);
  const [partnerForm, setPartnerForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
    contact_name: '', contact_email: '', members: 0, allocated_models: [],
    username: '', password: ''
  });

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        tabsRef.current.scrollLeft -= scrollAmount;
      } else {
        tabsRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const navigate = useNavigate();
  const allModels = AI_MODELS;
  const orgName = 'MASTERCHECK AI';

  useEffect(() => {
    const initOrgs = {};
    MASTERCHECK_MODULES.forEach(module => {
      initOrgs[module.id] = [];
    });
    setOrganizations(initOrgs);
    setSubscribedModels(allModels.map(m => m.id));
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('orgId');
    localStorage.removeItem('orgToken');
    localStorage.removeItem('masterCheckToken');
    localStorage.removeItem('adminToken');
    navigate('/mastercheckAI/login');
  };

  const handleAddOrg = (moduleId) => {
    if (!partnerForm.name || !partnerForm.email) {
      alert('Please fill required fields');
      return;
    }

    const existingOrgs = organizations[moduleId] || [];
    if (editingIds[moduleId]) {
      const updated = existingOrgs.map(o => o.id === editingIds[moduleId] ? {...partnerForm, id: editingIds[moduleId]} : o);
      setOrganizations({...organizations, [moduleId]: updated});
      setEditingIds({...editingIds, [moduleId]: null});
    } else {
      setOrganizations({...organizations, [moduleId]: [...existingOrgs, {...partnerForm, id: Date.now()}]});
    }

    setShowForms({...showForms, [moduleId]: false});
    setPartnerForm({
      name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
      contact_name: '', contact_email: '', members: 0, allocated_models: [],
      username: '', password: ''
    });
  };

  const handleEditOrg = (moduleId, org) => {
    setEditingIds({...editingIds, [moduleId]: org.id});
    setPartnerForm(org);
    setShowForms({...showForms, [moduleId]: true});
  };

  const handleDeleteOrg = (moduleId, orgId) => {
    const updated = organizations[moduleId].filter(o => o.id !== orgId);
    setOrganizations({...organizations, [moduleId]: updated});
  };

  const OrgForm = ({ module }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-yellow-500">
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-yellow-500/30">
          <div className="space-y-3">
            <input type="text" placeholder="Organization Name" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
            <div className="grid grid-cols-2 gap-2">
              <input type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
              <input type="tel" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
            </div>
            <input type="text" placeholder="Address" value={partnerForm.address} onChange={(e) => setPartnerForm({...partnerForm, address: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" placeholder="City" value={partnerForm.city} onChange={(e) => setPartnerForm({...partnerForm, city: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
              <input type="text" placeholder="State" value={partnerForm.state} onChange={(e) => setPartnerForm({...partnerForm, state: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
              <input type="number" placeholder="Members" value={partnerForm.members} onChange={(e) => setPartnerForm({...partnerForm, members: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
            </div>
            <input type="text" placeholder="Contact Name" value={partnerForm.contact_name} onChange={(e) => setPartnerForm({...partnerForm, contact_name: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
            <input type="email" placeholder="Contact Email" value={partnerForm.contact_email} onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
            <div className="border-t border-gray-600 pt-3 mt-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Username" value={partnerForm.username} onChange={(e) => setPartnerForm({...partnerForm, username: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
                <input type="password" placeholder="Password" value={partnerForm.password} onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:border-yellow-500 focus:outline-none transition" />
              </div>
            </div>
            <button onClick={() => handleAddOrg(module.id)} className="w-full text-white px-4 py-3 rounded font-bold transition bg-yellow-600 hover:bg-yellow-700">
              {editingIds[module.id] ? 'Update' : 'Add'} Organization
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-yellow-300">📚 SELECT AI MODELS</h3>
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600">
            {getModelsByModule(module.id).map(model => (
              <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-500 hover:border-yellow-500 cursor-pointer transition">
                <input type="checkbox" checked={partnerForm.allocated_models.includes(model.id)} onChange={(e) => setPartnerForm({...partnerForm, allocated_models: e.target.checked ? [...partnerForm.allocated_models, model.id] : partnerForm.allocated_models.filter(m => m !== model.id)})} className="rounded mt-1" />
                <p className="text-sm font-bold text-gray-300">{model.icon} {model.name}</p>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const OrgList = ({ module }) => {
    const moduleOrgs = organizations[module.id] || [];
    if (moduleOrgs.length === 0) return null;

    return (
      <div className="space-y-6 mt-8">
        <div className="rounded-xl p-4 shadow-lg bg-gradient-to-r from-yellow-600 to-yellow-700">
          <h3 className="text-2xl font-bold text-white">📋 Added Organizations ({moduleOrgs.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moduleOrgs.map(item => (
            <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-yellow-500/20 hover:shadow-2xl transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400">{item.name}</h3>
                  <p className="text-gray-400 text-sm font-semibold">{item.contact_name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditOrg(module.id, item)} className="p-2 rounded-lg transition bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteOrg(module.id, item.id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>📧 {item.email}</div>
                <div>📱 {item.phone}</div>
                <div>📍 {item.address}, {item.city}</div>
                <div className="mt-3 p-3 rounded-lg bg-yellow-600/10 border border-yellow-500/20">
                  <p className="font-bold text-lg text-yellow-400">👥 {item.members} Members</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
                <h1 className="text-4xl font-bold text-yellow-400">{orgName}</h1>
                <p className="text-yellow-300">AI-Driven Early Disease Detection & Identification</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/logos/Macvaar.jpg" alt="Macvaar AI" className="h-12 w-12 rounded-full border-2 border-yellow-500 object-cover" />
                <div className="text-right">
                  <p className="text-xs text-yellow-300">Powered by</p>
                  <p className="text-sm font-bold text-yellow-400">MacvaarAI</p>
                  <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded mt-1 transition">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="bg-gray-800 border-b-2 border-yellow-500 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2">
          <button onClick={() => scrollTabs('left')} className="text-yellow-400 hover:text-yellow-300 font-bold text-xl px-2 py-4">&lt;</button>
          <div ref={tabsRef} className="flex gap-4 overflow-x-auto" style={{scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none'}}>
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-4 border-b-3 font-bold transition whitespace-nowrap ${activeTab === 'dashboard' ? 'border-yellow-500 text-yellow-400 bg-gray-700' : 'border-transparent text-gray-400 hover:text-yellow-400'}`}>
              Dashboard
            </button>
            {MASTERCHECK_MODULES.map(module => (
              <button key={module.id} onClick={() => setActiveTab(module.id)} className={`px-4 py-4 border-b-3 font-bold transition whitespace-nowrap ${activeTab === module.id ? 'border-yellow-500 text-yellow-400 bg-gray-700' : 'border-transparent text-gray-400 hover:text-yellow-400'}`}>
                {module.title.split(' ')[0]}
              </button>
            ))}
            <button onClick={() => setActiveTab('models')} className={`px-4 py-4 border-b-3 font-bold transition whitespace-nowrap ${activeTab === 'models' ? 'border-yellow-500 text-yellow-400 bg-gray-700' : 'border-transparent text-gray-400 hover:text-yellow-400'}`}>
              Models
            </button>
          </div>
          <button onClick={() => scrollTabs('right')} className="text-yellow-400 hover:text-yellow-300 font-bold text-xl px-2 py-4">&gt;</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-yellow-400">Government Health Statistics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
                <Building2 size={40} className="mb-2 text-blue-400" />
                <p className="text-sm text-gray-300">Healthcare Modules</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{MASTERCHECK_MODULES.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-cyan-500">
                <Users size={40} className="mb-2 text-cyan-400" />
                <p className="text-sm text-gray-300">AI Agents</p>
                <p className="text-4xl font-bold text-cyan-400 mt-2">{MASTERCHECK_MODULES.reduce((sum, m) => sum + m.aiAgents.length, 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
                <Zap size={40} className="mb-2 text-yellow-400" />
                <p className="text-sm text-gray-300">AI Models</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{allModels.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-lg border-l-4 border-orange-500">
                <Users size={40} className="mb-2 text-orange-400" />
                <p className="text-sm text-gray-300">Total Orgs</p>
                <p className="text-4xl font-bold text-orange-400 mt-2">{Object.values(organizations).reduce((sum, orgs) => sum + orgs.length, 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* MODELS SECTION */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">AI Medical Models</h2>
            <p className="text-gray-400 text-lg mb-6">All {WORKING_MODELS.length} Available AI Diagnostic Models</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WORKING_MODELS.map((model, index) => {
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

        {/* SETTINGS SECTION */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-yellow-400">⚙️ Settings</h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border border-yellow-500/20">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Organization Settings</h3>
                  <p className="text-gray-400">Organization: <span className="text-yellow-300 font-bold">{orgName}</span></p>
                  <p className="text-gray-400">Total Modules: <span className="text-yellow-300 font-bold">{MASTERCHECK_MODULES.length}</span></p>
                  <p className="text-gray-400">Total AI Models: <span className="text-yellow-300 font-bold">{AI_MODELS.length}</span></p>
                </div>
                <hr className="border-gray-600" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Quick Actions</h3>
                  <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE VIEWS */}
        {MASTERCHECK_MODULES.map(module => (
          activeTab === module.id && (
            <div key={module.id} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-yellow-400">{module.icon} {module.title}</h2>
                {module.id !== 'state' && module.id !== 'district' && (
                  <button onClick={() => {setShowForms({...showForms, [module.id]: !showForms[module.id]}); if(editingIds[module.id]) setEditingIds({...editingIds, [module.id]: null});}} className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-bold">
                    <Plus size={20} /> Add Organization
                  </button>
                )}
              </div>

              <p className="text-gray-400 text-lg">{module.description}</p>

              {module.id === 'state' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-blue-500">
                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">🏛️ State AI Dashboard</h3>
                    <p className="text-gray-400 mb-4 text-sm">Designed for: <span className="text-yellow-300 font-semibold">Chief Minister, Health Secretary, NHM, TNHSP</span></p>
                    <p className="text-gray-400 mb-6">High-level state health governance and surveillance across all districts and healthcare organizations.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-900 p-4 rounded-lg border border-blue-500/30">
                        <p className="text-gray-400 text-sm">Total Organizations</p>
                        <p className="text-3xl font-bold text-blue-400 mt-2">{Object.values(organizations).reduce((sum, orgs) => sum + orgs.length, 0)}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-green-500/30">
                        <p className="text-gray-400 text-sm">Active Modules</p>
                        <p className="text-3xl font-bold text-green-400 mt-2">{MASTERCHECK_MODULES.length}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/30">
                        <p className="text-gray-400 text-sm">AI Agents</p>
                        <p className="text-3xl font-bold text-purple-400 mt-2">{MASTERCHECK_MODULES.reduce((sum, m) => sum + m.aiAgents.length, 0)}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-orange-500/30">
                        <p className="text-gray-400 text-sm">AI Models</p>
                        <p className="text-3xl font-bold text-orange-400 mt-2">{WORKING_MODELS.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500/30">
                    <h4 className="text-xl font-bold text-yellow-300 mb-4">📋 AI Modules for State Governance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-white font-bold">🗺️ Disease Heat Map AI</p>
                        <p className="text-gray-400 text-sm mt-1">Geographic disease distribution mapping</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-500">
                        <p className="text-white font-bold">🔬 Cancer Surveillance AI</p>
                        <p className="text-gray-400 text-sm mt-1">Cancer tracking and prevention initiatives</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-white font-bold">📊 NCD Dashboard AI</p>
                        <p className="text-gray-400 text-sm mt-1">Non-communicable disease tracking</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-cyan-500">
                        <p className="text-white font-bold">🎓 School Health Dashboard</p>
                        <p className="text-gray-400 text-sm mt-1">School-level health metrics</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-pink-500">
                        <p className="text-white font-bold">👩‍⚕️ Women's Health Dashboard</p>
                        <p className="text-gray-400 text-sm mt-1">Maternal and women health status</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-white font-bold">🌾 Rural Health Dashboard</p>
                        <p className="text-gray-400 text-sm mt-1">Rural area health indicators</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-white font-bold">🥗 Nutrition Dashboard</p>
                        <p className="text-gray-400 text-sm mt-1">Nutritional status tracking</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-600">
                        <p className="text-white font-bold">🚨 Emergency Alert AI</p>
                        <p className="text-gray-400 text-sm mt-1">Real-time emergency response</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-purple-500">
                        <p className="text-white font-bold">🏆 District Ranking AI</p>
                        <p className="text-gray-400 text-sm mt-1">Performance comparison across districts</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-indigo-500">
                        <p className="text-white font-bold">📈 Predictive Disease Outbreak AI</p>
                        <p className="text-gray-400 text-sm mt-1">Disease outbreak forecasting</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {module.id === 'district' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-purple-500">
                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">🌍 District AI</h3>
                    <p className="text-gray-400 mb-4 text-sm">Designed for: <span className="text-yellow-300 font-semibold">District Collectors & District Health Officers</span></p>
                    <p className="text-gray-400 mb-6">District-level health management and coordination across all health facilities, schools, and organizations.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/30">
                        <p className="text-gray-400 text-sm">District Organizations</p>
                        <p className="text-3xl font-bold text-purple-400 mt-2">{Object.values(organizations).reduce((sum, orgs) => sum + orgs.length, 0)}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-cyan-500/30">
                        <p className="text-gray-400 text-sm">Health Facilities</p>
                        <p className="text-3xl font-bold text-cyan-400 mt-2">{Object.values(organizations).reduce((sum, orgs) => sum + orgs.length, 0)}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-green-500/30">
                        <p className="text-gray-400 text-sm">Active Programs</p>
                        <p className="text-3xl font-bold text-green-400 mt-2">{MASTERCHECK_MODULES.length - 2}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-yellow-500/30">
                        <p className="text-gray-400 text-sm">Coverage</p>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">85%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500/30">
                    <h4 className="text-xl font-bold text-yellow-300 mb-4">📋 AI Agents for District Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-white font-bold">👥 Population Health AI</p>
                        <p className="text-gray-400 text-sm mt-1">District population health metrics</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-white font-bold">🔍 Disease Surveillance AI</p>
                        <p className="text-gray-400 text-sm mt-1">Disease tracking and monitoring</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-500">
                        <p className="text-white font-bold">🔬 Cancer Screening AI</p>
                        <p className="text-gray-400 text-sm mt-1">Cancer detection programs</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-pink-500">
                        <p className="text-white font-bold">❤️ Cardiovascular AI</p>
                        <p className="text-gray-400 text-sm mt-1">Heart disease management</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-white font-bold">⚕️ NCD AI</p>
                        <p className="text-gray-400 text-sm mt-1">Chronic disease management</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-white font-bold">🥗 Nutrition AI</p>
                        <p className="text-gray-400 text-sm mt-1">Nutritional interventions</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-green-600">
                        <p className="text-white font-bold">🌾 Rural Screening AI</p>
                        <p className="text-gray-400 text-sm mt-1">Village health camps</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-600">
                        <p className="text-white font-bold">🎓 School Health AI</p>
                        <p className="text-gray-400 text-sm mt-1">School children health</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-cyan-500">
                        <p className="text-white font-bold">👶 Maternal Health AI</p>
                        <p className="text-gray-400 text-sm mt-1">Mother and child health</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-purple-500">
                        <p className="text-white font-bold">🚑 Mobile Medical Unit AI</p>
                        <p className="text-gray-400 text-sm mt-1">Mobile clinic operations</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-indigo-500">
                        <p className="text-white font-bold">📊 District Analytics AI</p>
                        <p className="text-gray-400 text-sm mt-1">Data analysis and insights</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-600">
                        <p className="text-white font-bold">🏥 Hospital Performance AI</p>
                        <p className="text-gray-400 text-sm mt-1">Hospital quality metrics</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-pink-600">
                        <p className="text-white font-bold">🔗 Referral Management AI</p>
                        <p className="text-gray-400 text-sm mt-1">Patient referral tracking</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-teal-500">
                        <p className="text-white font-bold">📱 Telemedicine AI</p>
                        <p className="text-gray-400 text-sm mt-1">Remote consultation services</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p className="text-white font-bold">📦 Resource Allocation AI</p>
                        <p className="text-gray-400 text-sm mt-1">Healthcare resource planning</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {module.id !== 'state' && module.id !== 'district' && (
                <>
                  {showForms[module.id] && <OrgForm module={module} />}
                  {<OrgList module={module} />}
                </>
              )}
            </div>
          )
        ))}
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

export default MasterCheckAIDashboard;
