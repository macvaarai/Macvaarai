# colorectal_model.py

import torch
from transformers import Gemma3ForConditionalGeneration, AutoProcessor
from PIL import Image
from rapidfuzz import fuzz
import os

# 9-class CRC labels
TISSUE_CLASSES = [
    "A: adipose",
    "B: background",
    "C: debris",
    "D: lymphocytes",
    "E: mucus",
    "F: smooth muscle",
    "G: normal colon mucosa",
    "H: cancer-associated stroma",
    "I: colorectal adenocarcinoma epithelium"
]

# Prompt used during fine-tuning
PROMPT = (
    "What is the most likely tissue type shown in the histopathology image?\n" +
    "\n".join(TISSUE_CLASSES)
)

# Directories
MODEL_DIR = "model_storage/medgemma-4b"               # Path to base model
ADAPTER_DIR = "model_storage/colorectal_lora"         # Path to LoRA adapter

# Global model objects
processor = None
model = None

def initialize_model():
    global processor, model

    print("[INFO] Loading processor and model into CPU memory...")

    processor = AutoProcessor.from_pretrained(MODEL_DIR)

    # Try float16 for memory efficiency. Use float32 if inference quality degrades.
    base_model = Gemma3ForConditionalGeneration.from_pretrained(
        MODEL_DIR,
        torch_dtype=torch.float32,
        low_cpu_mem_usage=True
    )

    model = base_model.load_adapter(
        ADAPTER_DIR,
        adapter_name="default"
    )
    base_model.set_adapter("default")
    base_model.eval()

    print("[INFO] Model and processor ready.")

def postprocess_label(response: str) -> dict:
    best_match = "Unknown"
    best_score = 0

    for label in TISSUE_CLASSES:
        score = fuzz.partial_ratio(response.lower(), label.lower())
        if score > best_score:
            best_score = score
            best_match = label

    confidence = best_score / 100.0
    return {"label": best_match, "confidence": round(confidence, 3)}

def classify_tissue(image: Image.Image) -> dict:
    if processor is None or model is None:
        raise RuntimeError("Model is not initialized. Call initialize_model() first.")

    image = image.convert("RGB")

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": PROMPT}
            ]
        }
    ]

    inputs = processor(
        messages=messages,
        images=image,
        return_tensors="pt",
        padding=True
    )
    inputs = {k: v.to("cpu") for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=20,
            pad_token_id=processor.tokenizer.eos_token_id
        )

    response = processor.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
    label_info = postprocess_label(response)

    return {
        "label": label_info["label"],
        "confidence": label_info["confidence"],
        "raw_response": response,
        "summary": f"Prediction: {label_info['label']} ({label_info['confidence'] * 100:.1f}%)"
    }
