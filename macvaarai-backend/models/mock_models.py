"""Mock models with actual trained model labels"""
import random

MOCK_PREDICTIONS = {
    "ear": {
        "label": "Normal",
        "confidence": 0.87,
        "all_predictions": {
            "Acute Otitis Media": 0.06,
            "Chronic Otitis Media": 0.07,
            "Normal": 0.87
        }
    },
    "nose": {
        "label": "Normal",
        "confidence": 0.85,
        "all_predictions": {
            "Nasal Polyp": 0.15,
            "Normal": 0.85
        }
    },
    "throat": {
        "label": "Non Cancer",
        "confidence": 0.91,
        "all_predictions": {
            "Cancer": 0.09,
            "Non Cancer": 0.91
        }
    },
    "onelead": {
        "label": "Normal Heartbeat",
        "confidence": 0.92,
        "all_predictions": {
            "Normal Heartbeat": 0.92,
            "Supraventricular Heartbeat": 0.04,
            "Ventricular Heartbeat": 0.02,
            "Fusion Heartbeat": 0.01,
            "Unidentified Beat": 0.01
        }
    },
    "twelvelead": {
        "label": "Normal ECG",
        "confidence": 0.94,
        "all_predictions": {
            "Normal ECG": 0.94,
            "Myocardial Infarction": 0.02,
            "ST-T Abnormality": 0.02,
            "Conduction Abnormality": 0.01,
            "Arrhythmia": 0.01,
            "Other": 0.00
        }
    },
}

def predict_ear(image_bytes):
    return MOCK_PREDICTIONS["ear"]

def predict_nose(image_bytes):
    return MOCK_PREDICTIONS["nose"]

def predict_throat(image_bytes):
    return MOCK_PREDICTIONS["throat"]

def predict_onelead(image_bytes):
    return MOCK_PREDICTIONS["onelead"]

def predict_twelvelead(image_bytes):
    return MOCK_PREDICTIONS["twelvelead"]

# Placeholder stubs for other models (not focused on now)
def predict_eye(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_covid(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_pneumonia(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_skin(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_malaria(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_dengue(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_diabetes(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_oral(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_pharyngitis(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_colorectal(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}

def predict_lung(image_bytes):
    return {"label": "Model not active", "confidence": 0.0, "all_predictions": {}}
