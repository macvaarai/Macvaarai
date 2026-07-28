import React, { useState } from 'react';
import { X, Download, Phone, Video, MessageCircle, MapPin, Clock, Loader, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getThemeConfig } from '../utils/themeConfig';

const DiagnosisResultsPage = ({ diagnosis, model, imagePreview, onClose, currentImagePreview }) => {
  const theme = getThemeConfig();
  const navigate = useNavigate();
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [patientName, setPatientName] = useState('Patient');
  const [patientAge, setPatientAge] = useState('--');

  const displayImage = imagePreview || currentImagePreview;

  const getOrgLogoPath = () => {
    if (theme.name === 'vijaycare') return '/logos/Vijay.jpeg';
    if (theme.name === 'modi') return '/logos/Modi.jpeg';
    return '/logos/Vijay.jpeg';
  };

  const consultationOptions = [
    { type: 'Video Call', icon: Video, price: '$50', duration: '15 mins', color: 'bg-blue-500' },
    { type: 'Audio Call', icon: Phone, price: '$30', duration: '10 mins', color: 'bg-green-500' },
    { type: 'In-Person', icon: MapPin, price: '$80', duration: '30 mins', color: 'bg-purple-500' },
    { type: 'Chat', icon: MessageCircle, price: '$20', duration: 'Unlimited', color: 'bg-orange-500' }
  ];

  const downloadReport = async () => {
    setDownloadingReport(true);
    try {
      const element = document.getElementById('report-content');
      if (!element) {
        alert('Report content not found. Please try again.');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toLocaleString('en-IN').replace(/[\/,:]/g, '-');
      const filename = `${model.name}_Report_${timestamp}.pdf`;

      pdf.save(filename);
      alert('✅ Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('❌ Error downloading report. Please try again.\n\nError: ' + error.message);
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl my-2 mx-2 sm:mx-4 sm:my-4">
        {/* HEADER */}
        <div className={`${theme.headerGradient} text-white p-3 sm:p-6 flex justify-between items-center`}>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 sm:p-2 rounded transition flex-shrink-0"
              title="Go Back"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-3xl font-bold truncate">Diagnosis Report</h1>
              <p className="opacity-90 text-xs sm:text-base truncate">{model.name}</p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-3 items-center flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 sm:p-2 rounded transition"
              title="Go to Home"
            >
              <Home size={18} className="sm:w-6 sm:h-6" />
            </button>
            <button onClick={onClose} className="text-white hover:opacity-80 p-1 sm:p-2 rounded transition">
              <X size={20} className="sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>

        {/* REPORT CONTENT */}
        <div id="report-content" className="p-4 sm:p-8 md:p-12 bg-white">
          {/* LOGOS & BRANDING */}
          <div className="flex justify-between items-center mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-gray-400 gap-2 sm:gap-4">
            <img src="/logos/Macvaar.jpg" alt="MACVAARAI" className="h-12 sm:h-16 md:h-20 object-contain" />
            <div className="text-center flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black">Macvaar AI</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 mt-0.5 sm:mt-1 font-semibold hidden sm:block">AI-Driven Early Disease Detection</p>
            </div>
            <img src={getOrgLogoPath()} alt="Organization" className="h-12 sm:h-16 md:h-20 object-contain" />
          </div>

          {/* DOWNLOAD BUTTON */}
          <div className="mb-4 sm:mb-6 flex justify-end">
            <button
              onClick={downloadReport}
              disabled={downloadingReport}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 sm:px-6 py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-base transition shadow-lg disabled:opacity-50`}
              title="Download report as PDF"
            >
              {downloadingReport ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span className="hidden sm:inline">📥 Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          </div>

          {/* PATIENT DETAILS - RESPONSIVE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-gray-400">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">Patient Name</p>
              <p className="text-sm sm:text-lg md:text-xl font-bold text-black truncate">{patientName}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">Age</p>
              <p className="text-sm sm:text-lg md:text-xl font-bold text-black">{patientAge} yrs</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">Test Date</p>
              <p className="text-xs sm:text-sm md:text-base font-bold text-black">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">Report ID</p>
              <p className="text-xs sm:text-sm font-bold text-black font-mono truncate">RPT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
            </div>
          </div>

          {/* IMAGE & RESULTS - RESPONSIVE STACK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-gray-400">
            {/* LEFT: IMAGE */}
            <div className="flex flex-col">
              <p className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-4">Medical Image</p>
              <div className="border-2 border-gray-400 p-2 sm:p-4 bg-gray-50 flex-grow flex items-center justify-center">
                {displayImage ? (
                  <img src={displayImage} alt="Medical" className="w-full h-auto object-contain max-h-80 sm:max-h-[500px] md:max-h-[600px]" />
                ) : (
                  <div className="h-64 sm:h-96 flex items-center justify-center bg-gray-200 w-full">
                    <p className="text-gray-500 text-sm font-semibold">No Image</p>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 text-center font-semibold truncate">{model.name}</p>
            </div>

            {/* RIGHT: RESULTS */}
            <div className="space-y-3 sm:space-y-4">
              {/* PRIMARY DIAGNOSIS */}
              <div className="bg-green-50 border-2 border-green-600 p-3 sm:p-6 rounded-lg">
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">PRIMARY DIAGNOSIS</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-green-700 break-words">{diagnosis.label}</p>
              </div>

              {/* CONFIDENCE SCORE */}
              <div className="bg-blue-50 border-2 border-blue-600 p-3 sm:p-6 rounded-lg">
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Confidence Score</p>
                <p className="text-2xl sm:text-4xl font-black text-blue-600 mb-2 sm:mb-3">{(diagnosis.confidence * 100).toFixed(1)}%</p>
                <div className="w-full bg-gray-300 border-2 border-gray-400 h-3 sm:h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all"
                    style={{ width: `${diagnosis.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-700 font-semibold mt-2 sm:mt-3">
                  Reliability: <span className="text-blue-700">{diagnosis.confidence > 0.85 ? 'HIGH' : diagnosis.confidence > 0.70 ? 'MODERATE' : 'PRELIMINARY'}</span>
                </p>
              </div>

              {/* CLINICAL SUMMARY */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 sm:p-4 rounded">
                <p className="text-xs font-bold text-gray-700 mb-1 sm:mb-2">Clinical Summary</p>
                <p className="text-xs sm:text-sm text-gray-800">{diagnosis.summary || 'AI analysis completed. Please consult with a qualified physician for medical interpretation.'}</p>
              </div>
            </div>
          </div>


          {/* CLINICAL REPORT & RECOMMENDATIONS */}
          <div className="py-4 sm:py-6 border-b-2 border-gray-400">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">📋 Clinical Report</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded border-l-4 border-blue-600">
                <p className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">Analysis Summary</p>
                <p className="text-xs sm:text-sm text-gray-800">
                  The AI analysis indicates a primary diagnosis of <span className="font-bold text-blue-700">{diagnosis.label}</span> with a confidence level of <span className="font-bold text-blue-700">{(diagnosis.confidence * 100).toFixed(1)}%</span>. This finding is based on visual analysis of the provided medical image using machine learning algorithms trained on medical datasets.
                </p>
              </div>

              <div className="bg-green-50 p-3 sm:p-4 rounded border-l-4 border-green-600">
                <p className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">✓ Recommendations</p>
                <ul className="text-xs sm:text-sm text-gray-800 space-y-1 sm:space-y-2 list-none">
                  <li>• Consult with a qualified healthcare professional</li>
                  <li>• Share this report with your doctor</li>
                  <li>• Undergo additional clinical tests if needed</li>
                  <li>• Follow doctor's guidance for diagnosis confirmation</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-3 sm:p-4 rounded border-l-4 border-purple-600">
                <p className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">📌 Important Notes</p>
                <p className="text-xs sm:text-sm text-gray-800">
                  This report is generated using AI for preliminary screening. It must be reviewed by qualified medical professionals before any clinical decisions are made.
                </p>
              </div>
            </div>
          </div>

          {/* IMPORTANT DISCLAIMER */}
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3 sm:p-4 rounded">
            <p className="text-sm font-bold text-gray-800 mb-1 sm:mb-2">⚠️ Important Disclaimer</p>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
              This AI-assisted report is for preliminary screening purposes only. Please consult a qualified healthcare professional for proper medical evaluation and treatment.
            </p>
          </div>
        </div>

        {/* CONSULTATION SECTION */}
        <div className="p-4 sm:p-8 bg-gray-50 border-t border-gray-300 space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">💬 Book Consultation</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {consultationOptions.map((option, idx) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedConsultation(option.type)}
                  className={`p-2 sm:p-6 rounded-lg border-2 transition ${
                    selectedConsultation === option.type
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className={`${option.color} text-white w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-3`}>
                    <IconComponent size={16} className="sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-0.5 sm:mb-1">{option.type}</h4>
                  <p className="text-sm sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">{option.price}</p>
                  <p className="text-xs text-gray-600 flex items-center justify-center gap-0.5">
                    <Clock size={10} className="sm:w-3 sm:h-3" />
                    {option.duration}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedConsultation && (
            <div className="bg-white p-3 sm:p-6 rounded-lg border-2 border-blue-600">
              <p className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-4">Selected: {selectedConsultation}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition text-sm sm:text-base">
                  📞 Proceed to Booking
                </button>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition text-sm sm:text-base"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-4 px-3 sm:px-6 rounded-lg transition text-sm sm:text-base"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResultsPage;
