import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

const AIModelsDashboard = () => {
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, premium, free

  useEffect(() => {
    fetchAllModels();
  }, []);

  const fetchAllModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/admin/available-models');
      const data = await response.json();

      if (data.status === 'success' && data.models) {
        // Add all 18 models with extended info
        const modelsWithDetails = data.models.map(model => ({
          ...model,
          description: getModelDescription(model.id),
          inputType: getInputType(model.id),
          category: model.premium ? 'Premium' : 'Free'
        }));
        setAllModels(modelsWithDetails);
        setError('');
      } else {
        setError('Failed to fetch models');
      }
    } catch (err) {
      setError('Error loading models: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getModelDescription = (id) => {
    const descriptions = {
      eye: 'Detects diabetic retinopathy and eye diseases from retinal images',
      covid: 'Analyzes chest X-rays to detect COVID-19 infections',
      pneumonia: 'Detects pneumonia from chest X-rays',
      skin: 'Identifies skin cancer and lesion classification',
      malaria: 'Identifies malaria parasites from blood smears',
      dengue: 'Detects dengue virus from blood tests',
      diabetes: 'Predicts diabetes risk based on medical indicators',
      ear: 'Identifies ear infections and inflammation',
      nose: 'Detects nasal polyps and abnormalities',
      throat: 'Analyzes throat images for disease detection',
      oral: 'Identifies oral cancer and lesions',
      pharyngitis: 'Detects pharyngitis and throat infections',
      colorectal: 'Identifies colorectal polyps and abnormalities',
      lung: 'Detects lung nodules and cancer indicators',
      onelead: 'Analyzes single-lead ECG for cardiac abnormalities',
      twelvelead: 'Comprehensive 12-lead ECG analysis for heart conditions'
    };
    return descriptions[id] || 'AI Medical Diagnostic Model';
  };

  const getInputType = (id) => {
    const types = {
      eye: 'Retinal Image',
      covid: 'Chest X-ray',
      pneumonia: 'Chest X-ray',
      skin: 'Lesion Photo',
      malaria: 'Blood Smear',
      dengue: 'Blood Test',
      diabetes: 'Medical Data',
      ear: 'Ear Image',
      nose: 'Nasal Image',
      throat: 'Throat Image',
      oral: 'Mouth Image',
      pharyngitis: 'Throat Image',
      colorectal: 'Endoscopy Image',
      lung: 'Chest Image',
      onelead: '1-Lead ECG',
      twelvelead: '12-Lead ECG'
    };
    return types[id] || 'Medical Image';
  };

  const filteredModels = allModels.filter(model => {
    if (filter === 'premium') return model.premium;
    if (filter === 'free') return !model.premium;
    return true;
  });

  const premiumCount = allModels.filter(m => m.premium).length;
  const freeCount = allModels.filter(m => !m.premium).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">AI Diagnostic Models</h2>
          <p className="text-gray-600 mt-1">All {allModels.length} medical AI models</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <p className="text-blue-800 font-semibold">{allModels.length} Total</p>
            <p className="text-blue-600 text-sm">{premiumCount} Premium • {freeCount} Free</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Models ({allModels.length})
        </button>
        <button
          onClick={() => setFilter('premium')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'premium'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Premium ({premiumCount})
        </button>
        <button
          onClick={() => setFilter('free')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'free'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Free ({freeCount})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading all AI models...</p>
        </div>
      )}

      {/* Models Grid */}
      {!loading && filteredModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-lg transition"
            >
              {/* Header */}
              <div className={`px-6 py-4 ${model.premium ? 'bg-purple-600' : 'bg-green-600'} text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{model.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{model.inputType}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      model.premium ? 'bg-white text-purple-600' : 'bg-white text-green-600'
                    }`}>
                      {model.premium ? '$$$$' : 'FREE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-3">
                {/* Description */}
                <p className="text-sm text-gray-700">{model.description}</p>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-gray-700">
                      <strong>Type:</strong> {model.premium ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-gray-700">
                      <strong>Input:</strong> {model.inputType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-yellow-600" />
                    <span className="text-gray-700">
                      <strong>Status:</strong> <span className="text-green-600 font-semibold">Active</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <button className={`w-full py-2 rounded-lg font-semibold transition ${
                  model.premium
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  {model.premium ? 'Premium Model' : 'Available Model'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No models found for this filter</p>
        </div>
      )}

      {/* Stats Section */}
      {!loading && allModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-purple-800 font-semibold text-lg">{premiumCount}</p>
            <p className="text-purple-700 text-sm">Premium Models</p>
            <p className="text-xs text-purple-600 mt-2">Advanced diagnostics • $$$$</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800 font-semibold text-lg">{freeCount}</p>
            <p className="text-green-700 text-sm">Free Models</p>
            <p className="text-xs text-green-600 mt-2">Essential diagnostics • Free</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-semibold text-lg">{allModels.length}</p>
            <p className="text-blue-700 text-sm">Total Models</p>
            <p className="text-xs text-blue-600 mt-2">All diagnostic tools available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelsDashboard;
