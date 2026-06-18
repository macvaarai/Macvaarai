import numpy as np
import tensorflow as tf
import json
import pandas as pd
import os

# Load the dengue model - with graceful fallback if missing
model = None
try:
    if os.path.exists("model_storage/dengue_model.h5"):
        model = tf.keras.models.load_model("model_storage/dengue_model.h5")
except Exception as e:
    print(f"[WARNING] Could not load dengue model: {e}")
    model = None

def predict_dengue_from_json(file_bytes):
    try:
        if model is None:
            return {
                "label": "unavailable",
                "confidence": 0.0,
                "summary": "Dengue model not loaded - download model files to enable this feature"
            }

        # Decode incoming JSON
        content = file_bytes.decode("utf-8")
        data = json.loads(content)

        if "data" in data:
            data = data["data"]

        # Prepare input in the correct order
        input_data = {
            "Age": float(data.get("Age", 0)),
            "HB": float(data.get("HB (gm/dl)", 0)),
            "ESR": float(data.get("ESR (mm)", 0)),
            "WBC": float(data.get("WBC (TC) (/cumm)", 0)),
            "Neutrophils": float(data.get("Neutrophils (%)", 0)),
            "Lymphocytes": float(data.get("Lymphocytes (%)", 0)),
            "Monocytes": float(data.get("Monocytes (%)", 0)),
            "Eosinophils": float(data.get("Eosinophils (%)", 0)),
            "Circulating Eosinophils": float(data.get("Circulating Eosinophils (/cumm)", 0)),
            "RBC": float(data.get("RBC (m/µl)", 0)),
            "HTC/PCV": float(data.get("HTC/PCV (%)", 0)),
            "MCV": float(data.get("MCV (fl)", 0)),
            "MCH": float(data.get("MCH (pg)", 0)),
            "MCHC": float(data.get("MCHC (g/dl)", 0)),
            "RDW": float(data.get("RDW (%)", 0)),
            "PDW": float(data.get("PDW (fl)", 0)),
            "Platelets": float(data.get("Platelets (PC) (/cumm)", 0)),
            "MPV": float(data.get("MPV (fl)", 0)),
            "PCT": float(data.get("PCT (%)", 0))
        }

        # Convert to DataFrame for compatibility
        df = pd.DataFrame([input_data])

        # Predict using the model
        prediction = model.predict(df)[0][0]

        # Threshold 0.5 for classification
        label = "Positive" if prediction > 0.5 else "Negative"
        confidence = float(prediction if label == "Positive" else 1 - prediction)

        return {
            "label": label,
            "confidence": confidence,
            "summary": f"Dengue detection: {label} ({confidence*100:.2f}%)"
        }

    except Exception as e:
        return {
            "label": "error",
            "confidence": 0.0,
            "summary": f"Failed to process dengue analysis: {str(e)}"
        }