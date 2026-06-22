import React, { useState, useEffect } from "react";
import { LogOut, Plus, Edit2, Trash2, X } from "lucide-react";
import ModelManagement from "./ModelManagement";

const HeroAdminDashboardNew = ({ onLogout, adminData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({ total_hospitals: 0, total_models: 4, total_users: 0, total_admins: 0 });
  const [loading, setLoading] = useState(false);
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketResponse, setTicketResponse] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [consultationList, setConsultationList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [consultationResponse, setConsultationResponse] = useState("");
  const [consultationConfirmDate, setConsultationConfirmDate] = useState("");
  const [consultationConfirmTime, setConsultationConfirmTime] = useState("");
  const [searchHospitals, setSearchHospitals] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  const [searchConsultations, setSearchConsultations] = useState("");

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [vaccinationData, setVaccinationData] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [qualityData, setQualityData] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Available models with pricing (12 total)
  const availableModels = [
    { id: "eye", name: "Eye Disease Detection AI", category: "Premium", price: "$$$$$" },
    { id: "covid", name: "COVID-19 Detection AI", category: "Premium", price: "$$$$$" },
    { id: "ecg", name: "ECG Analysis AI", category: "Premium", price: "$$$$$" },
    { id: "skin", name: "Skin Cancer Detection AI", category: "Premium", price: "$$$$$" },
    { id: "breast", name: "Breast Cancer Detection AI", category: "Premium", price: "$$$$$" },
    { id: "tb", name: "Tuberculosis Detection AI", category: "Premium", price: "$$$$$" },
    { id: "diabetes", name: "Diabetes Detection AI", category: "Premium", price: "$$$$$" },
    { id: "pneumonia", name: "Pneumonia Detection AI", category: "Premium", price: "$$$$$" },
    { id: "malaria", name: "Malaria Detection AI", category: "Premium", price: "$$$$$" },
    { id: "dengue", name: "Dengue Detection AI", category: "Premium", price: "$$$$$" },
    { id: "stroke", name: "Stroke Prediction AI", category: "Premium", price: "$$$$$" },
    { id: "kidney", name: "Kidney Disease Detection AI", category: "Premium", price: "$$$$$" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    admin_name: "",
    admin_email: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    num_doctors: "1",
    other_doctors: "",
    num_beds: "",
    subscribed_models: [],
  });

  // Logo state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch hospitals and support tickets on mount
  useEffect(() => {
    fetchHospitals();
    fetchSupportTickets();
    fetchFeedback();
    fetchConsultations();
    fetchAnalyticsData();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/hospitals`);
      if (res.ok) {
        const data = await res.json();
        setHospitals(data.hospitals || []);
        setStats({
          total_hospitals: data.hospitals?.length || 0,
          total_models: availableModels.length,
          total_users: 0,
          total_admins: data.hospitals?.length || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/support-tickets`);
      if (res.ok) {
        const data = await res.json();
        setSupportTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/feedback`);
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data.feedback || []);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/consultations`);
      if (res.ok) {
        const data = await res.json();
        setConsultationList(data.consultations || []);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      const [analytics, diseases, vaccination, staff, inventory, finance, quality] = await Promise.all([
        fetch(`${apiUrl}/admin/analytics/overview`).then(r => r.json()),
        fetch(`${apiUrl}/admin/analytics/disease-surveillance`).then(r => r.json()),
        fetch(`${apiUrl}/admin/analytics/vaccination`).then(r => r.json()),
        fetch(`${apiUrl}/admin/analytics/staff`).then(r => r.json()),
        fetch(`${apiUrl}/admin/analytics/inventory`).then(r => r.json()),
        fetch(`${apiUrl}/admin/analytics/finance`).then(r => r.json()),
        fetch(`${apiUrl}/admin/analytics/quality`).then(r => r.json()),
      ]);

      setAnalyticsData(analytics.data);
      setDiseaseData(diseases.data);
      setVaccinationData(vaccination.data);
      setStaffData(staff.data);
      setInventoryData(inventory.data);
      setFinanceData(finance.data);
      setQualityData(quality.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const handleRespondToTicket = async (ticketId) => {
    if (!ticketResponse.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/admin/support-tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          response: ticketResponse,
          admin_id: adminData?.admin_id || "hero_admin",
        }),
      });

      if (res.ok) {
        alert("Response submitted!");
        setTicketResponse("");
        setSelectedTicket(null);
        fetchSupportTickets();
      }
    } catch (err) {
      console.error("Error responding to ticket:", err);
    }
  };

  const handleRespondToFeedback = async (feedbackId) => {
    if (!feedbackResponse.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/admin/feedback/${feedbackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          response: feedbackResponse,
          admin_id: adminData?.admin_id || "hero_admin",
        }),
      });

      if (res.ok) {
        alert("Feedback response submitted!");
        setFeedbackResponse("");
        setSelectedFeedback(null);
        fetchFeedback();
      }
    } catch (err) {
      console.error("Error responding to feedback:", err);
    }
  };

  const handleConfirmConsultation = async (consultationId) => {
    if (!consultationConfirmDate || !consultationConfirmTime || !consultationResponse.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/admin/consultations/${consultationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          confirmed_date: consultationConfirmDate,
          confirmed_time: consultationConfirmTime,
          response: consultationResponse,
          admin_id: adminData?.admin_id || "hero_admin",
        }),
      });

      if (res.ok) {
        alert("Consultation confirmed!");
        setConsultationResponse("");
        setConsultationConfirmDate("");
        setConsultationConfirmTime("");
        setSelectedConsultation(null);
        fetchConsultations();
      }
    } catch (err) {
      console.error("Error confirming consultation:", err);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.admin_name || !formData.email || !formData.phone || !formData.address) {
      alert("❌ Please fill in all required fields");
      return;
    }

    try {
      const endpoint = editingHospitalId ? `/admin/hospitals/${editingHospitalId}` : "/admin/hospitals";
      const method = editingHospitalId ? "PUT" : "POST";
      const fullUrl = `${apiUrl}${endpoint}`;

      console.log(`[${method}] Calling: ${fullUrl}`);
      console.log("Form Data:", formData);

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("admin_name", formData.admin_name);
      formDataObj.append("admin_email", formData.admin_email);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("address", formData.address);
      formDataObj.append("city", formData.city);
      formDataObj.append("state", formData.state);
      formDataObj.append("zip_code", formData.zip_code);
      formDataObj.append("num_doctors", formData.num_doctors || "0");
      formDataObj.append("num_beds", formData.num_beds || "0");
      formDataObj.append("subscribed_models", JSON.stringify(formData.subscribed_models));

      const res = await fetch(fullUrl, {
        method,
        body: formDataObj,
      });

      console.log("Response Status:", res.status);
      const data = await res.json();
      console.log("Response Data:", data);

      if (res.ok) {
        const hospitalId = data.hospital_id;

        // Upload logo if provided
        if (logoFile && hospitalId) {
          const logoFormData = new FormData();
          logoFormData.append("logo", logoFile);

          try {
            await fetch(`${apiUrl}/admin/hospitals/${hospitalId}/upload-logo`, {
              method: "POST",
              body: logoFormData,
            });
          } catch (err) {
            console.log("Logo upload skipped");
          }
        }

        if (!editingHospitalId && data.access_token) {
          // New hospital created - show token
          alert(`✅ Hospital created successfully!\n\n🔐 Access Token:\n${data.access_token}\n\nCopy this token and share it with the hospital admin for secure login.`);
        } else {
          alert(editingHospitalId ? "Hospital updated successfully!" : "Hospital created successfully!");
        }
        resetForm();
        setLogoFile(null);
        setLogoPreview(null);
        setShowAddHospitalModal(false);
        fetchHospitals();
      } else {
        console.error("Full Error Response:", res.status, data);
        let errorMsg = `HTTP ${res.status}`;

        // Try different error formats
        if (data.detail) {
          errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        } else if (data) {
          errorMsg = JSON.stringify(data);
        }

        console.error("Formatted Error:", errorMsg);
        alert(`❌ Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert(`❌ Connection Error: ${err.message}\n\nMake sure backend is running at: ${apiUrl}`);
    }
  };

  const handleEditHospital = (hospital) => {
    // Handle subscribed_models - it might be an array or a JSON string
    let models = [];
    if (hospital.subscribed_models) {
      if (Array.isArray(hospital.subscribed_models)) {
        models = hospital.subscribed_models;
      } else {
        try {
          models = JSON.parse(hospital.subscribed_models);
        } catch (e) {
          models = [];
        }
      }
    }

    setFormData({
      name: hospital.name,
      admin_name: hospital.admin_name,
      admin_email: hospital.admin_email,
      email: hospital.email,
      phone: hospital.phone,
      address: hospital.address,
      city: hospital.city,
      state: hospital.state,
      zip_code: hospital.zip_code,
      num_doctors: "1",
      other_doctors: "",
      num_beds: "",
      subscribed_models: models,
    });
    setEditingHospitalId(hospital.hospital_id);
    setShowAddHospitalModal(true);
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;

    try {
      const deleteUrl = `${apiUrl}/admin/hospitals/${hospitalId}`;
      console.log("Deleting hospital:", deleteUrl);

      const res = await fetch(deleteUrl, { method: "DELETE" });
      const data = await res.json();

      console.log("Delete Response:", res.status, data);

      if (res.ok) {
        alert("✅ Hospital deleted successfully!");
        fetchHospitals();
      } else {
        const errorMsg = data.detail || data.message || data.error || `HTTP ${res.status}`;
        alert(`❌ Error deleting hospital: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error deleting hospital:", err);
      alert(`❌ Connection Error: ${err.message}\n\nBackend URL: ${apiUrl}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      admin_name: "",
      admin_email: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      num_doctors: "1",
      other_doctors: "",
      num_beds: "",
      subscribed_models: [],
    });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingHospitalId(null);
  };

  const toggleModel = (modelId) => {
    setFormData({
      ...formData,
      subscribed_models: formData.subscribed_models.includes(modelId)
        ? formData.subscribed_models.filter((m) => m !== modelId)
        : [...formData.subscribed_models, modelId],
    });
  };

  const tabs = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "hospitals", label: "Hospitals", icon: "🏥" },
    { id: "models", label: "Models & Pricing", icon: "💊" },
    { id: "analytics", label: "Government Analytics", icon: "📈" },
    { id: "surveillance", label: "Disease Surveillance", icon: "🦠" },
    { id: "vaccination", label: "Vaccination Dashboard", icon: "💉" },
    { id: "staff", label: "Staff Management", icon: "👨‍⚕️" },
    { id: "inventory", label: "Inventory & Medicine", icon: "📦" },
    { id: "finance", label: "Finance & Budget", icon: "💰" },
    { id: "quality", label: "Quality & Compliance", icon: "✅" },
    { id: "support", label: "Support Tickets", icon: "🆘" },
    { id: "feedback", label: "Hospital Feedback", icon: "💬" },
    { id: "consultations", label: "Consultations", icon: "🤝" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">🏥 Super Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">MacvaarAI System Administration</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">📈 System Overview</h2>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
              <div className="text-gray-200 text-sm">Total Hospitals</div>
              <div className="text-4xl font-bold mt-2">{stats.total_hospitals}</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
              <div className="text-gray-200 text-sm">AI Models Available</div>
              <div className="text-4xl font-bold mt-2">{stats.total_models}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
              <div className="text-gray-200 text-sm">Hospital Admins</div>
              <div className="text-4xl font-bold mt-2">{stats.total_admins}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
              <div className="text-gray-200 text-sm">Total Users</div>
              <div className="text-4xl font-bold mt-2">{stats.total_users}</div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">💡 Quick Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Premium Models (Paid)</p>
                <p className="text-white font-semibold">4 - Eye, COVID, ECG, Skin</p>
              </div>
              <div>
                <p className="text-gray-400">Free Models</p>
                <p className="text-white font-semibold">4 - Diabetes, Pneumonia, Malaria, Dengue</p>
              </div>
              <div>
                <p className="text-gray-400">Total Model Cost (per hospital/year)</p>
                <p className="text-white font-semibold">$$$$ (for premium models)</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="text-green-400 font-semibold">✓ All Systems Operational</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOSPITALS TAB */}
      {activeTab === "hospitals" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🏥 Manage Hospitals</h2>
            <button
              onClick={() => {
                resetForm();
                setShowAddHospitalModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
            >
              <Plus size={20} /> Add Hospital
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search hospitals by name, city, or admin..."
              value={searchHospitals}
              onChange={(e) => setSearchHospitals(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none text-white placeholder-gray-400"
            />
          </div>

          {loading ? (
            <p className="text-gray-400">Loading hospitals...</p>
          ) : hospitals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hospitals yet. Click "Add Hospital" to create one.</p>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hospital Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Admin</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Access Token</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Models</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.filter((hospital) =>
                    hospital.name.toLowerCase().includes(searchHospitals.toLowerCase()) ||
                    hospital.admin_name.toLowerCase().includes(searchHospitals.toLowerCase()) ||
                    hospital.city.toLowerCase().includes(searchHospitals.toLowerCase()) ||
                    hospital.state.toLowerCase().includes(searchHospitals.toLowerCase())
                  ).map((hospital) => (
                    <tr key={hospital.hospital_id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                      <td className="px-6 py-4 font-semibold">{hospital.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p>{hospital.admin_name}</p>
                          <p className="text-gray-400 text-xs">{hospital.admin_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {hospital.city}, {hospital.state}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-800 px-2 py-1 rounded text-green-400 font-mono">
                            {hospital.access_token ? hospital.access_token.substring(0, 20) + '...' : 'N/A'}
                          </code>
                          {hospital.access_token && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(hospital.access_token);
                                alert("✅ Token copied!");
                              }}
                              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                              title="Copy full token"
                            >
                              📋 Copy
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-xs font-semibold">
                          {(() => {
                            try {
                              const models = Array.isArray(hospital.subscribed_models)
                                ? hospital.subscribed_models
                                : JSON.parse(hospital.subscribed_models || "[]");
                              return models.length;
                            } catch (e) {
                              return 0;
                            }
                          })()} models
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${hospital.is_active ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
                          {hospital.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEditHospital(hospital)}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <Edit2 size={18} className="inline mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hospital.hospital_id)}
                          className="text-red-400 hover:text-red-300 font-semibold"
                        >
                          <Trash2 size={18} className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODELS & PRICING TAB */}
      {activeTab === "models" && (
        <ModelManagement apiUrl={apiUrl} />
      )}

      {/* GOVERNMENT ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">📊 Government Health Analytics</h2>

          {analyticsData ? (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Total Population Served</p>
                  <p className="text-3xl font-bold mt-2">{(analyticsData.population_served / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-blue-200 mt-2">Tamil Nadu State</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Healthcare Coverage</p>
                  <p className="text-3xl font-bold mt-2">{analyticsData.healthcare_coverage}%</p>
                  <p className="text-xs text-green-200 mt-2">Rural & Urban</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Patient Recovery Rate</p>
                  <p className="text-3xl font-bold mt-2">{analyticsData.patient_recovery_rate}%</p>
                  <p className="text-xs text-purple-200 mt-2">Average Outcome</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Mortality Rate</p>
                  <p className="text-3xl font-bold mt-2">{analyticsData.mortality_rate}%</p>
                  <p className="text-xs text-orange-200 mt-2">Below National Average</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">📈 Key Performance Indicators</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400">Bed Occupancy Rate</p>
                    <p className="text-2xl font-bold text-green-400">{analyticsData.bed_occupancy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Staff Efficiency</p>
                    <p className="text-2xl font-bold text-blue-400">{analyticsData.staff_efficiency}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Patient Satisfaction</p>
                    <p className="text-2xl font-bold text-purple-400">{analyticsData.patient_satisfaction}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Budget Utilization</p>
                    <p className="text-2xl font-bold text-orange-400">{analyticsData.budget_utilization}%</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                📊 Download Full Analytics Report (PDF)
              </button>
            </>
          ) : (
            <p className="text-gray-400">Loading analytics data...</p>
          )}
        </div>
      )}

      {/* DISEASE SURVEILLANCE TAB */}
      {activeTab === "surveillance" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">🦠 Disease Surveillance</h2>

          {diseaseData && diseaseData.diseases ? (
            <>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">📊 Disease Distribution (Last 30 Days)</h3>
                <div className="space-y-4">
                  {Object.entries(diseaseData.diseases).map(([key, disease]) => {
                    const maxCases = Math.max(...Object.values(diseaseData.diseases).map(d => d.cases));
                    const percentage = (disease.cases / maxCases) * 100;
                    return (
                      <div key={key} className="flex items-center gap-4">
                        <span className="w-32 text-gray-300">{disease.name}</span>
                        <div className="flex-1 bg-gray-700 h-6 rounded">
                          <div className={`bg-${disease.color}-500 h-6 rounded`} style={{width: `${percentage}%`}}></div>
                        </div>
                        <span className="text-sm font-bold">{disease.cases.toLocaleString()} cases</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Active Cases</p>
                  <p className="text-3xl font-bold text-red-400">{diseaseData.summary.total_cases.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Recovered This Month</p>
                  <p className="text-3xl font-bold text-green-400">{diseaseData.summary.total_recovered.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Recovery Rate</p>
                  <p className="text-3xl font-bold text-orange-400">{diseaseData.summary.recovery_rate}%</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                📥 Export Disease Surveillance Report
              </button>
            </>
          ) : (
            <p className="text-gray-400">Loading disease surveillance data...</p>
          )}
        </div>
      )}

      {/* VACCINATION DASHBOARD TAB */}
      {activeTab === "vaccination" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">💉 Vaccination Dashboard</h2>

          {vaccinationData ? (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Total Vaccinated</p>
                  <p className="text-3xl font-bold mt-2">{(vaccinationData.total_vaccinated / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-200 mt-2">{((vaccinationData.total_vaccinated / vaccinationData.population) * 100).toFixed(1)}% Population</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Fully Vaccinated</p>
                  <p className="text-3xl font-bold mt-2">{(vaccinationData.fully_vaccinated / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-blue-200 mt-2">{((vaccinationData.fully_vaccinated / vaccinationData.population) * 100).toFixed(1)}% Population</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Vaccination Camps</p>
                  <p className="text-3xl font-bold mt-2">{vaccinationData.camps_held.toLocaleString()}</p>
                  <p className="text-xs text-purple-200 mt-2">Last 90 Days</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
                  <p className="text-gray-200 text-sm">Total Population</p>
                  <p className="text-3xl font-bold mt-2">{(vaccinationData.population / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-orange-200 mt-2">Tamil Nadu</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Vaccination Programs</h3>
                <div className="space-y-4">
                  {Object.entries(vaccinationData.programs).map(([key, program]) => (
                    <div key={key}><p className="font-semibold">{key.toUpperCase().replace('_', ' ')}: {program.coverage}% Coverage</p></div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                📊 Generate Vaccination Report
              </button>
            </>
          ) : (
            <p className="text-gray-400">Loading vaccination data...</p>
          )}
        </div>
      )}

      {/* STAFF MANAGEMENT TAB */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">👨‍⚕️ Staff Management</h2>

          {staffData ? (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Doctors</p>
                  <p className="text-3xl font-bold text-blue-400">{staffData.doctors.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Nurses & Paramedics</p>
                  <p className="text-3xl font-bold text-green-400">{staffData.nurses.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Support Staff</p>
                  <p className="text-3xl font-bold text-purple-400">{staffData.paramedics.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Administrative</p>
                  <p className="text-3xl font-bold text-orange-400">{staffData.administrative.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">📋 Doctor Specialties</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(staffData.specialties).map(([key, count]) => (
                    <div key={key}><p>{key.replace(/_/g, ' ').toUpperCase()}: {count.toLocaleString()}</p></div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                👥 Download Staff Directory
              </button>
            </>
          ) : (
            <p className="text-gray-400">Loading staff data...</p>
          )}
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">📦 Medicine & Inventory Management</h2>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Medicines</p>
              <p className="text-3xl font-bold text-blue-400">8,450</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-400">234</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Expiring Soon</p>
              <p className="text-3xl font-bold text-red-400">56</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Equipment</p>
              <p className="text-3xl font-bold text-green-400">12,340</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 Top Medicines by Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Paracetamol</span><span className="text-orange-400">2.3M units/month</span></div>
              <div className="flex justify-between"><span>Antibiotics</span><span className="text-orange-400">1.8M units/month</span></div>
              <div className="flex justify-between"><span>Insulin</span><span className="text-orange-400">850K units/month</span></div>
              <div className="flex justify-between"><span>Blood Pressure Meds</span><span className="text-orange-400">720K units/month</span></div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
            📤 Export Inventory Report
          </button>
        </div>
      )}

      {/* FINANCE TAB */}
      {activeTab === "finance" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">💰 Finance & Budget Management</h2>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Annual Budget</p>
              <p className="text-3xl font-bold mt-2">₹4,500 Cr</p>
              <p className="text-xs text-green-200 mt-2">All Hospitals</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Utilized So Far</p>
              <p className="text-3xl font-bold mt-2">₹3,915 Cr</p>
              <p className="text-xs text-blue-200 mt-2">87% Utilized</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Revenue Generated</p>
              <p className="text-3xl font-bold mt-2">₹2,340 Cr</p>
              <p className="text-xs text-purple-200 mt-2">OPD & IPD</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Cost Per Patient</p>
              <p className="text-3xl font-bold mt-2">₹3,450</p>
              <p className="text-xs text-orange-200 mt-2">Average</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 Budget Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Staff Salaries</span><span className="text-blue-400">₹1,890 Cr (42%)</span></div>
              <div className="flex justify-between"><span>Medicine & Supplies</span><span className="text-green-400">₹945 Cr (21%)</span></div>
              <div className="flex justify-between"><span>Equipment & Infrastructure</span><span className="text-purple-400">₹810 Cr (18%)</span></div>
              <div className="flex justify-between"><span>Operations & Utilities</span><span className="text-orange-400">₹585 Cr (13%)</span></div>
              <div className="flex justify-between"><span>Training & Development</span><span className="text-yellow-400">₹270 Cr (6%)</span></div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
            💹 Download Financial Report
          </button>
        </div>
      )}

      {/* QUALITY & COMPLIANCE TAB */}
      {activeTab === "quality" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">✅ Quality & Compliance</h2>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Compliance Score</p>
              <p className="text-3xl font-bold mt-2">94%</p>
              <p className="text-xs text-green-200 mt-2">Excellent</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Infection Rate</p>
              <p className="text-3xl font-bold mt-2">0.8%</p>
              <p className="text-xs text-blue-200 mt-2">Below Target</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Accreditation Status</p>
              <p className="text-3xl font-bold mt-2">3,240</p>
              <p className="text-xs text-purple-200 mt-2">Hospitals</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Audit Findings</p>
              <p className="text-3xl font-bold mt-2">23</p>
              <p className="text-xs text-orange-200 mt-2">Minor Issues</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">📋 Quality Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Patient Satisfaction Score</span><span className="text-green-400">4.6/5.0</span></div>
              <div className="flex justify-between"><span>Mortality Rate</span><span className="text-green-400">1.2%</span></div>
              <div className="flex justify-between"><span>Surgical Site Infections</span><span className="text-green-400">0.3%</span></div>
              <div className="flex justify-between"><span>Nosocomial Infection Rate</span><span className="text-green-400">0.8%</span></div>
              <div className="flex justify-between"><span>Re-admission Rate</span><span className="text-green-400">2.1%</span></div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
            📄 Download Compliance Report
          </button>
        </div>
      )}

      {/* SUPPORT TICKETS TAB */}
      {activeTab === "support" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">🆘 Support Tickets from Hospitals</h2>

          {supportTickets.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No support tickets.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => setSelectedTicket(selectedTicket === ticket.ticket_id ? null : ticket.ticket_id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{ticket.subject}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        From: <span className="font-semibold">{ticket.admin_name}</span> ({ticket.admin_email})
                      </p>
                      <p className="text-sm text-gray-400">Hospital: {ticket.hospital_id}</p>
                      <p className="text-sm text-gray-300 mt-3">{ticket.message}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold block mb-2 ${
                          ticket.status === "open"
                            ? "bg-red-900 text-red-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {ticket.status === "open" ? "OPEN" : "RESOLVED"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded block ${
                        ticket.priority === "high" ? "bg-red-900 text-red-200" :
                        ticket.priority === "normal" ? "bg-yellow-900 text-yellow-200" :
                        "bg-blue-900 text-blue-200"
                      }`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Expanded ticket details and response form */}
                  {selectedTicket === ticket.ticket_id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      {ticket.response ? (
                        <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded p-3">
                          <p className="text-sm text-gray-400">Your Response:</p>
                          <p className="text-sm text-white mt-1">{ticket.response}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Responded: {new Date(ticket.responded_at).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Type your response here..."
                            value={selectedTicket === ticket.ticket_id ? ticketResponse : ""}
                            onChange={(e) => setTicketResponse(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                            rows="4"
                          />
                          <button
                            onClick={() => handleRespondToTicket(ticket.ticket_id)}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
                          >
                            Send Response
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    Submitted: {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === "feedback" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">💬 Hospital Feedback</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search feedback by hospital, subject, or type..."
              value={searchFeedback}
              onChange={(e) => setSearchFeedback(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none text-white placeholder-gray-400"
            />
          </div>

          {feedbackList.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No feedback received.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {feedbackList.filter((feedback) =>
                feedback.hospital_name.toLowerCase().includes(searchFeedback.toLowerCase()) ||
                feedback.subject.toLowerCase().includes(searchFeedback.toLowerCase()) ||
                feedback.feedback_type.toLowerCase().includes(searchFeedback.toLowerCase())
              ).map((feedback) => (
                <div
                  key={feedback.feedback_id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => setSelectedFeedback(selectedFeedback === feedback.feedback_id ? null : feedback.feedback_id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{feedback.subject}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        From: <span className="font-semibold">{feedback.hospital_name}</span> ({feedback.admin_name})
                      </p>
                      <p className="text-sm text-gray-400">Type: {feedback.feedback_type} | Priority: {feedback.priority}</p>
                      <p className="text-sm text-gray-300 mt-3">{feedback.message}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold block mb-2 ${
                          feedback.status === "submitted"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {feedback.status === "submitted" ? "SUBMITTED" : "RESOLVED"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded feedback details and response form */}
                  {selectedFeedback === feedback.feedback_id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      {feedback.response ? (
                        <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded p-3">
                          <p className="text-sm text-gray-400">Your Response:</p>
                          <p className="text-sm text-white mt-1">{feedback.response}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Responded: {feedback.responded_at ? new Date(feedback.responded_at).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Type your response here..."
                            value={selectedFeedback === feedback.feedback_id ? feedbackResponse : ""}
                            onChange={(e) => setFeedbackResponse(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                            rows="4"
                          />
                          <button
                            onClick={() => handleRespondToFeedback(feedback.feedback_id)}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
                          >
                            Send Response
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    Submitted: {new Date(feedback.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONSULTATIONS TAB */}
      {activeTab === "consultations" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">🤝 Consultation Requests</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search consultations by hospital, topic, or status..."
              value={searchConsultations}
              onChange={(e) => setSearchConsultations(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none text-white placeholder-gray-400"
            />
          </div>

          {consultationList.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No consultation requests.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {consultationList.filter((consultation) =>
                consultation.hospital_name.toLowerCase().includes(searchConsultations.toLowerCase()) ||
                consultation.topic.toLowerCase().includes(searchConsultations.toLowerCase()) ||
                consultation.status.toLowerCase().includes(searchConsultations.toLowerCase())
              ).map((consultation) => (
                <div
                  key={consultation.consultation_id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => setSelectedConsultation(selectedConsultation === consultation.consultation_id ? null : consultation.consultation_id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{consultation.topic}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        From: <span className="font-semibold">{consultation.hospital_name}</span> ({consultation.admin_name})
                      </p>
                      <p className="text-sm text-gray-400">Preferred: {consultation.preferred_date} at {consultation.preferred_time} ({consultation.duration} min)</p>
                      {consultation.description && (
                        <p className="text-sm text-gray-300 mt-2">{consultation.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold block mb-2 ${
                          consultation.status === "pending"
                            ? "bg-yellow-900 text-yellow-200"
                            : consultation.status === "confirmed" ? "bg-green-900 text-green-200"
                            : "bg-blue-900 text-blue-200"
                        }`}
                      >
                        {consultation.status === "pending" ? "PENDING" : consultation.status === "confirmed" ? "CONFIRMED" : "COMPLETED"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded consultation details and confirmation form */}
                  {selectedConsultation === consultation.consultation_id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      {consultation.status === "confirmed" ? (
                        <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded p-3">
                          <p className="text-sm text-gray-400">Confirmed Details:</p>
                          <p className="text-sm text-white mt-1">Date: {consultation.confirmed_date} at {consultation.confirmed_time}</p>
                          <p className="text-sm text-white">Message: {consultation.response}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Confirmed: {consultation.responded_at ? new Date(consultation.responded_at).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="date"
                            placeholder="Confirmed Date"
                            value={selectedConsultation === consultation.consultation_id ? consultationConfirmDate : ""}
                            onChange={(e) => setConsultationConfirmDate(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                          />
                          <input
                            type="time"
                            placeholder="Confirmed Time"
                            value={selectedConsultation === consultation.consultation_id ? consultationConfirmTime : ""}
                            onChange={(e) => setConsultationConfirmTime(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                          />
                          <textarea
                            placeholder="Confirmation message..."
                            value={selectedConsultation === consultation.consultation_id ? consultationResponse : ""}
                            onChange={(e) => setConsultationResponse(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                            rows="3"
                          />
                          <button
                            onClick={() => handleConfirmConsultation(consultation.consultation_id)}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
                          >
                            Confirm Consultation
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    Requested: {new Date(consultation.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT HOSPITAL MODAL */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-2xl font-bold">{editingHospitalId ? "Edit Hospital" : "Create New Hospital"}</h2>
              <button
                onClick={() => {
                  setShowAddHospitalModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddHospital} className="p-6 space-y-6">
              {/* Hospital Basic Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">🏥 Hospital Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    id="hospital-name"
                    name="name"
                    type="text"
                    placeholder="Hospital Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-2 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    id="hospital-email"
                    name="email"
                    type="email"
                    placeholder="Hospital Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    id="hospital-phone"
                    name="phone"
                    type="tel"
                    placeholder="Hospital Phone *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    id="hospital-address"
                    name="address"
                    type="text"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="col-span-2 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    id="hospital-city"
                    name="city"
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    id="hospital-state"
                    name="state"
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    id="hospital-zip"
                    name="zip_code"
                    type="text"
                    placeholder="Zip Code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="col-span-2 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />

                  {/* Logo Upload */}
                  <div className="col-span-2">
                    <label className="text-sm text-gray-400 mb-2 block">🎨 Hospital Logo (Optional)</label>
                    <div className="border-2 border-dashed border-gray-600 rounded p-4 text-center cursor-pointer hover:border-blue-500 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => setLogoPreview(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {logoPreview ? (
                          <div className="flex flex-col items-center gap-2">
                            <img src={logoPreview} alt="Logo preview" className="h-20 object-contain" />
                            <p className="text-sm text-green-400">Logo selected: {logoFile?.name}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-400">Click to upload hospital logo</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP (Max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin/Doctor Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">👨‍⚕️ Doctor Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Primary Doctor Name *"
                    value={formData.admin_name}
                    onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                    className="col-span-2 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Doctor Email *"
                    value={formData.admin_email}
                    onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                    className="col-span-2 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <div>
                    <label className="text-sm text-gray-400">Number of Doctors</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.num_doctors}
                      onChange={(e) => setFormData({ ...formData, num_doctors: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Number of Beds</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={formData.num_beds}
                      onChange={(e) => setFormData({ ...formData, num_beds: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Other Doctors (optional) - comma separated"
                    value={formData.other_doctors}
                    onChange={(e) => setFormData({ ...formData, other_doctors: e.target.value })}
                    className="col-span-2 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    rows="2"
                  />
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4">🤖 Select AI Models (Models they bought)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableModels.map((model) => (
                    <label
                      key={model.id}
                      className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded hover:border-blue-500 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subscribed_models.includes(model.id)}
                        onChange={() => toggleModel(model.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{model.name}</p>
                        <p className="text-xs text-gray-400">
                          {model.category === "Premium" ? "$$$$" : "Free"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          model.category === "Premium"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {model.category}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  Selected: {formData.subscribed_models.length} models
                  {formData.subscribed_models.length > 0 && " ($$$$)"}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddHospitalModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  {editingHospitalId ? "Update Hospital" : "Create Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroAdminDashboardNew;
