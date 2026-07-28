import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

THROAT_LABELS = [
    "Cancer",
    "Non Cancer",
]

# Load model - try .h5 first
print("Loading throat model...")
model = None
for path in ["model_storage/throat_model.h5", "model_storage/throat_model.pth"]:
    if os.path.exists(path):
        try:
            model = tf.keras.models.load_model(path)
            print(f"✅ Throat model loaded from {path}")
            break
        except:
            continue
if model is None:
    print("⚠️ Throat model not found")


def preprocess_throat_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)


def predict_throat(image_bytes):
    """Predict throat condition from input image bytes"""
    if model is None:
        return {"label": "Model not available", "confidence": 0.0, "all_predictions": {}, "summary": "Throat model failed to load"}

    input_array = preprocess_throat_image(image_bytes)
    prediction = model.predict(input_array)

    # Handle actual model output size
    num_classes = len(prediction[0])
    idx = np.argmax(prediction)
    active_labels = THROAT_LABELS[:num_classes] if num_classes <= len(THROAT_LABELS) else THROAT_LABELS

    confidence = float(prediction[0][idx])
    all_predictions = {label: float(prediction[0][i]) for i, label in enumerate(active_labels)}

    return {
        "label": active_labels[idx] if idx < len(active_labels) else "Unknown",
        "confidence": confidence,
        "all_predictions": all_predictions,
        "summary": f"Throat analysis: {active_labels[idx] if idx < len(active_labels) else 'Unknown'} ({confidence*100:.2f}%)"
    }

# Keep old name for backward compatibility
predict_throat_cancer = predict_throat
