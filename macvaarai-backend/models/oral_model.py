import os
import torch
import torchvision.transforms as transforms
from PIL import Image
import io

MODEL_PATH = "model_storage/oral.pth"

oral_LABELS = [
    "Cancer",
    "Non Cancer",
]

print("Loading oral cancer model...")
model = torch.load(MODEL_PATH, map_location='cpu', weights_only=False)

model.eval()
print("oral cancer model loaded successfully.")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


def predict_oral(image_bytes):
    """
    Predict throat cancer condition from input image bytes
    """
    # Load and preprocess image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        top_idx = torch.argmax(probabilities).item()
        confidence = probabilities[top_idx].item()

    return {
        "label": oral_LABELS[top_idx],
        "confidence": float(confidence),
        "summary": f"oral cancer diagnosis: {oral_LABELS[top_idx]} ({confidence*100:.2f}%)"
    }

