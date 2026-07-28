import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

# Load model once
model = tf.keras.models.load_model("model_storage/ear_model.h5")

EAR_LABELS = [
    "Acute Otitis Media",
    "Chronic Otitis Media",
    "Normal",
]

def preprocess_ear_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_ear(image_bytes):
    input_array = preprocess_ear_image(image_bytes)
    prediction = model.predict(input_array)

    # Handle actual model output size (may be 2 or 3 classes)
    num_classes = len(prediction[0])
    idx = np.argmax(prediction)

    # Use only available labels
    active_labels = EAR_LABELS[:num_classes] if num_classes <= len(EAR_LABELS) else EAR_LABELS

    confidence = float(prediction[0][idx])
    all_predictions = {}
    for i, label in enumerate(active_labels):
        all_predictions[label] = float(prediction[0][i])

    return {
        "label": active_labels[idx] if idx < len(active_labels) else "Unknown",
        "confidence": confidence,
        "confidence_percent": f"{confidence*100:.1f}%",
        "all_predictions": all_predictions,
        "summary": f"Ear condition: {active_labels[idx] if idx < len(active_labels) else 'Unknown'}"
    }
