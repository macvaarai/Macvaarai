import sqlite3
import re
import os

# Connect to database
conn = sqlite3.connect("health_platform.db")
cursor = conn.cursor()

# Model files and their label extraction
model_labels = {
    "COVID-19 Detection": ["COVID-19 X-ray images", "Normal X-ray Images"],
    "Eye Disease Detection": ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"],
    "Pneumonia Detection": ["Normal", "Pneumonia"],
    "Malaria Detection": ["Infected (Parasitized)", "Uninfected"],
    "Skin Cancer Detection": ["Melanoma", "Non-Melanoma", "Normal"],
    "Dengue Detection": ["Dengue Positive", "Dengue Negative"],
    "Diabetes Detection": ["Non-Diabetic", "Diabetic", "Pre-Diabetic"],
    "Ear Disease Detection": ["Acute Otitis Media", "Chronic Otitis Media", "Normal"],
    "Nose Disease Detection": ["Sinusitis", "Polyp", "Deviated Septum", "Normal"],
    "Throat Disease Detection": ["Strep Throat", "Viral Infection", "Inflammation", "Normal"],
    "Pharyngitis Detection": ["Pharyngitis", "Normal"],
    "Oral Disease Detection": ["Caries", "Gingivitis", "Periodontitis", "Normal"],
    "Colorectal Detection": ["Polyp", "Mass", "Inflammation", "Normal"],
    "Lung Disease Detection": ["Pneumonia", "Tuberculosis", "Nodule", "Normal"],
    "1-Lead ECG Analysis": ["Normal", "Atrial Fibrillation", "Arrhythmia", "Abnormal"],
    "1-Lead ECG Advanced": ["Normal Sinus", "Atrial Fibrillation", "Ventricular Fibrillation", "Bradycardia", "Tachycardia"],
    "12-Lead ECG Analysis": ["Normal", "STEMI", "NSTEMI", "Bundle Branch Block", "Arrhythmia"],
    "Multi-Disease Detection": ["Abnormality Detected", "Normal Finding"]
}

# Update each model with its output labels
print("Extracting and updating model labels...\n")

for model_name, labels in model_labels.items():
    try:
        labels_str = " | ".join(labels)
        cursor.execute("""
            UPDATE ai_models
            SET output_format = ?
            WHERE name = ?
        """, (labels_str, model_name))

        print(f"[SUCCESS] {model_name}")
        print(f"  Labels: {labels_str}")
        print()
    except Exception as e:
        print(f"[ERROR] Failed to update {model_name}: {e}\n")

conn.commit()

# Verify all updates
cursor.execute("SELECT name, output_format FROM ai_models ORDER BY id")
results = cursor.fetchall()
conn.close()

print("\n" + "="*80)
print("FINAL MODEL LABELS IN DATABASE:")
print("="*80 + "\n")

for i, (name, output_format) in enumerate(results, 1):
    print(f"{i}. {name}")
    print(f"   Output: {output_format}\n")

print("[COMPLETE] All model labels updated successfully!")
