import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Upload, Link as LinkIcon, Loader } from 'lucide-react';

const ModelDiagnosticChatbot = ({ model, onClose }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: `Welcome to ${model.name} Diagnostic AI! Upload an image or provide a URL to analyze.` }
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const modelEndpoints = {
    eye: '/predict/eye',
    covid: '/predict/covid',
    diabetes: '/predict/diabetes',
    pneumonia: '/predict/pneumonia',
    ecg: '/predict/ecg',
    stroke: '/predict/stroke',
    colorectal: '/predict/colorectal',
    oral: '/predict/oral',
    lung: '/predict/lung',
    tb: '/predict/tb',
    malaria: '/predict/malaria',
    dengue: '/predict/dengue',
    skin: '/predict/skin',
    kidney: '/predict/kidney',
    ear: '/predict/ear',
    nose: '/predict/nose',
    throat: '/predict/throat',
    pharyngitis: '/predict/pharyngitis'
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setImageUrl('');
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setImageFile(null);
      setImagePreview(imageUrl);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile && !imagePreview) {
      setMessages([...messages, { type: 'bot', text: 'Please upload an image first.' }]);
      return;
    }

    setLoading(true);
    const userMsg = imageFile ? `Uploaded: ${imageFile.name}` : `URL: ${imageUrl}`;
    setMessages(prev => [...prev, { type: 'user', text: userMsg, image: imagePreview }]);

    try {
      let response;
      const endpoint = modelEndpoints[model.id] || '/predict/analyze';

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        response = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imageUrl })
        });
      }

      const data = await response.json();

      if (data.status === 'success' || data.prediction) {
        const result = data.prediction || data.result || data;

        let resultText = '';
        let resultData = {};

        if (typeof result === 'string') {
          resultText = result;
        } else if (typeof result === 'object') {
          resultData = result;

          // Format the result nicely
          if (result.label) {
            resultText = `
✅ **DIAGNOSIS:** ${result.label}
📊 **Confidence:** ${(result.confidence * 100).toFixed(2)}%
📝 **Summary:** ${result.summary || 'Analysis complete'}
            `.trim();
          } else if (result.prediction) {
            resultText = `
✅ **RESULT:** ${result.prediction}
📊 **Confidence:** ${(result.confidence * 100).toFixed(2)}%
            `.trim();
          } else if (result.class) {
            resultText = `
✅ **CLASS:** ${result.class}
📊 **Score:** ${(result.score * 100).toFixed(2)}%
            `.trim();
          } else {
            // General format for any object
            resultText = Object.entries(result)
              .filter(([key]) => !key.startsWith('_'))
              .map(([key, value]) => {
                if (typeof value === 'number') {
                  return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${(value * 100).toFixed(2)}%`;
                }
                return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
              })
              .join('\n');
          }
        }

        setMessages(prev => [...prev, {
          type: 'bot',
          text: resultText || JSON.stringify(result, null, 2),
          isResult: true
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `✓ Analysis complete! ${data.message || 'Diagnostic analysis finished.'}`
        }]);
      }

      setImageFile(null);
      setImagePreview(null);
      setImageUrl('');
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `Error: ${error.message}. Make sure image is valid and server is running.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border-2 border-orange-500">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-orange-900 text-white p-4 border-b border-orange-500 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-orange-400">{model.icon} {model.name}</h2>
            <p className="text-gray-300 text-sm">AI Diagnostic Analysis</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-400 p-2">
            <X size={24} />
          </button>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'user' ? (
                <div className="bg-orange-600 text-white rounded-lg p-3 max-w-xs">
                  {msg.image && <img src={msg.image} alt="Analysis" className="rounded mb-2 max-w-xs max-h-64 object-cover" />}
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                </div>
              ) : msg.isResult ? (
                <div className="bg-gradient-to-br from-green-900 to-green-800 text-white rounded-lg p-4 max-w-md border-2 border-green-500 shadow-lg">
                  <div className="text-sm whitespace-pre-wrap font-semibold leading-relaxed">{msg.text}</div>
                </div>
              ) : (
                <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 rounded-lg p-3 flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <span>Analyzing image...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="border-t border-orange-500 bg-gray-900 p-4 space-y-4">
          {/* Upload Mode Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setUploadMode('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition ${
                uploadMode === 'file'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Upload size={18} /> Upload File
            </button>
            <button
              onClick={() => setUploadMode('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition ${
                uploadMode === 'url'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <LinkIcon size={18} /> Image URL
            </button>
          </div>

          {/* File Upload */}
          {uploadMode === 'file' && (
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 border-2 border-dashed border-gray-500"
              >
                <Upload size={20} />
                Click to upload image or drag & drop
              </button>
              {imageFile && (
                <p className="text-green-400 text-sm mt-2">✓ {imageFile.name}</p>
              )}
            </div>
          )}

          {/* URL Input */}
          {uploadMode === 'url' && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg placeholder-gray-400"
              />
              <button
                onClick={handleUrlSubmit}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold"
              >
                Load
              </button>
            </div>
          )}

          {/* Preview */}
          {imagePreview && (
            <div className="bg-gray-700 p-3 rounded-lg">
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded object-contain" />
              <button
                onClick={() => { setImagePreview(null); setImageUrl(''); setImageFile(null); }}
                className="text-red-400 text-sm mt-2"
              >
                ✕ Clear image
              </button>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyzeImage}
            disabled={loading || !imagePreview}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send size={20} />
                Analyze Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelDiagnosticChatbot;
