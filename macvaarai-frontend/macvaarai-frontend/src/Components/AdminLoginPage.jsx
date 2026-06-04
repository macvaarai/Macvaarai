import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AdminLoginPage = ({ onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "accesskey"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;

      if (loginMethod === "email") {
        response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/admin/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/admin/login-access-key?access_key=${accessKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminRole", data.role);
        localStorage.setItem("adminId", data.admin_id);
        localStorage.setItem("hospitalId", data.hospital_id || null);
        localStorage.setItem("hospitalName", data.hospital_name || null);
        localStorage.setItem("grantedModels", JSON.stringify(data.granted_models || []));
        localStorage.setItem("accessKey", data.access_key || null);

        onLoginSuccess({
          role: data.role,
          admin_id: data.admin_id,
          hospital_id: data.hospital_id,
          hospital_name: data.hospital_name,
          granted_models: data.granted_models || [],
          name: data.name,
        });
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">MacvaarAI</h1>
          <p className="text-gray-400">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 rounded font-semibold transition ${
                loginMethod === "email"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("accesskey")}
              className={`flex-1 py-2 rounded font-semibold transition ${
                loginMethod === "accesskey"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              Access Key
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginMethod === "email" ? (
              <>
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hospital.com"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Access Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Access Key
                  </label>
                  <input
                    type="text"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                    placeholder="Enter your access key"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition font-mono text-center"
                    required
                  />
                </div>
                <p className="text-gray-400 text-sm text-center">
                  Access key will be provided by Hero Admin
                </p>
              </>
            )}

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 bg-gray-900 border border-gray-700 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Forgot your password?{" "}
            <button className="text-blue-400 hover:text-blue-300">
              Reset here
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">Demo Credentials:</p>
          <p className="text-gray-300 text-xs mb-2">
            <span className="font-semibold">Hero Admin (Email):</span><br/>
            hero@macvaarai.com / admin123
          </p>
          <p className="text-gray-300 text-xs mb-2">
            <span className="font-semibold">Hospital Admin (Email):</span><br/>
            raj@apollo.com / admin123
          </p>
          <p className="text-gray-300 text-xs">
            <span className="font-semibold">Hospital Admin (Access Key):</span><br/>
            ACCESS123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
