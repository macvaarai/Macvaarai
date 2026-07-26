import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Target, Users, Zap } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-yellow-900 to-gray-900 text-white shadow-2xl border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="flex items-center gap-4">
            <img src="/logos/Vijay.jpeg" alt="Logo" className="h-16 w-16 rounded-full border-4 border-yellow-500 object-cover" />
            <div>
              <h1 className="text-4xl font-bold text-yellow-400">MASTERCHECK AI</h1>
              <p className="text-yellow-300">AI-Driven Early Disease Detection & Identification</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-blue-400" size={32} />
              <h2 className="text-2xl font-bold text-yellow-400">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To revolutionize healthcare delivery across Tamil Nadu government institutions by leveraging AI-driven early disease detection and identification. We aim to make advanced diagnostic tools accessible to every government healthcare facility, from state-level agencies to rural Primary Health Centers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-purple-400" size={32} />
              <h2 className="text-2xl font-bold text-yellow-400">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To create a comprehensive AI-powered health ecosystem that improves patient outcomes, reduces healthcare disparities, and enables data-driven decision-making at every level of government healthcare administration.
            </p>
          </div>
        </div>

        {/* KEY FEATURES */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-red-500">
              <Zap className="text-red-400 mb-3" size={28} />
              <h3 className="text-lg font-bold text-white mb-2">18 AI Models</h3>
              <p className="text-gray-400 text-sm">Comprehensive diagnostic models covering all major health conditions</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
              <Users className="text-blue-400 mb-3" size={28} />
              <h3 className="text-lg font-bold text-white mb-2">16 Healthcare Modules</h3>
              <p className="text-gray-400 text-sm">Specialized modules for hospitals, schools, PHCs, and more</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
              <Heart className="text-green-400 mb-3" size={28} />
              <h3 className="text-lg font-bold text-white mb-2">146 AI Agents</h3>
              <p className="text-gray-400 text-sm">Specialized AI agents for specific health conditions and departments</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
              <Target className="text-yellow-400 mb-3" size={28} />
              <h3 className="text-lg font-bold text-white mb-2">Scalable Platform</h3>
              <p className="text-gray-400 text-sm">Designed to scale from PHCs to state-level health administration</p>
            </div>
          </div>
        </div>

        {/* MODULES */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Healthcare Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'State AI Dashboard', 'District AI', 'Hospital AI', 'PHC AI',
              'School Health AI', 'Women & Maternal AI', 'Child Health AI', 'Senior Citizen AI',
              'Police Health AI', 'Employee Health AI', 'Mobile Medical Van AI', 'Telemedicine AI',
              'Public Health Surveillance AI', 'Laboratory AI', 'Emergency AI', 'AI Model Marketplace'
            ].map((module, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-4 shadow-lg border-l-4 border-yellow-500">
                <p className="text-white font-bold text-sm">{module}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT MASTERCHECK */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-yellow-500 mb-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">About MasterCheckAI</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              MasterCheckAI is an enterprise-grade healthcare AI platform developed by MacvaarAI to serve government healthcare institutions across Tamil Nadu. It combines cutting-edge artificial intelligence with user-friendly interfaces to democratize access to advanced diagnostic capabilities.
            </p>
            <p>
              The platform is specifically designed for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>State-level health officials and policymakers</li>
              <li>District health administration and coordination</li>
              <li>Hospital management and clinical teams</li>
              <li>Primary Health Centers and rural clinics</li>
              <li>School health programs</li>
              <li>Women's health and maternal care services</li>
              <li>Police and employee occupational health</li>
              <li>And many more specialized healthcare domains</li>
            </ul>
            <p className="mt-4">
              By integrating AI-driven diagnostics at every level of government healthcare, MasterCheckAI enables early disease detection, improves patient outcomes, and supports evidence-based healthcare administration.
            </p>
          </div>
        </div>

        {/* TECHNOLOGY STACK */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-yellow-300 font-bold mb-2">Frontend</h3>
              <p className="text-gray-400">React, Vite, Tailwind CSS</p>
            </div>
            <div>
              <h3 className="text-yellow-300 font-bold mb-2">Backend</h3>
              <p className="text-gray-400">FastAPI, Python, Machine Learning</p>
            </div>
            <div>
              <h3 className="text-yellow-300 font-bold mb-2">AI/ML</h3>
              <p className="text-gray-400">Deep Learning, Computer Vision, NLP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
