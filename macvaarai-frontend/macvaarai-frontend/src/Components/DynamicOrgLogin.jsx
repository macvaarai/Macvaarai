import React, { useState, useEffect } from 'react';
import { LogIn, Lock, Mail, UserPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DynamicOrgLogin = () => {
  const { orgSlug } = useParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Sign In Form
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

  // Get organization display name and logo
  const getOrgData = () => {
    const slug = orgSlug?.toLowerCase().split('-')[0] || '';
    return organizationData[slug] || {
      fullName: 'Organization',
      logo: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/LOGO/Macvaar.jpg',
      color: 'from-blue-600 to-blue-800'
    };
  };

  const currentOrg = getOrgData();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!signInForm.email || !signInForm.password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/org-admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInForm.email,
          password: signInForm.password,
          organization: orgName
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('orgAdminToken', data.token || 'org_token_' + Date.now());
        localStorage.setItem('orgToken', data.token || 'org_token_' + Date.now());
        localStorage.setItem('orgName', currentOrg.fullName);
        localStorage.setItem('orgEmail', signInForm.email);
        localStorage.setItem('orgId', data.org_id || '1');
        localStorage.setItem('orgLogo', currentOrg.logo);

        navigate(`/org/portal`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!signUpForm.name || !signUpForm.email || !signUpForm.password || !signUpForm.phone) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/org-admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpForm.name,
          email: signUpForm.email,
          phone: signUpForm.phone,
          password: signUpForm.password,
          organization: orgName
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Account created successfully! Please sign in.');
        localStorage.setItem('orgName', currentOrg.fullName);
        localStorage.setItem('orgLogo', currentOrg.logo);
        localStorage.setItem('orgAdminToken', data.token || 'org_token_' + Date.now());
        setIsSignUp(false);
        setSignUpForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentOrg.color} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <img
                src={currentOrg.logo}
                alt={currentOrg.fullName}
                className="w-full h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#f0f0f0;border-radius:8px;"><span style="font-size:24px;color:#666;">Logo</span></div>';
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentOrg.fullName}</h1>
            <p className="text-gray-600">Organization Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <Lock size={18} />
                  Password
                </label>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-600">Don't have an account?</p>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-600 hover:text-blue-700 font-bold mt-2">
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Full Name *</label>
                <input
                  type="text"
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm({...signUpForm, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Email Address *</label>
                <input
                  type="email"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={signUpForm.phone}
                  onChange={(e) => setSignUpForm({...signUpForm, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Password *</label>
                <input
                  type="password"
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                  placeholder="Enter a strong password"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={signUpForm.confirmPassword}
                  onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-600 hover:text-blue-700 font-bold">
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm mt-6 pt-6 border-t border-gray-200">
            <p>Secure Organization Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicOrgLogin;
