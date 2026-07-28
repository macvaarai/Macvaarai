import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

SKIN_AI_LABELS = [
    "Actinic Keratoses (akiec)",
    "Basal Cell Carcinoma (bcc)",
    "Benign Keratosis-like Lesions (bkl)",
    "Dermatofibroma (df)",
    "Melanoma (mel)",
    "Melanocytic Nevi (nv)",
    "Vascular Lesions (vasc)"
]

# Load model - try .h5 first
print("Loading skin model...")
model = None
for path in ["model_storage/skin_model.h5", "model_storage/skin_model.pth"]:
    if os.path.exists(path):
        try:
            model = tf.keras.models.load_model(path)
            print(f"✅ Skin model loaded from {path}")
            break
        except:
            continue
if model is None:
    print("⚠️ Skin model not found")


def preprocess_skin_image(image_bytes):
    """Convert uploaded image bytes into a normalized array"""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)


def predict_skin(image_bytes):
    """Run inference and return label + confidence + all predictions"""
    if model is None:
        return {"label": "Model not available", "confidence": 0.0, "all_predictions": {}, "summary": "Skin model failed to load"}

    input_array = preprocess_skin_image(image_bytes)
    prediction = model.predict(input_array)

    # Handle actual model output size
    num_classes = len(prediction[0])
    idx = np.argmax(prediction)
    active_labels = SKIN_AI_LABELS[:num_classes] if num_classes <= len(SKIN_AI_LABELS) else SKIN_AI_LABELS

    confidence = float(prediction[0][idx])
    all_predictions = {label: float(prediction[0][i]) for i, label in enumerate(active_labels)}

    return {
        "label": active_labels[idx] if idx < len(active_labels) else "Unknown",
        "confidence": confidence,
        "all_predictions": all_predictions,
        "summary": f"Skin diagnosis: {active_labels[idx] if idx < len(active_labels) else 'Unknown'} ({confidence*100:.2f}%)"
    }
