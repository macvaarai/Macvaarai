// Centralized AI Models Configuration
// All 16 medical AI models with metadata

export const AI_MODELS = [
  { id: 'eye', name: 'Eye AI', icon: '👁️', price: '$$$', description: 'Screen vision health and detect eye-related issues using AI.' },
  { id: 'covid', name: 'COVID-19 AI', icon: '🦠', price: '$$$', description: 'Chest X-ray analysis and COVID-19 screening using machine learning.' },
  { id: 'pneumonia', name: 'Pneumonia AI', icon: '🫁', price: '$$$', description: 'Screen and detect early pneumonia risks with AI.' },
  { id: 'skin', name: 'Dental AI', icon: '🦷', price: '$$$', description: 'Dental health checks, cavity detection, and oral hygiene tips powered by AI.' },
  { id: 'malaria', name: 'Malaria AI', icon: '🦟', price: '$$$', description: 'Screen for malaria symptoms and provide early advice.' },
  { id: 'dengue', name: 'Dengue AI', icon: '🦟', price: '$$$', description: 'Screen for dengue symptoms and provide AI-driven advice.' },
  { id: 'diabetes', name: 'Diabetes AI', icon: '💉', price: '$$$', description: 'Monitor glucose trends, risk factors, and receive diabetic care advice.' },
  { id: 'ear', name: 'Ear AI', icon: '👂', price: '$$$', description: 'Screen for common ear issues and receive hearing health suggestions.' },
  { id: 'nose', name: 'Nose AI', icon: '👃', price: '$$$', description: 'AI-driven nasal health checks for allergies, congestion, and sinus care.' },
  { id: 'throat', name: 'Throat AI', icon: '🗣️', price: '$$$', description: 'Assess throat symptoms and receive tailored advice for throat health.' },
  { id: 'oral', name: 'Oral AI', icon: '🦷', price: '$$$', description: 'Screen oral hygiene, gum disease, and mouth health with AI.' },
  { id: 'pharyngitis', name: 'Advanced 1 Lead ECG', icon: '❤️', price: '$$$', description: 'Screen for respiratory conditions and get lung health insights using AI.' },
  { id: 'colorectal', name: 'Heart AI 12 lead', icon: '❤️', price: '$$$', description: 'Comprehensive 12-lead ECG interpretation for advanced cardiac assessment.' },
  { id: 'lung', name: 'Lungs AI', icon: '🫁', price: '$$$', description: 'Screen for respiratory conditions and get lung health insights using AI.' },
  { id: 'onelead', name: 'HeartAI 1 lead', icon: '❤️', price: '$$$', description: 'Quick ECG analysis using a single-lead input for early heart health screening.' },
  { id: 'twelvelead', name: 'Heart AI 12 lead', icon: '❤️', price: '$$$', description: 'Comprehensive 12-lead ECG interpretation for advanced cardiac assessment.' },
  { id: 'vitamind', name: 'Vitamin Deficiency AI', icon: '🥗', price: '$$$', description: 'Detect and assess vitamin deficiency symptoms with AI-powered nutrition screening.' }
];

// Get model by ID
export const getModelById = (id) => AI_MODELS.find(m => m.id === id);

// Get all model IDs
export const getAllModelIds = () => AI_MODELS.map(m => m.id);

// Get all model names
export const getAllModelNames = () => AI_MODELS.map(m => m.name);
