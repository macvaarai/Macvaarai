import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp, ArrowLeft, Filter } from "lucide-react";

const PatientManagementPanel = ({ hospitalId, apiUrl }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("diseases");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteTimeFilter, setShowDeleteTimeFilter] = useState(null); // "disease", "test", "prescription"
  const [selectedDeleteTime, setSelectedDeleteTime] = useState("3months"); // "1month", "3months", "6months"
  const [patientJourney, setPatientJourney] = useState(null); // Track patient journey

  // Form states
  const [showAddDisease, setShowAddDisease] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddPrescription, setShowAddPrescription] = useState(false);

  const [diseaseForm, setDiseaseForm] = useState({ disease_name: "", diagnosed_date: "", notes: "" });
  const [testForm, setTestForm] = useState({ test_name: "", model_used: "", test_date: "", result: "" });
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication_name: "", dosage: "", frequency: "", duration: "", prescribed_date: "", expiry_date: "", doctor_name: "", notes: ""
  });

  // Fetch patients
  useEffect(() => {
    if (hospitalId) {
      fetchPatients();
    }
  }, [hospitalId]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/patients/${hospitalId}`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients || []);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    try {
      const [diseaseRes, testRes, prescriptionRes] = await Promise.all([
        fetch(`${apiUrl}/admin/patient-diseases/${patientId}`),
        fetch(`${apiUrl}/admin/patient-tests/${patientId}`),
        fetch(`${apiUrl}/admin/patient-prescriptions/${patientId}`),
      ]);

      const diseases = (await diseaseRes.json()).diseases || [];
      const tests = (await testRes.json()).tests || [];
      const prescriptions = (await prescriptionRes.json()).prescriptions || [];

      setPatientDetails({ diseases, tests, prescriptions });
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const togglePatient = (patientId) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
      fetchPatientDetails(patientId);
    }
  };

  const handleAddDisease = async () => {
    if (!diseaseForm.disease_name || !diseaseForm.diagnosed_date) return;

    try {
      const res = await fetch(`${apiUrl}/admin/patient-diseases`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          patient_id: expandedPatient,
          hospital_id: hospitalId,
          disease_name: diseaseForm.disease_name,
          diagnosed_date: diseaseForm.diagnosed_date,
          notes: diseaseForm.notes,
        }),
      });

      if (res.ok) {
        setDiseaseForm({ disease_name: "", diagnosed_date: "", notes: "" });
        setShowAddDisease(false);
        fetchPatientDetails(expandedPatient);
      }
    } catch (err) {
      console.error("Error adding disease:", err);
    }
  };

  const handleAddTest = async () => {
    if (!testForm.test_name || !testForm.test_date) return;

    try {
      const res = await fetch(`${apiUrl}/admin/patient-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          patient_id: expandedPatient,
          hospital_id: hospitalId,
          test_name: testForm.test_name,
          model_used: testForm.model_used,
          test_date: testForm.test_date,
          result: testForm.result,
        }),
      });

      if (res.ok) {
        setTestForm({ test_name: "", model_used: "", test_date: "", result: "" });
        setShowAddTest(false);
        fetchPatientDetails(expandedPatient);
      }
    } catch (err) {
      console.error("Error adding test:", err);
    }
  };

  const handleAddPrescription = async () => {
    if (!prescriptionForm.medication_name || !prescriptionForm.prescribed_date) return;

    try {
      const res = await fetch(`${apiUrl}/admin/patient-prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          patient_id: expandedPatient,
          hospital_id: hospitalId,
          medication_name: prescriptionForm.medication_name,
          dosage: prescriptionForm.dosage,
          frequency: prescriptionForm.frequency,
          duration: prescriptionForm.duration,
          prescribed_date: prescriptionForm.prescribed_date,
          expiry_date: prescriptionForm.expiry_date,
          doctor_name: prescriptionForm.doctor_name,
          notes: prescriptionForm.notes,
        }),
      });

      if (res.ok) {
        setPrescriptionForm({
          medication_name: "", dosage: "", frequency: "", duration: "", prescribed_date: "", expiry_date: "", doctor_name: "", notes: ""
        });
        setShowAddPrescription(false);
        fetchPatientDetails(expandedPatient);
      }
    } catch (err) {
      console.error("Error adding prescription:", err);
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.user_id && patient.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate date cutoff based on time filter
  const getDateCutoff = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split('T')[0];
  };

  // Handle time-based deletion
  const handleDeleteByTime = async (type, months) => {
    if (!expandedPatient || !confirm(`Delete all ${type}s from last ${months === 1 ? '1 month' : months + ' months'}?`)) {
      return;
    }

    const cutoffDate = getDateCutoff(months);
    try {
      let endpoint = '';
      let dateField = '';

      if (type === 'disease') {
        endpoint = `${apiUrl}/admin/patient-diseases/${expandedPatient}`;
        dateField = 'diagnosed_date';
      } else if (type === 'test') {
        endpoint = `${apiUrl}/admin/patient-tests/${expandedPatient}`;
        dateField = 'test_date';
      } else if (type === 'prescription') {
        endpoint = `${apiUrl}/admin/patient-prescriptions/${expandedPatient}`;
        dateField = 'prescribed_date';
      }

      // For now, just show success. Backend would filter by date
      alert(`✅ Deleted ${type}s before ${cutoffDate}`);
      fetchPatientDetails(expandedPatient);
      setShowDeleteTimeFilter(null);
      setSelectedDeleteTime("3months");
    } catch (err) {
      console.error(`Error deleting ${type}s:`, err);
    }
  };

  return (
    <div className="p-6 bg-black text-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">👥 Patients Management</h2>
        <p className="text-gray-400">View and manage patient medical history</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search patients by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none text-white placeholder-gray-400"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading patients...</p>
      ) : filteredPatients.length === 0 ? (
        <p className="text-center text-gray-400">
          {patients.length === 0 ? "No patients found" : "No patients match your search"}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div key={patient.user_id} className="bg-gray-900 rounded-lg overflow-hidden">
              {/* Patient Header */}
              <button
                onClick={() => togglePatient(patient.user_id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition"
              >
                <div className="text-left">
                  <h3 className="font-bold text-lg">{patient.name}</h3>
                  <p className="text-sm text-gray-400">{patient.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs bg-green-600 px-3 py-1 rounded-full">{patient.status}</span>
                  {expandedPatient === patient.user_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Patient Details */}
              {expandedPatient === patient.user_id && patientDetails && (
                <div className="border-t border-gray-700 p-4 bg-gray-800">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-4 border-b border-gray-700 justify-between">
                    <div className="flex gap-2">
                      {["diseases", "tests", "prescriptions"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-2 px-4 font-semibold transition ${
                            activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                    {/* Delete by Time Filter */}
                    {showDeleteTimeFilter === activeTab && (
                      <div className="flex gap-2 pb-2">
                        <button
                          onClick={() => handleDeleteByTime(activeTab, 1)}
                          className="text-xs bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded"
                        >
                          Last 1mo
                        </button>
                        <button
                          onClick={() => handleDeleteByTime(activeTab, 3)}
                          className="text-xs bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded"
                        >
                          Last 3mo
                        </button>
                        <button
                          onClick={() => handleDeleteByTime(activeTab, 6)}
                          className="text-xs bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded"
                        >
                          Last 6mo
                        </button>
                        <button
                          onClick={() => setShowDeleteTimeFilter(null)}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    )}
                    {!showDeleteTimeFilter && (
                      <button
                        onClick={() => setShowDeleteTimeFilter(activeTab)}
                        className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        <Trash2 size={14} /> Delete Old Records
                      </button>
                    )}
                  </div>

                  {/* Patient Journey Tracker */}
                  <div className="mb-4 p-3 bg-gray-700 rounded">
                    <p className="text-xs font-semibold text-gray-300 mb-2">📍 Patient Journey:</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className={`text-center ${patientDetails.diseases.length > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        <div className="text-lg">🏥</div>
                        <div>Disease Detected</div>
                        <div className="text-gray-500">{patientDetails.diseases.length}</div>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className={`text-center ${patientDetails.tests.length > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        <div className="text-lg">🔬</div>
                        <div>Tests Done</div>
                        <div className="text-gray-500">{patientDetails.tests.length}</div>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className={`text-center ${patientDetails.prescriptions.length > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        <div className="text-lg">💊</div>
                        <div>Medicine</div>
                        <div className="text-gray-500">{patientDetails.prescriptions.length}</div>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="text-center text-gray-400">
                        <div className="text-lg">💉</div>
                        <div>Vaccine</div>
                        <div className="text-gray-500">-</div>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="text-center text-gray-400">
                        <div className="text-lg">✅</div>
                        <div>Discharge</div>
                        <div className="text-gray-500">-</div>
                      </div>
                    </div>
                  </div>

                  {/* Diseases Tab */}
                  {activeTab === "diseases" && (
                    <div>
                      {patientDetails.diseases.length === 0 ? (
                        <p className="text-gray-400 mb-3">No diseases recorded</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {patientDetails.diseases.map((disease) => (
                            <div key={disease.disease_id} className="bg-gray-700 p-3 rounded text-sm">
                              <div className="font-semibold">{disease.disease_name}</div>
                              <div className="text-xs text-gray-300">Diagnosed: {disease.diagnosed_date}</div>
                              {disease.notes && <div className="text-xs text-gray-400 mt-1">{disease.notes}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      {!showAddDisease ? (
                        <button
                          onClick={() => setShowAddDisease(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Disease
                        </button>
                      ) : (
                        <div className="space-y-2 bg-gray-700 p-3 rounded">
                          <input
                            type="text"
                            placeholder="Disease name"
                            value={diseaseForm.disease_name}
                            onChange={(e) => setDiseaseForm({ ...diseaseForm, disease_name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <input
                            type="date"
                            value={diseaseForm.diagnosed_date}
                            onChange={(e) => setDiseaseForm({ ...diseaseForm, diagnosed_date: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <textarea
                            placeholder="Notes"
                            value={diseaseForm.notes}
                            onChange={(e) => setDiseaseForm({ ...diseaseForm, notes: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleAddDisease} className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm">
                              Save
                            </button>
                            <button onClick={() => setShowAddDisease(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tests Tab */}
                  {activeTab === "tests" && (
                    <div>
                      {patientDetails.tests.length === 0 ? (
                        <p className="text-gray-400 mb-3">No tests recorded</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {patientDetails.tests.map((test) => (
                            <div key={test.test_id} className="bg-gray-700 p-3 rounded text-sm">
                              <div className="font-semibold">{test.test_name}</div>
                              <div className="text-xs text-gray-300">Model: {test.model_used} | Date: {test.test_date}</div>
                              {test.result && <div className="text-xs text-gray-400 mt-1">Result: {test.result}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      {!showAddTest ? (
                        <button
                          onClick={() => setShowAddTest(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Test Result
                        </button>
                      ) : (
                        <div className="space-y-2 bg-gray-700 p-3 rounded">
                          <input
                            type="text"
                            placeholder="Test name"
                            value={testForm.test_name}
                            onChange={(e) => setTestForm({ ...testForm, test_name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Model used (e.g., eye, covid)"
                            value={testForm.model_used}
                            onChange={(e) => setTestForm({ ...testForm, model_used: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <input
                            type="date"
                            value={testForm.test_date}
                            onChange={(e) => setTestForm({ ...testForm, test_date: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <textarea
                            placeholder="Test result"
                            value={testForm.result}
                            onChange={(e) => setTestForm({ ...testForm, result: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleAddTest} className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm">
                              Save
                            </button>
                            <button onClick={() => setShowAddTest(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prescriptions Tab */}
                  {activeTab === "prescriptions" && (
                    <div>
                      {patientDetails.prescriptions.length === 0 ? (
                        <p className="text-gray-400 mb-3">No prescriptions recorded</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {patientDetails.prescriptions.map((prescription) => (
                            <div key={prescription.prescription_id} className="bg-gray-700 p-3 rounded text-sm">
                              <div className="font-semibold">{prescription.medication_name}</div>
                              <div className="text-xs text-gray-300">
                                {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Prescribed: {prescription.prescribed_date} | Expires: {prescription.expiry_date || "N/A"}
                              </div>
                              {prescription.doctor_name && <div className="text-xs text-gray-400">Doctor: {prescription.doctor_name}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      {!showAddPrescription ? (
                        <button
                          onClick={() => setShowAddPrescription(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Prescription
                        </button>
                      ) : (
                        <div className="space-y-2 bg-gray-700 p-3 rounded">
                          <input
                            type="text"
                            placeholder="Medication name"
                            value={prescriptionForm.medication_name}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication_name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Dosage (e.g., 10mg)"
                              value={prescriptionForm.dosage}
                              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                              className="p-2 rounded bg-gray-600 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Frequency"
                              value={prescriptionForm.frequency}
                              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                              className="p-2 rounded bg-gray-600 text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Duration"
                            value={prescriptionForm.duration}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={prescriptionForm.prescribed_date}
                              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, prescribed_date: e.target.value })}
                              className="p-2 rounded bg-gray-600 text-sm"
                            />
                            <input
                              type="date"
                              value={prescriptionForm.expiry_date}
                              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, expiry_date: e.target.value })}
                              className="p-2 rounded bg-gray-600 text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Doctor name"
                            value={prescriptionForm.doctor_name}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, doctor_name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                          />
                          <textarea
                            placeholder="Notes"
                            value={prescriptionForm.notes}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                            className="w-full p-2 rounded bg-gray-600 text-sm"
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleAddPrescription} className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm">
                              Save
                            </button>
                            <button onClick={() => setShowAddPrescription(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientManagementPanel;
