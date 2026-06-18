import React, { useState } from 'react';
import { LogIn, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MacvaarLogin = () => {
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/macvaar-admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey })
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('macvaarAdminKey', adminKey);
        localStorage.setItem('macvaarAdminId', data.admin_id);
        localStorage.setItem('macvaarAdminRole', data.role);

        setTimeout(() => {
          navigate('/macvaar/dashboard');
        }, 500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MacvaarAI</h1>
            <p className="text-gray-600">Official Administration Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <Lock size={18} />
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter your admin key"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              <p className="text-gray-600 text-xs mt-2">
                Default key: hero_admin_001
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Portal
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm mt-6 pt-6 border-t border-gray-200">
            <p>MacvaarAI Healthcare System Administration</p>
            <p className="text-xs mt-1">Secure access only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacvaarLogin;
