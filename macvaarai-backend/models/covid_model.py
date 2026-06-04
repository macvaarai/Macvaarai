import numpy as np
import tensorflow as tf
from PIL import Image
import io

# Labels for binary classification
COVID_LABELS = ["Covid-19 X-ray images", "Normal X-ray Images"]

# Load the model once
model = tf.keras.models.load_model("model_storage/covid_xray_model.h5")

def preprocess_covid_image(image_bytes):
    """
    Preprocess uploaded image bytes for COVID X-ray model prediction.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_covid(image_bytes):
    """
    Predict COVID infection status from an image.
    Returns label, confidence, and a readable summary.
    """
    input_array = preprocess_covid_image(image_bytes)
    prediction = model.predict(input_array)[0][0]

    # 0 = Infected, 1 = Uninfected
    if prediction < 0.5:
        label = COVID_LABELS[0]
        confidence = float(1 - prediction)
    else:
        label = COVID_LABELS[1]
        confidence = float(prediction)

    return {
        "label": label,
        "confidence": confidence,
        "summary": f"COVID detection: {label} ({confidence*100:.2f}%)"
    }