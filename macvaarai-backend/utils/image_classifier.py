import io
import torch
from PIL import Image
from utils.preprocess import convert_to_json

# Import model predictors with graceful fallback if models are missing
try:
    from models.diabetes_model import predict_diabetes_from_json
except Exception as e:
    print(f"[WARNING] Could not import diabetes model: {e}")
    def predict_diabetes_from_json(file_bytes):
        return {"label": "unavailable", "confidence": 0.0, "summary": "Model not loaded"}

try:
    from models.dengue_model import predict_dengue_from_json
except Exception as e:
    print(f"[WARNING] Could not import dengue model: {e}")
    def predict_dengue_from_json(file_bytes):
        return {"label": "unavailable", "confidence": 0.0, "summary": "Model not loaded"}

# Optional: HEIC support
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Load CLIP optionally (not required for core functionality)
CLIP_MODEL = None
CLIP_PREPROCESS = None
try:
    import clip
    CLIP_MODEL, CLIP_PREPROCESS = clip.load("ViT-B/32", device=DEVICE)
    print("[OK] CLIP model loaded successfully")
except Exception as e:
    print(f"[WARNING] CLIP model not available: {str(e)}. Continuing without CLIP...")

# Supported image and document extensions
IMAGE_EXTENSIONS = {
    "png", "jpeg", "jpg", "gif", "bmp", "tiff", "tif", "heif", "heic", "webp", "avif",
    "dds", "icns", "ico", "pcx", "tga", "svg", "eps", "pdf", "ai", "cdr",
    "cr2", "cr3", "nef", "arw", "orf", "raf", "dng", "rw2", "dcm", "dicom",
    "fits", "exr", "hdr", "psd", "xcf", "apng", "mng"
}
DOCUMENT_EXTENSIONS = {
    "pdf", "txt", "doc", "docx", "rtf", "odt", "dot", "dotx", "md", "wps", "xml",
    "epub", "mobi", "azw", "html", "csv", "json", "ppt", "pptx", "xls", "xlsx", "log"
}

async def route_model(file_bytes, file_type, model_type=None, model_subtype=None):
    """
    Routes uploaded file to the correct medical model.
    Accepts all images/documents.
    """
    file_type_lower = (file_type or "").lower()

    # --------------------------
    # Handle Images
    # --------------------------
    if file_type_lower in IMAGE_EXTENSIONS:
        # Route to medical models
        if model_type == "skin":
            from models.skin_model import predict_skin
            return predict_skin(file_bytes)

        elif model_type == "1lead":
            if model_subtype == "advanced":
                from models.onelead_advanced import predict_onelead
                return predict_onelead(file_bytes)
            else:
                from models.onelead_model import predict_onelead
                return predict_onelead(file_bytes)

        elif model_type == "12lead":
            from models.twelvelead_model import predict_twelvelead
            return predict_twelvelead(file_bytes)

        elif model_type == "lung":
            from models.lung_model import predict_lung
            return predict_lung(file_bytes)

        elif model_type == "covid":
            from models.covid_model import predict_covid
            return predict_covid(file_bytes)

        elif model_type == "ear":
            from models.ear_model import predict_ear
            return predict_ear(file_bytes)

        elif model_type == "eye":
            from models.eye_model import predict_eye
            return predict_eye(file_bytes)

        elif model_type == "malaria":
            from models.malaria_model import predict_malaria
            return predict_malaria(file_bytes)

        elif model_type == "pneumonia":
            from models.pneumonia_model import predict_pneumonia
            return predict_pneumonia(file_bytes)
        
        elif model_type == "oral":
            from models.oral_model import predict_oral
            return predict_oral(file_bytes)

        elif model_type == "nose":
            from models.nose_model import predict_nose
            return predict_nose(file_bytes)

        elif model_type == "throat":
            if model_subtype == "cancer":
                from models.throat_model import predict_throat_cancer
                return predict_throat_cancer(file_bytes)
            elif model_subtype == "pharyngitis":
                from models.pharyngitis_model import predict_pharyngitis
                return predict_pharyngitis(file_bytes)
            else:
                return {"summary": "Throat subtype not specified. File accepted."}

        else:
            return {"summary": f"Image file accepted. No model assigned for type: {model_type}"}

    # --------------------------
    # Handle Documents
    # --------------------------
    elif file_type_lower in DOCUMENT_EXTENSIONS:
        if model_type == "diabetes":
            if file_type_lower in {"txt", "pdf", "doc", "docx"}:
                extracted_json = convert_to_json(file_bytes, file_type_lower)
                return predict_diabetes_from_json(extracted_json)
            return predict_diabetes_from_json(file_bytes)

        elif model_type == "dengue":
            if file_type_lower in {"txt", "pdf", "doc", "docx"}:
                extracted_json = convert_to_json(file_bytes, file_type_lower)
                return predict_dengue_from_json(extracted_json)
            return predict_dengue_from_json(file_bytes)

        return {"summary": f"{file_type_lower.upper()} file accepted. No model assigned."}

    # --------------------------
    # Unknown file types
    # --------------------------
    else:
        return {"summary": f"File accepted, unsupported type: {file_type_lower}"}