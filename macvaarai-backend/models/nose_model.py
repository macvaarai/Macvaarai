import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import json


MODEL_PATH = "model_storage/nose_classification_model.pth"
INFO_PATH = "model_storage/nose_classification_info.json"


with open(INFO_PATH, 'r') as f:
    model_info = json.load(f)

hyperparams = model_info['hyperparameters']
dropout_rate = hyperparams['dropout_rate']


NOSE_LABELS = [
    "Nasal Polyp",
    "Normal",
]

NUM_CLASSES = len(NOSE_LABELS)


def build_resnet(num_classes, dropout_rate=0.4, pretrained=True):
    model = models.resnet50(pretrained=pretrained)
    num_ftrs = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(dropout_rate),
        nn.Linear(num_ftrs, 1024),
        nn.ReLU(inplace=True),
        nn.BatchNorm1d(1024),
        nn.Dropout(dropout_rate * 0.7),
        nn.Linear(1024, 512),
        nn.ReLU(inplace=True),
        nn.BatchNorm1d(512),
        nn.Dropout(dropout_rate * 0.5),
        nn.Linear(512, num_classes)
    )
    return model


model = build_resnet(NUM_CLASSES, dropout_rate=dropout_rate, pretrained=True)
state_dict = torch.load(MODEL_PATH, map_location='cpu')
model.load_state_dict(state_dict)
model.eval()


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


def predict_nose(image_bytes):
    """
    Predict nose condition from input image bytes
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        top_idx = torch.argmax(probabilities).item()
        confidence = probabilities[top_idx].item()

    return {
        "label": NOSE_LABELS[top_idx],
        "confidence": float(confidence),
        "summary": f"Nose diagnosis: {NOSE_LABELS[top_idx]} ({confidence*100:.2f}%)"
    }

