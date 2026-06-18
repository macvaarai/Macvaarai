import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import io

MODEL_PATH = "model_storage/ear_model.pth"

EAR_LABELS = [
    "Acute Otitis Media",
    "Chronic Otitis Media",
    "Normal",
]
NUM_CLASSES = len(EAR_LABELS)


class EarCNN(nn.Module):
    def __init__(self, num_classes):
        super(EarCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2,2)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.fc1 = nn.Linear(64*32*32, 128)
        self.fc2 = nn.Linear(128, num_classes)
        
    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = x.view(-1, 64*32*32)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x


model = EarCNN(NUM_CLASSES)
state_dict = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
model.load_state_dict(state_dict)
model.eval()

transform = transforms.Compose([
    transforms.Resize((128,128)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5,0.5,0.5], std=[0.5,0.5,0.5])
])

def predict_ear(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        top_idx = torch.argmax(probs).item()
        confidence = probs[top_idx].item()

    return {
        "label": EAR_LABELS[top_idx],
        "confidence": float(confidence),
        "summary": f"Ear diagnosis: {EAR_LABELS[top_idx]} ({confidence*100:.2f}%)"
    }
