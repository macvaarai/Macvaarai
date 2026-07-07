import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Upload, Link as LinkIcon, Loader, Video, Phone } from 'lucide-react';
import DiagnosisResultsPage from './DiagnosisResultsPage';
import { getThemeConfig } from '../utils/themeConfig';
import { askFreeAI, isHealthQuestion } from '../utils/freeAI';

const ModelDiagnosticChatbot = ({ model, onClose }) => {
  const theme = getThemeConfig();
  const [messages, setMessages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick questions (model-specific only)
  const quickQuestions = {
    eye: ["What are symptoms of diabetic retinopathy?", "How to detect glaucoma early?", "What causes blurred vision?", "When should I get an eye checkup?"],
    ear: ["What are symptoms of ear infection?", "How to treat ear infections?", "What causes hearing loss?", "When to see an ear specialist?"],
    nose: ["What are nasal polyp symptoms?", "How to detect nasal issues?", "What causes nasal congestion?", "When to see an ENT specialist?"],
    covid: ["What are COVID-19 symptoms?", "How is COVID detected?", "What does a chest X-ray show?", "Recovery timeline for COVID?"],
    pneumonia: ["What are pneumonia symptoms?", "How is pneumonia detected?", "Types of pneumonia?", "Treatment options available?"],
    skin: ["What is skin cancer?", "How to identify melanoma?", "Benign vs malignant lesions?", "Skin cancer prevention tips?"],
    throat: ["What are throat infection symptoms?", "How to detect throat cancer?", "Bacterial vs viral infections?", "When to see a specialist?"],
    oral: ["What is oral cancer?", "Oral cancer warning signs?", "How is oral cancer detected?", "Oral health prevention tips?"],
    pharyngitis: ["What is pharyngitis?", "Pharyngitis vs regular sore throat?", "Acute vs chronic pharyngitis?", "Treatment options?"],
    malaria: ["What are malaria symptoms?", "How is malaria diagnosed?", "Malaria prevention methods?", "Treatment available?"],
    dengue: ["What are dengue symptoms?", "How is dengue transmitted?", "Dengue severity levels?", "Prevention strategies?"],
    diabetes: ["What are diabetes symptoms?", "How is diabetes detected?", "Type 1 vs Type 2 diabetes?", "Diabetes management tips?"],
    colorectal: ["What is colorectal cancer?", "Colorectal cancer warning signs?", "Screening methods available?", "Prevention strategies?"],
    lung: ["What are lung disease symptoms?", "How is lung disease detected?", "Types of lung conditions?", "Lung health prevention?"],
    onelead: ["What is a 1-lead ECG?", "What can 1-lead ECG detect?", "What do arrhythmias mean?", "When should I get an ECG?"],
    twelvelead: ["What is a 12-lead ECG?", "What abnormalities can 12-lead detect?", "What does ST-T abnormality mean?", "How to interpret results?"]
  };

  const modelQuestions = quickQuestions[model.id] || quickQuestions.covid;

  const modelMap = {
    'eye': 'eye', 'Eye AI': 'eye', 'covid': 'covid', 'COVID-19 AI': 'covid',
    'pneumonia': 'pneumonia', 'Pneumonia AI': 'pneumonia', 'skin': 'skin', 'Skin Cancer AI': 'skin',
    'malaria': 'malaria', 'Malaria AI': 'malaria', 'dengue': 'dengue', 'Dengue AI': 'dengue',
    'diabetes': 'diabetes', 'Diabetes AI': 'diabetes', 'ear': 'ear', 'Ear AI': 'ear',
    'nose': 'nose', 'Nose AI': 'nose', 'throat': 'throat', 'Throat AI': 'throat',
    'oral': 'oral', 'Oral AI': 'oral', 'pharyngitis': 'pharyngitis', 'Pharyngitis AI': 'pharyngitis',
    'colorectal': 'colorectal', 'Colorectal AI': 'colorectal', 'lung': 'lung', 'Lung AI': 'lung',
    'onelead': 'onelead', '1-Lead ECG AI': 'onelead', 'twelvelead': 'twelvelead', '12-Lead ECG AI': 'twelvelead'
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
    }
  };

  const handleTextQuestion = async (question) => {
    if (!question.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setLoading(true);

    try {
      if (isHealthQuestion(question)) {
        const aiResponse = await askFreeAI(question, model.name);
        setMessages(prev => [...prev, { type: 'bot', text: aiResponse, isAIGenerated: true }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `I'm a ${model.name} specialist. Please ask a health-related question or upload an image for analysis.`
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Try uploading an image.' }]);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile && !imagePreview) {
      alert('Please upload an image first.');
      return;
    }

    setLoading(true);
    const fileName = imageFile ? imageFile.name : 'Image URL';
    setMessages(prev => [...prev, { type: 'user', text: fileName, image: imagePreview }]);

    try {
      const modelId = modelMap[model.id] || modelMap[model.name] || model.id;

      let response;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('model_type', modelId);
        formData.append('patient_name', 'Patient');
        formData.append('patient_age', '0');

        response = await fetch(`http://localhost:8000/api/v1/diagnose/complete`, {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch(`http://localhost:8000/api/v1/diagnose/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imagePreview, model_type: modelId, patient_name: 'Patient', patient_age: '0' })
        });
      }

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.success && data.diagnosis) {
        setDiagnosisResult({
          diagnosis: data.diagnosis,
          specialist: data.consultation_options?.recommended_specialty,
          consultation_modes: data.consultation_options?.available_consultation_modes,
          currentImagePreview: imagePreview
        });

        setMessages(prev => [...prev, {
          type: 'bot',
          text: `✓ Analysis: ${data.diagnosis.label} (${(data.diagnosis.confidence * 100).toFixed(1)}% confidence)`,
          isResult: true
        }]);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (diagnosisResult) {
    return <DiagnosisResultsPage diagnosis={diagnosisResult.diagnosis} model={model} currentImagePreview={diagnosisResult.currentImagePreview} onClose={() => { setDiagnosisResult(null); setImageFile(null); setImagePreview(null); }} />;
  }

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-b from-gray-900 to-transparent p-4">
        <div className="flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{model.icon}</span>
            <h1 className="text-2xl font-bold text-white">{model.name}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowVideoCall(true)} className={`${theme.buttonPrimary} text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition`}><Video size={18} />Video</button>
            <button onClick={() => setShowVideoCall(true)} className={`bg-${theme.primary}-500 hover:bg-${theme.primary}-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition`}><Phone size={18} />Audio</button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-2 transition"><X size={24} /></button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* WELCOME SECTION */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="mb-8"><span className="text-8xl">{model.icon}</span></div>
            <h2 className="text-6xl font-bold text-center mb-4">Hello, <span className={theme.accentText}>Patient</span></h2>
            <p className="text-2xl text-gray-400 text-center mb-12">How may I help you today?</p>
            <div className="grid grid-cols-2 gap-3 max-w-2xl">
              {modelQuestions.map((q, i) => (
                <button key={i} onClick={() => handleTextQuestion(q)} className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-3 rounded-lg font-medium transition text-sm text-left">{q}</button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT MESSAGES */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'user' ? (
                    <div className="bg-gray-800 text-gray-100 rounded-lg p-4 max-w-2xl">
                      {msg.image && <img src={msg.image} alt="Analysis" className="rounded-lg mb-3 max-w-xl max-h-80 object-cover" />}
                      <p className="whitespace-pre-wrap text-base">{msg.text}</p>
                    </div>
                  ) : (
                    <div className="text-gray-200 max-w-2xl">
                      {msg.isResult && <span className="inline-block text-xs bg-green-600/30 text-green-300 px-2 py-1 rounded-full mb-2">Model Analysis</span>}
                      {msg.isAIGenerated && <span className="inline-block text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded-full mb-2">Free AI</span>}
                      <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 rounded-lg p-4 flex items-center gap-3">
                    <Loader size={20} className="animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM INPUT - ChatGPT Style */}
      <div className="bg-gradient-to-t from-gray-950 to-transparent p-4 pb-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          {/* Image Preview */}
          {imagePreview && messages.length > 0 && (
            <div className="mb-4 flex gap-3 items-center bg-gray-800/30 p-3 rounded-lg">
              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
              <div className="flex-1"><p className="text-gray-400 text-sm">{imageFile?.name || 'Image URL'}</p></div>
              <button onClick={() => { setImagePreview(null); setImageFile(null); }} className="text-gray-400 hover:text-red-400 transition">✕</button>
            </div>
          )}

          {/* Input Box */}
          <div className="bg-gray-800/30 hover:bg-gray-800/50 rounded-2xl p-4 flex items-end gap-3 transition backdrop-blur-sm border border-gray-700/50">
            <input
              ref={inputRef}
              type="text"
              placeholder={imagePreview ? "Ask about the image..." : "Ask or upload an image..."}
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-base"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const text = e.target.value;
                  e.target.value = '';
                  if (imagePreview) analyzeImage();
                  else handleTextQuestion(text);
                }
              }}
            />
            <button onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-orange-400 p-2 transition" title="Upload"><Upload size={20} /></button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <button onClick={() => { const url = prompt('Paste URL:'); if (url) setImagePreview(url); }} className="text-gray-500 hover:text-orange-400 p-2 transition" title="URL"><LinkIcon size={20} /></button>
            <button onClick={() => imagePreview ? analyzeImage() : alert('Upload image')} disabled={loading} className={`${theme.buttonPrimary} text-white p-2 rounded-lg transition disabled:opacity-50`}><Send size={20} /></button>
          </div>
        </div>
      </div>

      {/* CONSULTATION MODAL */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Book Consultation</h3>
              <button onClick={() => setShowVideoCall(false)} className="text-gray-600 hover:text-red-600"><X size={24} /></button>
            </div>
            <div className="space-y-3">
              {[{ type: 'Video Call', icon: '📹', duration: '15 mins', price: '$50', color: 'border-blue-500' }, { type: 'Audio Call', icon: '📞', duration: '10 mins', price: '$30', color: 'border-green-500' }, { type: 'In-Person', icon: '🏥', duration: '30 mins', price: '$80', color: 'border-purple-500' }, { type: 'Chat', icon: '💬', duration: 'Unlimited', price: '$20', color: 'border-orange-500' }].map((opt, i) => (
                <div key={i} className={`border-2 ${opt.color} rounded-lg p-4 hover:opacity-80 cursor-pointer transition`}><h4 className="font-bold text-gray-800">{opt.icon} {opt.type}</h4><p className="text-sm text-gray-600">{opt.duration} • {opt.price}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDiagnosticChatbot;
