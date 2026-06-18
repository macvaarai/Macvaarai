import React, { useState, useEffect } from "react";
import { LogOut, Download, MessageSquare } from "lucide-react";
import PatientManagementPanel from "./PatientManagementPanel";

const HospitalAdminDashboard = ({ onLogout, adminData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: "",
    issue_type: "technical_issue",
    message: "",
    priority: "normal",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const hospitalName = adminData?.hospital_name || adminData?.hospital_id || "Hospital";
  const grantedModels = adminData?.granted_models || [];

  // Model info
  const allModels = [
    { id: "eye", name: "Eye Disease Detection", premium: true },
    { id: "covid", name: "COVID-19 Detection", premium: true },
    { id: "ecg", name: "ECG Analysis", premium: true },
    { id: "skin", name: "Skin Cancer Detection", premium: true },
    { id: "diabetes", name: "Diabetes Detection", premium: true },
    { id: "pneumonia", name: "Pneumonia Detection", premium: true },
    { id: "malaria", name: "Malaria Detection", premium: true },
    { id: "dengue", name: "Dengue Detection", premium: true },
  ];

  // Demo data
  const staff = [
    { id: "doc_001", name: "Dr. Priya Sharma", role: "Doctor", email: "priya@apollo.com", status: "active" },
    { id: "doc_002", name: "Dr. Amit Kumar", role: "Doctor", email: "amit@apollo.com", status: "active" },
    { id: "nurs_001", name: "Nurse Sarah", role: "Nurse", email: "sarah@apollo.com", status: "active" },
  ];

  const patients = [
    { id: "pat_001", name: "Naga Pavani", email: "naga@example.com", phone: "+91-9876543210", status: "active" },
    { id: "pat_002", name: "John Doe", email: "john@example.com", phone: "+91-9876543211", status: "active" },
  ];

  const reports = [
    { id: "rep_001", patient: "Naga Pavani", model: "Eye Disease", date: "2026-06-02", status: "completed" },
    { id: "rep_002", patient: "John Doe", model: "COVID-19", date: "2026-06-01", status: "completed" },
  ];

  useEffect(() => {
    fetchData();
    fetchSupportTickets();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, usersRes] = await Promise.all([
        fetch(`${apiUrl}/admin/appointments?hospital_id=${adminData?.hospital_id}&admin_role=hospital_admin`),
        fetch(`${apiUrl}/admin/users?hospital_id=${adminData?.hospital_id}&admin_role=hospital_admin`),
      ]);

      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json();
        setAppointments(data.appointments || []);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/support-tickets?hospital_id=${adminData?.hospital_id}`);
      if (res.ok) {
        const data = await res.json();
        setSupportTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    }
  };

  const handleSubmitSupportTicket = async (e) => {
    e.preventDefault();
    if (!supportForm.subject || !supportForm.message) {
      alert("Please fill in subject and message");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/admin/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          hospital_id: adminData?.hospital_id,
          admin_id: adminData?.admin_id,
          admin_name: adminData?.name || "Admin",
          admin_email: adminData?.email || "admin@hospital.com",
          subject: supportForm.subject,
          issue_type: supportForm.issue_type,
          message: supportForm.message,
          priority: supportForm.priority,
        }),
      });

      if (res.ok) {
        alert("Support ticket submitted successfully!");
        setSupportForm({ subject: "", issue_type: "technical_issue", message: "", priority: "normal" });
        setShowSupportForm(false);
        fetchSupportTickets();
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert("Error submitting support ticket");
    }
  };

  const tabs = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "staff", label: "Hospital Staff", icon: "👨‍⚕️" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "patients", label: "Patients", icon: "👥" },
    { id: "reports", label: "AI Reports", icon: "📋" },
    { id: "models", label: "Subscribed Models", icon: "🤖" },
    { id: "support", label: "Support & Feedback", icon: "🆘" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🏥 Hospital Admin Portal</h1>
            <p className="text-gray-400">{hospitalName} - Logged in as {adminData?.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Hospital Staff</p>
                <p className="text-3xl font-bold text-green-400">45</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-blue-400">1,234</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Today's Appointments</p>
                <p className="text-3xl font-bold text-purple-400">23</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">AI Reports Generated</p>
                <p className="text-3xl font-bold text-yellow-400">567</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Subscribed Models</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                    <span>Eye Disease Detection</span>
                    <span className="text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                    <span>COVID-19 Detection</span>
                    <span className="text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                    <span>ECG Analysis</span>
                    <span className="text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                    <span>Skin Cancer Detection</span>
                    <span className="text-green-400">✓ Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Hospital Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Hospital ID:</span> APL-001</p>
                  <p><span className="text-gray-400">Admin:</span> Dr. Raj Kumar</p>
                  <p><span className="text-gray-400">Email:</span> raj@apollo.com</p>
                  <p><span className="text-gray-400">Phone:</span> +91-9876543210</p>
                  <p><span className="text-gray-400">City:</span> Mumbai</p>
                  <p><span className="text-gray-400">Access Level:</span> Hospital Admin</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === "staff" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Hospital Staff</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                + Add Staff Member
              </button>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-3">{member.name}</td>
                      <td className="px-6 py-3">{member.role}</td>
                      <td className="px-6 py-3">{member.email}</td>
                      <td className="px-6 py-3">
                        <span className="bg-green-900 text-green-400 px-2 py-1 rounded text-xs">
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                        <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Hospital Appointments</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Doctor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-3">John Doe</td>
                    <td className="px-6 py-3">Dr. Priya Sharma</td>
                    <td className="px-6 py-3">2026-06-05 2:00 PM</td>
                    <td className="px-6 py-3">Eye Checkup</td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-900 text-blue-400 px-2 py-1 rounded text-xs">Scheduled</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <PatientManagementPanel hospitalId={adminData?.hospital_id} apiUrl={apiUrl} />
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Generated AI Reports</h2>
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2">
                <Download size={18} /> Export All
              </button>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Patient Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Model Used</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Generated Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-3">{report.patient}</td>
                      <td className="px-6 py-3">{report.model}</td>
                      <td className="px-6 py-3">{report.date}</td>
                      <td className="px-6 py-3 space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                        <button className="text-green-400 hover:text-green-300 text-sm">Download PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Models Tab */}
        {activeTab === "models" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Granted AI Models</h2>
            {grantedModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allModels.filter(m => grantedModels.includes(m.id)).map((model) => (
                  <div key={model.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{model.name}</h3>
                      {model.premium && <span className="text-yellow-400 text-xs bg-yellow-900 px-2 py-1 rounded">Premium</span>}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Status: <span className="text-green-400">✓ Active</span></p>
                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm w-full">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg text-center">
                <p className="text-gray-400">No models granted. Contact Hero Admin to grant model access.</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "support" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🆘 Support & Feedback</h2>
              <button
                onClick={() => setShowSupportForm(!showSupportForm)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 font-semibold"
              >
                <MessageSquare size={18} /> Submit Issue
              </button>
            </div>

            {/* Support Ticket Form */}
            {showSupportForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Report Issue or Request Feature</h3>
                <form onSubmit={handleSubmitSupportTicket} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Subject *"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={supportForm.issue_type}
                      onChange={(e) => setSupportForm({ ...supportForm, issue_type: e.target.value })}
                      className="p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                    >
                      <option value="technical_issue">Technical Issue</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="billing">Billing</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                      className="p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Describe your issue or request *"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                    rows="4"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold">
                      Submit Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSupportForm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Support Tickets List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Your Submitted Tickets</h3>
              {supportTickets.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No support tickets yet. Submit one if you need assistance.</p>
              ) : (
                supportTickets.map((ticket) => (
                  <div key={ticket.ticket_id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{ticket.subject}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {ticket.issue_type.replace("_", " ").charAt(0).toUpperCase() + ticket.issue_type.slice(1)} • {ticket.priority}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">{ticket.message}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          ticket.status === "open"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                    {ticket.response && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-400">Response:</p>
                        <p className="text-sm text-gray-300">{ticket.response}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;
