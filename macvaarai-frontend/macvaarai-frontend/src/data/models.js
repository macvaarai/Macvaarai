// Comprehensive AI Models organized by Module
// Each model is associated with specific modules for smart allocation

export const AI_MODELS = [
  // STATE AI DASHBOARD
  { id: 'heat-map', name: 'Disease Heat Map AI', icon: '🗺️', module: 'state', description: 'Geographic disease distribution mapping' },
  { id: 'cancer-surveillance', name: 'Cancer Surveillance AI', icon: '🔬', module: 'state', description: 'Cancer tracking and prevention' },
  { id: 'ncd-dashboard', name: 'NCD Dashboard AI', icon: '📊', module: 'state', description: 'Non-communicable disease tracking' },
  { id: 'school-health-state', name: 'School Health Dashboard', icon: '🎓', module: 'state', description: 'School-level health metrics' },
  { id: 'womens-health-state', name: 'Women\'s Health Dashboard', icon: '👩‍⚕️', module: 'state', description: 'Maternal and women health' },
  { id: 'rural-health', name: 'Rural Health Dashboard', icon: '🌾', module: 'state', description: 'Rural area health status' },
  { id: 'nutrition-dashboard', name: 'Nutrition Dashboard', icon: '🥗', module: 'state', description: 'Nutritional status tracking' },
  { id: 'emergency-alert', name: 'Emergency Alert AI', icon: '🚨', module: 'state', description: 'Real-time emergency response' },
  { id: 'district-ranking', name: 'District Ranking AI', icon: '🏆', module: 'state', description: 'Performance comparison' },
  { id: 'outbreak-prediction', name: 'Predictive Disease Outbreak AI', icon: '📈', module: 'state', description: 'Disease outbreak forecasting' },

  // DISTRICT AI
  { id: 'population-health', name: 'Population Health AI', icon: '👥', module: 'district', description: 'District population health metrics' },
  { id: 'disease-surveillance', name: 'Disease Surveillance AI', icon: '🔍', module: 'district', description: 'Disease tracking and monitoring' },
  { id: 'cancer-screening-dist', name: 'Cancer Screening AI', icon: '🔬', module: 'district', description: 'Cancer detection programs' },
  { id: 'cardiovascular', name: 'Cardiovascular AI', icon: '❤️', module: 'district', description: 'Heart disease management' },
  { id: 'ncd-dist', name: 'NCD AI', icon: '⚕️', module: 'district', description: 'Chronic disease management' },
  { id: 'nutrition-dist', name: 'Nutrition AI', icon: '🥗', module: 'district', description: 'Nutritional interventions' },
  { id: 'rural-screening', name: 'Rural Screening AI', icon: '🌾', module: 'district', description: 'Village health camps' },
  { id: 'school-health-dist', name: 'School Health AI', icon: '🎓', module: 'district', description: 'School children health' },
  { id: 'maternal-health', name: 'Maternal Health AI', icon: '👶', module: 'district', description: 'Mother and child health' },
  { id: 'mobile-medical', name: 'Mobile Medical Unit AI', icon: '🚑', module: 'district', description: 'Mobile clinic operations' },
  { id: 'district-analytics', name: 'District Analytics AI', icon: '📊', module: 'district', description: 'Data analysis and insights' },
  { id: 'hospital-performance', name: 'Hospital Performance AI', icon: '🏥', module: 'district', description: 'Hospital quality metrics' },
  { id: 'referral-management', name: 'Referral Management AI', icon: '🔗', module: 'district', description: 'Patient referral tracking' },
  { id: 'telemedicine-dist', name: 'Telemedicine AI', icon: '📱', module: 'district', description: 'Remote consultation services' },
  { id: 'resource-allocation', name: 'Resource Allocation AI', icon: '📦', module: 'district', description: 'Healthcare resource planning' },

  // HOSPITAL AI (Flagship)
  { id: 'emergency-hosp', name: 'Emergency AI', icon: '🚨', module: 'hospital', description: 'Emergency department triage' },
  { id: 'radiology', name: 'Radiology AI', icon: '🔍', module: 'hospital', description: 'Medical imaging analysis' },
  { id: 'ecg-hosp', name: 'ECG AI', icon: '❤️', module: 'hospital', description: 'Cardiac signal analysis' },
  { id: 'cardiology', name: 'Cardiology AI', icon: '❤️', module: 'hospital', description: 'Heart disease diagnosis' },
  { id: 'stroke', name: 'Stroke AI', icon: '🧠', module: 'hospital', description: 'Stroke risk and treatment' },
  { id: 'cancer-hosp', name: 'Cancer AI', icon: '🔬', module: 'hospital', description: 'Oncology support' },
  { id: 'laboratory', name: 'Laboratory AI', icon: '🧪', module: 'hospital', description: 'Lab test analysis' },
  { id: 'icu', name: 'ICU AI', icon: '🏥', module: 'hospital', description: 'Critical care monitoring' },
  { id: 'opd', name: 'OPD AI', icon: '🏥', module: 'hospital', description: 'Outpatient clinic management' },
  { id: 'admission', name: 'Admission AI', icon: '📋', module: 'hospital', description: 'Patient admission workflow' },
  { id: 'referral-hosp', name: 'Referral AI', icon: '🔗', module: 'hospital', description: 'Inter-hospital referrals' },
  { id: 'bed-management', name: 'Bed Management AI', icon: '🛏️', module: 'hospital', description: 'Hospital bed optimization' },
  { id: 'operation-theatre', name: 'Operation Theatre AI', icon: '🔪', module: 'hospital', description: 'Surgery scheduling' },
  { id: 'discharge', name: 'Discharge AI', icon: '👋', module: 'hospital', description: 'Patient discharge planning' },
  { id: 'clinical-decision', name: 'Clinical Decision Support AI', icon: '💡', module: 'hospital', description: 'Diagnostic assistance' },
  { id: 'pharmacy', name: 'Pharmacy AI', icon: '💊', module: 'hospital', description: 'Medication management' },
  { id: 'telemedicine-hosp', name: 'Telemedicine AI', icon: '📱', module: 'hospital', description: 'Remote consultations' },
  { id: 'readmission-prediction', name: 'Predictive Readmission AI', icon: '📈', module: 'hospital', description: 'Readmission risk' },
  { id: 'mortality-risk', name: 'Mortality Risk AI', icon: '⚠️', module: 'hospital', description: 'Patient mortality prediction' },

  // SCHOOL AI
  { id: 'nutrition-school', name: 'Nutrition AI', icon: '🥗', module: 'school', description: 'Vitamin D, B12, Iron, Calcium, Magnesium, Protein, Zinc, Iodine' },
  { id: 'growth-school', name: 'Growth AI', icon: '📏', module: 'school', description: 'Height, Weight, BMI, Growth Curves, Stunting, Wasting' },
  { id: 'vision-school', name: 'Vision AI', icon: '👁️', module: 'school', description: 'Eye Screening, Color Blindness, Refractive Errors, Cataracts' },
  { id: 'ent-school', name: 'ENT AI', icon: '👂', module: 'school', description: 'Ear, Nose, Sinus, Hearing Loss, Throat' },
  { id: 'dental-school', name: 'Dental AI', icon: '🦷', module: 'school', description: 'Cavities, Gum Disease, Oral Cancer, Teeth Alignment' },
  { id: 'heart-school', name: 'Heart AI', icon: '❤️', module: 'school', description: '1-Lead ECG, 12-Lead ECG analysis' },
  { id: 'respiratory-school', name: 'Respiratory AI', icon: '🫁', module: 'school', description: 'Asthma, Pneumonia, TB Risk' },
  { id: 'infectious-disease-school', name: 'Infectious Disease AI', icon: '🦠', module: 'school', description: 'COVID, Dengue, Malaria, Typhoid, Influenza, Measles' },
  { id: 'mental-wellness-school', name: 'Mental Wellness AI', icon: '🧠', module: 'school', description: 'Anxiety, Depression, ADHD, Autism, Learning Disability' },
  { id: 'lifestyle-school', name: 'Lifestyle AI', icon: '🏃', module: 'school', description: 'Obesity, Sleep, Physical Activity' },
  { id: 'skin-school', name: 'Skin AI', icon: '🩹', module: 'school', description: 'Skin cancer detection and skin lesion classification' },

  // PHC AI
  { id: 'village-screening', name: 'Village Screening AI', icon: '🌾', module: 'phc', description: 'Village health camps' },
  { id: 'ncd-phc', name: 'NCD AI', icon: '⚕️', module: 'phc', description: 'Chronic disease screening' },
  { id: 'maternal-phc', name: 'Maternal AI', icon: '👶', module: 'phc', description: 'Maternal healthcare' },
  { id: 'child-phc', name: 'Child AI', icon: '👧', module: 'phc', description: 'Child health monitoring' },
  { id: 'nutrition-phc', name: 'Nutrition AI', icon: '🥗', module: 'phc', description: 'Nutritional assessment' },
  { id: 'telemedicine-phc', name: 'Telemedicine AI', icon: '📱', module: 'phc', description: 'Remote consultations' },
  { id: 'drug-inventory', name: 'Drug Inventory AI', icon: '💊', module: 'phc', description: 'Medicine stock management' },
  { id: 'referral-phc', name: 'Referral AI', icon: '🔗', module: 'phc', description: 'Hospital referrals' },
  { id: 'vaccination', name: 'Vaccination AI', icon: '💉', module: 'phc', description: 'Immunization programs' },

  // WOMEN AI
  { id: 'maternal-women', name: 'Maternal AI', icon: '👶', module: 'women', description: 'Maternal health monitoring' },
  { id: 'pregnancy', name: 'Pregnancy AI', icon: '🤰', module: 'women', description: 'Pregnancy tracking and care' },
  { id: 'fetal-health', name: 'Fetal Health AI', icon: '👶', module: 'women', description: 'Fetal development monitoring' },
  { id: 'high-risk-pregnancy', name: 'High-Risk Pregnancy AI', icon: '⚠️', module: 'women', description: 'Risk assessment' },
  { id: 'breast-cancer', name: 'Breast Cancer AI', icon: '🔬', module: 'women', description: 'Screening and detection' },
  { id: 'cervical-cancer', name: 'Cervical Cancer AI', icon: '🔬', module: 'women', description: 'Cancer prevention' },
  { id: 'pcos', name: 'PCOS AI', icon: '⚕️', module: 'women', description: 'Polycystic ovary syndrome' },
  { id: 'menopause', name: 'Menopause AI', icon: '🌡️', module: 'women', description: 'Menopause management' },
  { id: 'anemia-women', name: 'Anemia AI', icon: '🩸', module: 'women', description: 'Iron deficiency management' },
  { id: 'nutrition-women', name: 'Nutrition AI', icon: '🥗', module: 'women', description: 'Nutritional support' },
  { id: 'bone-health', name: 'Bone Health AI', icon: '🦴', module: 'women', description: 'Osteoporosis prevention' },
  { id: 'mental-health-women', name: 'Mental Health AI', icon: '🧠', module: 'women', description: 'Psychological wellbeing' },
  { id: 'postpartum', name: 'Postpartum AI', icon: '👶', module: 'women', description: 'Postpartum care' },
  { id: 'family-planning', name: 'Family Planning AI', icon: '📋', module: 'women', description: 'Contraception and planning' },

  // POLICE AI
  { id: 'annual-health-police', name: 'Annual Health Check AI', icon: '💊', module: 'police', description: 'Regular health screening' },
  { id: 'heart-risk-police', name: 'Heart Risk AI', icon: '❤️', module: 'police', description: 'Cardiac risk assessment' },
  { id: 'stress-police', name: 'Stress AI', icon: '😰', module: 'police', description: 'Stress management' },
  { id: 'mental-wellness-police', name: 'Mental Wellness AI', icon: '🧠', module: 'police', description: 'PTSD, depression support' },
  { id: 'hypertension-police', name: 'Hypertension AI', icon: '🩸', module: 'police', description: 'Blood pressure management' },
  { id: 'diabetes-police', name: 'Diabetes AI', icon: '💉', module: 'police', description: 'Diabetes screening' },
  { id: 'sleep-police', name: 'Sleep AI', icon: '😴', module: 'police', description: 'Sleep quality improvement' },
  { id: 'obesity-police', name: 'Obesity AI', icon: '⚖️', module: 'police', description: 'Weight management' },
  { id: 'fatigue-police', name: 'Fatigue AI', icon: '😴', module: 'police', description: 'Fatigue assessment' },
  { id: 'fitness-police', name: 'Fitness AI', icon: '💪', module: 'police', description: 'Physical fitness tracking' },
  { id: 'ecg-police', name: 'ECG AI', icon: '❤️', module: 'police', description: 'Cardiac screening' },
  { id: 'lung-police', name: 'Lung AI', icon: '🫁', module: 'police', description: 'Respiratory health' },
  { id: 'substance-abuse', name: 'Substance Abuse Risk AI', icon: '⚠️', module: 'police', description: 'Addiction screening' },
  { id: 'cancer-screening-police', name: 'Cancer Screening AI', icon: '🔬', module: 'police', description: 'Cancer detection' },
  { id: 'heat-stress', name: 'Heat Stress AI', icon: '🌡️', module: 'police', description: 'Heat illness prevention' },

  // EMPLOYEE AI
  { id: 'annual-health-emp', name: 'Annual Health AI', icon: '💊', module: 'employee', description: 'Yearly health screening' },
  { id: 'executive-health', name: 'Executive Health AI', icon: '👔', module: 'employee', description: 'Senior management health' },
  { id: 'stress-emp', name: 'Stress AI', icon: '😰', module: 'employee', description: 'Workplace stress management' },
  { id: 'diabetes-emp', name: 'Diabetes AI', icon: '💉', module: 'employee', description: 'Diabetes risk screening' },
  { id: 'hypertension-emp', name: 'Hypertension AI', icon: '🩸', module: 'employee', description: 'Hypertension management' },
  { id: 'heart-emp', name: 'Heart AI', icon: '❤️', module: 'employee', description: 'Cardiac health' },
  { id: 'bmi', name: 'BMI AI', icon: '⚖️', module: 'employee', description: 'Body mass index tracking' },
  { id: 'vision-emp', name: 'Vision AI', icon: '👁️', module: 'employee', description: 'Eye health screening' },
  { id: 'hearing-emp', name: 'Hearing AI', icon: '👂', module: 'employee', description: 'Hearing assessment' },
  { id: 'cancer-emp', name: 'Cancer AI', icon: '🔬', module: 'employee', description: 'Cancer risk assessment' },

  // MOBILE MEDICAL VAN AI
  { id: 'remote-ecg', name: 'Remote ECG AI (1-Lead & 12-Lead)', icon: '❤️', module: 'mobile-van', description: 'Mobile cardiac screening with ECG analysis' },
  { id: 'remote-ear', name: 'Remote Ear AI', icon: '👂', module: 'mobile-van', description: 'Mobile ear condition screening' },
  { id: 'remote-nose', name: 'Remote Nose AI', icon: '👃', module: 'mobile-van', description: 'Mobile nasal health screening' },
  { id: 'remote-throat', name: 'Remote Throat AI', icon: '🗣️', module: 'mobile-van', description: 'Mobile throat condition screening' },
  { id: 'remote-ent', name: 'Remote ENT AI', icon: '👂', module: 'mobile-van', description: 'Mobile ENT services' },
  { id: 'remote-skin', name: 'Remote Skin AI', icon: '🩹', module: 'mobile-van', description: 'Dermatology and skin cancer screening' },
  { id: 'remote-eye', name: 'Remote Eye AI', icon: '👁️', module: 'mobile-van', description: 'Optometry services' },
  { id: 'remote-oral', name: 'Remote Oral AI', icon: '🦷', module: 'mobile-van', description: 'Dental screening' },
  { id: 'remote-cancer', name: 'Remote Cancer AI', icon: '🔬', module: 'mobile-van', description: 'Cancer screening' },
  { id: 'remote-doctor', name: 'Remote Doctor AI', icon: '👨‍⚕️', module: 'mobile-van', description: 'Telehealth consultation' },
  { id: 'satellite', name: 'Satellite Connectivity AI', icon: '🛰️', module: 'mobile-van', description: 'Offline-capable systems' },
  { id: 'offline-ai', name: 'Offline AI', icon: '📡', module: 'mobile-van', description: 'Offline functionality' },
  { id: 'referral-van', name: 'Referral AI', icon: '🔗', module: 'mobile-van', description: 'Hospital referral' },

  // CHILD AI
  { id: 'growth-child', name: 'Growth AI', icon: '📏', module: 'child', description: 'Growth monitoring' },
  { id: 'nutrition-child', name: 'Nutrition AI', icon: '🥗', module: 'child', description: 'Child nutrition' },
  { id: 'development', name: 'Development AI', icon: '🧠', module: 'child', description: 'Developmental milestones' },
  { id: 'immunization', name: 'Immunization AI', icon: '💉', module: 'child', description: 'Vaccination tracking' },
  { id: 'pediatric-infections', name: 'Infectious Diseases AI', icon: '🦠', module: 'child', description: 'Common childhood infections' },
  { id: 'respiratory-child', name: 'Respiratory AI', icon: '🫁', module: 'child', description: 'Childhood respiratory issues' },
  { id: 'allergy', name: 'Allergy AI', icon: '🤧', module: 'child', description: 'Allergy screening' },

  // SENIOR CITIZEN AI
  { id: 'cognitive', name: 'Cognitive Health AI', icon: '🧠', module: 'senior', description: 'Dementia and cognitive decline' },
  { id: 'fall-risk', name: 'Fall Risk AI', icon: '⚠️', module: 'senior', description: 'Fall prevention' },
  { id: 'mobility', name: 'Mobility AI', icon: '🚶', module: 'senior', description: 'Movement and balance' },
  { id: 'medication-elderly', name: 'Medication Management AI', icon: '💊', module: 'senior', description: 'Drug interactions' },
  { id: 'chronic-elderly', name: 'Chronic Disease AI', icon: '⚕️', module: 'senior', description: 'Age-related conditions' },
  { id: 'isolation-elderly', name: 'Social Isolation AI', icon: '💬', module: 'senior', description: 'Mental health support' },
  { id: 'nutrition-elderly', name: 'Nutrition AI', icon: '🥗', module: 'senior', description: 'Senior nutrition' },

  // TELEMEDICINE AI
  { id: 'video-consultation', name: 'Video Consultation AI', icon: '📹', module: 'telemedicine', description: 'Live video consultations' },
  { id: 'prescription-ai', name: 'Prescription AI', icon: '📋', module: 'telemedicine', description: 'Digital prescription generation' },
  { id: 'follow-up', name: 'Follow-up AI', icon: '📞', module: 'telemedicine', description: 'Automated follow-ups' },
  { id: 'tele-diagnosis', name: 'Diagnosis AI', icon: '💡', module: 'telemedicine', description: 'Remote diagnosis support' },
  { id: 'prescription-refill', name: 'Prescription Refill AI', icon: '💊', module: 'telemedicine', description: 'Medicine refills' },

  // PUBLIC HEALTH SURVEILLANCE AI
  { id: 'disease-tracking', name: 'Disease Tracking AI', icon: '📊', module: 'public-health', description: 'Real-time disease tracking' },
  { id: 'outbreak-detection', name: 'Outbreak Detection AI', icon: '🚨', module: 'public-health', description: 'Automatic outbreak alerts' },
  { id: 'epidemic-modeling', name: 'Epidemic Modeling AI', icon: '📈', module: 'public-health', description: 'Disease spread prediction' },
  { id: 'contact-tracing', name: 'Contact Tracing AI', icon: '🔍', module: 'public-health', description: 'Exposure tracking' },
  { id: 'data-analytics', name: 'Data Analytics AI', icon: '📊', module: 'public-health', description: 'Epidemiological analysis' },

  // LABORATORY AI
  { id: 'lab-testing', name: 'Lab Testing AI', icon: '🧪', module: 'laboratory', description: 'Test order management' },
  { id: 'result-analysis', name: 'Result Analysis AI', icon: '🔬', module: 'laboratory', description: 'Test result interpretation' },
  { id: 'quality-control', name: 'Quality Control AI', icon: '✅', module: 'laboratory', description: 'Result validation' },
  { id: 'lab-inventory', name: 'Inventory AI', icon: '📦', module: 'laboratory', description: 'Reagent inventory management' },

  // EMERGENCY AI
  { id: 'emergency-triage', name: 'Emergency Triage AI', icon: '🚨', module: 'emergency', description: 'Patient priority assessment' },
  { id: 'disaster-response', name: 'Disaster Response AI', icon: '🆘', module: 'emergency', description: 'Mass casualty management' },
  { id: 'ambulance-dispatch', name: 'Ambulance Dispatch AI', icon: '🚑', module: 'emergency', description: 'Emergency vehicle routing' },
  { id: 'critical-alerts', name: 'Critical Alerts AI', icon: '⚠️', module: 'emergency', description: 'Real-time alerts' },

  // AI MODEL MARKETPLACE
  { id: 'model-catalog', name: 'Model Catalog AI', icon: '📚', module: 'marketplace', description: 'Browse available models' },
  { id: 'subscription', name: 'Subscription AI', icon: '💳', module: 'marketplace', description: 'Model licensing' },
  { id: 'usage-analytics', name: 'Usage Analytics AI', icon: '📊', module: 'marketplace', description: 'Model usage tracking' },
  { id: 'billing', name: 'Billing AI', icon: '💰', module: 'marketplace', description: 'Invoice and payment management' }
];

// 24 Main Working AI Models for the Models Dashboard Section
// Heart and ENT models are prioritized at the top
export const WORKING_MODELS = [
  // HEART & ECG (Priority 1)
  { id: 'onelead', name: 'Heart AI 1 Lead', icon: '❤️', price: '$$$', description: 'Quick ECG analysis using a single-lead input for early heart health screening.' },
  { id: 'twelvelead', name: 'Heart AI 12 Lead', icon: '❤️', price: '$$$', description: 'Comprehensive 12-lead ECG interpretation for advanced cardiac assessment.' },

  // ENT (Priority 2)
  { id: 'ear', name: 'Ear AI', icon: '👂', price: '$$$', description: 'Screen for common ear issues and receive hearing health suggestions.' },
  { id: 'nose', name: 'Nose AI', icon: '👃', price: '$$$', description: 'AI-driven nasal health checks for allergies, congestion, and sinus care.' },
  { id: 'throat', name: 'Throat AI', icon: '🗣️', price: '$$$', description: 'Assess throat symptoms and receive tailored advice for throat health.' },

  // SKIN AI (Priority 3)
  { id: 'skin', name: 'Skin AI', icon: '🩹', price: '$$$', description: 'Dermatology analysis for skin cancer detection and skin lesion classification.' },

  // OTHER MODELS
  { id: 'eye', name: 'Eye AI', icon: '👁️', price: '$$$', description: 'Screen vision health and detect eye-related issues using AI.' },
  { id: 'covid', name: 'COVID-19 AI', icon: '🦠', price: '$$$', description: 'Chest X-ray analysis and COVID-19 screening using machine learning.' },
  { id: 'pneumonia', name: 'Pneumonia AI', icon: '🫁', price: '$$$', description: 'Screen and detect early pneumonia risks with AI.' },
  { id: 'malaria', name: 'Malaria AI', icon: '🦟', price: '$$$', description: 'Screen for malaria symptoms and provide early advice.' },
  { id: 'dengue', name: 'Dengue AI', icon: '🦟', price: '$$$', description: 'Screen for dengue symptoms and provide AI-driven advice.' },
  { id: 'diabetes', name: 'Diabetes AI', icon: '💉', price: '$$$', description: 'Monitor glucose trends, risk factors, and receive diabetic care advice.' },
  { id: 'oral', name: 'Oral AI', icon: '🦷', price: '$$$', description: 'Screen oral hygiene, gum disease, and mouth health with AI.' },
  { id: 'pharyngitis', name: 'Pharyngitis AI', icon: '🗣️', price: '$$$', description: 'Assess throat symptoms and receive tailored advice for pharyngitis.' },
  { id: 'colorectal', name: 'Colorectal AI', icon: '🔬', price: '$$$', description: 'Identify colorectal polyps and abnormalities with AI analysis.' },
  { id: 'lung', name: 'Lungs AI', icon: '🫁', price: '$$$', description: 'Screen for respiratory conditions and get lung health insights using AI.' },
  { id: 'vitamind', name: 'Vitamin D Deficiency AI', icon: '🥗', price: '$$$', description: 'Detect and assess vitamin D deficiency symptoms with AI-powered nutrition screening.' },
  { id: 'iron', name: 'Iron Deficiency AI', icon: '🩸', price: '$$$', description: 'Screen for iron deficiency anemia and receive nutritional guidance.' }
];

// Get models by module
export const getModelsByModule = (moduleId) => AI_MODELS.filter(m => m.module === moduleId);

// Get model by ID
export const getModelById = (id) => AI_MODELS.find(m => m.id === id);

// Get all model IDs
export const getAllModelIds = () => AI_MODELS.map(m => m.id);
