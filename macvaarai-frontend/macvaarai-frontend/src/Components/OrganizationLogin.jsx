import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizationLogin = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [tokenForm, setTokenForm] = useState({ token: '' });
  const [credentialsForm, setCredentialsForm] = useState({ email: '', password: '' });

  // Token Login
  const handleTokenLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!tokenForm.token.trim()) {
      setError('Please enter your organization token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/org/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenForm.token })
      });

      const data = await response.json();

      if (data.status === 'success' && data.organization) {
        setSuccess('Token verified! Redirecting...');
        localStorage.setItem('orgToken', tokenForm.token);
        localStorage.setItem('orgId', data.organization.organization_id);
        localStorage.setItem('orgName', data.organization.name);
        localStorage.setItem('orgEmail', data.organization.email);
        localStorage.setItem('subscribedModels', JSON.stringify(data.organization.subscribed_models || []));
        localStorage.setItem('orgLogo', data.organization.logo || '');

        setTimeout(() => navigate('/org/portal'), 1500);
      } else {
        setError(data.error || 'Invalid token. Please check and try again.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Credentials Login
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!credentialsForm.email || !credentialsForm.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/org-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialsForm)
      });

      const data = await response.json();

      if (data.status === 'success' && data.token) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('orgAdminToken', data.token);
        localStorage.setItem('orgId', data.organization_id);
        localStorage.setItem('orgName', data.organization_name);
        localStorage.setItem('orgEmail', data.email);
        localStorage.setItem('adminName', data.admin_name || '');
        localStorage.setItem('subscribedModels', JSON.stringify(data.subscribed_models || []));

        setTimeout(() => navigate('/org/portal'), 1500);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-600 text-white p-3 rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MacvaarAI</h1>
          <p className="text-gray-600 mt-2">Organization Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setLoginMethod('token');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition ${
                loginMethod === 'token'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Token Login
            </button>
            <button
              onClick={() => {
                setLoginMethod('credentials');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition ${
                loginMethod === 'credentials'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Admin Login
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-green-800">Success!</p>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Token Login Form */}
          {loginMethod === 'token' && (
            <form onSubmit={handleTokenLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Token
                </label>
                <input
                  type="text"
                  placeholder="ORG_ORGANIZATIONNAME_xxxxxxxx"
                  value={tokenForm.token}
                  onChange={(e) => setTokenForm({ token: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the organization token provided by your super admin
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Verifying...' : 'Access Organization Portal'}
              </button>
            </form>
          )}

          {/* Credentials Login Form */}
          {loginMethod === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@organization.com"
                  value={credentialsForm.email}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentialsForm.password}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Logging in...' : 'Login to Portal'}
              </button>
            </form>
          )}

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-2">
              <strong>Token:</strong> Use organization token for quick access
            </p>
            <p className="text-xs text-gray-600 text-center">
              <strong>Credentials:</strong> Use registered email and password
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>First time?</strong> Request your organization token from super admin at http://localhost:5173/admin/login
          </p>
        </div>

        {/* Back to Admin */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/admin/login')}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            Super Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLogin;
