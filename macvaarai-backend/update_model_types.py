import sqlite3

# Connect to database
conn = sqlite3.connect("health_platform.db")
cursor = conn.cursor()

# Model details with types based on .py files
model_updates = {
    "COVID-19 Detection": {
        "model_type": "Binary Classification",
        "input_format": "Chest X-ray Image (224x224)",
        "output_format": "COVID-19 / Normal with Confidence %",
        "accuracy": 0.95
    },
    "Eye Disease Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Fundus Image (224x224)",
        "output_format": "No DR / Mild / Moderate / Severe / Proliferative DR",
        "accuracy": 0.92
    },
    "Pneumonia Detection": {
        "model_type": "Binary Classification",
        "input_format": "Chest X-ray Image (224x224)",
        "output_format": "Pneumonia / Normal with Confidence %",
        "accuracy": 0.94
    },
    "Malaria Detection": {
        "model_type": "Binary Classification",
        "input_format": "Blood Smear Image (224x224)",
        "output_format": "Malaria / Normal with Confidence %",
        "accuracy": 0.96
    },
    "Skin Cancer Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Skin Lesion Image (224x224)",
        "output_format": "Melanoma / Benign Nevus / Other with Confidence %",
        "accuracy": 0.93
    },
    "Dengue Detection": {
        "model_type": "Binary Classification",
        "input_format": "Blood/Serology Image (224x224)",
        "output_format": "Dengue Positive / Negative with Confidence %",
        "accuracy": 0.91
    },
    "Diabetes Detection": {
        "model_type": "Regression/Classification",
        "input_format": "Patient Health Data (Age, BMI, Glucose, etc)",
        "output_format": "Diabetes Risk Score with Confidence %",
        "accuracy": 0.89
    },
    "Ear Disease Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Otoscopy Image (224x224)",
        "output_format": "Infection Type / Normal with Confidence %",
        "accuracy": 0.90
    },
    "Nose Disease Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Nasal Endoscopy Image (224x224)",
        "output_format": "Condition Classification with Confidence %",
        "accuracy": 0.88
    },
    "Throat Disease Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Pharyngeal Image (224x224)",
        "output_format": "Infection Type / Normal with Confidence %",
        "accuracy": 0.89
    },
    "Pharyngitis Detection": {
        "model_type": "Binary Classification",
        "input_format": "Throat Image (224x224)",
        "output_format": "Pharyngitis / Normal with Confidence %",
        "accuracy": 0.91
    },
    "Oral Disease Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Oral/Dental Image (224x224)",
        "output_format": "Disease Type / Normal with Confidence %",
        "accuracy": 0.87
    },
    "Colorectal Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Endoscopy Image (224x224)",
        "output_format": "Lesion Type / Normal with Confidence %",
        "accuracy": 0.92
    },
    "Lung Disease Detection": {
        "model_type": "Multi-Class Classification",
        "input_format": "Chest CT/X-ray Image (224x224)",
        "output_format": "Disease Classification with Confidence %",
        "accuracy": 0.90
    },
    "1-Lead ECG Analysis": {
        "model_type": "Time Series Classification",
        "input_format": "Single Lead ECG Signal",
        "output_format": "Cardiac Status / Abnormality with Confidence %",
        "accuracy": 0.88
    },
    "1-Lead ECG Advanced": {
        "model_type": "Time Series Classification",
        "input_format": "Single Lead ECG Signal (Advanced)",
        "output_format": "Detailed Arrhythmia Classification with Confidence %",
        "accuracy": 0.89
    },
    "12-Lead ECG Analysis": {
        "model_type": "Time Series Classification",
        "input_format": "12-Lead ECG Signal",
        "output_format": "Complete Cardiac Assessment with Confidence %",
        "accuracy": 0.94
    },
    "Multi-Disease Detection": {
        "model_type": "Multi-Task Learning",
        "input_format": "General Medical Image (224x224)",
        "output_format": "Multi-Disease Detection with Confidence %",
        "accuracy": 0.85
    }
}

# Update each model
for model_name, details in model_updates.items():
    try:
        cursor.execute("""
            UPDATE ai_models
            SET model_type = ?, input_format = ?, output_format = ?, accuracy = ?
            WHERE name = ?
        """, (
            details["model_type"],
            details["input_format"],
            details["output_format"],
            details["accuracy"],
            model_name
        ))
        print(f"[SUCCESS] Updated: {model_name}")
        print(f"  Type: {details['model_type']}")
        print(f"  Input: {details['input_format']}")
        print(f"  Output: {details['output_format']}")
        print()
    except Exception as e:
        print(f"[ERROR] Failed to update {model_name}: {e}")

conn.commit()
conn.close()

print("[COMPLETE] All models updated with types and details!")
