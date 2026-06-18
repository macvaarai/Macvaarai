import React, { useState } from 'react';
import { Plus, Copy, CheckCircle } from 'lucide-react';

const OrganizationRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: ''
  });

  const [createdOrg, setCreatedOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email) {
      setError('Organization name and email are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setCreatedOrg({
          id: data.organization_id,
          name: data.name,
          token: data.token,
          url: `macvaar/${data.name.toLowerCase().replace(/\s+/g, '-')}`
        });
        setFormData({ name: '', email: '', phone: '', city: '', state: '' });
      } else {
        setError(data.message || 'Failed to create organization');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (createdOrg) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle size={32} />
              <div>
                <h2 className="text-2xl font-bold">Organization Created Successfully!</h2>
                <p>Share the details below with the organization owner</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-gray-300 font-bold mb-2">Organization Name</label>
              <div className="bg-gray-900 border border-gray-600 rounded p-4 text-white font-semibold">
                {createdOrg.name}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">Generated Token</label>
              <div className="bg-gray-900 border border-gray-600 rounded p-4 text-white font-mono text-sm break-all flex items-center justify-between">
                <span>{createdOrg.token}</span>
                <button
                  onClick={() => copyToClipboard(createdOrg.token, 'Token')}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                This is a unique token. Organization owner must enter this to access their portal.
              </p>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">Organization Portal URL</label>
              <div className="bg-gray-900 border border-gray-600 rounded p-4 text-white font-mono text-sm break-all flex items-center justify-between">
                <span>http://localhost:5173/{createdOrg.url}/admin-login</span>
                <button
                  onClick={() => copyToClipboard(`http://localhost:5173/${createdOrg.url}/admin-login`, 'URL')}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Organization owner uses this URL to access their token verification page
              </p>
            </div>

            <div className="bg-blue-900 border border-blue-700 rounded p-4">
              <p className="text-blue-200">
                <strong>Next Steps:</strong> Send the token and URL to the organization owner. They will enter the token to verify access, then sign up/sign in to create their account and manage hospitals & AI models.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setCreatedOrg(null);
                  setFormData({ name: '', email: '', phone: '', city: '', state: '' });
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition"
              >
                Create Another Organization
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Create New Organization</h2>
          <p>Set up a new organization portal with unique token and URL</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-bold mb-2">Organization Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Vijay Care, BJP Healthcare, Modi Medical"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="organization@example.com"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State (e.g., Tamil Nadu)"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Create Organization
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationRegistration;
