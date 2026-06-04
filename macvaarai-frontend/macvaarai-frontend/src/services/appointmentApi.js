// src/services/appointmentApi.js
import axios from "axios";

const BASE_URL = "https://macvaarai.com/api/v1";

// ✅ Get all appointments
export const getAllAppointments = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/appointments`);
    return res.data;
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return [];
  }
};

// ✅ Get single appointment report by ID
export const getAppointmentById = async (appointmentId) => {
  try {
    const res = await axios.get(`${BASE_URL}/reports/${appointmentId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching appointment:", err);
    return null;
  }
};

// ✅ Download report (JSON → file)
export const downloadAppointmentReport = async (appointmentId) => {
  try {
    const res = await axios.get(`${BASE_URL}/reports/${appointmentId}`);
    const blob = new Blob([JSON.stringify(res.data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointment-${appointmentId}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Error downloading report:", err);
  }
};
