import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

# Class labels (order must match training)
LUNG_LABELS = [
    "Lung-Benign_Tissue",
    "Lung_Adenocarcinoma",
    "Lung_Squamous_Cell_Carcinoma"
]

# Load the model - try .keras first, then .h5
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
print("Loading lung model...")
model = None
for path in ["model_storage/lung_model_fixed_final.keras", "model_storage/lung_model.h5"]:
    if os.path.exists(path):
        try:
            model = tf.keras.models.load_model(path, compile=False)
            print(f"✅ Lung model loaded from {path}")
            break
        except:
            continue
if model is None:
    print("⚠️ Lung model not found")

# Preprocess image
def preprocess_lung_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)

# Predict
def predict_lung(image_bytes):
    if model is None:
        return {"label": "Model not available", "confidence": 0.0, "summary": "Lung model failed to load"}

    input_array = preprocess_lung_image(image_bytes)
    preds = model.predict(input_array)[0]
    class_index = int(np.argmax(preds))

    # Handle actual model output size
    num_classes = len(preds)
    active_labels = LUNG_LABELS[:num_classes] if num_classes <= len(LUNG_LABELS) else LUNG_LABELS

    label = active_labels[class_index] if class_index < len(active_labels) else "Unknown"
    confidence = float(preds[class_index])

    return {
        "label": label,
        "confidence": confidence,
        "summary": f"Lung diagnosis: {label} ({confidence*100:.2f}%)"
    }
