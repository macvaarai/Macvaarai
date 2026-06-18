import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Settings, MessageSquare, BarChart3, Users, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [models, setModels] = useState([]);
  const [purchasedModels, setPurchasedModels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newHospitalForm, setNewHospitalForm] = useState({ name: '', email: '', phone: '', city: '', state: '', beds_total: 0 });
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showModelMarketplace, setShowModelMarketplace] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const navigate = useNavigate();
  const orgName = localStorage.getItem('orgName') || 'Organization';
  const orgToken = localStorage.getItem('orgToken');

  useEffect(() => {
    if (!orgToken) {
      navigate('/org-admin/login');
      return;
    }
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch organization data
      const [hospitalsRes, modelsRes] = await Promise.all([
        fetch(`${apiUrl}/admin/hospitals?org_id=1`),
        fetch(`${apiUrl}/admin/models`)
      ]);

      const hospitalsData = await hospitalsRes.json();
      const modelsData = await modelsRes.json();

      if (hospitalsData.status === 'success') {
        setHospitals(hospitalsData.hospitals || []);
      }
      if (modelsData.status === 'success') {
        setModels(modelsData.models || []);
      }

      // Set basic stats
      setStats({
        total_hospitals: hospitalsData.hospitals?.length || 0,
        total_patients: 0,
        available_models: 18,
        purchased_models: purchasedModels.length
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ ...newHospitalForm, organization_id: 1 })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Hospital "${newHospitalForm.name}" created!\n\nAccess Code: ${data.access_code}`);
        setNewHospitalForm({ name: '', email: '', phone: '', city: '', state: '', beds_total: 0 });
        setShowHospitalForm(false);
        fetchAllData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handlePurchaseModel = async (model) => {
    try {
      // Simulate purchase
      const purchaseData = {
        model_id: model.id,
        purchase_date: new Date().toISOString(),
        price: model.price
      };

      setPurchasedModels([...purchasedModels, purchaseData]);
      alert(`Successfully purchased: ${model.name}\n\nPrice: ₹${model.price?.toLocaleString() || '50,000'}`);
      setSelectedModel(null);
      fetchAllData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/org-admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="http://localhost:8000/LOGO/Macvaar.jpg"
              alt="Organization"
              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 className="text-3xl font-bold">{orgName} Portal</h1>
              <p className="text-green-100">Organization Management Dashboard</p>
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
            { id: 'hospitals', label: 'Hospitals', icon: Users },
            { id: 'models', label: 'AI Models', icon: ShoppingCart },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold border-b-2 transition flex items-center gap-2 ${activeTab === tab.id ? 'text-green-600 border-green-600' : 'text-gray-600 border-transparent hover:text-green-600'}`}
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
              <div className="bg-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-4xl font-bold">{stats.total_hospitals || 0}</div>
                <div className="text-green-100 mt-2">Hospitals</div>
              </div>
              <div className="bg-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-4xl font-bold">{purchasedModels.length}</div>
                <div className="text-blue-100 mt-2">Models Purchased</div>
              </div>
              <div className="bg-purple-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-4xl font-bold">{stats.available_models || 18}</div>
                <div className="text-purple-100 mt-2">Available Models</div>
              </div>
              <div className="bg-orange-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-4xl font-bold">{stats.total_patients || 0}</div>
                <div className="text-orange-100 mt-2">Total Patients</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setShowHospitalForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                  <Plus size={20} />
                  Add Hospital
                </button>
                <button
                  onClick={() => setShowModelMarketplace(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                  <ShoppingCart size={20} />
                  Purchase Models
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                  <BarChart3 size={20} />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOSPITALS TAB */}
        {activeTab === 'hospitals' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Hospitals</h2>
              <button
                onClick={() => setShowHospitalForm(!showHospitalForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition">
                <Plus size={20} />
                Add Hospital
              </button>
            </div>

            {showHospitalForm && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Create New Hospital</h3>
                  <button onClick={() => setShowHospitalForm(false)}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateHospital} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Hospital Name *"
                      value={newHospitalForm.name}
                      onChange={(e) => setNewHospitalForm({...newHospitalForm, name: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={newHospitalForm.email}
                      onChange={(e) => setNewHospitalForm({...newHospitalForm, email: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newHospitalForm.phone}
                      onChange={(e) => setNewHospitalForm({...newHospitalForm, phone: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
                    />
                    <input
                      type="number"
                      placeholder="Total Beds"
                      value={newHospitalForm.beds_total}
                      onChange={(e) => setNewHospitalForm({...newHospitalForm, beds_total: parseInt(e.target.value) || 0})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
                    />
                  </div>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                    Create Hospital
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Hospitals ({hospitals.length})</h3>
              <div className="space-y-3">
                {hospitals.length === 0 ? (
                  <p className="text-gray-600">No hospitals yet. Click "Add Hospital" to create one.</p>
                ) : (
                  hospitals.map(hospital => (
                    <div key={hospital.id} className="border border-gray-200 p-4 rounded-lg hover:bg-green-50 transition">
                      <h4 className="font-bold text-gray-900">{hospital.name}</h4>
                      <p className="text-gray-600 text-sm">Email: {hospital.email} | Beds: {hospital.beds_total}</p>
                      <p className="text-gray-600 text-sm">Access Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{hospital.access_code}</span></p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODELS TAB */}
        {activeTab === 'models' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">AI Models Marketplace</h2>
              <button
                onClick={() => setShowModelMarketplace(!showModelMarketplace)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition">
                <ShoppingCart size={20} />
                Browse Models
              </button>
            </div>

            {showModelMarketplace && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Available Models (18 Total)</h3>
                  <button onClick={() => setShowModelMarketplace(false)}><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                  {models.map(model => (
                    <div key={model.id} className="border border-gray-200 p-4 rounded-lg hover:bg-blue-50 transition flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{model.name}</h4>
                        <p className="text-gray-600 text-sm">{model.description}</p>
                        <p className="text-gray-600 text-xs mt-1">Category: {model.category}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-blue-600">₹{model.price?.toLocaleString() || '50,000'}</p>
                        <button
                          onClick={() => handlePurchaseModel(model)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-semibold transition">
                          Purchase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Purchased Models ({purchasedModels.length})</h3>
              {purchasedModels.length === 0 ? (
                <p className="text-gray-600">No models purchased yet.</p>
              ) : (
                <div className="space-y-3">
                  {purchasedModels.map((purchase, idx) => (
                    <div key={idx} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                      <p className="font-bold text-gray-900">Model ID: {purchase.model_id}</p>
                      <p className="text-gray-600 text-sm">Purchase Date: {new Date(purchase.purchase_date).toLocaleDateString()}</p>
                      <p className="text-gray-600 text-sm">Amount: ₹{purchase.price?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && !loading && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Organization Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Organization Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Organization Name</p>
                  <p className="text-gray-900">{orgName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Organization Token</p>
                  <p className="font-mono text-gray-900 bg-gray-100 p-2 rounded">{orgToken}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Total Hospitals</p>
                  <p className="text-gray-900">{stats.total_hospitals || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Models Purchased</p>
                  <p className="text-gray-900">{purchasedModels.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDashboard;
