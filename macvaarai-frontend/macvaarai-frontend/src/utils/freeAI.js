// Macvaar AI - Medical Knowledge Base
// Provides instant answers to common health questions

const medicalKnowledge = {
  pneumonia: {
    symptoms: "Common pneumonia symptoms include: fever (usually high), cough (often productive with mucus/phlegm), chest pain when breathing or coughing, shortness of breath, fatigue, chills, and sometimes nausea. Seek immediate medical attention if experiencing severe symptoms.",
    detection: "Pneumonia is detected through: physical examination by a doctor, chest X-ray, CT scan, blood tests, and sputum culture. Symptoms combined with imaging help confirm diagnosis. Early detection improves treatment outcomes.",
    types: "Main types include: Bacterial pneumonia (most common), Viral pneumonia, Fungal pneumonia, and Aspiration pneumonia. Bacterial pneumonia often responds well to antibiotics, while viral and fungal types require specific treatments.",
    treatment: "Treatment depends on type: Bacterial pneumonia uses antibiotics, viral cases use antivirals or supportive care, rest, fluids, and fever management. Hospitalization may be needed for severe cases. Always consult a healthcare provider."
  },
  covid: {
    symptoms: "COVID-19 symptoms include: fever/chills, cough (usually dry), fatigue or tiredness, loss of taste/smell, difficulty breathing. Symptoms may appear 2-14 days after exposure. Some people are asymptomatic.",
    detection: "COVID-19 is detected through: RT-PCR tests (most accurate), antigen tests (rapid), and antibody tests. Chest X-rays or CT scans may show lung involvement. Testing accuracy is highest 5-8 days after symptom onset.",
    xray: "Chest X-rays in COVID-19 may show bilateral pneumonia patterns, ground-glass opacities, or consolidated areas. However, X-rays alone cannot diagnose COVID - they help assess disease severity.",
    recovery: "Recovery timeline varies: Mild cases typically resolve in 1-2 weeks, moderate cases in 3-6 weeks, severe cases may take 6+ weeks or longer. Post-COVID syndrome can persist for months in some patients."
  },
  malaria: {
    symptoms: "Malaria symptoms include: high fever (often 103-106°F), chills and sweating, headache, muscle aches, weakness, nausea, and vomiting. Symptoms typically appear 10-15 days after mosquito bite.",
    diagnosis: "Malaria is diagnosed through: blood microscopy (gold standard), rapid diagnostic tests (RDTs), PCR testing, and clinical presentation. Multiple blood tests may be needed for accurate diagnosis.",
    prevention: "Prevention includes: antimalarial medications (for travelers), insect repellent, mosquito nets, staying indoors during dawn/dusk, and protective clothing. Talk to a doctor before traveling to endemic areas.",
    treatment: "Treatment depends on parasite type and drug resistance. Common medications: Artemisinin-based combinations (ACTs), Quinine, Chloroquine. Treatment must start promptly. Hospitalization may be needed for severe cases."
  },
  dengue: {
    symptoms: "Dengue symptoms include: sudden high fever, severe headache, pain behind eyes, joint/muscle pain, rash (usually appears 3-4 days after fever), mild bleeding (nose/gums). Severe dengue is life-threatening.",
    transmission: "Dengue spreads through Aedes mosquito bites (active during day). Cannot spread person-to-person except during pregnancy. One infection provides immunity to that strain but not others.",
    severity: "Dengue has 4 severity levels: Asymptomatic, Dengue Fever (DF), Dengue Hemorrhagic Fever (DHF), Dengue Shock Syndrome (DSS). Severe forms can cause bleeding and organ failure.",
    prevention: "Prevention: Eliminate mosquito breeding sites (standing water), use insect repellent, wear protective clothing, install screens, consider dengue vaccine in endemic areas."
  },
  eye: {
    retinopathy: "Diabetic retinopathy is eye damage from diabetes. Early stage: small hemorrhages, microaneurysms. Advanced: vision-threatening neovascularization. Regular eye exams (annually for diabetics) catch early changes.",
    glaucoma: "Glaucoma causes irreversible vision loss from high intraocular pressure. Often asymptomatic until advanced. Risk factors: family history, age, ethnicity. Early detection through regular screening is crucial.",
    blurredVision: "Blurred vision causes: refractive errors (myopia, hyperopia), cataracts, dry eyes, retinal problems, diabetic changes, or serious conditions. Sudden onset needs urgent eye care.",
    checkup: "Eye checkups recommended: Every 1-2 years for normal vision, annually for diabetics/glaucoma risk, every 6 months if already diagnosed. Early detection prevents 90% of vision loss."
  },
  throat: {
    infection: "Throat infections symptoms: sore throat, pain swallowing, fever, swollen tonsils, white/yellow patches, enlarged lymph nodes. Can be bacterial or viral.",
    cancer: "Throat cancer signs: persistent sore throat, difficulty swallowing, neck lump, voice changes, ear pain. Risk factors: tobacco, alcohol, HPV. Early detection improves survival rates significantly.",
    bacterial: "Bacterial infections (like strep) respond to antibiotics. Symptoms appear suddenly with high fever. Viral infections need supportive care only.",
    specialist: "See an ENT specialist for: persistent throat problems lasting >3 weeks, difficulty swallowing, voice changes, signs of cancer, recurrent infections."
  },
  skin: {
    cancer: "Skin cancer types: Basal cell (most common), Squamous cell, Melanoma (most dangerous). Early detection through ABCDE rule improves outcomes dramatically.",
    melanoma: "Melanoma warning signs (ABCDE): Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution/changes. Found on skin, under nails, or in eyes. Highly preventable with sun protection.",
    benign: "Benign lesions: moles, age spots, keratosis. Usually stable, uniform color, regular borders. Malignant lesions show changes, irregular borders, varied colors. Any change requires evaluation.",
    prevention: "Prevention: SPF 30+ sunscreen daily, avoid peak sun (10am-4pm), wear protective clothing, avoid tanning beds, monthly skin checks, annual dermatologist visit."
  }
};

export const askFreeAI = async (question, modelName = '') => {
  try {
    const lowerQuestion = question.toLowerCase();

    // Route to relevant medical knowledge
    let answer = '';

    if (lowerQuestion.includes('pneumonia')) {
      if (lowerQuestion.includes('symptom')) answer = medicalKnowledge.pneumonia.symptoms;
      else if (lowerQuestion.includes('detect')) answer = medicalKnowledge.pneumonia.detection;
      else if (lowerQuestion.includes('type')) answer = medicalKnowledge.pneumonia.types;
      else if (lowerQuestion.includes('treat')) answer = medicalKnowledge.pneumonia.treatment;
      else answer = medicalKnowledge.pneumonia.symptoms;
    }
    else if (lowerQuestion.includes('covid') || lowerQuestion.includes('coronavirus')) {
      if (lowerQuestion.includes('symptom')) answer = medicalKnowledge.covid.symptoms;
      else if (lowerQuestion.includes('detect') || lowerQuestion.includes('test')) answer = medicalKnowledge.covid.detection;
      else if (lowerQuestion.includes('x-ray') || lowerQuestion.includes('xray')) answer = medicalKnowledge.covid.xray;
      else if (lowerQuestion.includes('recover')) answer = medicalKnowledge.covid.recovery;
      else answer = medicalKnowledge.covid.symptoms;
    }
    else if (lowerQuestion.includes('malaria')) {
      if (lowerQuestion.includes('symptom')) answer = medicalKnowledge.malaria.symptoms;
      else if (lowerQuestion.includes('diagnos')) answer = medicalKnowledge.malaria.diagnosis;
      else if (lowerQuestion.includes('prevent')) answer = medicalKnowledge.malaria.prevention;
      else if (lowerQuestion.includes('treat')) answer = medicalKnowledge.malaria.treatment;
      else answer = medicalKnowledge.malaria.symptoms;
    }
    else if (lowerQuestion.includes('dengue')) {
      if (lowerQuestion.includes('symptom')) answer = medicalKnowledge.dengue.symptoms;
      else if (lowerQuestion.includes('transmit')) answer = medicalKnowledge.dengue.transmission;
      else if (lowerQuestion.includes('severity') || lowerQuestion.includes('level')) answer = medicalKnowledge.dengue.severity;
      else if (lowerQuestion.includes('prevent')) answer = medicalKnowledge.dengue.prevention;
      else answer = medicalKnowledge.dengue.symptoms;
    }
    else if (lowerQuestion.includes('eye') || lowerQuestion.includes('retinopathy') || lowerQuestion.includes('glaucoma') || lowerQuestion.includes('vision')) {
      if (lowerQuestion.includes('retinopathy')) answer = medicalKnowledge.eye.retinopathy;
      else if (lowerQuestion.includes('glaucoma')) answer = medicalKnowledge.eye.glaucoma;
      else if (lowerQuestion.includes('blur')) answer = medicalKnowledge.eye.blurredVision;
      else if (lowerQuestion.includes('checkup') || lowerQuestion.includes('exam')) answer = medicalKnowledge.eye.checkup;
      else answer = medicalKnowledge.eye.retinopathy;
    }
    else if (lowerQuestion.includes('throat') || lowerQuestion.includes('throat cancer') || lowerQuestion.includes('sore throat')) {
      if (lowerQuestion.includes('cancer')) answer = medicalKnowledge.throat.cancer;
      else if (lowerQuestion.includes('bacterial')) answer = medicalKnowledge.throat.bacterial;
      else if (lowerQuestion.includes('specialist')) answer = medicalKnowledge.throat.specialist;
      else answer = medicalKnowledge.throat.infection;
    }
    else if (lowerQuestion.includes('skin') || lowerQuestion.includes('melanoma') || lowerQuestion.includes('lesion') || lowerQuestion.includes('mole')) {
      if (lowerQuestion.includes('cancer')) answer = medicalKnowledge.skin.cancer;
      else if (lowerQuestion.includes('melanoma')) answer = medicalKnowledge.skin.melanoma;
      else if (lowerQuestion.includes('benign') || lowerQuestion.includes('vs')) answer = medicalKnowledge.skin.benign;
      else if (lowerQuestion.includes('prevent')) answer = medicalKnowledge.skin.prevention;
      else answer = medicalKnowledge.skin.cancer;
    }
    else if (lowerQuestion.includes('ecg') || lowerQuestion.includes('lead') || lowerQuestion.includes('heartbeat') || lowerQuestion.includes('arrhythmia')) {
      answer = `ECG (Electrocardiogram) Analysis:\n\n1-Lead ECG: Quick screening for basic heartbeat detection\n- Detects: Normal heartbeats, arrhythmias, irregular patterns\n- Best for: Quick heart health screening\n\n12-Lead ECG: Comprehensive cardiac assessment\n- Detects: MI, ST-T abnormalities, arrhythmias, conduction issues\n- Best for: Detailed cardiac diagnosis\n\n⚠️ ECG results must be interpreted by a cardiologist. Always consult a healthcare professional for accurate diagnosis.`;
    }
    else {
      answer = `I can answer questions about pneumonia, COVID-19, malaria, dengue, eye conditions, throat health, skin cancer, and ECG analysis. Please ask a specific health question for accurate information.\n\n⚠️ This is educational information only. Always consult healthcare professionals for medical advice and diagnosis.`;
    }

    return answer;
  } catch (error) {
    console.error('Macvaar AI Error:', error);
    return `Sorry, I couldn't process that question. Please try uploading a medical image for AI-powered analysis instead.`;
  }
};

// Detect if question is health-related
export const isHealthQuestion = (text) => {
  const healthKeywords = [
    'symptom', 'disease', 'infection', 'pain', 'fever', 'cough', 'cold',
    'flu', 'covid', 'malaria', 'dengue', 'diabetic', 'skin', 'cancer',
    'heart', 'lung', 'throat', 'ear', 'eye', 'diagnosis', 'treatment',
    'remedy', 'medicine', 'doctor', 'health', 'medical', 'patient',
    'illness', 'disease', 'condition', 'syndrome', 'disorder', 'virus',
    'ecg', 'heartbeat', 'arrhythmia', 'cardiac', 'cardiologist', 'ekg'
  ];

  const lowerText = text.toLowerCase();
  return healthKeywords.some(keyword => lowerText.includes(keyword));
};
