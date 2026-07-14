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
      const response = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/available-models');
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
      eye: 'Screen vision health and detect eye-related issues using AI.',
      covid: 'Chest X-ray analysis and COVID-19 screening using machine learning.',
      pneumonia: 'Screen and detect early pneumonia risks with AI.',
      skin: 'Analyze skin conditions, rashes, and moles for early detection and advice.',
      malaria: 'Screen for malaria symptoms and provide early advice.',
      dengue: 'Screen for dengue symptoms and provide AI-driven advice.',
      diabetes: 'Monitor glucose trends, risk factors, and receive diabetic care advice.',
      ear: 'Screen for common ear issues and receive hearing health suggestions.',
      nose: 'AI-driven nasal health checks for allergies, congestion, and sinus care.',
      throat: 'Assess throat symptoms and receive tailored advice for throat health.',
      oral: 'Screen oral hygiene, gum disease, and mouth health with AI.',
      pharyngitis: 'Pharyngitis classification and treatment recommendations.',
      colorectal: 'Colorectal lesion detection and analysis.',
      lung: 'Screen for respiratory conditions and get lung health insights using AI.',
      onelead: 'Quick ECG analysis using a single-lead input for early heart health screening.',
      twelvelead: 'Comprehensive 12-lead ECG interpretation for advanced cardiac assessment.'
    };
    return descriptions[id] || 'AI Medical Diagnostic Model';
  };

  const getModelEmoji = (id) => {
    const emojis = {
      eye: '👁️',
      covid: '🦠',
      pneumonia: '🫁',
      skin: '🩹',
      malaria: '🦟',
      dengue: '🦟',
      diabetes: '💉',
      ear: '👂',
      nose: '👃',
      throat: '🗣️',
      oral: '🦷',
      pharyngitis: '🗣️',
      colorectal: '🔬',
      lung: '🫁',
      onelead: '❤️',
      twelvelead: '❤️',
      dental: '🦷',
      heart: '❤️'
    };
    return emojis[id] || '🤖';
  };

  const getModelBorderColor = (index) => {
    const colors = [
      'border-red-500',
      'border-orange-500',
      'border-yellow-500',
      'border-blue-500',
      'border-cyan-500',
      'border-green-500',
      'border-purple-500',
      'border-pink-500',
      'border-red-600',
      'border-blue-600',
      'border-teal-500',
      'border-indigo-500'
    ];
    return colors[index % colors.length];
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

      {/* Models Grid - 4 Columns */}
      {!loading && filteredModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredModels.map((model, index) => (
            <div
              key={model.id}
              className={`bg-gray-900 rounded-xl border-2 ${getModelBorderColor(index)} p-6 hover:shadow-xl transition cursor-pointer`}
            >
              {/* Emoji Icon */}
              <div className="text-5xl mb-4">{getModelEmoji(model.id)}</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">{model.name}</h3>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">{model.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No models found</p>
        </div>
      )}
    </div>
  );
};

export default AIModelsDashboard;
