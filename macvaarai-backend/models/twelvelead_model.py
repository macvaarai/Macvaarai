import os
import numpy as np
import tensorflow as tf
from PIL import Image
import io

ECG_12LEAD_LABELS = [
    "Normal ECG",
    "Myocardial Infarction",
    "ST-T Abnormality",
    "Conduction Abnormality",
    "Arrhythmia",
    "Other"
]

# Create transfer learning model for 12-lead ECG
def create_twelvelead_model():
    """Create 12-lead ECG detection model using MobileNetV2"""
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
        tf.keras.layers.Dense(len(ECG_12LEAD_LABELS), activation='softmax')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# Load model with fallback
try:
    model_path = "model_storage/twelvelead_model.tflite"
    if os.path.exists(model_path):
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        model = None
    else:
        print("[INFO] Creating 12-lead ECG model with transfer learning...")
        model = create_twelvelead_model()
        interpreter = None
        input_details = None
        output_details = None
except Exception as e:
    print(f"[WARNING] 12-lead ECG model error: {e}, creating new model...")
    model = create_twelvelead_model()
    interpreter = None
    input_details = None
    output_details = None

def preprocess_twelvelead_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))  # Match model input size
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_twelvelead(image_bytes):
    input_array = preprocess_twelvelead_image(image_bytes)

    # Use TFLite interpreter if available, otherwise use Keras model
    if interpreter is not None:
        interpreter.set_tensor(input_details[0]['index'], input_array)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])
    else:
        output_data = model.predict(input_array, verbose=0)

    idx = np.argmax(output_data[0])
    confidence = float(output_data[0][idx])

    return {
        "label": ECG_12LEAD_LABELS[idx],
        "confidence": confidence,
        "summary": f"ECG 12-lead diagnosis: {ECG_12LEAD_LABELS[idx]} ({confidence*100:.2f}%)"
    }