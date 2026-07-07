// Centralized AI Models Configuration
// All 16 medical AI models with metadata

export const AI_MODELS = [
  { id: 'eye', name: 'Eye AI', icon: '👁️', price: '$$$', description: 'Retinal disease detection' },
  { id: 'covid', name: 'COVID-19 AI', icon: '🦠', price: '$$$', description: 'Chest X-ray analysis' },
  { id: 'pneumonia', name: 'Pneumonia AI', icon: '🫁', price: '$$$', description: 'Pneumonia detection' },
  { id: 'skin', name: 'Skin Cancer AI', icon: '🩹', price: '$$$', description: 'Skin lesion analysis' },
  { id: 'malaria', name: 'Malaria AI', icon: '🦟', price: '$$$', description: 'Malaria parasite detection' },
  { id: 'dengue', name: 'Dengue AI', icon: '🦟', price: '$$$', description: 'Dengue fever detection' },
  { id: 'diabetes', name: 'Diabetes AI', icon: '💉', price: '$$$', description: 'Diabetes screening' },
  { id: 'ear', name: 'Ear AI', icon: '👂', price: '$$$', description: 'Ear condition analysis' },
  { id: 'nose', name: 'Nose AI', icon: '👃', price: '$$$', description: 'Nasal condition detection' },
  { id: 'throat', name: 'Throat AI', icon: '🗣️', price: '$$$', description: 'Throat disease detection' },
  { id: 'oral', name: 'Oral AI', icon: '🦷', price: '$$$', description: 'Oral health analysis' },
  { id: 'pharyngitis', name: 'Pharyngitis AI', icon: '🗣️', price: '$$$', description: 'Pharyngitis detection' },
  { id: 'colorectal', name: 'Colorectal AI', icon: '🏥', price: '$$$', description: 'Colorectal cancer screening' },
  { id: 'lung', name: 'Lung AI', icon: '🫁', price: '$$$', description: 'Lung disease detection' },
  { id: 'onelead', name: '1-Lead ECG AI', icon: '❤️', price: '$$$', description: 'Single-lead ECG analysis' },
  { id: 'twelvelead', name: '12-Lead ECG AI', icon: '❤️', price: '$$$', description: 'Full ECG analysis' }
];

// Get model by ID
export const getModelById = (id) => AI_MODELS.find(m => m.id === id);

// Get all model IDs
export const getAllModelIds = () => AI_MODELS.map(m => m.id);

// Get all model names
export const getAllModelNames = () => AI_MODELS.map(m => m.name);
