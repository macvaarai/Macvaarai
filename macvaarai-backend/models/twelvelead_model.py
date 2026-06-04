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

# Load once
interpreter = tf.lite.Interpreter(model_path="model_storage/twelvelead_model.tflite")  # Adjust filename if needed
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_twelvelead_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((128, 128))  # Resize to what your model expects
    image_array = np.array(image).astype(np.float32) / 255.0
    input_array = np.expand_dims(image_array, axis=0)
    return input_array

def predict_twelvelead(image_bytes):
    input_array = preprocess_twelvelead_image(image_bytes)
    interpreter.set_tensor(input_details[0]['index'], input_array)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    idx = np.argmax(output_data)
    return {
        "label": ECG_12LEAD_LABELS[idx],
        "confidence": float(output_data[0][idx]),
        "summary": f"ECG 12-lead diagnosis: {ECG_12LEAD_LABELS[idx]} ({output_data[0][idx]*100:.2f}%)"
    }