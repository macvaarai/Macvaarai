import os
import joblib
import numpy as np
import json
import pandas as pd

# Lazy load model to avoid import errors at startup
model = None

def _load_model():
    global model
    if model is None:
        try:
            model = joblib.load("model_storage/diabetes_inference_pipeline.pkl")
        except Exception as e:
            print(f"Warning: Could not load diabetes model: {e}")
            model = None

def predict_diabetes_from_json(file_bytes):
    _load_model()
    if model is None:
        return {
            "label": "error",
            "confidence": 0.0,
            "summary": "Diabetes model is not available"
        }

    try:
        content = file_bytes.decode("utf-8")
        data = json.loads(content)

        if "data" in data:
            data = data["data"]

        gender_raw = str(data.get("gender", "")).strip().lower()
        gender = 'Male' if gender_raw in ['male', 'm'] else 'Female'

        raw_smoking = str(data.get("smoking_history", "")).strip().lower().replace('_', ' ')
        if raw_smoking in ['never', 'no info', 'none']:
            smoking_history = 'non_smoker'
        elif raw_smoking == 'current':
            smoking_history = 'current'
        elif raw_smoking in ['ever', 'not current', 'former', 'past smoker']:
            smoking_history = 'past_smoker'
        else:
            smoking_history = 'non_smoker'

        input_data = {
            "gender": gender,
            "age": float(data.get("age", 0)),
            "hypertension": int(data.get("hypertension", 0)),
            "heart_disease": int(data.get("heart_disease", 0)),
            "smoking_history": smoking_history,
            "bmi": float(data.get("bmi", 0.0)),
            "blood_glucose_level": float(data.get("blood_glucose_level", 0))
        }

        df = pd.DataFrame([input_data])
        predicted_class = model.predict(df)[0]
        result = "diabetes" if predicted_class == 1 else "no diabetes"

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(df)
            class_labels = np.array([0, 1])
            predicted_class_index = np.where(class_labels == predicted_class)[0][0]
            confidence = float(probabilities[0][predicted_class_index])
        else:
            confidence = 0.0 

        return {
            "label": result,
            "confidence": confidence,
            "summary": f"Diabetes analysis: {result.upper()} based on input data"
        }

    except Exception as e:
        return {
            "label": "error",
            "confidence": 0.0,
            "summary": f"Failed to process diabetes analysis: {str(e)}"
        }