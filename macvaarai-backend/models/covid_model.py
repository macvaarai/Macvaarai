import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import hashlib

COVID_LABELS = ["COVID-19 Detected", "Normal"]

# Create lightweight transfer learning model
def create_covid_model():
    """Create COVID detection model using MobileNetV2"""
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False

    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(2, activation='softmax')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# Load model with fallback
try:
    model_path = "model_storage/covid_model.h5"
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
    else:
        print("[INFO] Creating COVID model with transfer learning...")
        model = create_covid_model()
except Exception as e:
    print(f"[WARNING] COVID model error: {e}, creating new model...")
    model = create_covid_model()

def preprocess_covid_image(image_bytes):
    """Preprocess chest X-ray for COVID detection"""
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((224, 224))
        image_array = np.array(image).astype(np.float32) / 255.0
        image_array = tf.keras.applications.mobilenet_v2.preprocess_input(image_array * 255)
        return np.expand_dims(image_array, axis=0)
    except Exception as e:
        print(f"Preprocessing error: {e}")
        return None

def predict_covid(image_bytes):
    """Predict COVID-19 from chest X-ray image"""
    try:
        input_array = preprocess_covid_image(image_bytes)
        if input_array is None:
            return {"label": "Error", "confidence": 0.0, "summary": "Image processing failed"}

        prediction = model.predict(input_array, verbose=0)[0]
        idx = np.argmax(prediction)
        confidence = float(prediction[idx])

        # Ensure valid range
        confidence = max(0.0, min(1.0, confidence))

        diagnosis = COVID_LABELS[idx]

        # Create all_predictions dictionary
        all_predictions = {}
        for i, label in enumerate(COVID_LABELS):
            all_predictions[label] = float(prediction[i])

        return {
            "label": diagnosis,
            "confidence": confidence,
            "all_predictions": all_predictions,
            "summary": f"Chest X-ray Analysis: {diagnosis} ({confidence*100:.1f}% confidence)"
        }
    except Exception as e:
        print(f"COVID prediction error: {e}")
        return {"label": "Error", "confidence": 0.0, "summary": f"Prediction failed: {str(e)}"}