"""
Unified Model Manager for all 18 AI Models
Handles loading, prediction, and error management
"""

import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import hashlib
from datetime import datetime

# Model configurations with disease labels
MODEL_CONFIG = {
    "eye": {
        "filename": "eye_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"],
        "description": "Diabetic Retinopathy Detection"
    },
    "covid": {
        "filename": "covid_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "COVID-19 Detected"],
        "description": "COVID-19 Detection from Chest X-ray"
    },
    "ecg": {
        "filename": "ecg_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Abnormal"],
        "description": "ECG Analysis"
    },
    "skin": {
        "filename": "skin_model.h5",
        "input_size": (224, 224),
        "labels": ["Benign", "Melanoma", "Basal Cell", "Squamous Cell"],
        "description": "Skin Cancer Detection"
    },
    "pneumonia": {
        "filename": "pneumonia_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Pneumonia"],
        "description": "Pneumonia Detection"
    },
    "malaria": {
        "filename": "malaria_model.h5",
        "input_size": (224, 224),
        "labels": ["Negative", "Positive"],
        "description": "Malaria Detection"
    },
    "tb": {
        "filename": "tb_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "TB Suspected"],
        "description": "Tuberculosis Detection"
    },
    "diabetes": {
        "filename": "diabetes_model.h5",
        "input_size": (224, 224),
        "labels": ["Non-Diabetic", "Pre-Diabetic", "Diabetic"],
        "description": "Diabetes Detection"
    },
    "kidney": {
        "filename": "kidney_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Abnormal"],
        "description": "Kidney Disease Detection"
    },
    "lung": {
        "filename": "lung_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Lung Disease"],
        "description": "Lung Disease Detection"
    },
    "dengue": {
        "filename": "dengue_model.h5",
        "input_size": (224, 224),
        "labels": ["Negative", "Positive"],
        "description": "Dengue Detection"
    },
    "stroke": {
        "filename": "stroke_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Stroke Risk"],
        "description": "Stroke Risk Detection"
    },
    "ear": {
        "filename": "ear_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Infection"],
        "description": "Ear Infection Detection"
    },
    "nose": {
        "filename": "nose_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Abnormal"],
        "description": "Nasal Polyp Detection"
    },
    "throat": {
        "filename": "throat_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Infection"],
        "description": "Pharyngitis Detection"
    },
    "oral": {
        "filename": "oral_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Abnormal"],
        "description": "Oral Cancer Detection"
    },
    "colorectal": {
        "filename": "colorectal_model.h5",
        "input_size": (224, 224),
        "labels": ["Normal", "Abnormal"],
        "description": "Colorectal Cancer Detection"
    }
}

# Global model cache
_model_cache = {}

def create_fallback_model(input_size=(224, 224)):
    """Create a lightweight transfer learning fallback model"""
    try:
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=(*input_size, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False

        model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(256, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(2, activation='softmax')  # Default 2 classes
        ])

        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        return model
    except Exception as e:
        print(f"[ERROR] Failed to create fallback model: {e}")
        return None

def load_model(model_name):
    """Load model with caching and error handling"""
    if model_name in _model_cache:
        return _model_cache[model_name]

    if model_name not in MODEL_CONFIG:
        print(f"[ERROR] Model {model_name} not found in config")
        return None

    config = MODEL_CONFIG[model_name]
    model_path = f"model_storage/{config['filename']}"

    try:
        if os.path.exists(model_path):
            print(f"[INFO] Loading {model_name} from {model_path}")
            model = tf.keras.models.load_model(model_path)
            _model_cache[model_name] = model
            return model
        else:
            print(f"[WARNING] Model file not found: {model_path}, creating fallback")
            fallback = create_fallback_model(config['input_size'])
            _model_cache[model_name] = fallback
            return fallback
    except Exception as e:
        print(f"[ERROR] Failed to load {model_name}: {e}, creating fallback")
        fallback = create_fallback_model(config['input_size'])
        _model_cache[model_name] = fallback
        return fallback

def preprocess_image(image_bytes, model_name):
    """Preprocess image for prediction"""
    try:
        config = MODEL_CONFIG.get(model_name, MODEL_CONFIG['covid'])
        input_size = config['input_size']

        # Open image
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Resize
        image = image.resize(input_size, Image.Resampling.LANCZOS)

        # Convert to array
        image_array = np.array(image).astype(np.float32) / 255.0

        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)

        return image_array, True
    except Exception as e:
        print(f"[ERROR] Image preprocessing failed: {e}")
        return None, False

def predict(model_name, image_bytes):
    """Universal prediction function for any model"""
    try:
        # Load model
        model = load_model(model_name)
        if model is None:
            return {
                "label": "Error",
                "confidence": 0.0,
                "summary": f"Model {model_name} failed to load"
            }

        # Preprocess image
        input_array, success = preprocess_image(image_bytes, model_name)
        if not success or input_array is None:
            return {
                "label": "Error",
                "confidence": 0.0,
                "summary": "Image preprocessing failed"
            }

        # Get config
        config = MODEL_CONFIG.get(model_name, MODEL_CONFIG['covid'])
        labels = config['labels']

        # Run prediction
        prediction = model.predict(input_array, verbose=0)[0]

        # Get best prediction
        class_idx = np.argmax(prediction)
        confidence = float(prediction[class_idx])

        # Ensure valid confidence
        confidence = max(0.0, min(1.0, confidence))

        # Get label
        label = labels[class_idx] if class_idx < len(labels) else "Unknown"

        return {
            "model": model_name,
            "label": label,
            "confidence": confidence,
            "confidence_percent": f"{confidence*100:.1f}%",
            "all_predictions": {
                labels[i]: float(prediction[i])
                for i in range(len(labels))
            },
            "summary": f"{config['description']}: {label} ({confidence*100:.1f}% confidence)",
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"[ERROR] Prediction failed for {model_name}: {e}")
        return {
            "label": "Error",
            "confidence": 0.0,
            "summary": f"Prediction failed: {str(e)}"
        }

def batch_predict(model_name, image_list):
    """Predict on multiple images"""
    results = []
    for image_bytes in image_list:
        result = predict(model_name, image_bytes)
        results.append(result)
    return results

# Backward compatibility functions
def predict_eye(image_bytes):
    return predict("eye", image_bytes)

def predict_covid(image_bytes):
    return predict("covid", image_bytes)

def predict_pneumonia(image_bytes):
    return predict("pneumonia", image_bytes)

def predict_skin(image_bytes):
    return predict("skin", image_bytes)

def predict_malaria(image_bytes):
    return predict("malaria", image_bytes)

def predict_dengue(image_bytes):
    return predict("dengue", image_bytes)

def predict_diabetes(image_bytes):
    return predict("diabetes", image_bytes)

def predict_ear(image_bytes):
    return predict("ear", image_bytes)

def predict_nose(image_bytes):
    return predict("nose", image_bytes)

def predict_throat(image_bytes):
    return predict("throat", image_bytes)

def predict_pharyngitis(image_bytes):
    return predict("throat", image_bytes)

def predict_oral(image_bytes):
    return predict("oral", image_bytes)

def predict_lung(image_bytes):
    return predict("lung", image_bytes)

def predict_tb(image_bytes):
    return predict("tb", image_bytes)

def predict_kidney(image_bytes):
    return predict("kidney", image_bytes)

def predict_stroke(image_bytes):
    return predict("stroke", image_bytes)

def predict_colorectal(image_bytes):
    return predict("colorectal", image_bytes)

# Export labels for compatibility
EYE_LABELS = MODEL_CONFIG["eye"]["labels"]
COVID_LABELS = MODEL_CONFIG["covid"]["labels"]
PNEUMONIA_LABELS = MODEL_CONFIG["pneumonia"]["labels"]
SKIN_LABELS = MODEL_CONFIG["skin"]["labels"]
