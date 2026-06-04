import numpy as np
import tensorflow as tf
from PIL import Image
import io

MODEL_PATH = "model_storage/pneumonia_classification_model.h5"

# Load model once
model = tf.keras.models.load_model(MODEL_PATH)

# Print expected input shape for debugging
print(f"[INFO] Loaded Pneumonia model with input shape: {model.input_shape}")

PNEUMONIA_LABELS = ["NORMAL", "ABNORMAL(PNEUMONIA)"]

# Get input size dynamically from model
if len(model.input_shape) == 4:
    _, h, w, c = model.input_shape
    IMG_SIZE = (h, w)
    CHANNELS = c
else:
    # fallback default
    IMG_SIZE = (224, 224)
    CHANNELS = 1


def preprocess_pneumonia_image(image_bytes):
    """
    Preprocess uploaded image bytes for pneumonia model prediction.
    """
    image = Image.open(io.BytesIO(image_bytes))

    # If model expects grayscale
    if CHANNELS == 1:
        image = image.convert("L")
    else:
        image = image.convert("RGB")

    image = image.resize(IMG_SIZE)

    # Normalize and reshape
    image_array = np.array(image).astype(np.float32) / 255.0

    if CHANNELS == 1:
        image_array = np.expand_dims(image_array, axis=-1)  # add channel dim

    image_array = np.expand_dims(image_array, axis=0)  # batch dim
    return image_array


def predict_pneumonia(image_bytes):
    """
    Predict pneumonia status from an X-ray image.
    Returns label, confidence, and human-readable summary.
    """
    input_array = preprocess_pneumonia_image(image_bytes)

    predictions = model.predict(input_array)[0]
    class_index = np.argmax(predictions)
    confidence = float(predictions[class_index])

    label = PNEUMONIA_LABELS[class_index]

    return {
        "label": label,
        "confidence": confidence,
        "summary": f"Pneumonia detection result: {label} ({confidence*100:.2f}%)"
    }