// src/services/healthApi.js

// Base API URLs (use import.meta.env for Vite)
const HEALTH_API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/ai-health-assistant`
  : "http://localhost:8000/ai-health-assistant";

const CHATBOT_API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/chatbot`
  : "http://localhost:8000/chatbot";

/**
 * Call Health Assistant API
 * Handles:
 *  - Text only
 *  - Text + model_type
 *  - Text + File + model_type 
 *  - File + model_type
 *
 * @param {FormData} formData - text, file, model_type, model_subtype
 * @returns {Promise<any>} Response data (JSON)
 */
export async function postHealthAssistantData(formData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600000); // 10 min

  try {
    const res = await fetch(HEALTH_API_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Health API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    console.error("Health API Error:", err.message);
    throw err;
  }
}

/**
 * Call Chatbot API
 * Handles:
 *  - Text only
 *  - File only
 *  - Text + File
 *
 * @param {FormData} formData - text + optional file
 * @returns {Promise<string>} Response data (Plain text)
 */
export async function postChatbotData(formData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600000); // 10 min

  try {
    const res = await fetch(CHATBOT_API_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Chatbot API error: ${res.status} ${res.statusText}`);
    }

    return await res.text();
  } catch (err) {
    clearTimeout(timeout);
    console.error("Chatbot API Error:", err.message);
    throw err;
  }
}
