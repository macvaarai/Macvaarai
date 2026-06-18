import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const HospitalTokenLogin = ({ apiUrl }) => {
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!accessToken.trim()) {
      setError("❌ Please enter your hospital access token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("access_token", accessToken.trim());

      const res = await fetch(`${apiUrl}/admin/verify-hospital-token`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success" && data.hospital) {
        const hospital = data.hospital;

        console.log("Hospital data received:", hospital);

        // Convert relative logo URL to full URL
        let logoUrl = hospital.logo_url || "";
        if (logoUrl && !logoUrl.startsWith("http")) {
          logoUrl = `${apiUrl}${logoUrl}`;
        }

        // Store hospital and admin info in localStorage
        localStorage.setItem("adminKey", accessToken.trim());
        localStorage.setItem("adminRole", "hospital_admin");
        localStorage.setItem("adminId", hospital.hospital_id || "hospital_admin_001");
        localStorage.setItem("adminName", hospital.admin_name || "");
        localStorage.setItem("adminEmail", hospital.admin_email || "");

        localStorage.setItem("hospitalId", hospital.hospital_id || "");
        localStorage.setItem("hospitalName", hospital.name || "");
        localStorage.setItem("hospitalEmail", hospital.email || "");
        localStorage.setItem("hospitalPhone", hospital.phone || "");
        localStorage.setItem("hospitalCity", hospital.city || "");
        localStorage.setItem("hospitalState", hospital.state || "");
        localStorage.setItem("hospitalAddress", hospital.address || "");
        localStorage.setItem("hospitalZip", hospital.zip_code || "");
        localStorage.setItem("hospitalLogoUrl", logoUrl);
        localStorage.setItem("numDoctors", hospital.num_doctors || "0");
        localStorage.setItem("numBeds", hospital.num_beds || "0");

        console.log("localStorage set with hospital ID:", localStorage.getItem("hospitalId"));
        console.log("Hospital logo URL:", logoUrl);

        // Store subscribed models
        if (hospital.subscribed_models) {
          if (typeof hospital.subscribed_models === 'string') {
            localStorage.setItem("subscribedModels", hospital.subscribed_models);
          } else {
            localStorage.setItem("subscribedModels", JSON.stringify(hospital.subscribed_models));
          }
        }

        console.log("Redirecting to hospital portal");

        // Redirect to hospital portal
        navigate("/hospital");
      } else {
        console.log("Login failed:", data);
        setError("❌ " + (data.message || data.error || "Invalid or inactive access token"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Error verifying token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🏥 Hospital Admin Portal</h1>
          <p className="text-gray-400">Access your hospital's dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 border-2 border-blue-600 rounded-lg p-8 shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              🔐 Hospital Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                placeholder="Paste your hospital access token here"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full p-4 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none text-white placeholder-gray-400 pr-10"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Get your access token from your hospital's super admin
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold mb-3 transition flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Verifying Token...
              </>
            ) : (
              <>
                🚀 Access Hospital Portal
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="p-4 bg-blue-900 border border-blue-700 rounded-lg">
            <p className="text-xs text-blue-200 mb-2">
              <span className="font-semibold">📌 What is an access token?</span>
            </p>
            <p className="text-xs text-blue-200">
              Your hospital access token is a secure key generated by your super admin. It grants you access to your hospital's specific portal and all patient data.
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-xs text-gray-400">
              🔒 <span className="font-semibold">Security:</span> Never share your access token. Each hospital has a unique token for secure access control.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            🏥 MacvaarAI Hospital Management System
          </p>
          <p className="text-gray-600 text-xs mt-2">
            © 2026 MacvaarAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalTokenLogin;
