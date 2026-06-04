# Complete AI Models Database with Pricing and Details

MODELS_DATABASE = {
    "eye": {
        "model_id": "eye",
        "name": "Eye Disease Detection",
        "category": "Premium",
        "price": 5000,
        "currency": "INR",
        "description": "Advanced AI system for detecting and diagnosing various eye diseases and conditions from retinal images and eye photos.",
        "features": [
            "Diabetic Retinopathy Detection",
            "Glaucoma Screening",
            "Age-related Macular Degeneration (AMD)",
            "Cataracts Detection",
            "Retinal Vessel Analysis",
            "Optic Disc Assessment"
        ],
        "diseases_trained": [
            "Diabetic Retinopathy",
            "Glaucoma",
            "Age-related Macular Degeneration",
            "Cataracts",
            "Retinal Hemorrhage",
            "Microaneurysms"
        ],
        "accuracy": "94.5%",
        "training_data": "500,000+ annotated images",
        "created_at": "2025-01-15"
    },
    "covid": {
        "model_id": "covid",
        "name": "COVID-19 Detection",
        "category": "Premium",
        "price": 5000,
        "currency": "INR",
        "description": "Chest X-ray and CT scan analysis AI for COVID-19 detection and severity assessment.",
        "features": [
            "Chest X-ray Analysis",
            "CT Scan Interpretation",
            "Severity Scoring",
            "Progression Tracking",
            "Pneumonia Detection",
            "Lung Opacity Assessment"
        ],
        "diseases_trained": [
            "COVID-19 (Mild, Moderate, Severe)",
            "Viral Pneumonia",
            "Bacterial Pneumonia",
            "Atypical Pneumonia",
            "Ground Glass Opacity",
            "Pulmonary Embolism"
        ],
        "accuracy": "96.2%",
        "training_data": "200,000+ X-ray images",
        "created_at": "2025-01-15"
    },
    "ecg": {
        "model_id": "ecg",
        "name": "ECG Analysis",
        "category": "Premium",
        "price": 5000,
        "currency": "INR",
        "description": "Electrocardiogram interpretation AI for detecting cardiac abnormalities and arrhythmias.",
        "features": [
            "Arrhythmia Detection",
            "ST-Segment Analysis",
            "Heart Rate Variability",
            "Myocardial Infarction Detection",
            "QT Interval Analysis",
            "Chamber Enlargement Detection"
        ],
        "diseases_trained": [
            "Atrial Fibrillation",
            "Myocardial Infarction",
            "Heart Block",
            "Ventricular Hypertrophy",
            "Acute Coronary Syndrome",
            "Pacemaker Rhythm"
        ],
        "accuracy": "95.8%",
        "training_data": "1,000,000+ ECG records",
        "created_at": "2025-01-15"
    },
    "skin": {
        "model_id": "skin",
        "name": "Skin Cancer Detection",
        "category": "Premium",
        "price": 5000,
        "currency": "INR",
        "description": "Dermatology AI for melanoma and skin cancer detection from dermoscopy and clinical images.",
        "features": [
            "Melanoma Detection",
            "Benign Nevus Classification",
            "Basal Cell Carcinoma Detection",
            "Squamous Cell Carcinoma Detection",
            "ABCDE Analysis",
            "Risk Stratification"
        ],
        "diseases_trained": [
            "Melanoma",
            "Basal Cell Carcinoma",
            "Squamous Cell Carcinoma",
            "Benign Nevi",
            "Seborrheic Keratosis",
            "Actinic Keratosis"
        ],
        "accuracy": "93.7%",
        "training_data": "150,000+ dermoscopy images",
        "created_at": "2025-01-15"
    },
    "diabetes": {
        "model_id": "diabetes",
        "name": "Diabetes Detection",
        "category": "Free",
        "price": 0,
        "currency": "INR",
        "description": "Predictive AI model for diabetes risk assessment and early detection from health metrics.",
        "features": [
            "Risk Score Calculation",
            "HbA1c Prediction",
            "Blood Glucose Forecasting",
            "Complication Risk Assessment",
            "Dietary Impact Analysis",
            "Medication Effectiveness Prediction"
        ],
        "diseases_trained": [
            "Type 1 Diabetes",
            "Type 2 Diabetes",
            "Gestational Diabetes",
            "Prediabetes",
            "Neonatal Diabetes",
            "MODY (Maturity-Onset Diabetes of Young)"
        ],
        "accuracy": "91.2%",
        "training_data": "500,000+ patient records",
        "created_at": "2025-01-15"
    },
    "pneumonia": {
        "model_id": "pneumonia",
        "name": "Pneumonia Detection",
        "category": "Free",
        "price": 0,
        "currency": "INR",
        "description": "Chest imaging analysis for pneumonia detection and classification.",
        "features": [
            "Bacterial Pneumonia Detection",
            "Viral Pneumonia Detection",
            "Fungal Pneumonia Detection",
            "Severity Classification",
            "Consolidation Pattern Analysis",
            "Infiltrate Localization"
        ],
        "diseases_trained": [
            "Bacterial Pneumonia",
            "Viral Pneumonia",
            "Fungal Pneumonia",
            "Aspiration Pneumonia",
            "Atypical Pneumonia",
            "Hospital-Acquired Pneumonia"
        ],
        "accuracy": "94.1%",
        "training_data": "300,000+ X-ray images",
        "created_at": "2025-01-15"
    },
    "malaria": {
        "model_id": "malaria",
        "name": "Malaria Detection",
        "category": "Free",
        "price": 0,
        "currency": "INR",
        "description": "Blood slide microscopy AI for malaria parasite detection and species classification.",
        "features": [
            "Parasite Detection",
            "Species Classification",
            "Parasitemia Level Estimation",
            "Infected RBC Count",
            "Gametocyte Detection",
            "Contamination Assessment"
        ],
        "diseases_trained": [
            "Plasmodium falciparum",
            "Plasmodium vivax",
            "Plasmodium ovale",
            "Plasmodium malariae",
            "Plasmodium knowlesi",
            "Mixed Malaria Infections"
        ],
        "accuracy": "97.3%",
        "training_data": "100,000+ blood slide images",
        "created_at": "2025-01-15"
    },
    "dengue": {
        "model_id": "dengue",
        "name": "Dengue Detection",
        "category": "Free",
        "price": 0,
        "currency": "INR",
        "description": "Serological and clinical data analysis for dengue fever detection and severity assessment.",
        "features": [
            "Dengue IgM Detection",
            "Dengue IgG Detection",
            "Serotype Classification",
            "Severe Dengue (DHF/DSS) Risk",
            "Thrombocytopenia Prediction",
            "Plasma Leakage Assessment"
        ],
        "diseases_trained": [
            "Dengue Fever",
            "Dengue Hemorrhagic Fever (DHF)",
            "Dengue Shock Syndrome (DSS)",
            "Dengue with Warning Signs",
            "Severe Dengue",
            "Secondary Dengue Infection"
        ],
        "accuracy": "92.8%",
        "training_data": "200,000+ patient records",
        "created_at": "2025-01-15"
    }
}
