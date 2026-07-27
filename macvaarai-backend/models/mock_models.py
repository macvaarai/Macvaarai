"""Mock models for testing without TensorFlow"""
import random

MOCK_PREDICTIONS = {
    "eye": {"label": "No DR", "confidence": 0.92, "all_predictions": {"No DR": 0.92, "Mild": 0.05, "Moderate": 0.02, "Severe": 0.01, "Proliferative DR": 0.00}},
    "covid": {"label": "Normal", "confidence": 0.88, "all_predictions": {"Normal": 0.88, "COVID-19": 0.12}},
    "pneumonia": {"label": "Normal", "confidence": 0.85, "all_predictions": {"Normal": 0.85, "Pneumonia": 0.15}},
    "skin": {"label": "Benign", "confidence": 0.90, "all_predictions": {"Benign": 0.90, "Melanoma": 0.10}},
    "malaria": {"label": "Negative", "confidence": 0.87, "all_predictions": {"Negative": 0.87, "Positive": 0.13}},
    "dengue": {"label": "Negative", "confidence": 0.89, "all_predictions": {"Negative": 0.89, "Positive": 0.11}},
    "diabetes": {"label": "No Retinopathy", "confidence": 0.91, "all_predictions": {"No Retinopathy": 0.91, "Diabetic": 0.09}},
    "ear": {"label": "Normal", "confidence": 0.86, "all_predictions": {"Normal": 0.86, "Infected": 0.14}},
    "nose": {"label": "Normal", "confidence": 0.84, "all_predictions": {"Normal": 0.84, "Polyp": 0.16}},
    "throat": {"label": "Normal", "confidence": 0.88, "all_predictions": {"Normal": 0.88, "Infected": 0.12}},
    "oral": {"label": "Normal", "confidence": 0.93, "all_predictions": {"Normal": 0.93, "Cancer": 0.07}},
    "pharyngitis": {"label": "Viral", "confidence": 0.82, "all_predictions": {"Viral": 0.82, "Bacterial": 0.18}},
    "colorectal": {"label": "Normal", "confidence": 0.89, "all_predictions": {"Normal": 0.89, "Abnormal": 0.11}},
    "lung": {"label": "Normal", "confidence": 0.87, "all_predictions": {"Normal": 0.87, "Abnormal": 0.13}},
    "onelead": {"label": "Normal Sinus Rhythm", "confidence": 0.91, "all_predictions": {"Normal": 0.91, "Abnormal": 0.09}},
    "twelvelead": {"label": "Normal", "confidence": 0.94, "all_predictions": {"Normal": 0.94, "Abnormal": 0.06}},
}

def predict_eye(image_bytes):
    return MOCK_PREDICTIONS["eye"]

def predict_covid(image_bytes):
    return MOCK_PREDICTIONS["covid"]

def predict_pneumonia(image_bytes):
    return MOCK_PREDICTIONS["pneumonia"]

def predict_skin(image_bytes):
    return MOCK_PREDICTIONS["skin"]

def predict_malaria(image_bytes):
    return MOCK_PREDICTIONS["malaria"]

def predict_dengue(image_bytes):
    return MOCK_PREDICTIONS["dengue"]

def predict_diabetes(image_bytes):
    return MOCK_PREDICTIONS["diabetes"]

def predict_ear(image_bytes):
    return MOCK_PREDICTIONS["ear"]

def predict_nose(image_bytes):
    return MOCK_PREDICTIONS["nose"]

def predict_throat(image_bytes):
    return MOCK_PREDICTIONS["throat"]

def predict_oral(image_bytes):
    return MOCK_PREDICTIONS["oral"]

def predict_pharyngitis(image_bytes):
    return MOCK_PREDICTIONS["pharyngitis"]

def predict_colorectal(image_bytes):
    return MOCK_PREDICTIONS["colorectal"]

def predict_lung(image_bytes):
    return MOCK_PREDICTIONS["lung"]

def predict_onelead(image_bytes):
    return MOCK_PREDICTIONS["onelead"]

def predict_twelvelead(image_bytes):
    return MOCK_PREDICTIONS["twelvelead"]
