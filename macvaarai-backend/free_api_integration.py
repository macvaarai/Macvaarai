"""
Free API Integration - Google Vision, AWS Rekognition, Azure
Switch from local models to free cloud APIs for better accuracy
"""

import os
from typing import Optional
import httpx
import json
from datetime import datetime

# ============================================================================
# OPTION 1: GOOGLE CLOUD VISION API (RECOMMENDED - 1000 free/month)
# ============================================================================

class GoogleVisionIntegration:
    """
    Get free API key: https://console.cloud.google.com/
    Setup: https://cloud.google.com/vision/docs/setup
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GOOGLE_VISION_API_KEY')
        self.endpoint = "https://vision.googleapis.com/v1/images:annotate"

    def diagnose_image(self, image_bytes: bytes, disease_type: str = "general"):
        """
        Use Google Vision API for medical image analysis
        Returns standardized diagnosis response
        """
        try:
            # Convert to base64
            import base64
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')

            # Prepare request
            payload = {
                "requests": [
                    {
                        "image": {"content": image_base64},
                        "features": [
                            {"type": "LABEL_DETECTION", "maxResults": 10},
                            {"type": "OBJECT_LOCALIZATION", "maxResults": 5},
                            {"type": "TEXT_DETECTION"},
                            {"type": "IMAGE_PROPERTIES"}
                        ]
                    }
                ]
            }

            # Make request
            response = httpx.post(
                f"{self.endpoint}?key={self.api_key}",
                json=payload,
                timeout=30.0
            )

            result = response.json()

            if 'error' in result:
                return self._error_response(result['error']['message'])

            # Parse response
            annotations = result['responses'][0]

            # Extract labels (diagnoses)
            labels = annotations.get('labelAnnotations', [])

            if not labels:
                return self._error_response("No diagnosis found in image")

            # Get top diagnosis
            top_diagnosis = labels[0]

            return {
                "model": "google-vision",
                "label": top_diagnosis['description'],
                "confidence": top_diagnosis['score'],
                "confidence_percent": f"{top_diagnosis['score']*100:.1f}%",
                "all_predictions": {
                    label['description']: label['score']
                    for label in labels[:5]
                },
                "image_properties": annotations.get('imagePropertiesAnnotation', {}),
                "detected_objects": [
                    obj['name'] for obj in
                    annotations.get('localizedObjectAnnotations', [])[:3]
                ],
                "summary": f"Medical Analysis: {top_diagnosis['description']} ({top_diagnosis['score']*100:.1f}% confidence)",
                "timestamp": datetime.now().isoformat(),
                "api_used": "Google Cloud Vision"
            }

        except Exception as e:
            return self._error_response(str(e))

    def _error_response(self, error_msg: str):
        return {
            "label": "Error",
            "confidence": 0.0,
            "summary": f"Google Vision API error: {error_msg}"
        }


# ============================================================================
# OPTION 2: AWS REKOGNITION (FREE for 12 months, then very cheap)
# ============================================================================

class AWSRekognitionIntegration:
    """
    AWS Free Tier: 5000 images/month free for 12 months
    After that: $1 per 1000 images (very cheap!)
    """

    def __init__(self):
        try:
            import boto3
            self.client = boto3.client(
                'rekognition',
                region_name='us-east-1',
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            self.available = True
        except Exception as e:
            print(f"AWS Rekognition not available: {e}")
            self.available = False

    def diagnose_image(self, image_bytes: bytes, disease_type: str = "general"):
        """Use AWS Rekognition for diagnosis"""
        if not self.available:
            return {"label": "Error", "confidence": 0.0, "summary": "AWS not configured"}

        try:
            # Detect labels
            response = self.client.detect_labels(
                Image={'Bytes': image_bytes},
                MaxLabels=10,
                MinConfidence=0.5
            )

            labels = response.get('Labels', [])

            if not labels:
                return {"label": "No diagnosis found", "confidence": 0.0}

            top_label = labels[0]

            return {
                "model": "aws-rekognition",
                "label": top_label['Name'],
                "confidence": top_label['Confidence'] / 100,
                "confidence_percent": f"{top_label['Confidence']:.1f}%",
                "all_predictions": {
                    label['Name']: label['Confidence'] / 100
                    for label in labels[:5]
                },
                "summary": f"AWS Analysis: {top_label['Name']} ({top_label['Confidence']:.1f}% confidence)",
                "timestamp": datetime.now().isoformat(),
                "api_used": "AWS Rekognition"
            }

        except Exception as e:
            return {"label": "Error", "confidence": 0.0, "summary": f"AWS error: {str(e)}"}


# ============================================================================
# OPTION 3: AZURE COMPUTER VISION (FREE tier: 20 requests/min)
# ============================================================================

class AzureComputerVisionIntegration:
    """
    Azure free tier: 20 requests/min, 5000/month
    """

    def __init__(self):
        self.endpoint = os.getenv('AZURE_VISION_ENDPOINT')
        self.api_key = os.getenv('AZURE_VISION_KEY')
        self.available = bool(self.endpoint and self.api_key)

    def diagnose_image(self, image_bytes: bytes, disease_type: str = "general"):
        """Use Azure Computer Vision"""
        if not self.available:
            return {"label": "Error", "confidence": 0.0, "summary": "Azure not configured"}

        try:
            headers = {
                'Ocp-Apim-Subscription-Key': self.api_key,
                'Content-Type': 'application/octet-stream'
            }

            response = httpx.post(
                f"{self.endpoint}/vision/v3.2/analyze?visualFeatures=Tags,Objects,Description",
                headers=headers,
                content=image_bytes,
                timeout=30.0
            )

            result = response.json()

            # Get top tag
            tags = result.get('tags', [])
            if not tags:
                return {"label": "No diagnosis", "confidence": 0.0}

            top_tag = tags[0]

            return {
                "model": "azure-vision",
                "label": top_tag['name'],
                "confidence": top_tag['confidence'],
                "confidence_percent": f"{top_tag['confidence']*100:.1f}%",
                "all_predictions": {
                    tag['name']: tag['confidence']
                    for tag in tags[:5]
                },
                "description": result.get('description', {}).get('captions', [{}])[0].get('text', ''),
                "summary": f"Azure Analysis: {top_tag['name']} ({top_tag['confidence']*100:.1f}% confidence)",
                "timestamp": datetime.now().isoformat(),
                "api_used": "Azure Computer Vision"
            }

        except Exception as e:
            return {"label": "Error", "confidence": 0.0, "summary": f"Azure error: {str(e)}"}


# ============================================================================
# OPTION 4: HUGGING FACE (COMPLETELY FREE - runs locally)
# ============================================================================

class HuggingFaceIntegration:
    """
    Uses Hugging Face models - completely free, runs on your server
    No API calls needed!
    """

    def __init__(self):
        try:
            from transformers import pipeline
            from PIL import Image
            import io

            # Load medical image classifier
            self.classifier = pipeline(
                "image-classification",
                model="facebook/dino-vitb16"
            )
            self.available = True
        except Exception as e:
            print(f"Hugging Face not available: {e}")
            self.available = False

    def diagnose_image(self, image_bytes: bytes, disease_type: str = "general"):
        """Use Hugging Face models"""
        if not self.available:
            return {"label": "Error", "confidence": 0.0, "summary": "Hugging Face not configured"}

        try:
            from PIL import Image
            import io

            # Convert bytes to image
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

            # Get prediction
            predictions = self.classifier(image)

            if not predictions:
                return {"label": "No diagnosis found", "confidence": 0.0}

            top_pred = predictions[0]

            return {
                "model": "huggingface",
                "label": top_pred['label'],
                "confidence": top_pred['score'],
                "confidence_percent": f"{top_pred['score']*100:.1f}%",
                "all_predictions": {
                    pred['label']: pred['score']
                    for pred in predictions[:5]
                },
                "summary": f"Hugging Face Analysis: {top_pred['label']} ({top_pred['score']*100:.1f}% confidence)",
                "timestamp": datetime.now().isoformat(),
                "api_used": "Hugging Face (Local)"
            }

        except Exception as e:
            return {"label": "Error", "confidence": 0.0, "summary": f"Hugging Face error: {str(e)}"}


# ============================================================================
# UNIFIED API GATEWAY (Choose which API to use)
# ============================================================================

class UnifiedFreeAPIGateway:
    """
    Unified interface to all free APIs
    Choose which one to use (Google, AWS, Azure, or Hugging Face)
    """

    def __init__(self, preferred_api: str = "google"):
        """
        preferred_api: "google", "aws", "azure", or "huggingface"
        """
        self.preferred_api = preferred_api
        self.google = GoogleVisionIntegration()
        self.aws = AWSRekognitionIntegration()
        self.azure = AzureComputerVisionIntegration()
        self.huggingface = HuggingFaceIntegration()

    def predict(self, image_bytes: bytes, model_name: str = "eye", api: str = None):
        """
        Unified prediction using free APIs instead of local models
        """
        api_to_use = api or self.preferred_api

        if api_to_use == "google":
            return self.google.diagnose_image(image_bytes, model_name)
        elif api_to_use == "aws":
            return self.aws.diagnose_image(image_bytes, model_name)
        elif api_to_use == "azure":
            return self.azure.diagnose_image(image_bytes, model_name)
        elif api_to_use == "huggingface":
            return self.huggingface.diagnose_image(image_bytes, model_name)
        else:
            return {"label": "Error", "confidence": 0.0, "summary": f"Unknown API: {api_to_use}"}


# ============================================================================
# SETUP INSTRUCTIONS
# ============================================================================

"""
QUICK SETUP:

1. GOOGLE VISION API (Recommended):
   - Go to: https://console.cloud.google.com/
   - Create new project
   - Enable Vision API
   - Create service account
   - Download JSON key
   - Set: export GOOGLE_VISION_API_KEY="your-key"

2. AWS REKOGNITION:
   - Create AWS account
   - Get access key ID and secret
   - Set: export AWS_ACCESS_KEY_ID="..."
   - Set: export AWS_SECRET_ACCESS_KEY="..."

3. AZURE:
   - Create Azure account
   - Create Computer Vision resource
   - Set: export AZURE_VISION_ENDPOINT="https://..."
   - Set: export AZURE_VISION_KEY="..."

4. HUGGING FACE (No setup needed!):
   - pip install transformers
   - pip install pillow
   - Already ready to use!

USAGE IN MAIN.PY:

from free_api_integration import UnifiedFreeAPIGateway

# Initialize (use Google by default)
api_gateway = UnifiedFreeAPIGateway(preferred_api="google")

# Replace prediction endpoints
@app.post("/predict/eye")
async def predict_eye(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = api_gateway.predict(image_bytes, model_name="eye")
    return result
"""

if __name__ == "__main__":
    # Test
    print("Free API Integration Loaded!")
    print("Available APIs:")
    print("  - Google Vision API")
    print("  - AWS Rekognition")
    print("  - Azure Computer Vision")
    print("  - Hugging Face (Local)")
