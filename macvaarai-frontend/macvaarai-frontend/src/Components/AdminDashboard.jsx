import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Settings, MessageSquare, BarChart3, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrganizationRegistration from './OrganizationRegistration';
import HospitalManagement from './HospitalManagement';
import OrganizationManagement from './OrganizationManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [models, setModels] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newOrgForm, setNewOrgForm] = useState({ name: '', email: '', phone: '', city: '', state: '' });
  const [newHospitalForm, setNewHospitalForm] = useState({ name: '', email: '', phone: '', city: '', state: '', beds_total: 0, organization_id: null });
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(null);
  const [ticketResolution, setTicketResolution] = useState('');
  const [editingModel, setEditingModel] = useState(null);
  const [editModelForm, setEditModelForm] = useState({ id: '', name: '', desc: '', input: '', output: '', type: '', price: '$$$$$' });
  const [showModelForm, setShowModelForm] = useState(false);
  const [allModels, setAllModels] = useState([
    { id: 1, name: '👁️ Eye Disease Detection AI', desc: 'Diabetic retinopathy detection', input: 'Retinal Image', output: 'DR / No DR', type: 'Binary Classification', price: '$$$$$', status: 'Active' },
    { id: 2, name: '🦠 COVID-19 Detection AI', desc: 'Chest X-ray analysis', input: 'Chest X-ray', output: 'COVID / Normal / Pneumonia', type: 'Multi-class Classification', price: '$$$$$', status: 'Active' },
    { id: 3, name: '🩹 Skin Cancer Detection AI', desc: 'Lesion classification', input: 'Skin Image', output: 'Melanoma / Benign / Basal Cell', type: 'Multi-class Classification', price: '$$$$$', status: 'Active' },
    { id: 4, name: '💉 Diabetes Prediction AI', desc: 'Diabetes risk assessment', input: 'Medical Data', output: 'Diabetic / Pre-diabetic / Normal', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 5, name: '🫁 Pneumonia Detection AI', desc: 'Pneumonia detection', input: 'Chest X-ray', output: 'Pneumonia / Normal / Viral', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 6, name: '🦟 Malaria Detection AI', desc: 'Blood smear analysis', input: 'Blood Smear Image', output: 'Infected / Uninfected', type: 'Binary Classification', price: '$$$$$', status: 'Active' },
    { id: 7, name: '🦟 Dengue Detection AI', desc: 'Dengue virus detection', input: 'Blood Test', output: 'Dengue / Non-Dengue', type: 'Binary Classification', price: '$$$$$', status: 'Active' },
    { id: 8, name: '👂 Ear Infection Detection AI', desc: 'Ear infection detection', input: 'Ear Image', output: 'Infected / Healthy / Inflamed', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 9, name: '👃 Nasal Polyp Detection AI', desc: 'Nasal abnormality detection', input: 'Nasal Image', output: 'Polyp Detected / Normal / Deviated Septum', type: 'Detection', price: '$$$$$', status: 'Active' },
    { id: 10, name: '🗣️ Throat Analysis AI', desc: 'Throat disease detection', input: 'Throat Image', output: 'Normal / Infected / Inflamed', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 11, name: '🦷 Oral Cancer Detection AI', desc: 'Oral cancer detection', input: 'Mouth Image', output: 'Cancer / Benign / Suspicious', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 12, name: '🗣️ Pharyngitis Detection AI', desc: 'Throat infection detection', input: 'Throat Image', output: 'Bacterial / Viral / Normal', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 13, name: '🔬 Colorectal Cancer AI', desc: 'Tissue classification', input: 'Histopathology Image', output: 'Polyp / Normal / Suspicious', type: 'Detection', price: '$$$$$', status: 'Active' },
    { id: 14, name: '🫁 Lung Disease Detection AI', desc: 'Lung nodule detection', input: 'Chest Image', output: 'Nodule / Normal / Suspicious', type: 'Detection', price: '$$$$$', status: 'Active' },
    { id: 15, name: '❤️ 1-Lead ECG AI', desc: 'Single-lead ECG analysis', input: '1-Lead ECG', output: 'Normal / Abnormal / Arrhythmia', type: 'Classification', price: '$$$$$', status: 'Active' },
    { id: 16, name: '❤️ 12-Lead ECG AI', desc: 'Comprehensive ECG analysis', input: '12-Lead ECG', output: 'Normal / Abnormal / Arrhythmia', type: 'Classification', price: '$$$$$', status: 'Active' }
  ]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin';

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const endpoints = [
        `/admin/dashboard`,
        `/admin/organizations`,
        `/admin/hospitals`,
        `/admin/models`,
        `/admin/support-tickets`,
        `/admin/feedback`
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(`${apiUrl}${endpoint}`).then(r => r.json()))
      );

      if (responses[0].status === 'success') setStats(responses[0].statistics || {});
      if (responses[1].status === 'success') setOrganizations(responses[1].organizations || []);
      if (responses[2].status === 'success') setHospitals(responses[2].hospitals || []);
      if (responses[3].status === 'success') setModels(responses[3].models || []);
      if (responses[4].status === 'success') setTickets(responses[4].tickets || []);
      if (responses[5].status === 'success') setFeedback(responses[5].feedback || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    if (!newOrgForm.name || !newOrgForm.email) {
      alert('Please fill required fields');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/admin/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrgForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Organization "${newOrgForm.name}" created!\n\nToken: ${data.token}\n\nShare this token with the organization owner.`);
        setNewOrgForm({ name: '', email: '', phone: '', city: '', state: '' });
        setShowOrgForm(false);
        fetchAllData();
      } else {
        alert('Error: ' + (data.message || 'Failed to create organization'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCreateHospital = async (e) => {
    e.preventDefault();
    if (!newHospitalForm.name || !newHospitalForm.email) {
      alert('Please fill required fields');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/admin/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHospitalForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Hospital "${newHospitalForm.name}" created!\n\nAccess Code: ${data.access_code}`);
        setNewHospitalForm({ name: '', email: '', phone: '', city: '', state: '', beds_total: 0, organization_id: null });
        setShowHospitalForm(false);
        fetchAllData();
      } else {
        alert('Error: ' + (data.message || 'Failed to create hospital'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEditModel = (model) => {
    setEditingModel(model.id);
    setEditModelForm({
      id: model.id,
      name: model.name,
      desc: model.desc,
      input: model.input,
      output: model.output,
      type: model.type,
      price: model.price
    });
    setShowModelForm(true);
  };

  const handleSaveModel = async () => {
    if (!editModelForm.name || !editModelForm.price) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const updatedModels = allModels.map(m =>
        m.id === editingModel ? { ...m, ...editModelForm, status: 'Active' } : m
      );
      setAllModels(updatedModels);
      alert('✅ Model updated successfully!');
      setShowModelForm(false);
      setEditingModel(null);
      setEditModelForm({ id: '', name: '', desc: '', input: '', output: '', type: '', price: '$$$$$' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteModel = (modelId) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        const updatedModels = allModels.filter(m => m.id !== modelId);
        setAllModels(updatedModels);
        alert('✅ Model deleted successfully!');
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const handleResolveTicket = async () => {
    if (!ticketResolution.trim()) {
      alert('Please enter resolution details');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/admin/support-tickets/${showTicketDetails.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution: ticketResolution })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Ticket resolved successfully');
        setShowTicketDetails(null);
        setTicketResolution('');
        fetchAllData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="http://localhost:8000/LOGO/Macvaar.jpg"
              alt="MacvaarAI"
              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 className="text-3xl font-bold">MacvaarAI Admin Panel</h1>
              <p className="text-blue-100">Welcome, {adminName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex gap-1 px-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'organizations', label: 'Organizations', icon: Settings },
            { id: 'hospitals', label: 'Hospitals', icon: Zap },
            { id: 'models', label: 'AI Models', icon: Settings },
            { id: 'support', label: 'Support', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold border-b-2 transition flex items-center gap-2 ${activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading && <div className="text-center py-8 text-gray-600">Loading...</div>}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && !loading && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_organizations || 0}</div>
                <div className="text-blue-100 mt-2">Organizations</div>
              </div>
              <div className="bg-green-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_hospitals || 0}</div>
                <div className="text-green-100 mt-2">Hospitals</div>
              </div>
              <div className="bg-purple-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.total_patients || 0}</div>
                <div className="text-purple-100 mt-2">Patients</div>
              </div>
              <div className="bg-orange-600 text-white p-6 rounded-lg shadow">
                <div className="text-4xl font-bold">{stats.open_support_tickets || 0}</div>
                <div className="text-orange-100 mt-2">Open Tickets</div>
              </div>
            </div>
          </div>
        )}

        {/* ORGANIZATIONS TAB */}
        {activeTab === 'organizations' && !loading && (
          <OrganizationManagement />
        )}

        {/* HOSPITALS TAB */}
        {activeTab === 'hospitals' && !loading && (
          <HospitalManagement />
        )}

        {/* MODELS TAB */}
        {activeTab === 'models' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">🤖 All AI Diagnostic Models (18 Premium)</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-b-2 border-blue-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">#</th>
                    <th className="px-4 py-3 text-left font-bold">Model Name</th>
                    <th className="px-4 py-3 text-left font-bold">Description</th>
                    <th className="px-4 py-3 text-left font-bold">📥 Input Type</th>
                    <th className="px-4 py-3 text-left font-bold">📤 Output Labels</th>
                    <th className="px-4 py-3 text-left font-bold">Model Type</th>
                    <th className="px-4 py-3 text-left font-bold">💰 Price</th>
                    <th className="px-4 py-3 text-left font-bold">Status</th>
                    <th className="px-4 py-3 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allModels.map((model) => (
                    <tr key={model.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-bold text-gray-900 bg-gray-50">{model.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{model.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{model.desc}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">{model.input}</span></td>
                      <td className="px-4 py-3 text-gray-700 text-xs"><span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">{model.output}</span></td>
                      <td className="px-4 py-3 text-gray-700 text-xs"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">{model.type}</span></td>
                      <td className="px-4 py-3 font-bold text-orange-600 text-lg">{model.price}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">✓ {model.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditModel(model)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Edit</button>
                          <button onClick={() => handleDeleteModel(model.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-4">💎 Premium Model Collection</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-orange-600 shadow">
                  <p className="text-gray-600 font-semibold text-sm">Total Models</p>
                  <p className="text-4xl font-bold text-orange-600 mt-2">18</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600 shadow">
                  <p className="text-gray-600 font-semibold text-sm">All Premium ($$$$$)</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">18</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-600 shadow">
                  <p className="text-gray-600 font-semibold text-sm">Free Models</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600 shadow">
                  <p className="text-gray-600 font-semibold text-sm">Status</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">All Active ✓</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">📊 Model Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded border-l-4 border-red-500"><p className="text-xs font-bold text-gray-700">Image Classification</p><p className="text-2xl font-bold text-red-600 mt-1">12</p></div>
                <div className="bg-white p-3 rounded border-l-4 border-blue-500"><p className="text-xs font-bold text-gray-700">Detection Models</p><p className="text-2xl font-bold text-blue-600 mt-1">3</p></div>
                <div className="bg-white p-3 rounded border-l-4 border-green-500"><p className="text-xs font-bold text-gray-700">Prediction Models</p><p className="text-2xl font-bold text-green-600 mt-1">2</p></div>
                <div className="bg-white p-3 rounded border-l-4 border-purple-500"><p className="text-xs font-bold text-gray-700">Multi-class Models</p><p className="text-2xl font-bold text-purple-600 mt-1">5</p></div>
              </div>
            </div>

            {showModelForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Edit Model</h3>
                    <button onClick={() => setShowModelForm(false)}><X size={24} className="text-gray-600 hover:text-gray-900" /></button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Model Name</label>
                      <input type="text" value={editModelForm.name} onChange={(e) => setEditModelForm({...editModelForm, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                      <input type="text" value={editModelForm.desc} onChange={(e) => setEditModelForm({...editModelForm, desc: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Input Type</label>
                        <input type="text" value={editModelForm.input} onChange={(e) => setEditModelForm({...editModelForm, input: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Model Type</label>
                        <input type="text" value={editModelForm.type} onChange={(e) => setEditModelForm({...editModelForm, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Output Labels</label>
                      <textarea value={editModelForm.output} onChange={(e) => setEditModelForm({...editModelForm, output: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900" rows="3" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                      <select value={editModelForm.price} onChange={(e) => setEditModelForm({...editModelForm, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900">
                        <option value="$">$</option>
                        <option value="$$">$$</option>
                        <option value="$$$">$$$</option>
                        <option value="$$$$">$$$$</option>
                        <option value="$$$$$">$$$$$ (Premium)</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSaveModel} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">Save Changes</button>
                      <button onClick={() => setShowModelForm(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && !loading && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Support & Feedback</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Support Tickets ({tickets.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tickets.length === 0 ? (
                    <p className="text-gray-600">No support tickets</p>
                  ) : (
                    tickets.map(ticket => (
                      <div key={ticket.id} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowTicketDetails(ticket)}>
                        <h4 className="font-bold text-gray-900 text-sm">{ticket.subject}</h4>
                        <p className="text-gray-600 text-xs">Status: <span className={`font-semibold ${ticket.status === 'open' ? 'text-red-600' : 'text-green-600'}`}>{ticket.status}</span></p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Feedback ({feedback.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {feedback.length === 0 ? (
                    <p className="text-gray-600">No feedback</p>
                  ) : (
                    feedback.map(item => (
                      <div key={item.id} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
                        <h4 className="font-bold text-gray-900 text-sm">{item.subject}</h4>
                        <p className="text-gray-600 text-xs">Rating: {item.rating ? '⭐'.repeat(item.rating) : 'N/A'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {showTicketDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{showTicketDetails.subject}</h3>
                    <button onClick={() => setShowTicketDetails(null)}><X size={24} /></button>
                  </div>
                  <p className="text-gray-600 mb-4">{showTicketDetails.description}</p>
                  <p className="text-gray-600 text-sm mb-4">Status: <span className={`font-semibold ${showTicketDetails.status === 'open' ? 'text-red-600' : 'text-green-600'}`}>{showTicketDetails.status}</span></p>
                  {showTicketDetails.status === 'open' && (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Enter resolution..."
                        value={ticketResolution}
                        onChange={(e) => setTicketResolution(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                        rows="4"
                      />
                      <button onClick={handleResolveTicket} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Resolve Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HIDE OLD CONTENT */}
        <div style={{display: 'none'}}>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">2. COVID-19 Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Analyzes chest X-rays to detect COVID-19 infections</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Chest X-ray</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">3. ECG Analysis</h4>
                  <p className="text-gray-600 text-sm mt-1">Analyzes heart rhythm patterns from ECG tracings</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>ECG Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">4. Skin Cancer Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Identifies skin cancer and lesion classification</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Lesion Photo</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">5. Tuberculosis Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Detects tuberculosis from chest radiographs</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Chest X-ray</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">6. Throat Analysis</h4>
                  <p className="text-gray-600 text-sm mt-1">Analyzes throat images for disease detection</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Throat Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">7. Lung Disease Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Detects lung nodules and cancer indicators</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Chest Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">8. Colorectal Cancer Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Identifies colorectal polyps and abnormalities</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Endoscopy Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Detection</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">4. Diabetes Prediction</h4>
                  <p className="text-gray-600 text-sm mt-1">Predicts diabetes risk based on medical indicators</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Medical Data</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Prediction</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">11. Pneumonia Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Detects pneumonia from chest X-rays</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Chest X-ray</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">12. Malaria Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Identifies malaria parasites from blood smears</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Blood Smear</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">13. Dengue Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Detects dengue virus from blood tests</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Blood Test</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">8. Ear Infection Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Identifies ear infections and inflammation</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Ear Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">16. Nasal Polyp Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Detects nasal polyps and abnormalities</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Nasal Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Detection</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">17. Oral Cancer Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Identifies oral cancer and lesions</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Mouth Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 text-lg">18. Pharyngitis Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">Detects pharyngitis and throat infections</p>
                  <div className="grid grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div><p className="font-semibold text-gray-700">Input</p><p>Throat Image</p></div>
                    <div><p className="font-semibold text-gray-700">Type</p><p>Classification</p></div>
                    <div><p className="font-semibold text-gray-700">Price</p><p>$$</p></div>
                    <div><p className="font-semibold text-gray-700">Status</p><p className="text-green-600">Active</p></div>
                  </div>
                </div>
        </div>
        {/* End of hidden old content */}
      </div>
    </div>
  );
};

export default AdminDashboard;
