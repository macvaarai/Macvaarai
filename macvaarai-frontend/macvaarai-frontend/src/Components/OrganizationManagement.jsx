import React, { useState, useEffect } from 'react';
import { X, Plus, Copy, CheckCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react';

const OrganizationManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [allModels, setAllModels] = useState([]);
  const [copiedToken, setCopiedToken] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    num_hospitals: 0,
    subscribed_models: [],
    logo: null
  });

  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('🔄 Fetching models from: http://localhost:8000/admin/available-models');
        const response = await fetch('http://localhost:8000/admin/available-models');
        console.log('Response Status:', response.status);
        const data = await response.json();
        console.log('Models Data:', data);

        if (data.models && data.models.length > 0) {
          console.log('✅ Models loaded:', data.models.length);
          setAllModels(data.models);
        } else if (data.status === 'success' && data.models) {
          setAllModels(data.models);
        } else {
          console.warn('⚠️ No models found in response:', data);
          setAllModels([]);
        }
      } catch (error) {
        console.error('❌ Error fetching models:', error);
        alert('Error fetching models: ' + error.message);
      }
    };
    fetchModels();
  }, []);

  // Fetch organizations
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/admin/organizations');
      const data = await response.json();
      if (data.status === 'success') {
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_hospitals' ? parseInt(value) || 0 : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelToggle = (modelId) => {
    setFormData(prev => ({
      ...prev,
      subscribed_models: prev.subscribed_models.includes(modelId)
        ? prev.subscribed_models.filter(m => m !== modelId)
        : [...prev.subscribed_models, modelId]
    }));
  };

  const handleEdit = (org) => {
    setEditingId(org.organization_id);

    // Parse subscribed_models if it's a string
    let models = org.subscribed_models || [];
    if (typeof models === 'string') {
      try {
        models = JSON.parse(models);
      } catch {
        models = [];
      }
    }

    setFormData({
      name: org.name || '',
      email: org.email || '',
      phone: org.phone || '',
      address: org.address || '',
      city: org.city || '',
      state: org.state || '',
      zip_code: org.zip_code || '',
      num_hospitals: org.num_hospitals || 0,
      subscribed_models: Array.isArray(models) ? models : [],
      logo: null
    });
    setLogoPreview(null);
    setShowForm(true);
  };

  const handleDelete = async (org_id) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/admin/organizations/${org_id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Organization deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchOrganizations();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error deleting organization: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.subscribed_models.length === 0) {
      alert('Please select at least one model');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'subscribed_models') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      let url = 'http://localhost:8000/admin/organizations';
      let method = 'POST';

      if (editingId) {
        url = `http://localhost:8000/admin/organizations/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage(
          editingId
            ? 'Organization updated successfully!'
            : `Organization created successfully! Token: ${data.access_token}`
        );
        setTimeout(() => setSuccessMessage(''), 5000);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          num_hospitals: 0,
          subscribed_models: [],
          logo: null
        });
        setLogoPreview(null);
        setEditingId(null);
        setShowForm(false);
        fetchOrganizations();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const simpleCopy = (token, id) => {
    const el = document.createElement('textarea');
    el.value = token;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      num_hospitals: 0,
      subscribed_models: [],
      logo: null
    });
    setLogoPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Organization Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          Add Organization
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-green-800 font-semibold">Success!</p>
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Add/Edit Organization Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Organization' : 'Add New Organization'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Organization Logo</h4>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-gray-400 text-sm">No logo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
            </div>

            {/* Organization Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Organization Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  id="org-name"
                  name="name"
                  placeholder="Organization Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="email"
                  id="org-email"
                  name="email"
                  placeholder="Organization Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="tel"
                  id="org-phone"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  id="org-address"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  id="org-city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  id="org-state"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  id="org-zip"
                  name="zip_code"
                  placeholder="Zip Code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  id="org-hospitals"
                  name="num_hospitals"
                  placeholder="Number of Associated Hospitals"
                  value={formData.num_hospitals}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Select AI Models to Grant Access
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Select which models this organization can access:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {allModels.map((model) => (
                    <label
                      key={model.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-green-500 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subscribed_models.includes(model.id)}
                        onChange={() => handleModelToggle(model.id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{model.name}</p>
                        <p className="text-xs text-gray-500">
                          {model.premium ? '$$$$' : 'Free'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Selected: {formData.subscribed_models.length} / {allModels.length} models
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Processing...' : editingId ? 'Update Organization' : 'Create Organization & Generate Token'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Organizations List */}
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Organization Name</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Email</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Phone</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Hospitals</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Models</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Access Token</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.length === 0 ? (
                <tr key="empty-state">
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No organizations added yet
                  </td>
                </tr>
              ) : (
                organizations.map((org, index) => {
                  const logoMap = {
                    'Vijay Care': '/logos/Vijay.jpeg',
                    'Modi Care': '/logos/Modi.jpeg',
                    'CBN Care': '/logos/CBN.jpg',
                    'BJP Care': '/logos/BJP.jpeg'
                  };
                  const logoPath = logoMap[org.name];

                  return (
                  <tr key={org.organization_id || `org-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      <div className="flex items-center gap-3">
                        {logoPath && (
                          <img src={logoPath} alt={org.name} className="w-10 h-10 object-contain rounded" />
                        )}
                        <span>{org.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{org.email}</td>
                    <td className="px-6 py-4 text-gray-700">{org.phone}</td>
                    <td className="px-6 py-4 text-gray-700">{org.num_hospitals || 0}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {org.subscribed_models ? org.subscribed_models.length : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 user-select-none">
                      <div className="flex items-center gap-2 bg-blue-50 p-2 rounded border border-blue-200">
                        <input
                          type="text"
                          value={org.access_token || ''}
                          readOnly
                          className="flex-1 bg-white border border-blue-300 px-3 py-1 rounded text-sm font-mono text-gray-800 cursor-pointer"
                          title="Token - Click copy button to copy"
                        />
                        <button
                          type="button"
                          onClick={() => simpleCopy(org.access_token, org.organization_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold flex items-center gap-1 cursor-pointer"
                          title="Copy token to clipboard"
                        >
                          {copiedToken === org.organization_id ? (
                            <>
                              <CheckCircle size={16} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(org);
                          }}
                          className="text-green-600 hover:text-green-800 p-2 cursor-pointer"
                          title="Edit organization"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(org.organization_id);
                          }}
                          className="text-red-600 hover:text-red-800 p-2 cursor-pointer"
                          title="Delete organization"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationManagement;
