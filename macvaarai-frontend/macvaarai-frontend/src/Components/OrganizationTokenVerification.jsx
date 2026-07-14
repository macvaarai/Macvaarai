import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const OrganizationTokenVerification = () => {
  const { orgSlug } = useParams();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [orgInfo, setOrgInfo] = useState(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Organization name from slug
  const orgName = orgSlug?.split('-')[0] || '';

  // Organization data mapping
  const organizationData = {
    'vijay': {
      fullName: 'Vijay Care AI',
      logo: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/Vijay.jpeg',
      color: 'from-yellow-500 to-yellow-700'
    },
    'bjp': {
      fullName: 'BJP Care AI',
      logo: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/BJP.jpeg',
      color: 'from-orange-500 to-orange-700'
    },
    'modi': {
      fullName: 'Modi Healthcare',
      logo: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/Modi.jpeg',
      color: 'from-blue-600 to-blue-800'
    },
    'cbn': {
      fullName: 'CBN Care AI',
      logo: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/CBN.jpg',
      color: 'from-yellow-200 to-yellow-400'
    }
  };

  const currentOrg = organizationData[orgName.toLowerCase()] || {
    fullName: orgName || 'Organization',
    logo: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/Macvaar.jpg',
    color: 'from-blue-600 to-blue-800'
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token.trim()) {
      setError('Please enter the organization token');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/org/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          org_name: currentOrg.fullName
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Store verification data
        localStorage.setItem('orgTokenVerified', 'true');
        localStorage.setItem('orgId', data.organization_id);
        localStorage.setItem('orgName', currentOrg.fullName);
        localStorage.setItem('orgLogo', currentOrg.logo);
        localStorage.setItem('orgToken', token);

        setVerified(true);
        setOrgInfo(data.organization);

        // Redirect to sign in/sign up page after 2 seconds
        setTimeout(() => {
          navigate(`/${orgSlug}-org-admin/login`);
        }, 2000);
      } else {
        setError(data.message || 'Invalid token. Please check and try again.');
      }
    } catch (err) {
      setError('Error verifying token: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentOrg.color} flex items-center justify-center p-4`}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Verified!</h2>
            <p className="text-gray-600 mb-6">You will be redirected to sign in/sign up page...</p>
            <div className="animate-pulse text-blue-600 font-semibold">Redirecting...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentOrg.color} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img
                src={currentOrg.logo}
                alt={currentOrg.fullName}
                className="w-full h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#f0f0f0;border-radius:8px;"><span style="font-size:28px;color:#666;">Logo</span></div>';
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentOrg.fullName}</h1>
            <p className="text-gray-600 mb-2">Organization Portal</p>
            <p className="text-sm text-gray-500">Token Verification Required</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              Please enter the organization token provided to you. This token grants you access to the organization's portal.
            </p>
          </div>

          {/* Token Form */}
          <form onSubmit={handleVerifyToken} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <Lock size={18} />
                Organization Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-500 font-mono text-sm"
                disabled={loading}
              />
              <p className="text-gray-500 text-xs mt-2">Token is case-sensitive</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Verify Token
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3 font-semibold">Don't have a token?</p>
            <p className="text-gray-600 text-sm mb-4">
              If you're an organization owner, please contact MacvaarAI admin to get your organization token.
            </p>
            <a
              href="/"
              className="block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Go Back to Home
            </a>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs mt-6 pt-6 border-t border-gray-200">
            <p>Secure Organization Portal</p>
            <p className="text-gray-500">Your data is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTokenVerification;
