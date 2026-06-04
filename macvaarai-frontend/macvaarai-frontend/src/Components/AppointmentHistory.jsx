// src/Components/AppointmentHistory.jsx
import React, { useEffect, useState } from "react";
import { downloadReportPDF } from "../utils/reportDownloader";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://macvaarai.com/api/v1/appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const fetchReport = async (id) => {
    try {
      const res = await fetch(`https://macvaarai.com/api/v1/reports/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data || data;
    } catch {
      return null;
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    const data = await fetchReport(searchId.trim());
    if (!data) {
      setSearchResult(null);
      setError("Report not found");
    } else {
      setError("");
      setSearchResult(data);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-black text-white h-full overflow-hidden">
         <div className="flex justify-between items-center py-4 px-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                📋 Appointment History
            </h1>
            <img
              src="/1.png"
              alt="Macvaar Logo"
            className="h-20 w-auto object-contain"
            />
         </div>

      <div className="p-4 border-b border-gray-700 flex items-center gap-4">
        <button
          onClick={() => {
            setSearchResult(null);
            setError("");
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          View All Appointments
        </button>

        <input
          type="text"
          placeholder="Enter Appointment ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 bg-gray-800 border border-gray-600 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
        >
          Search Appointment
        </button>
      </div>

      {!loading && !searchResult && !error && (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full border border-gray-700 text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 border border-gray-600">Appointment ID</th>
                <th className="p-2 border border-gray-600">Patient</th>
                <th className="p-2 border border-gray-600">Doctor</th>
                <th className="p-2 border border-gray-600">Exam Type</th>
                <th className="p-2 border border-gray-600">Readings</th>
                <th className="p-2 border border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-700 align-top">
                  <td className="p-2 border border-gray-600">{a.appointmentId}</td>
                  <td className="p-2 border border-gray-600">{a.patientName}</td>
                  <td className="p-2 border border-gray-600">{a.doctorName}</td>
                  <td className="p-2 border border-gray-600">{a.examType}</td>
                  <td className="p-2 border border-gray-600 max-w-[300px] overflow-x-auto">
                    {a.readings?.length > 0 ? (
                      <ul>
                        {a.readings.map((r, i) => (
                          <li key={i} className="mb-2">
                            <strong>{r.Sensor}</strong>:{" "}
                            {r.SensorMode === "image" ? (
                              r.SensorSettings ? (
                                <img
                                  src={r.SensorSettings}
                                  alt="sensor"
                                  className="h-16 mt-2"
                                />
                              ) : (
                                "null"
                              )
                            ) : r.SensorMode === "audio" ? (
                              r.SensorSettings ? (
                                <a
                                  href={r.SensorSettings}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-400 underline"
                                >
                                  {r.SensorSettings}
                                </a>
                              ) : (
                                "null"
                              )
                            ) : (
                              r.SensorData || "null"
                            )}
                            {r.SensorSettings && r.SensorMode === "Default" && (
                              <span className="ml-2 text-gray-400">
                                ({r.SensorSettings})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border border-gray-600">
                    <button
                      onClick={async () => {
                        const report = await fetchReport(a.appointmentId);
                        if (report) downloadReportPDF(report);
                        else setError("Report not found");
                      }}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs"
                    >
                      Download Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchResult && !error && (
        <div className="p-4 overflow-y-auto max-h-[600px]">
          <h3 className="text-xl font-semibold mb-4">Appointment Report</h3>
          <p><strong>ID:</strong> {searchResult.appointmentId || "null"}</p>
          <p><strong>Patient:</strong> {searchResult.patientName || "null"}</p>
          <p><strong>Doctor:</strong> {searchResult.doctorName || "null"}</p>
          <p><strong>Exam Type:</strong> {searchResult.examType || "null"}</p>
          <p><strong>Start:</strong> {searchResult.startDateUtc || "null"}</p>
          <p><strong>End:</strong> {searchResult.endDateUtc || "null"}</p>
          <p><strong>Duration:</strong> {searchResult.durationInMinutes || "null"} min</p>

          <h4 className="mt-4 font-semibold">Readings:</h4>
          <ul className="list-disc ml-6">
            {searchResult.readings?.map((r, i) => (
              <li key={i} className="mb-2">
                <strong>{r.Sensor}</strong>:{" "}
                {r.SensorMode === "image" ? (
                  r.SensorSettings ? (
                    <img src={r.SensorSettings} alt="sensor" className="h-24 mt-2" />
                  ) : (
                    "null"
                  )
                ) : r.SensorMode === "audio" ? (
                  r.SensorSettings ? (
                    <a
                      href={r.SensorSettings}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline"
                    >
                      {r.SensorSettings}
                    </a>
                  ) : (
                    "null"
                  )
                ) : (
                  r.SensorData || "null"
                )}
                {r.SensorSettings && r.SensorMode === "Default" && (
                  <span className="ml-2 text-gray-400">({r.SensorSettings})</span>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => downloadReportPDF(searchResult)}
            className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
          >
            Download Report
          </button>
        </div>
      )}

      {error && !searchResult && (
        <div className="p-4 text-red-400 font-semibold">Report not found</div>
      )}
    </div>
  );
};

export default AppointmentHistory;
