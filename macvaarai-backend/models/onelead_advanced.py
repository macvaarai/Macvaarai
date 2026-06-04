import torch
from transformers import AutoModelForImageClassification, AutoProcessor
from PIL import Image
import io
from torchvision import transforms

# AAMI ECG classes
ECG_1LEAD_LABELS = ['Fusion beat', 
                    'Myocardial Infarction', 
                    'Normal beat', 
                    'Unclassifiable beat', 
                    'Supraventricular premature beat', 
                    'Premature ventricular contraction (PVC)']

# Load model and processor from local directory
MODEL_DIR = "model_storage/one_lead_advanced"

model = AutoModelForImageClassification.from_pretrained(MODEL_DIR)
processor = AutoProcessor.from_pretrained(MODEL_DIR)  # Use if available
model.eval()

# If AutoProcessor doesn't work, fallback to manual transforms
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_tensor = preprocess(image).unsqueeze(0)  # Shape: [1, 3, 224, 224]
    return image_tensor

def predict_onelead(image_bytes):
    input_tensor = preprocess_image(image_bytes)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        idx = torch.argmax(probs, dim=1).item()
        confidence = probs[0][idx].item()
    
    return {
        "label": ECG_1LEAD_LABELS[idx],
        "confidence": confidence,
        "summary": f"ECG 1-lead result: {ECG_1LEAD_LABELS[idx]} ({confidence * 100:.2f}%)"
    }
