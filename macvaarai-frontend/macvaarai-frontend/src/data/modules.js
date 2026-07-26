export const MASTERCHECK_MODULES = [
  {
    id: 'state',
    title: 'State AI Dashboard',
    subtitle: 'Chief Minister, Health Secretary Level',
    icon: '🏛️',
    color: '#2563eb',
    description: 'High-level state health governance and surveillance',
    aiAgents: [
      { id: 'heat-map', name: 'Disease Heat Map AI', description: 'Geographic disease distribution' },
      { id: 'cancer-surveillance', name: 'Cancer Surveillance AI', description: 'Cancer tracking and prevention' },
      { id: 'ncd-dashboard', name: 'NCD Dashboard AI', description: 'Non-communicable disease tracking' },
      { id: 'school-health', name: 'School Health Dashboard', description: 'School-level health metrics' },
      { id: 'womens-health', name: 'Women\'s Health Dashboard', description: 'Maternal and women health' },
      { id: 'rural-health', name: 'Rural Health Dashboard', description: 'Rural area health status' },
      { id: 'nutrition-dashboard', name: 'Nutrition Dashboard', description: 'Nutritional status tracking' },
      { id: 'emergency-alert', name: 'Emergency Alert AI', description: 'Real-time emergency response' },
      { id: 'district-ranking', name: 'District Ranking AI', description: 'Performance comparison' },
      { id: 'outbreak-prediction', name: 'Predictive Disease Outbreak AI', description: 'Disease outbreak forecasting' }
    ]
  },
  {
    id: 'district',
    title: 'District AI',
    subtitle: 'District Collectors & Health Officers',
    icon: '🌍',
    color: '#7c3aed',
    description: 'District-level health management and coordination',
    aiAgents: [
      { id: 'population-health', name: 'Population Health AI', description: 'District population health metrics' },
      { id: 'disease-surveillance', name: 'Disease Surveillance AI', description: 'Disease tracking and monitoring' },
      { id: 'cancer-screening', name: 'Cancer Screening AI', description: 'Cancer detection programs' },
      { id: 'cardiovascular', name: 'Cardiovascular AI', description: 'Heart disease management' },
      { id: 'ncd', name: 'NCD AI', description: 'Chronic disease management' },
      { id: 'nutrition', name: 'Nutrition AI', description: 'Nutritional interventions' },
      { id: 'rural-screening', name: 'Rural Screening AI', description: 'Village health camps' },
      { id: 'school-health-d', name: 'School Health AI', description: 'School children health' },
      { id: 'maternal-health', name: 'Maternal Health AI', description: 'Mother and child health' },
      { id: 'mobile-medical', name: 'Mobile Medical Unit AI', description: 'Mobile clinic operations' },
      { id: 'district-analytics', name: 'District Analytics AI', description: 'Data analysis and insights' },
      { id: 'hospital-performance', name: 'Hospital Performance AI', description: 'Hospital quality metrics' },
      { id: 'referral-management', name: 'Referral Management AI', description: 'Patient referral tracking' },
      { id: 'telemedicine', name: 'Telemedicine AI', description: 'Remote consultation services' },
      { id: 'resource-allocation', name: 'Resource Allocation AI', description: 'Healthcare resource planning' }
    ]
  },
  {
    id: 'hospital',
    title: 'Hospital AI',
    subtitle: 'Medical Institutions & Tertiary Care',
    icon: '🏥',
    color: '#dc2626',
    description: 'Comprehensive hospital management and clinical support',
    aiAgents: [
      { id: 'emergency', name: 'Emergency AI', description: 'Emergency department triage' },
      { id: 'radiology', name: 'Radiology AI', description: 'Medical imaging analysis' },
      { id: 'ecg', name: 'ECG AI', description: 'Cardiac signal analysis' },
      { id: 'cardiology', name: 'Cardiology AI', description: 'Heart disease diagnosis' },
      { id: 'stroke', name: 'Stroke AI', description: 'Stroke risk and treatment' },
      { id: 'cancer', name: 'Cancer AI', description: 'Oncology support' },
      { id: 'laboratory', name: 'Laboratory AI', description: 'Lab test analysis' },
      { id: 'icu', name: 'ICU AI', description: 'Critical care monitoring' },
      { id: 'opd', name: 'OPD AI', description: 'Outpatient clinic management' },
      { id: 'admission', name: 'Admission AI', description: 'Patient admission workflow' },
      { id: 'referral', name: 'Referral AI', description: 'Inter-hospital referrals' },
      { id: 'bed-management', name: 'Bed Management AI', description: 'Hospital bed optimization' },
      { id: 'operation-theatre', name: 'Operation Theatre AI', description: 'Surgery scheduling' },
      { id: 'discharge', name: 'Discharge AI', description: 'Patient discharge planning' },
      { id: 'clinical-decision', name: 'Clinical Decision Support AI', description: 'Diagnostic assistance' },
      { id: 'pharmacy', name: 'Pharmacy AI', description: 'Medication management' },
      { id: 'hospital-telemedicine', name: 'Telemedicine AI', description: 'Remote consultations' },
      { id: 'readmission-prediction', name: 'Predictive Readmission AI', description: 'Readmission risk' },
      { id: 'mortality-risk', name: 'Mortality Risk AI', description: 'Patient mortality prediction' }
    ]
  },
  {
    id: 'phc',
    title: 'PHC AI',
    subtitle: 'Primary Health Centers',
    icon: '🏘️',
    color: '#059669',
    description: 'Primary healthcare and village screening',
    aiAgents: [
      { id: 'village-screening', name: 'Village Screening AI', description: 'Village health camps' },
      { id: 'ncd-phc', name: 'NCD AI', description: 'Chronic disease screening' },
      { id: 'maternal-phc', name: 'Maternal AI', description: 'Maternal healthcare' },
      { id: 'child-phc', name: 'Child AI', description: 'Child health monitoring' },
      { id: 'nutrition-phc', name: 'Nutrition AI', description: 'Nutritional assessment' },
      { id: 'telemedicine-phc', name: 'Telemedicine AI', description: 'Remote consultations' },
      { id: 'drug-inventory', name: 'Drug Inventory AI', description: 'Medicine stock management' },
      { id: 'referral-phc', name: 'Referral AI', description: 'Hospital referrals' },
      { id: 'vaccination', name: 'Vaccination AI', description: 'Immunization programs' }
    ]
  },
  {
    id: 'school',
    title: 'School Health AI',
    subtitle: 'Educational Institutions',
    icon: '🎓',
    color: '#f97316',
    description: 'Comprehensive school health and student wellness',
    aiAgents: [
      { id: 'nutrition-school', name: 'Nutrition AI', description: 'Vitamin D, Iron, Calcium, Magnesium, Protein, Zinc, Iodine tracking' },
      { id: 'growth', name: 'Growth AI', description: 'Height, Weight, BMI, Growth Curves, Stunting, Wasting' },
      { id: 'vision', name: 'Vision AI', description: 'Eye Screening, Color Blindness, Refractive Errors' },
      { id: 'ent-school', name: 'ENT AI', description: 'Ear Infection, Hearing Loss, Nose, Sinus, Throat' },
      { id: 'dental', name: 'Dental AI', description: 'Cavities, Gum Disease, Oral Cancer, Teeth Alignment' },
      { id: 'heart-school', name: 'Heart AI', description: '1-Lead ECG, 12-Lead ECG analysis' },
      { id: 'respiratory', name: 'Respiratory AI', description: 'Asthma, Pneumonia, TB Risk' },
      { id: 'infectious-disease', name: 'Infectious Disease AI', description: 'COVID, Dengue, Malaria, Typhoid, Influenza, Measles' },
      { id: 'mental-wellness', name: 'Mental Wellness AI', description: 'Anxiety, Depression, ADHD, Autism, Learning Disability' },
      { id: 'lifestyle', name: 'Lifestyle AI', description: 'Obesity, Sleep, Physical Activity' }
    ]
  },
  {
    id: 'women',
    title: 'Women & Maternal AI',
    subtitle: 'Women\'s Health & Family Welfare',
    icon: '👩‍⚕️',
    color: '#ec4899',
    description: 'Comprehensive women\'s health and maternal care',
    aiAgents: [
      { id: 'maternal', name: 'Maternal AI', description: 'Maternal health monitoring' },
      { id: 'pregnancy', name: 'Pregnancy AI', description: 'Pregnancy tracking and care' },
      { id: 'fetal-health', name: 'Fetal Health AI', description: 'Fetal development monitoring' },
      { id: 'high-risk-pregnancy', name: 'High-Risk Pregnancy AI', description: 'Risk assessment' },
      { id: 'breast-cancer', name: 'Breast Cancer AI', description: 'Screening and detection' },
      { id: 'cervical-cancer', name: 'Cervical Cancer AI', description: 'Cancer prevention' },
      { id: 'pcos', name: 'PCOS AI', description: 'Polycystic ovary syndrome' },
      { id: 'menopause', name: 'Menopause AI', description: 'Menopause management' },
      { id: 'anemia-women', name: 'Anemia AI', description: 'Iron deficiency management' },
      { id: 'bone-health', name: 'Bone Health AI', description: 'Osteoporosis prevention' },
      { id: 'mental-health-women', name: 'Mental Health AI', description: 'Psychological wellbeing' },
      { id: 'postpartum', name: 'Postpartum AI', description: 'Postpartum care' },
      { id: 'family-planning', name: 'Family Planning AI', description: 'Contraception and planning' }
    ]
  },
  {
    id: 'police',
    title: 'Police Health AI',
    subtitle: 'Law Enforcement Personnel',
    icon: '👮',
    color: '#1e40af',
    description: 'Occupational health for police personnel',
    aiAgents: [
      { id: 'annual-health', name: 'Annual Health Check AI', description: 'Regular health screening' },
      { id: 'heart-risk', name: 'Heart Risk AI', description: 'Cardiac risk assessment' },
      { id: 'stress', name: 'Stress AI', description: 'Stress management' },
      { id: 'mental-wellness-police', name: 'Mental Wellness AI', description: 'PTSD, depression support' },
      { id: 'hypertension', name: 'Hypertension AI', description: 'Blood pressure management' },
      { id: 'diabetes-police', name: 'Diabetes AI', description: 'Diabetes screening' },
      { id: 'sleep', name: 'Sleep AI', description: 'Sleep quality improvement' },
      { id: 'obesity-police', name: 'Obesity AI', description: 'Weight management' },
      { id: 'fatigue', name: 'Fatigue AI', description: 'Fatigue assessment' },
      { id: 'fitness', name: 'Fitness AI', description: 'Physical fitness tracking' },
      { id: 'ecg-police', name: 'ECG AI', description: 'Cardiac screening' },
      { id: 'lung-police', name: 'Lung AI', description: 'Respiratory health' },
      { id: 'substance-abuse', name: 'Substance Abuse Risk AI', description: 'Addiction screening' },
      { id: 'cancer-screening-police', name: 'Cancer Screening AI', description: 'Cancer detection' },
      { id: 'heat-stress', name: 'Heat Stress AI', description: 'Heat illness prevention' }
    ]
  },
  {
    id: 'employee',
    title: 'Employee Health AI',
    subtitle: 'Government & Corporate Employees',
    icon: '💼',
    color: '#6366f1',
    description: 'Occupational health and wellness programs',
    aiAgents: [
      { id: 'annual-health-emp', name: 'Annual Health AI', description: 'Yearly health screening' },
      { id: 'executive-health', name: 'Executive Health AI', description: 'Senior management health' },
      { id: 'stress-emp', name: 'Stress AI', description: 'Workplace stress management' },
      { id: 'diabetes-emp', name: 'Diabetes AI', description: 'Diabetes risk screening' },
      { id: 'hypertension-emp', name: 'Hypertension AI', description: 'Hypertension management' },
      { id: 'heart-emp', name: 'Heart AI', description: 'Cardiac health' },
      { id: 'bmi', name: 'BMI AI', description: 'Body mass index tracking' },
      { id: 'vision-emp', name: 'Vision AI', description: 'Eye health screening' },
      { id: 'hearing-emp', name: 'Hearing AI', description: 'Hearing assessment' },
      { id: 'cancer-emp', name: 'Cancer AI', description: 'Cancer risk assessment' }
    ]
  },
  {
    id: 'child',
    title: 'Child Health AI',
    subtitle: 'Pediatric Care & Development',
    icon: '👧',
    color: '#06b6d4',
    description: 'Comprehensive child health and development tracking',
    aiAgents: [
      { id: 'growth-child', name: 'Growth AI', description: 'Growth monitoring' },
      { id: 'nutrition-child', name: 'Nutrition AI', description: 'Child nutrition' },
      { id: 'development', name: 'Development AI', description: 'Developmental milestones' },
      { id: 'immunization', name: 'Immunization AI', description: 'Vaccination tracking' },
      { id: 'pediatric-infections', name: 'Infectious Diseases AI', description: 'Common childhood infections' },
      { id: 'respiratory-child', name: 'Respiratory AI', description: 'Childhood respiratory issues' },
      { id: 'allergy', name: 'Allergy AI', description: 'Allergy screening' }
    ]
  },
  {
    id: 'senior',
    title: 'Senior Citizen AI',
    subtitle: 'Elderly Care & Geriatrics',
    icon: '👴',
    color: '#8b5cf6',
    description: 'Age-specific healthcare for elderly citizens',
    aiAgents: [
      { id: 'cognitive', name: 'Cognitive Health AI', description: 'Dementia and cognitive decline' },
      { id: 'fall-risk', name: 'Fall Risk AI', description: 'Fall prevention' },
      { id: 'mobility', name: 'Mobility AI', description: 'Movement and balance' },
      { id: 'medication', name: 'Medication Management AI', description: 'Drug interactions' },
      { id: 'chronic-elderly', name: 'Chronic Disease AI', description: 'Age-related conditions' },
      { id: 'isolation', name: 'Social Isolation AI', description: 'Mental health support' },
      { id: 'nutrition-elderly', name: 'Nutrition AI', description: 'Senior nutrition' }
    ]
  },
  {
    id: 'mobile-van',
    title: 'Mobile Medical Van AI',
    subtitle: 'Outreach & Remote Healthcare',
    icon: '🚐',
    color: '#ea580c',
    description: 'Remote healthcare delivery system',
    aiAgents: [
      { id: 'remote-ecg', name: 'Remote ECG AI', description: 'Mobile cardiac screening' },
      { id: 'remote-ent', name: 'Remote ENT AI', description: 'Mobile ENT services' },
      { id: 'remote-skin', name: 'Remote Skin AI', description: 'Dermatology services' },
      { id: 'remote-eye', name: 'Remote Eye AI', description: 'Optometry services' },
      { id: 'remote-oral', name: 'Remote Oral AI', description: 'Dental screening' },
      { id: 'remote-cancer', name: 'Remote Cancer AI', description: 'Cancer screening' },
      { id: 'remote-doctor', name: 'Remote Doctor AI', description: 'Telehealth consultation' },
      { id: 'satellite', name: 'Satellite Connectivity AI', description: 'Offline-capable systems' },
      { id: 'referral-van', name: 'Referral AI', description: 'Hospital referral' }
    ]
  },
  {
    id: 'telemedicine',
    title: 'Telemedicine AI',
    subtitle: 'Remote Consultation Platform',
    icon: '📱',
    color: '#16a34a',
    description: 'Virtual healthcare delivery and consultations',
    aiAgents: [
      { id: 'video-consultation', name: 'Video Consultation AI', description: 'Live video consultations' },
      { id: 'prescription-ai', name: 'Prescription AI', description: 'Digital prescription generation' },
      { id: 'follow-up', name: 'Follow-up AI', description: 'Automated follow-ups' },
      { id: 'tele-diagnosis', name: 'Diagnosis AI', description: 'Remote diagnosis support' },
      { id: 'prescription-refill', name: 'Prescription Refill AI', description: 'Medicine refills' }
    ]
  },
  {
    id: 'public-health',
    title: 'Public Health Surveillance AI',
    subtitle: 'Disease Tracking & Outbreak',
    icon: '🔍',
    color: '#d97706',
    description: 'Disease surveillance and outbreak tracking',
    aiAgents: [
      { id: 'disease-tracking', name: 'Disease Tracking AI', description: 'Real-time disease tracking' },
      { id: 'outbreak-detection', name: 'Outbreak Detection AI', description: 'Automatic outbreak alerts' },
      { id: 'epidemic-modeling', name: 'Epidemic Modeling AI', description: 'Disease spread prediction' },
      { id: 'contact-tracing', name: 'Contact Tracing AI', description: 'Exposure tracking' },
      { id: 'data-analytics', name: 'Data Analytics AI', description: 'Epidemiological analysis' }
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory AI',
    subtitle: 'Diagnostic Testing & Analysis',
    icon: '🧪',
    color: '#059669',
    description: 'Laboratory test management and analysis',
    aiAgents: [
      { id: 'lab-testing', name: 'Lab Testing AI', description: 'Test order management' },
      { id: 'result-analysis', name: 'Result Analysis AI', description: 'Test result interpretation' },
      { id: 'quality-control', name: 'Quality Control AI', description: 'Result validation' },
      { id: 'inventory', name: 'Inventory AI', description: 'Reagent inventory management' }
    ]
  },
  {
    id: 'emergency',
    title: 'Emergency AI',
    subtitle: 'Critical Care & Disaster Response',
    icon: '🚨',
    color: '#dc2626',
    description: 'Emergency response and critical care management',
    aiAgents: [
      { id: 'emergency-triage', name: 'Emergency Triage AI', description: 'Patient priority assessment' },
      { id: 'disaster-response', name: 'Disaster Response AI', description: 'Mass casualty management' },
      { id: 'ambulance-dispatch', name: 'Ambulance Dispatch AI', description: 'Emergency vehicle routing' },
      { id: 'critical-alerts', name: 'Critical Alerts AI', description: 'Real-time alerts' }
    ]
  },
  {
    id: 'marketplace',
    title: 'AI Model Marketplace',
    subtitle: 'AI Services Hub',
    icon: '🛒',
    color: '#7c3aed',
    description: 'AI model subscription and licensing platform',
    aiAgents: [
      { id: 'model-catalog', name: 'Model Catalog AI', description: 'Browse available models' },
      { id: 'subscription', name: 'Subscription AI', description: 'Model licensing' },
      { id: 'usage-analytics', name: 'Usage Analytics AI', description: 'Model usage tracking' },
      { id: 'billing', name: 'Billing AI', description: 'Invoice and payment management' }
    ]
  }
];

export const getModuleById = (id) => MASTERCHECK_MODULES.find(m => m.id === id);

export const getModulesByCategory = (category) => {
  // Can group modules by category if needed
  return MASTERCHECK_MODULES;
};
