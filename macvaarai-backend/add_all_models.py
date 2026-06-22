import sqlite3

# Connect to database
conn = sqlite3.connect("health_platform.db")
cursor = conn.cursor()

# All 18 AI Models with complete details
models = [
    {
        "name": "COVID-19 Detection",
        "description": "Chest X-ray COVID-19 detection using deep learning",
        "category": "Respiratory",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Eye Disease Detection",
        "description": "Diabetic retinopathy classification (No DR, Mild, Moderate, Severe, Proliferative)",
        "category": "Ophthalmology",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Pneumonia Detection",
        "description": "Lung pneumonia detection from chest X-ray images",
        "category": "Respiratory",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Malaria Detection",
        "description": "Malaria parasite detection from blood smear microscopy images",
        "category": "Hematology",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Skin Cancer Detection",
        "description": "Skin lesion classification for melanoma and non-melanoma detection",
        "category": "Dermatology",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Dengue Detection",
        "description": "Dengue virus detection from blood/serology images",
        "category": "Infectious Disease",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Diabetes Detection",
        "description": "Diabetes prediction based on patient health data and metrics",
        "category": "Metabolic",
        "model_type": "Data",
        "price": 50000
    },
    {
        "name": "Ear Disease Detection",
        "description": "Ear infection and disease detection from otoscopy images",
        "category": "ENT",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Nose Disease Detection",
        "description": "Nasal disease and abnormality detection from endoscopy images",
        "category": "ENT",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Throat Disease Detection",
        "description": "Throat infection and disease detection from pharyngeal images",
        "category": "ENT",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Pharyngitis Detection",
        "description": "Pharyngitis (sore throat) classification and severity detection",
        "category": "ENT",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Oral Disease Detection",
        "description": "Oral cavity and mouth disease detection from dental images",
        "category": "Dentistry",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Colorectal Detection",
        "description": "Colorectal lesion and polyp detection from endoscopy images",
        "category": "Gastroenterology",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "Lung Disease Detection",
        "description": "General lung disease detection from chest imaging (CT/X-ray)",
        "category": "Respiratory",
        "model_type": "Image",
        "price": 50000
    },
    {
        "name": "1-Lead ECG Analysis",
        "description": "Single lead ECG signal analysis for cardiac abnormalities",
        "category": "Cardiology",
        "model_type": "ECG",
        "price": 50000
    },
    {
        "name": "1-Lead ECG Advanced",
        "description": "Advanced single lead ECG analysis with arrhythmia detection",
        "category": "Cardiology",
        "model_type": "ECG",
        "price": 50000
    },
    {
        "name": "12-Lead ECG Analysis",
        "description": "Complete 12-lead ECG analysis for comprehensive cardiac assessment",
        "category": "Cardiology",
        "model_type": "ECG",
        "price": 50000
    },
    {
        "name": "Multi-Disease Detection",
        "description": "General multi-purpose diagnostic model for various medical images",
        "category": "General",
        "model_type": "Image",
        "price": 50000
    }
]

# Clear existing models (optional)
cursor.execute("DELETE FROM ai_models")

# Insert all models
for model in models:
    try:
        cursor.execute("""
            INSERT INTO ai_models (name, description, category, model_type, price, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        """, (model["name"], model["description"], model["category"], model["model_type"], model["price"]))
        print(f"[SUCCESS] Added: {model['name']}")
    except sqlite3.IntegrityError:
        print(f"[EXISTS] Already exists: {model['name']}")
    except Exception as e:
        print(f"[ERROR] Failed to add {model['name']}: {e}")

conn.commit()

# Verify
cursor.execute("SELECT COUNT(*) as count FROM ai_models")
total = cursor.fetchone()["count"]
conn.close()

print(f"\n[COMPLETE] Total models in database: {total}")
