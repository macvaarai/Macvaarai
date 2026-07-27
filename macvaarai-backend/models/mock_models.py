"""Mock models with actual trained model labels - returns random predictions"""
import random

def get_ear_prediction():
    labels = ["Acute Otitis Media", "Chronic Otitis Media", "Normal"]
    idx = random.randint(0, 2)
    confs = [random.uniform(0.70, 0.95), random.uniform(0.01, 0.20), random.uniform(0.01, 0.20)]
    confs[idx] = random.uniform(0.75, 0.95)
    return {
        "label": labels[idx],
        "confidence": confs[idx],
        "all_predictions": {labels[i]: confs[i] for i in range(3)}
    }

def get_nose_prediction():
    labels = ["Nasal Polyp", "Normal"]
    idx = random.randint(0, 1)
    confs = [random.uniform(0.70, 0.90), random.uniform(0.70, 0.90)]
    confs[idx] = random.uniform(0.80, 0.95)
    return {
        "label": labels[idx],
        "confidence": confs[idx],
        "all_predictions": {labels[i]: confs[i] for i in range(2)}
    }

def get_throat_prediction():
    labels = ["Cancer", "Non Cancer"]
    idx = random.randint(0, 1)
    confs = [random.uniform(0.70, 0.90), random.uniform(0.70, 0.90)]
    confs[idx] = random.uniform(0.80, 0.95)
    return {
        "label": labels[idx],
        "confidence": confs[idx],
        "all_predictions": {labels[i]: confs[i] for i in range(2)}
    }

def get_onelead_prediction():
    labels = ["Normal Heartbeat", "Supraventricular Heartbeat", "Ventricular Heartbeat", "Fusion Heartbeat", "Unidentified Beat"]
    idx = random.randint(0, 4)
    confs = [random.uniform(0.10, 0.30) for _ in range(5)]
    confs[idx] = random.uniform(0.60, 0.95)
    return {
        "label": labels[idx],
        "confidence": confs[idx],
        "all_predictions": {labels[i]: confs[i] for i in range(5)}
    }

def get_twelvelead_prediction():
    labels = ["Normal ECG", "Myocardial Infarction", "ST-T Abnormality", "Conduction Abnormality", "Arrhythmia", "Other"]
    idx = random.randint(0, 5)
    confs = [random.uniform(0.05, 0.25) for _ in range(6)]
    confs[idx] = random.uniform(0.70, 0.95)
    return {
        "label": labels[idx],
        "confidence": confs[idx],
        "all_predictions": {labels[i]: confs[i] for i in range(6)}
    }

def predict_ear(image_bytes):
    return get_ear_prediction()

def predict_nose(image_bytes):
    return get_nose_prediction()

def predict_throat(image_bytes):
    return get_throat_prediction()

def predict_onelead(image_bytes):
    return get_onelead_prediction()

def predict_twelvelead(image_bytes):
    return get_twelvelead_prediction()

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
