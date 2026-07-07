import os
import torch
import torch.nn.functional as F
from PIL import Image
import io
import numpy as np
from torchvision import transforms, models
from torch.serialization import add_safe_globals

add_safe_globals([models.mobilenetv2.MobileNetV2])

SKIN_AI_LABELS = [
    "Actinic Keratoses (akiec)",
    "Basal Cell Carcinoma (bcc)",
    "Benign Keratosis-like Lesions (bkl)",
    "Dermatofibroma (df)",
    "Melanoma (mel)",
    "Melanocytic Nevi (nv)",
    "Vascular Lesions (vasc)"
]


device = torch.device("cpu")
model_path = "model_storage/skin_model.pth"

def create_skin_model():
    """Create skin cancer detection model using MobileNetV2"""
    model = models.mobilenetv2(weights='DEFAULT')
    # Replace final layer to match number of classes
    model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, len(SKIN_AI_LABELS))
    return model

try:
    if os.path.exists(model_path):
        # Explicitly set weights_only=False to load full model
        model = torch.load(model_path, map_location=device, weights_only=False)
    else:
        print("[INFO] Creating skin cancer model with transfer learning...")
        model = create_skin_model()
except Exception as e:
    print(f"[WARNING] Skin model error: {e}, creating new model...")
    model = create_skin_model()

model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def preprocess_skin_image(image_bytes):
    """Convert uploaded image bytes into a normalized tensor"""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return transform(image).unsqueeze(0)

def predict_skin(image_bytes):
    """Run inference and return label + confidence + all predictions"""
    input_tensor = preprocess_skin_image(image_bytes)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = F.softmax(outputs, dim=1)
        idx = torch.argmax(probs, dim=1).item()
        confidence = probs[0][idx].item()

    # Create all_predictions dictionary
    all_predictions = {}
    for i, label in enumerate(SKIN_AI_LABELS):
        all_predictions[label] = float(probs[0][i].item())

    return {
        "label": SKIN_AI_LABELS[idx],
        "confidence": float(confidence),
        "all_predictions": all_predictions,
        "summary": f"Skin diagnosis: {SKIN_AI_LABELS[idx]} ({confidence*100:.2f}%)"
    }
