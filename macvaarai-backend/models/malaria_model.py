import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

# Labels for binary classification
MALARIA_LABELS = ["Infected (Parasitized)", "Uninfected"]

# Load the model once
model = tf.keras.models.load_model("model_storage/malaria_model.keras")

def preprocess_malaria_image(image_bytes):
    """
    Preprocess uploaded image bytes for malaria model prediction.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))  
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_malaria(image_bytes):
    """
    Predict malaria infection status from an image.
    Returns label, confidence, all predictions, and a readable summary.
    """
    input_array = preprocess_malaria_image(image_bytes)
    prediction = model.predict(input_array)[0][0]

    # 0 = Infected, 1 = Uninfected
    if prediction < 0.5:
        label = MALARIA_LABELS[0]
        confidence = float(1 - prediction)
    else:
        label = MALARIA_LABELS[1]
        confidence = float(prediction)

    # Create all_predictions dictionary
    all_predictions = {
        MALARIA_LABELS[0]: float(1 - prediction),
        MALARIA_LABELS[1]: float(prediction)
    }

    return {
        "label": label,
        "confidence": confidence,
        "all_predictions": all_predictions,
        "summary": f"Malaria detection: {label} ({confidence*100:.2f}%)"
    }