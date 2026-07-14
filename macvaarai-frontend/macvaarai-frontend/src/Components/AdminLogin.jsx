import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('anbu1001');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('adminToken', data.admin_id);
        localStorage.setItem('adminName', data.name);
        localStorage.setItem('adminEmail', data.email);
        localStorage.setItem('adminRole', data.role);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Using demo mode...');
      localStorage.setItem('adminToken', 'demo-' + Date.now());
      localStorage.setItem('adminName', 'Demo Admin');
      localStorage.setItem('adminRole', 'hero_admin');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex justify-center">
              <img src="/logos/Macvaar.jpg" alt="MacvaarAI Logo" className="h-20 w-20 rounded-full object-cover border-4 border-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MacvaarAI Admin</h1>
            <p className="text-gray-600">System Administration Portal</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              <strong>Demo Credentials:</strong><br/>
              Email: anbu1001<br/>
              Password: anbu1001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
