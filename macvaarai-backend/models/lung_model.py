import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

# Path to the trained model
MODEL_PATH = "model_storage/lung_model_fixed_final.keras"

# Class labels (order must match training)
LUNG_LABELS = [
    "Lung-Benign_Tissue",
    "Lung_Adenocarcinoma",
    "Lung_Squamous_Cell_Carcinoma"
]

# Load the model
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
print("Loading lung cancer model...")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("✅ Lung model loaded successfully.")

# Preprocess image
def preprocess_lung_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)

# Predict
def predict_lung(image_bytes):
    input_array = preprocess_lung_image(image_bytes)
    preds = model.predict(input_array)[0]
    class_index = int(np.argmax(preds))
    label = LUNG_LABELS[class_index]
    confidence = float(preds[class_index])
    return {
        "label": label,
        "confidence": confidence,
        "summary": f"Lung diagnosis: {label} ({confidence*100:.2f}%)"
    }
