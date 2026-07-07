import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

# Load model once
model = tf.keras.models.load_model("model_storage/nose_model.h5")

NOSE_LABELS = [
    "Nasal Polyp",
    "Normal",
]

def preprocess_nose_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_nose(image_bytes):
    """Predict nose condition from input image bytes"""
    input_array = preprocess_nose_image(image_bytes)
    prediction = model.predict(input_array)
    idx = np.argmax(prediction)
    confidence = float(prediction[0][idx])

    all_predictions = {}
    for i, label in enumerate(NOSE_LABELS):
        all_predictions[label] = float(prediction[0][i])

    return {
        "label": NOSE_LABELS[idx],
        "confidence": confidence,
        "confidence_percent": f"{confidence*100:.1f}%",
        "all_predictions": all_predictions,
        "summary": f"Nasal condition: {NOSE_LABELS[idx]}"
    }

