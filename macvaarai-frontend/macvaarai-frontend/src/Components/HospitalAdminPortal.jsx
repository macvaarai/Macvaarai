import React, { useState, useEffect } from "react";
import { LogOut, Lock, Unlock, Plus, Trash2, Users, BarChart3, Pill, MessageSquare, Calendar, Send, ArrowLeft } from "lucide-react";
import PatientManagementPanel from "./PatientManagementPanel";
import ModelDiagnosisPage from "./ModelDiagnosisPage";

const HospitalAdminPortal = ({ onLogout, adminData }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hospital, setHospital] = useState(null);
  const [models, setModels] = useState([]);
  const [stats, setStats] = useState({
    total_patients: 0,
    total_appointments: 0,
    total_reports: 0,
    active_admins: 1,
  });
  const [loading, setLoading] = useState(false);
  const [hospitalAdmins, setHospitalAdmins] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [consultationList, setConsultationList] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null); // For diagnosis page
  const [newPatientForm, setNewPatientForm] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "Male",
    address: "",
  });
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    type: "suggestion",
    message: "",
    priority: "normal",
  });
  const [consultationForm, setConsultationForm] = useState({
    topic: "",
    date: "",
    time: "",
    duration: "60",
    description: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const hospitalId = adminData?.hospital_id;

  // All 12 AI models with pricing
  const allModels = [
    { id: "eye", name: "Eye Disease Detection", price: "$$$$$", category: "Premium" },
    { id: "covid", name: "COVID-19 Detection AI", price: "$$$$$", category: "Premium" },
    { id: "ecg", name: "ECG Analysis AI", price: "$$$$$", category: "Premium" },
    { id: "skin", name: "Skin Cancer Detection AI", price: "$$$$$", category: "Premium" },
    { id: "breast", name: "Breast Cancer Detection AI", price: "$$$$$", category: "Premium" },
    { id: "tb", name: "Tuberculosis Detection AI", price: "$$$$$", category: "Premium" },
    { id: "diabetes", name: "Diabetes Detection AI", price: "$$$$$", category: "Premium" },
    { id: "pneumonia", name: "Pneumonia Detection AI", price: "$$$$$", category: "Premium" },
    { id: "malaria", name: "Malaria Detection AI", price: "$$$$$", category: "Premium" },
    { id: "dengue", name: "Dengue Detection AI", price: "$$$$$", category: "Premium" },
    { id: "stroke", name: "Stroke Prediction AI", price: "$$$$$", category: "Premium" },
    { id: "kidney", name: "Kidney Disease Detection AI", price: "$$$$$", category: "Premium" },
  ];

  // Fetch hospital data on mount
  useEffect(() => {
    if (hospitalId) {
      fetchHospitalData();
      fetchModels();
      fetchFeedback();
      fetchConsultations();
    }
  }, []);

  const fetchHospitalData = async () => {
    setLoading(true);
    try {
      // First, try to use localStorage data (faster)
      const localHospitalData = {
        hospital_id: localStorage.getItem("hospitalId"),
        name: localStorage.getItem("hospitalName"),
        email: localStorage.getItem("hospitalEmail"),
        phone: localStorage.getItem("hospitalPhone"),
        address: localStorage.getItem("hospitalAddress"),
        city: localStorage.getItem("hospitalCity"),
        state: localStorage.getItem("hospitalState"),
        zip_code: localStorage.getItem("hospitalZip"),
        admin_name: localStorage.getItem("adminName"),
        admin_email: localStorage.getItem("adminEmail"),
        num_doctors: localStorage.getItem("numDoctors"),
        num_beds: localStorage.getItem("numBeds"),
      };

      console.log("LocalStorage Hospital Data:", localHospitalData);

      if (localHospitalData.hospital_id && localHospitalData.name) {
        console.log("✅ Using localStorage data:", localHospitalData);
        console.log("Subscribed models from localStorage:", localStorage.getItem("subscribedModels"));

        // Add logo URL from localStorage
        localHospitalData.logo_url = localStorage.getItem("hospitalLogoUrl") || null;

        setHospital(localHospitalData);
        setLoading(false);
        return;
      }

      console.log("⚠️ localStorage data incomplete:", localHospitalData);
      console.log("localStorage content:", {
        hospitalId: localStorage.getItem("hospitalId"),
        hospitalName: localStorage.getItem("hospitalName"),
        subscribedModels: localStorage.getItem("subscribedModels"),
      });

      // Fallback: fetch from API
      const res = await fetch(`${apiUrl}/admin/hospitals`);
      if (res.ok) {
        const data = await res.json();
        const currentHospital = data.hospitals?.find((h) => h.hospital_id === hospitalId);
        if (currentHospital) {
          setHospital(currentHospital);

          // Parse subscribed models
          let subscribedModels = [];
          if (Array.isArray(currentHospital.subscribed_models)) {
            subscribedModels = currentHospital.subscribed_models;
          } else if (typeof currentHospital.subscribed_models === "string") {
            try {
              subscribedModels = JSON.parse(currentHospital.subscribed_models);
            } catch (e) {
              subscribedModels = [];
            }
          }

          // Calculate stats
          setStats({
            total_patients: 2, // From demo data
            total_appointments: 2,
            total_reports: 2,
            active_admins: 1,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching hospital:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/models`);
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
      }
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/feedback?hospital_id=${hospitalId}`);
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
      const res = await fetch(`${apiUrl}/admin/consultations?hospital_id=${hospitalId}`);
      if (res.ok) {
        const data = await res.json();
        setConsultationList(data.consultations || []);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatientForm.name || !newPatientForm.email || !newPatientForm.phone) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newPatientForm.name);
      formData.append("email", newPatientForm.email);
      formData.append("hospital_id", hospitalId);
      formData.append("phone", newPatientForm.phone);
      formData.append("date_of_birth", newPatientForm.date_of_birth);
      formData.append("gender", newPatientForm.gender);
      formData.append("address", newPatientForm.address);
      formData.append("role", "patient");

      const res = await fetch(`${apiUrl}/admin/patients`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("✅ Patient added successfully!");
        setNewPatientForm({ name: "", email: "", phone: "", date_of_birth: "", gender: "Male", address: "" });
        setShowAddPatientModal(false);
      } else {
        alert("❌ Failed to add patient");
      }
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("❌ Error adding patient");
    }
  };

  const getSubscribedModels = () => {
    let subscribed = [];

    console.log("[MODEL DEBUG] Getting subscribed models...");
    console.log("[MODEL DEBUG] hospital object:", hospital);

    // Try from hospital object first
    if (hospital?.subscribed_models) {
      console.log("[MODEL DEBUG] Found in hospital object:", hospital.subscribed_models);
      if (Array.isArray(hospital.subscribed_models)) {
        subscribed = hospital.subscribed_models;
        console.log("[MODEL DEBUG] Already array:", subscribed);
      } else if (typeof hospital.subscribed_models === "string") {
        try {
          subscribed = JSON.parse(hospital.subscribed_models);
          console.log("[MODEL DEBUG] Parsed from string:", subscribed);
        } catch (e) {
          console.log("[MODEL DEBUG] Parse error:", e);
          subscribed = [];
        }
      }
    } else {
      console.log("[MODEL DEBUG] No subscribed_models in hospital object");
    }

    // Fallback to localStorage
    if (!subscribed || subscribed.length === 0) {
      console.log("[MODEL DEBUG] No models found in hospital, checking localStorage...");
      const localModels = localStorage.getItem("subscribedModels");
      console.log("[MODEL DEBUG] localStorage subscribedModels:", localModels);
      if (localModels) {
        try {
          subscribed = typeof localModels === "string" ? JSON.parse(localModels) : localModels;
          console.log("[MODEL DEBUG] Parsed from localStorage:", subscribed);
        } catch (e) {
          console.log("[MODEL DEBUG] localStorage parse error:", e);
          subscribed = [];
        }
      }
    }

    console.log("[MODEL DEBUG] Final subscribed models array:", subscribed);
    return subscribed;
  };

  const isModelUnlocked = (modelId) => {
    const subscribed = getSubscribedModels();
    const isUnlocked = subscribed.includes(modelId);
    console.log(`[DEBUG] Model ${modelId} unlocked:`, isUnlocked);
    return isUnlocked;
  };

  const getModelDetails = (modelId) => {
    return allModels.find((m) => m.id === modelId);
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackForm.subject || !feedbackForm.message) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("hospital_id", hospitalId);
      formData.append("hospital_name", hospital.name);
      formData.append("admin_id", adminData.admin_id);
      formData.append("admin_name", adminData.name);
      formData.append("subject", feedbackForm.subject);
      formData.append("feedback_type", feedbackForm.type);
      formData.append("message", feedbackForm.message);
      formData.append("priority", feedbackForm.priority);

      const res = await fetch(`${apiUrl}/admin/feedback`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Add to local list
        const newFeedback = {
          feedback_id: data.feedback_id,
          ...feedbackForm,
          hospital_name: hospital.name,
          admin_name: adminData.name,
          created_at: new Date().toLocaleString(),
          status: "submitted",
        };

        setFeedbackList([newFeedback, ...feedbackList]);
        setFeedbackForm({ subject: "", type: "suggestion", message: "", priority: "normal" });
        setShowFeedbackForm(false);
        alert("✅ Feedback sent successfully!");
      } else {
        alert("❌ Failed to send feedback");
      }
    } catch (err) {
      console.error("Error sending feedback:", err);
      alert("❌ Error sending feedback");
    }
  };

  const handleScheduleConsultation = async (e) => {
    e.preventDefault();
    if (!consultationForm.topic || !consultationForm.date || !consultationForm.time) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("hospital_id", hospitalId);
      formData.append("hospital_name", hospital.name);
      formData.append("admin_id", adminData.admin_id);
      formData.append("admin_name", adminData.name);
      formData.append("topic", consultationForm.topic);
      formData.append("preferred_date", consultationForm.date);
      formData.append("preferred_time", consultationForm.time);
      formData.append("duration", consultationForm.duration);
      formData.append("description", consultationForm.description);

      const res = await fetch(`${apiUrl}/admin/consultations`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Add to local list
        const newConsultation = {
          consultation_id: data.consultation_id,
          topic: consultationForm.topic,
          date: consultationForm.date,
          time: consultationForm.time,
          duration: consultationForm.duration,
          description: consultationForm.description,
          hospital_name: hospital.name,
          admin_name: adminData.name,
          created_at: new Date().toLocaleString(),
          status: "pending",
        };

        setConsultationList([newConsultation, ...consultationList]);
        setConsultationForm({ topic: "", date: "", time: "", duration: "60", description: "" });
        setShowConsultationForm(false);
        alert("✅ Consultation request submitted! Our team will confirm shortly.");
      } else {
        alert("❌ Failed to schedule consultation");
      }
    } catch (err) {
      console.error("Error scheduling consultation:", err);
      alert("❌ Error scheduling consultation");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "models", label: "AI Models", icon: "💊" },
    { id: "patients", label: "Patients", icon: "👥" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "reports", label: "Reports", icon: "📋" },
    { id: "admins", label: "Hospital Admins", icon: "👨‍💼" },
    { id: "feedback", label: "Feedback", icon: "💬" },
    { id: "consultation", label: "Consultation", icon: "🤝" },
  ];

  // If a model is selected, show the diagnosis page
  if (selectedModel) {
    return (
      <ModelDiagnosisPage
        modelId={selectedModel.id}
        modelName={selectedModel.name}
        onBack={() => setSelectedModel(null)}
        hospitalId={hospitalId}
        adminData={adminData}
        apiUrl={apiUrl}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading hospital data...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Hospital data not found</p>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Hospital Logo */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo + Hospital Info */}
          <div className="flex items-center gap-6">
            {/* Round Logo */}
            <div className="flex-shrink-0">
              {hospital?.logo_url ? (
                <img
                  src={hospital.logo_url}
                  alt="Hospital Logo"
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-lg">
                  🏥
                </div>
              )}
            </div>

            {/* Hospital Info */}
            <div>
              <h1 className="text-3xl font-bold text-white">{hospital.name}</h1>
              <p className="text-blue-100 text-sm mt-1">Hospital Admin Portal</p>
              <div className="mt-3 space-y-1 text-xs text-blue-100">
                <p>📧 {hospital.email}</p>
                <p>📱 {hospital.phone}</p>
                <p>📍 {hospital.city}, {hospital.state} {hospital.zip_code}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold transition whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-400 border-blue-400"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">📊 Hospital Dashboard</h2>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
                <p className="text-gray-200 text-sm">Total Patients</p>
                <p className="text-4xl font-bold mt-2">{stats.total_patients}</p>
                <p className="text-xs text-blue-200 mt-2">Registered in hospital</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
                <p className="text-gray-200 text-sm">Appointments</p>
                <p className="text-4xl font-bold mt-2">{stats.total_appointments}</p>
                <p className="text-xs text-green-200 mt-2">Scheduled/completed</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
                <p className="text-gray-200 text-sm">AI Reports</p>
                <p className="text-4xl font-bold mt-2">{stats.total_reports}</p>
                <p className="text-xs text-purple-200 mt-2">Generated using AI models</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
                <p className="text-gray-200 text-sm">Hospital Admins</p>
                <p className="text-4xl font-bold mt-2">{stats.active_admins}</p>
                <p className="text-xs text-orange-200 mt-2">Active in this hospital</p>
              </div>
            </div>
          </div>
        )}

        {/* MODELS TAB */}
        {activeTab === "models" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">💊 AI Models Catalog</h2>
              <p className="text-gray-400">
                Your hospital has {getSubscribedModels().length} unlocked models. Purchase more to unlock additional features.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {allModels
                .filter((model) => isModelUnlocked(model.id))
                .map((model) => {
                  const dbModel = models.find((m) => m.model_id === model.id);

                  return (
                    <div
                      key={model.id}
                      className="rounded-lg border-2 border-green-500 bg-gray-900 p-6 transition hover:border-green-400"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold">{model.name}</h3>
                          <p className="text-sm text-green-400">{model.category}</p>
                        </div>
                        <Unlock className="text-green-400" size={24} />
                      </div>

                      {dbModel && (
                        <>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {dbModel.description}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>📊 Accuracy: {dbModel.accuracy}</p>
                            <p>📈 Training: {dbModel.training_data}</p>
                          </div>
                        </>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => setSelectedModel({ id: model.id, name: model.name })}
                          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold text-sm transition transform hover:scale-105"
                        >
                          🚀 Open Diagnosis Tool
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {getSubscribedModels().length === 0 && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 text-center">
                <p className="text-yellow-200">No AI models subscribed yet. Contact super admin to add models to your hospital.</p>
              </div>
            )}
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === "patients" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">👥 Patients</h2>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
              >
                <Plus size={20} /> Add New Patient
              </button>
            </div>
            <PatientManagementPanel hospitalId={hospitalId} apiUrl={apiUrl} />
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">📅 Appointments</h2>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <p className="text-gray-400">Appointment management coming soon...</p>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">📋 AI Reports</h2>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <p className="text-gray-400">Reports and diagnostics will appear here...</p>
            </div>
          </div>
        )}

        {/* ADMINS TAB */}
        {activeTab === "admins" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">👨‍💼 Hospital Admin Management</h2>
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold">
                <Plus size={20} /> Add Admin
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="px-6 py-4">{hospital.admin_name}</td>
                    <td className="px-6 py-4">{hospital.admin_email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-sm">
                        Hospital Admin
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-900 text-green-200 px-3 py-1 rounded text-sm">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
                        <Trash2 size={16} /> Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">💬 Send Feedback</h2>
              <button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
              >
                <Send size={20} /> Send Feedback
              </button>
            </div>

            {/* Feedback Form */}
            {showFeedbackForm && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <form onSubmit={handleSendFeedback} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Subject *</label>
                    <input
                      type="text"
                      placeholder="Brief subject of your feedback"
                      value={feedbackForm.subject}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Feedback Type</label>
                      <select
                        value={feedbackForm.type}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                        className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      >
                        <option value="suggestion">Suggestion</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Priority</label>
                      <select
                        value={feedbackForm.priority}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, priority: e.target.value })}
                        className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message *</label>
                    <textarea
                      placeholder="Detailed feedback message"
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      rows="5"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-semibold"
                    >
                      Submit Feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Feedback List */}
            <div>
              <h3 className="text-xl font-bold mb-4">Your Feedback</h3>
              {feedbackList.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No feedback submitted yet</p>
              ) : (
                <div className="space-y-3">
                  {feedbackList.map((fb) => (
                    <div key={fb.feedback_id || fb.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{fb.subject}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Type: <span className="capitalize">{fb.feedback_type || fb.type}</span> | Priority: <span className="capitalize">{fb.priority}</span>
                          </p>
                          <p className="text-sm text-gray-300 mt-2">{fb.message}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded text-xs font-semibold block ${
                            fb.status === "submitted" ? "bg-blue-900 text-blue-200" : "bg-green-900 text-green-200"
                          }`}>
                            {fb.status === "submitted" ? "Submitted" : "Resolved"}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">{fb.created_at || fb.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONSULTATION TAB */}
        {activeTab === "consultation" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">🤝 Book Consultation</h2>
              <button
                onClick={() => setShowConsultationForm(!showConsultationForm)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
              >
                <Calendar size={20} /> Book Consultation
              </button>
            </div>

            {/* Consultation Form */}
            {showConsultationForm && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <form onSubmit={handleScheduleConsultation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Consultation Topic *</label>
                    <input
                      type="text"
                      placeholder="e.g., AI Model Integration, System Optimization, Staff Training"
                      value={consultationForm.topic}
                      onChange={(e) => setConsultationForm({ ...consultationForm, topic: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Preferred Date *</label>
                      <input
                        type="date"
                        value={consultationForm.date}
                        onChange={(e) => setConsultationForm({ ...consultationForm, date: e.target.value })}
                        className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Preferred Time *</label>
                      <input
                        type="time"
                        value={consultationForm.time}
                        onChange={(e) => setConsultationForm({ ...consultationForm, time: e.target.value })}
                        className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                      <select
                        value={consultationForm.duration}
                        onChange={(e) => setConsultationForm({ ...consultationForm, duration: e.target.value })}
                        className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      placeholder="Describe what you'd like to discuss in the consultation"
                      value={consultationForm.description}
                      onChange={(e) => setConsultationForm({ ...consultationForm, description: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                      rows="4"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-semibold"
                    >
                      Request Consultation
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConsultationForm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Consultation Requests */}
            <div>
              <h3 className="text-xl font-bold mb-4">Your Consultation Requests</h3>
              {consultationList.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No consultation requests yet</p>
              ) : (
                <div className="space-y-3">
                  {consultationList.map((cons) => (
                    <div key={cons.consultation_id || cons.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{cons.topic}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            📅 {cons.preferred_date || cons.date} at {cons.preferred_time || cons.time} ({cons.duration} minutes)
                          </p>
                          {cons.description && (
                            <p className="text-sm text-gray-300 mt-2">{cons.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded text-xs font-semibold block ${
                            cons.status === "pending" ? "bg-yellow-900 text-yellow-200" :
                            cons.status === "confirmed" ? "bg-green-900 text-green-200" :
                            "bg-blue-900 text-blue-200"
                          }`}>
                            {cons.status === "pending" ? "⏳ Pending" : cons.status === "confirmed" ? "✅ Confirmed" : "Completed"}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">Requested: {cons.created_at || cons.booked_at}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ADD PATIENT MODAL */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-2xl font-bold">➕ Add New Patient</h2>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Patient Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newPatientForm.name}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={newPatientForm.email}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, email: e.target.value })}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91-XXXXXXXXXX"
                    value={newPatientForm.phone}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={newPatientForm.date_of_birth}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, date_of_birth: e.target.value })}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Gender</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newPatientForm.address}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, address: e.target.value })}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-semibold"
                >
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-2xl font-bold">➕ Add New Admin</h2>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newAdminForm.name && newAdminForm.email) {
                  alert("✅ Admin invitation sent to " + newAdminForm.email);
                  setNewAdminForm({ name: "", email: "", phone: "" });
                  setShowAddAdminModal(false);
                }
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">Admin Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  required
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="admin@hospital.com"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  required
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="+91-XXXXXXXXXX"
                  value={newAdminForm.phone}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-semibold"
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalAdminPortal;
