import React, { useState, useEffect } from 'react';
import { Upload, Loader, Download, Save } from 'lucide-react';

const HospitalAIDiagnosisPortal = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchAvailableModels();
    loadDiagnosisHistory();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/available-models`);
      const data = await response.json();
      if (data.status === 'success') {
        setModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Failed to load models');
    }
  };

  const loadDiagnosisHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
      setDiagnosisHistory(history);
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('model_id', selectedModel);
      formData.append('file', selectedFile);

      const response = await fetch(`${apiUrl}/api/ai-diagnosis`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data);

        const diagnosis = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          modelName: data.model_name,
          disease: data.label,
          confidence: data.confidence_percentage,
          fileName: data.image_name
        };

        const updatedHistory = [diagnosis, ...diagnosisHistory].slice(0, 10);
        setDiagnosisHistory(updatedHistory);
        localStorage.setItem('diagnosisHistory', JSON.stringify(updatedHistory));
      } else {
        setError(data.message || 'Analysis failed');
        setResult(null);
      }
    } catch (err) {
      setError('Analysis error: ' + err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setSelectedModel(models.length > 0 ? models[0].id : '');
    setError('');
  };

  const getModelName = (modelId) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  const getConfidenceColor = (confidence) => {
    const percent = parseFloat(confidence);
    if (percent >= 90) return 'bg-green-100 text-green-800';
    if (percent >= 75) return 'bg-blue-100 text-blue-800';
    if (percent >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">AI Diagnosis Portal</h1>
          <p className="text-gray-600 mt-2">Upload medical images for AI-powered diagnosis</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Input Section */}
          <div className="col-span-2 space-y-6">
            {/* Model Selection */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-lg font-bold text-gray-900 mb-4">Select AI Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-lg font-bold text-gray-900 mb-4">Upload Medical Image</label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
                onClick={() => document.getElementById('fileInput').click()}>
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('fileInput').click();
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload size={48} className="text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">Click to upload or drag and drop</p>
                      <p className="text-gray-600 text-sm">PNG, JPG, DICOM (max 50MB)</p>
                    </div>
                  </div>
                )}
              </div>

              <input
                id="fileInput"
                type="file"
                accept="image/*,.dcm"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !selectedFile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Analyze Image
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-6">
            {/* Results Display */}
            {result && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Diagnosis Result</h2>

                {/* Model Name */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-gray-600 text-sm font-semibold">Model Used</p>
                  <p className="text-lg font-bold text-gray-900">{result.model_name}</p>
                </div>

                {/* Disease/Condition */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-gray-600 text-sm font-semibold">Diagnosis</p>
                  <p className="text-2xl font-bold text-gray-900">{result.label}</p>
                </div>

                {/* Confidence */}
                <div className="mb-6">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Confidence Score</p>
                  <div className={`${getConfidenceColor(result.confidence_percentage)} px-4 py-3 rounded-lg text-center`}>
                    <p className="text-3xl font-bold">{result.confidence_percentage}</p>
                  </div>
                </div>

                {/* Summary */}
                {result.summary && (
                  <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Summary</p>
                    <p className="text-gray-800">{result.summary}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition text-sm">
                    <Save size={18} />
                    Save
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition text-sm">
                    <Download size={18} />
                    Report
                  </button>
                </div>
              </div>
            )}

            {/* Recent Diagnoses */}
            {diagnosisHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Diagnoses</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {diagnosisHistory.map((diagnosis) => (
                    <div key={diagnosis.id} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{diagnosis.modelName}</p>
                      <p className="text-sm text-gray-600">{diagnosis.disease}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`${getConfidenceColor(diagnosis.confidence)} px-2 py-1 rounded text-xs font-bold`}>
                          {diagnosis.confidence}
                        </span>
                        <span className="text-xs text-gray-500">{diagnosis.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Available Models */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available AI Models ({models.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedModel === model.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <p className="font-bold text-gray-900 text-sm">{model.name}</p>
                <p className="text-gray-600 text-xs mt-1">{model.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-semibold">
                  {model.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalAIDiagnosisPortal;
