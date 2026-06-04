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

try:
    # Explicitly set weights_only=False to load full model
    model = torch.load(model_path, map_location=device, weights_only=False)
except Exception as e:
    print("❌ Error loading model:", e)
    raise RuntimeError(
        "Failed to load skin_model.pth. Ensure it's a valid MobileNetV2 checkpoint."
    )

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
    """Run inference and return label + confidence"""
    input_tensor = preprocess_skin_image(image_bytes)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = F.softmax(outputs, dim=1)
        idx = torch.argmax(probs, dim=1).item()
        confidence = probs[0][idx].item()

    return {
        "label": SKIN_AI_LABELS[idx],
        "confidence": float(confidence),
        "summary": f"Skin diagnosis: {SKIN_AI_LABELS[idx]} ({confidence*100:.2f}%)"
    }
