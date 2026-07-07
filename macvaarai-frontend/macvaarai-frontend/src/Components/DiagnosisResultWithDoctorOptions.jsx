import React, { useState } from 'react';
import { Download, Phone, Video, MessageSquare, MapPin, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function DiagnosisResultWithDoctorOptions({
  diagnosis,
  reportPdf,
  consultationOptions,
  onSelectDoctor
}) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const downloadReport = async () => {
    try {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${reportPdf}`;
      link.download = `diagnosis_report_${new Date().getTime()}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const proceedWithConsultation = () => {
    if (selectedMode) {
      onSelectDoctor({
        consultation_mode: selectedMode,
        specialty: consultationOptions.recommended_specialty,
        urgency: consultationOptions.urgency_level,
        fee: consultationOptions.consultation_fee
      });
      setShowConfirmation(true);
    }
  };

  // Confidence color based on value
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.85) return 'text-green-500';
    if (confidence >= 0.70) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Urgency color and icon
  const getUrgencyStyle = (urgency) => {
    if (urgency.includes('URGENT')) {
      return { bg: 'bg-red-900', text: 'text-red-100', icon: '🚨' };
    } else if (urgency.includes('HIGH')) {
      return { bg: 'bg-orange-900', text: 'text-orange-100', icon: '⚠️' };
    } else if (urgency.includes('MEDIUM')) {
      return { bg: 'bg-blue-900', text: 'text-blue-100', icon: 'ℹ️' };
    }
    return { bg: 'bg-gray-800', text: 'text-gray-200', icon: '✓' };
  };

  const urgencyStyle = getUrgencyStyle(consultationOptions.urgency_level);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">AI DIAGNOSTIC ANALYSIS COMPLETE</h1>
          <p className="text-blue-200 mt-1">Professional diagnosis report ready</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Diagnosis Result */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {diagnosis.label}
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <p className="text-gray-400 text-sm">Confidence Level</p>
                    <p className={`text-3xl font-bold ${getConfidenceColor(diagnosis.confidence)}`}>
                      {diagnosis.confidence_percent}
                    </p>
                  </div>
                  <div className="border-l border-gray-600 pl-4">
                    <p className="text-gray-400 text-sm">Analysis Method</p>
                    <p className="text-white font-semibold">{diagnosis.api_used}</p>
                  </div>
                </div>
              </div>
              <CheckCircle className="text-green-500" size={48} />
            </div>
          </div>

          {/* Download Report Section */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Professional Report</h3>
                <p className="text-gray-400 text-sm">PDF report with detailed analysis and recommendations</p>
              </div>
              <button
                onClick={downloadReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Download size={20} /> Download PDF
              </button>
            </div>
          </div>

          {/* Urgency Alert */}
          <div className={`${urgencyStyle.bg} rounded-lg p-6 border-2 border-current`}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">{urgencyStyle.icon}</span>
              <div>
                <h3 className={`text-lg font-bold ${urgencyStyle.text}`}>
                  {consultationOptions.urgency_level}
                </h3>
                <p className="text-gray-200 mt-2">
                  Please consult with a healthcare professional as soon as possible. This AI analysis is preliminary and requires professional evaluation.
                </p>
              </div>
            </div>
          </div>

          {/* All Predictions */}
          {diagnosis.all_predictions && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Prediction Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(diagnosis.all_predictions)
                  .sort((a, b) => b[1] - a[1])
                  .map(([condition, confidence]) => (
                    <div key={condition} className="flex items-center justify-between">
                      <span className="text-gray-300">{condition}</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full transition-all"
                            style={{ width: `${confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-bold w-16 text-right">
                          {(confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Doctor Recommendation */}
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
            <h3 className="text-lg font-bold text-white mb-4">Recommended Specialist</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Recommended Specialty</p>
                <p className="text-2xl font-bold text-blue-400 mt-2">
                  👨‍⚕️ {consultationOptions.recommended_specialty}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Consultation Fee</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  ₹{consultationOptions.consultation_fee}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Estimated Wait Time</p>
                <p className="text-lg font-bold text-yellow-400 mt-2 flex items-center gap-2">
                  <Clock size={18} /> {consultationOptions.estimated_wait_time}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Next Available</p>
                <p className="text-lg font-bold text-purple-400 mt-2">
                  Within {consultationOptions.estimated_wait_time.split('-')[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Mode Selection */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Select Consultation Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultationOptions.available_consultation_modes.map((mode, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMode(mode.mode)}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer text-left ${
                    selectedMode === mode.mode
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-600 bg-gray-700/20 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{mode.icon}</span>
                    {selectedMode === mode.mode && (
                      <CheckCircle className="text-blue-400" size={20} />
                    )}
                  </div>
                  <h4 className="text-white font-bold">{mode.mode}</h4>
                  <p className="text-gray-400 text-sm mt-2">
                    <Clock size={14} className="inline mr-1" /> {mode.duration}
                  </p>
                  <p className="text-yellow-400 text-sm mt-1">
                    <DollarSign size={14} className="inline mr-1" /> {mode.cost}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-red-100 mb-2">⚠️ Important Medical Disclaimer</h4>
                <p className="text-red-100 text-sm">
                  This AI analysis is a preliminary screening tool only and NOT a professional medical diagnosis.
                  Always consult with a qualified healthcare professional for accurate diagnosis and treatment.
                  In case of emergency, contact emergency services immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={proceedWithConsultation}
              disabled={!selectedMode}
              className={`flex-1 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                selectedMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Video size={20} /> Book {selectedMode || 'Consultation'}
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition"
            >
              Back
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 max-w-md">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-white text-center mb-4">Ready to Book!</h2>
              <p className="text-gray-300 text-center mb-6">
                You've selected <span className="font-bold text-blue-400">{selectedMode}</span> consultation
                with a <span className="font-bold text-blue-400">{consultationOptions.recommended_specialty}</span>
              </p>
              <p className="text-gray-400 text-center text-sm mb-6">
                Next, you'll see available doctors and time slots based on your preferences.
              </p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Continue to Doctor Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
