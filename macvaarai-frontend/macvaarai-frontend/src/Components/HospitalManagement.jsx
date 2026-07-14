import React, { useState, useEffect } from 'react';
import { X, Plus, Copy, CheckCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react';

// Logo mapping for hospitals - based on hospital names
const getHospitalLogo = (hospitalName) => {
  if (!hospitalName) return '/logos/Macvaar.jpg';

  const lowerName = hospitalName.toLowerCase();

  // Exact and partial matches for each organization
  const logoMap = [
    // Vijay Care AIlogos
    { patterns: ['vijay', 'vijay care'], logo: '/logos/Vijay.jpeg' },

    // Modi Care logos
    { patterns: ['modi', 'modi care', 'covid response'], logo: '/logos/Modi.jpeg' },

    // BJP Care logos
    { patterns: ['bjp', 'bjp care'], logo: '/logos/BJP.jpeg' },

    // CBN Care logos
    { patterns: ['cbn', 'cbn care'], logo: '/logos/CBN.jpg' },

    // Kilpauk Medical College
    { patterns: ['kilpauk', 'kilpauk medical'], logo: '/logos/Kilpauk.jpg' },

    // TN Government / Omandurar
    { patterns: ['omandurar', 'tn government', 'tn medical'], logo: '/logos/TN.jpg' },
  ];

  // Find matching logo
  for (const mapping of logoMap) {
    for (const pattern of mapping.patterns) {
      if (lowerName.includes(pattern)) {
        return mapping.logo;
      }
    }
  }

  // Fallback - Try to find logo file matching hospital name
  const words = lowerName.split(/[\s\-_]+/);
  for (const word of words) {
    if (word.length > 2) {
      const potentialLogo = `/logos/${word.charAt(0).toUpperCase() + word.slice(1)}.jpg`;
      return potentialLogo;
    }
  }

  return '/logos/Macvaar.jpg'; // Default fallback
};

const HospitalManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [hospitals, setHospitals] = useState([]);
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
    admin_name: '',
    admin_email: '',
    num_doctors: 0,
    num_beds: 0,
    subscribed_models: [],
    logo: null
  });

  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/available-models');
        const data = await response.json();
        if (data.models) {
          setAllModels(data.models);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  // Fetch hospitals
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/hospitals');
      const data = await response.json();
      if (data.status === 'success') {
        setHospitals(data.hospitals || []);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_doctors' || name === 'num_beds' ? parseInt(value) || 0 : value
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

  const handleEdit = (hospital) => {
    setEditingId(hospital.hospital_id);
    setFormData({
      name: hospital.name || '',
      email: hospital.email || '',
      phone: hospital.phone || '',
      address: hospital.address || '',
      city: hospital.city || '',
      state: hospital.state || '',
      zip_code: hospital.zip_code || '',
      admin_name: hospital.admin_name || '',
      admin_email: hospital.admin_email || '',
      num_doctors: hospital.num_doctors || 0,
      num_beds: hospital.num_beds || 0,
      subscribed_models: hospital.subscribed_models || []
    });
    setShowForm(true);
  };

  const handleDelete = async (hospital_id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/admin/hospitals/${hospital_id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Hospital deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchHospitals();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error deleting hospital: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
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

      let url = '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/hospitals';
      let method = 'POST';

      if (editingId) {
        url = `http://localhost:8000/admin/hospitals/${editingId}`;
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
            ? 'Hospital updated successfully!'
            : `Hospital created successfully! Token: ${data.access_token}`
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
          admin_name: '',
          admin_email: '',
          num_doctors: 0,
          num_beds: 0,
          subscribed_models: [],
          logo: null
        });
        setLogoPreview(null);
        setEditingId(null);
        setShowForm(false);
        fetchHospitals();
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
      admin_name: '',
      admin_email: '',
      num_doctors: 0,
      num_beds: 0,
      subscribed_models: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hospital Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Hospital
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

      {/* Add/Edit Hospital Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Hospital' : 'Add New Hospital'}
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
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Hospital Logo</h4>
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

            {/* Hospital Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Hospital Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Hospital Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Hospital Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="zip_code"
                  placeholder="Zip Code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="num_doctors"
                  placeholder="Number of Doctors"
                  value={formData.num_doctors}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                <input
                  type="number"
                  name="num_beds"
                  placeholder="Number of Beds"
                  value={formData.num_beds}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Admin Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Admin Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="admin_name"
                  placeholder="Admin Name"
                  value={formData.admin_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="admin_email"
                  placeholder="Admin Email"
                  value={formData.admin_email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Select which models this hospital can access:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {allModels.map((model) => (
                    <label
                      key={model.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subscribed_models.includes(model.id)}
                        onChange={() => handleModelToggle(model.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{model.name}</p>
                        <p className="text-xs text-gray-500">
                          '$$$$$'
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
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Processing...' : editingId ? 'Update Hospital' : 'Create Hospital & Generate Token'}
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

      {/* Hospitals List */}
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Hospital Name</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Email</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Phone</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Doctors</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Models</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Access Token</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.length === 0 ? (
                <tr key="empty-state">
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No hospitals added yet
                  </td>
                </tr>
              ) : (
                hospitals.map((hospital, index) => (
                  <tr key={hospital.hospital_id || `hospital-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      <div className="flex items-center gap-3">
                        <img src={getHospitalLogo(hospital.name)} alt="Hospital Logo" className="w-10 h-10 object-contain rounded border border-gray-300" />
                        <span>{hospital.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{hospital.email}</td>
                    <td className="px-6 py-4 text-gray-700">{hospital.phone}</td>
                    <td className="px-6 py-4 text-gray-700">{hospital.num_doctors || 0}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {hospital.subscribed_models ? hospital.subscribed_models.length : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 user-select-none">
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={getHospitalLogo(hospital.name)}
                          alt={hospital.name}
                          className="h-14 w-14 object-contain rounded-lg border-2 border-blue-300"
                          title={hospital.name}
                        />
                        <div className="flex flex-col items-center gap-1 w-full">
                          {hospital.access_token && (
                            <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded break-all max-w-xs">
                              {hospital.access_token}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => simpleCopy(hospital.access_token, hospital.hospital_id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Copy token to clipboard"
                          >
                            {copiedToken === hospital.hospital_id ? (
                              <>
                                <CheckCircle size={14} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy Token</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(hospital);
                          }}
                          className="text-green-600 hover:text-green-800 p-2 cursor-pointer"
                          title="Edit hospital"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(hospital.hospital_id);
                          }}
                          className="text-red-600 hover:text-red-800 p-2 cursor-pointer"
                          title="Delete hospital"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HospitalManagement;
