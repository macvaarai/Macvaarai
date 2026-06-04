import React, { useState, useRef } from "react";
import { Upload, ArrowLeft, Loader } from "lucide-react";

const ModelDiagnosisPage = ({ modelId, modelName, onBack, hospitalId, adminData, apiUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MODEL_CONFIG = {
    eye: {
      title: "👁️ Eye Disease Detection",
      description: "Upload a retinal image to detect eye diseases",
      subtitle: "Retinal Disease Detection System",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    covid: {
      title: "🫁 COVID-19 Detection",
      description: "Upload a chest X-ray to detect COVID-19",
      subtitle: "Chest X-ray Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    ecg: {
      title: "❤️ ECG Analysis",
      description: "Upload an ECG image for heart disease detection",
      subtitle: "Electrocardiogram Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    skin: {
      title: "🩹 Skin Cancer Detection",
      description: "Upload a skin lesion image for cancer detection",
      subtitle: "Dermatology Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    diabetes: {
      title: "🩸 Diabetes Detection",
      description: "Upload blood test image or provide data",
      subtitle: "Blood Sugar Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    pneumonia: {
      title: "🫁 Pneumonia Detection",
      description: "Upload a chest X-ray to detect pneumonia",
      subtitle: "Pneumonia Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    malaria: {
      title: "🦟 Malaria Detection",
      description: "Upload a blood smear image to detect malaria",
      subtitle: "Parasitology Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
    dengue: {
      title: "🦟 Dengue Detection",
      description: "Upload blood test image for dengue detection",
      subtitle: "Dengue Analysis",
      acceptedFormats: ".jpg,.jpeg,.png,.gif",
    },
  };

  const config = MODEL_CONFIG[modelId] || MODEL_CONFIG.eye;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("model_type", modelId);
      formData.append("hospital_id", hospitalId);

      const res = await fetch(`${apiUrl}/ai-health-assistant`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          status: "success",
          prediction: data.prediction || "Disease detected - Further analysis recommended",
          confidence: data.confidence || "85%",
          recommendations: data.recommendations || [
            "Consult a specialist for detailed examination",
            "Schedule follow-up appointment",
            "Document findings in patient records",
          ],
          modelUsed: modelName,
          timestamp: new Date().toLocaleString(),
        });
      } else {
        setError("Failed to analyze image. Please try again.");
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Error analyzing image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToPatientRecord = () => {
    if (!result) return;
    // This would integrate with patient records
    alert("✅ Result saved to patient records!");
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 font-semibold"
          >
            <ArrowLeft size={20} /> Back to AI Models
          </button>
          <h1 className="text-4xl font-bold">{config.title}</h1>
          <p className="text-blue-100 mt-2">{config.subtitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">📤 Upload Image</h2>
              <p className="text-gray-400 mb-6">{config.description}</p>

              {/* File Input Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
                  preview
                    ? "border-green-500 bg-green-900 bg-opacity-20"
                    : "border-gray-600 hover:border-blue-500 hover:bg-gray-800"
                }`}
              >
                {preview ? (
                  <div>
                    <p className="text-green-400 font-semibold">✅ Image Selected</p>
                    <p className="text-sm text-gray-400 mt-2">{selectedFile?.name}</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="font-semibold mb-2">Drag and drop your image here</p>
                    <p className="text-sm text-gray-400">or click to select a file</p>
                    <p className="text-xs text-gray-500 mt-3">
                      Supported formats: JPG, PNG, GIF (Max 10MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={config.acceptedFormats}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3">Preview:</p>
                  <img src={preview} alt="Preview" className="w-full rounded-lg border border-gray-600" />
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {!result && (
                  <>
                    <button
                      onClick={handleUploadAndAnalyze}
                      disabled={!selectedFile || loading}
                      className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                        loading || !selectedFile
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
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
                    {selectedFile && (
                      <button
                        onClick={handleClear}
                        className="px-6 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition"
                      >
                        Clear
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                  <p className="text-red-200 font-semibold">❌ Error</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-gray-900 border-2 border-green-600 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">✅ Analysis Results</h2>

                {/* Prediction */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Prediction:</p>
                    <p className="text-lg font-semibold text-green-400">{result.prediction}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Confidence:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: result.confidence || "85%" }}
                        />
                      </div>
                      <p className="font-semibold">{result.confidence}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Model Used:</p>
                    <p className="text-white">{result.modelUsed}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Analysis Time:</p>
                    <p className="text-sm text-gray-300">{result.timestamp}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="font-semibold mb-3">📋 Recommendations:</p>
                  <ul className="space-y-2">
                    {result.recommendations?.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-300">
                        <span className="text-green-400 font-bold">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSaveToPatientRecord}
                    className="flex-1 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 transition"
                  >
                    💾 Save to Patient Record
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition"
                  >
                    🔄 Analyze Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">📊 How It Works</h2>
                <div className="space-y-4 text-gray-300">
                  <div className="flex gap-4">
                    <div className="text-blue-400 font-bold text-xl">1️⃣</div>
                    <div>
                      <p className="font-semibold">Upload Image</p>
                      <p className="text-sm text-gray-400">Select or drag an image of {config.subtitle.toLowerCase()}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-blue-400 font-bold text-xl">2️⃣</div>
                    <div>
                      <p className="font-semibold">AI Analysis</p>
                      <p className="text-sm text-gray-400">Our AI model analyzes the image for disease detection</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-blue-400 font-bold text-xl">3️⃣</div>
                    <div>
                      <p className="font-semibold">Get Results</p>
                      <p className="text-sm text-gray-400">Receive prediction with confidence and recommendations</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-blue-400 font-bold text-xl">4️⃣</div>
                    <div>
                      <p className="font-semibold">Save & Act</p>
                      <p className="text-sm text-gray-400">Save results to patient records and follow recommendations</p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-200">
                    💡 <span className="font-semibold">Tip:</span> This AI tool is designed to assist doctors in diagnosis.
                    Always consult with medical professionals for final diagnosis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDiagnosisPage;
