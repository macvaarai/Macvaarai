import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnifiedCareLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginForm.username || !loginForm.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);

      // Call Supabase org-auth endpoint
      const response = await fetch('http://localhost:8000/api/org-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (data.token) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('orgToken', data.token);
        localStorage.setItem('orgId', data.org_id);
        localStorage.setItem('orgName', data.org_name);
        localStorage.setItem('orgType', data.org_type);
        localStorage.setItem('orgUsername', loginForm.username);

        setTimeout(() => navigate('/care/dashboard'), 1500);
        return;
      }

      setError(data.detail || 'Invalid username or password');
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Left Corner Logo - Vijay */}
      <div className="absolute top-8 left-8 z-20">
        <img
          src="/logos/Vijay.jpeg"
          alt="Vijay Care"
          className="h-24 w-24 rounded-full shadow-lg border-4 border-white object-cover hover:scale-110 transition transform"
        />
      </div>

      {/* Right Corner Logo - Macvaar */}
      <div className="absolute top-8 right-8 z-20">
        <img
          src="/logos/Macvaar.jpg"
          alt="Macvaar AI"
          className="h-24 w-24 rounded-full shadow-lg border-4 border-white object-cover hover:scale-110 transition transform"
        />
      </div>

      {/* Center Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-4 border-yellow-400">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Care Portal</h1>
            <p className="text-lg text-gray-700 font-semibold">
              AI Driven Early Disease Detection
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <p className="font-semibold text-red-800">Login Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <p className="font-semibold text-green-800">Success!</p>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-yellow-500" size={22} />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-yellow-500" size={22} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-600 hover:text-gray-800 transition"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-105 active:scale-95 mt-8 text-lg shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                'Login to Portal'
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-semibold text-white drop-shadow-lg">
          <p>© 2026 Vijay Care & Macvaar AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCareLogin;
