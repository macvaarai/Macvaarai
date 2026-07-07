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
    idx = np.argmax(prediction)
    confidence = float(prediction[0][idx])

    all_predictions = {}
    for i, label in enumerate(EAR_LABELS):
        all_predictions[label] = float(prediction[0][i])

    return {
        "label": EAR_LABELS[idx],
        "confidence": confidence,
        "confidence_percent": f"{confidence*100:.1f}%",
        "all_predictions": all_predictions,
        "summary": f"Ear condition: {EAR_LABELS[idx]}"
    }

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        top_idx = torch.argmax(probs).item()
        confidence = probs[top_idx].item()

    return {
        "label": EAR_LABELS[top_idx],
        "confidence": float(confidence),
        "summary": f"Ear diagnosis: {EAR_LABELS[top_idx]} ({confidence*100:.2f}%)"
    }
