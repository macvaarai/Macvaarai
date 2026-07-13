import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VijayLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/organization/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('vijayToken', email);
        localStorage.setItem('vijayOrgName', data.org_name);
        localStorage.setItem('orgToken', email);
        localStorage.setItem('orgName', data.org_name);
        localStorage.setItem('orgId', data.org_id);
        navigate('/vijay-care/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900 flex items-center justify-center p-6">
      <div className="bg-yellow-50 rounded-lg shadow-2xl p-8 max-w-md w-full border-4 border-yellow-500">
        <div className="text-center mb-6">
          <img src="/logos/Vijay.jpeg" alt="Vijay Care" className="h-20 w-20 rounded-full mx-auto mb-4 border-4 border-yellow-500" />
          <h2 className="text-3xl font-bold text-yellow-900 mb-2">Vijay Care AI</h2>
          <p className="text-gray-700">Organization Portal</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-yellow-400 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-yellow-400 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-yellow-900 font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-4">
          Demo: admin@vijaycare.com / vijay123
        </p>
      </div>
    </div>
  );
};

export default VijayLoginPage;
