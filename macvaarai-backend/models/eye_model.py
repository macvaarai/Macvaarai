import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

EYE_LABELS = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative DR"
]

# Load once
model = tf.keras.models.load_model("model_storage/eye_model.h5")

def preprocess_eye_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))  # Change if your model expects a different size
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_eye(image_bytes):
    input_array = preprocess_eye_image(image_bytes)
    prediction = model.predict(input_array)
    idx = np.argmax(prediction)
    return {
        "label": EYE_LABELS[idx],
        "confidence": float(prediction[0][idx]),
        "summary": f"Eye result: {EYE_LABELS[idx]} ({prediction[0][idx]*100:.2f}%)"
    }