import re
from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.staticfiles import StaticFiles
from typing import Optional
from utils.file_utils import detect_file_type
from utils.image_classifier import route_model
from llm.qwen_client import ask_together, build_response_json
from utils.pdf_final import create_exact_medical_report
from fastapi.middleware.cors import CORSMiddleware
import os
from enum import Enum
from langdetect import detect
import sqlite3
import json

from pydantic import BaseModel
from typing import Optional, Union, Literal, List
from models.admin_models import AVAILABLE_MODELS
import uuid
from datetime import datetime

# Database connection
def get_db_connection():
    """Get SQLite database connection"""
    conn = sqlite3.connect("health_platform.db")
    conn.row_factory = sqlite3.Row
    return conn


app = FastAPI(
    title="MacvaarAi Testing API",
    description="MacvaarAi Health Assistant Backend API — for Eye, ECG, Pneumonia, Malaria, Diabetes, Ear, Lung, Skin, Throat, Nose, Covid, Dengue.",
    version="1.0.0",
    contact={
        "name": "MacvaarAi Team",
        "email": "admin@macvaarai.com",
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (hospital logos)
os.makedirs("uploads", exist_ok=True)
try:
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except Exception as e:
    print(f"[WARNING] Could not mount static files: {e}")

NON_MEDICAL_KEYWORDS = [
    r"\bhello\b", r"\bhi\b", r"\bhey\b",
    r"\bhow are you\b", r"\bgood morning\b", r"\bgood evening\b",
    r"\bthank you\b", r"\byes\b", r"\bno\b", r"\bhmm+\b", r"\bok+\b"
]


class ModelType(str, Enum):
    none = "none"
    skin = "skin"
    onelead = "1lead"
    twelvelead = "12lead"
    lung = "lung"
    ear = "ear"
    malaria = "malaria"
    pneumonia = "pneumonia"
    diabetes = "diabetes"
    throat = "throat"
    covid = "covid"
    dengue = "dengue"
    nose = "nose"
    eye = "eye"
    oral = "oral"

class OneLeadSubType(str, Enum):
    general = "general"
    advanced = "advanced"


class ThroatSubType(str, Enum):
    cancer = "cancer"
    pharyngitis = "pharyngitis"


class SubTypes(str, Enum):
    none = "none"
    general = "general"
    advanced = "advanced"
    cancer = "cancer"
    pharyngitis = "pharyngitis"


def is_non_medical(text: str):
    for pattern in NON_MEDICAL_KEYWORDS:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


@app.post("/ai-health-assistant")
async def ai_health_assistant(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    model_type: Optional[ModelType] = Form(None),
    model_subtype: Optional[SubTypes] = Form(None),
    hospital_id: Optional[str] = Form(None)
):
    # Check model access for hospital admin
    if hospital_id:
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT subscribed_models FROM hospitals WHERE hospital_id = ?", (hospital_id,))
            row = cursor.fetchone()
            conn.close()

            if row:
                subscribed_models = json.loads(row[0] or "[]")
                model_str = str(model_type).split('.')[-1] if model_type else None

                if model_str and model_str not in subscribed_models:
                    return {"status": "error", "error": f"❌ Model '{model_str}' not available for your hospital. Subscribed models: {subscribed_models}"}
        except Exception as e:
            print(f"Model access check error: {str(e)}")

    if model_type == ModelType.onelead and model_subtype not in [SubTypes.general, SubTypes.advanced]:
        return {"error": "Invalid subtype. Allowed: general, advanced"}

    if model_type == ModelType.throat and model_subtype not in [SubTypes.cancer, SubTypes.pharyngitis]:
        return {"error": "Invalid subtype. Allowed: cancer, pharyngitis"}

    if model_type not in [ModelType.onelead, ModelType.throat]:
        model_subtype = None

    text_response = None
    image_response = None
    file_bytes = None
    file_type = None

    if file and file.filename.strip() != "":
        file_bytes = await file.read()
        file_type = detect_file_type(file)
        if model_subtype:
            image_response = await route_model(file_bytes, file_type, model_type, model_subtype)
        else:
            image_response = await route_model(file_bytes, file_type, model_type)

    if text and text.strip() != "":
        if is_non_medical(text):
            return {
                "status": "success",
                "response": {
                    "query": text,
                    "answer": "Hi! I’m your medical assistant. Please ask a health-related question.",
                    "type": "greeting"
                }
            }

        enriched_prompt = text
        if model_type:
            enriched_prompt += "\n\n(Clinical Context: " + str(model_type) + ")"
        if image_response and "summary" in image_response:
            summary_text = image_response.get("summary", "")
            enriched_prompt += "\n\nImage Diagnosis Summary: " + str(summary_text)

        try:
            text_response = ask_together(enriched_prompt)
        except Exception as e:
            print("LLM Error (continuing without enrichment): " + str(e))
            text_response = None

    if not text and image_response and "summary" in image_response:
        summary_text = image_response.get("summary", "")
        enriched_prompt = "Diagnosis Summary: " + str(summary_text)
        if model_type:
            enriched_prompt += "\n\n(Clinical Context: " + str(model_type) + ")"

        try:
            text_response = ask_together(enriched_prompt)
        except Exception as e:
            print("LLM Error (continuing without enrichment): " + str(e))
            text_response = None

    # Return model results FIRST (fast response)
    if image_response:
        if image_response.get("rejected", False):
            image_response["confidence"] = 0.0

        response_data = build_response_json(
            text=text,
            file_type=file_type,
            model_result=image_response,
            llm_response=text_response if text_response else None
        )

        confidence = image_response.get("confidence", 0) * 100
        print("✅ Model response ready in ~{:.1f}% confidence".format(confidence))
        return response_data

    elif text_response:
        return build_response_json(
            text=text,
            file_type=None,
            model_result=None,
            llm_response=text_response
        )

    return {"summary": "No valid input provided"}


@app.get("/")
def read_root():
    return {"message": "AI Health Assistant API is running. Use /docs to test the endpoints."}


import pytesseract
from PIL import Image
import io
import os
import subprocess, tempfile, whisper, cv2
from llm.chatbot_client import ask_chatbot
from utils.preprocess import extract_text
from fastapi.responses import PlainTextResponse, FileResponse
import json

whisper_model = whisper.load_model("base")


@app.post("/chatbot", response_class=PlainTextResponse)
async def chatbot(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    extracted_text = ""

    if file and file.filename.strip() != "":
        file_bytes = await file.read()
        file_ext = os.path.splitext(file.filename)[-1].lower().replace(".", "")

        try:
            # Handle images with OCR
            if file_ext in ["jpg", "jpeg", "png"]:
                img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
                extracted_text = pytesseract.image_to_string(
                    img,
                    lang="eng+hin+tel+tam+kan+mal+ori+ben+guj+mar+pan+asm+nep+urd"
                )

            # Handle PDF, TXT, DOC, DOCX
            elif file_ext in ["pdf", "txt", "doc", "docx"]:
                extracted_text = extract_text(file_bytes, file_ext)

            # Handle Video (mp4, mov, avi, mkv)
            elif file_ext in ["mp4", "mov", "avi", "mkv"]:
                with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as tmp_video:
                    tmp_video.write(file_bytes)
                    tmp_video_path = tmp_video.name

                audio_path = tmp_video_path + ".wav"
                subprocess.run([
                    "ffmpeg", "-i", tmp_video_path, "-vn", "-acodec", "pcm_s16le",
                    "-ar", "16000", "-ac", "1", audio_path, "-y"
                ])
                result = whisper_model.transcribe(audio_path)
                extracted_text = result["text"]

                # OCR on first video frame
                cap = cv2.VideoCapture(tmp_video_path)
                success, frame = cap.read()
                if success:
                    pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                    ocr_text = pytesseract.image_to_string(pil_img)
                    if ocr_text.strip():
                        extracted_text += f"\n[Frame OCR]: {ocr_text}"
                cap.release()

            else:
                extracted_text = f"[Unsupported file type: {file_ext}]"

        except Exception as e:
            extracted_text = f"[ERROR extracting text: {e}]"

    # Detect language from user text or extracted text
    from langdetect import detect, DetectorFactory
    DetectorFactory.seed = 0  # makes detection consistent

    def safe_detect(text: str) -> str:
        try:
            if not text or len(text.strip()) < 3:  # too short, default English
                return "en"
            return detect(text)
        except:
            return "en"

    user_lang = "en"  # default
    if text and text.strip():
        try:
            user_lang = safe_detect(text)
        except:
            user_lang = "en"

    # Build chatbot prompt
    enriched_prompt = "You are MacvaarAI Chatbot.\n\n"
    if text:
        enriched_prompt += f"User Question: {text}\n\n"
    if file and file.filename.strip() != "" and extracted_text.strip():
        enriched_prompt += f"Extracted Report/File Text: {extracted_text}\n\n"

    if not text and not extracted_text.strip():
        return "Please provide text or upload a file."

    # Call chatbot model
    chatbot_response = ask_chatbot(enriched_prompt, user_lang=user_lang)

    # Clean response (remove excessive newlines)
    chatbot_response = chatbot_response.replace("\n", " ").strip()

    return chatbot_response


# ═══════════════════════════════════════════════════════════════
# PDF REPORT DOWNLOAD ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.post("/download-report")
async def download_report(request_data: dict):
    """
    Generate and return PDF report for download.

    Expected request body:
    {
        "model_result": {...},
        "llm_response": {...},
        "query": "...",
        "file_type": "..."
    }
    """
    try:
        model_result = request_data.get("model_result")
        llm_response = request_data.get("llm_response")
        query = request_data.get("query")

        # Generate PDF
        pdf_result = create_exact_medical_report(
            patient_name="Patient",
            dob="Unknown",
            gender="Unknown",
            test_type="Medical Analysis",
            uploaded_image_path=None,
            model_result=model_result,
            llm_response=llm_response,
            query_text=query
        )

        if pdf_result.get("status") == "success":
            filepath = pdf_result.get("filepath")
            filename = pdf_result.get("filename")

            # Return PDF file for download
            return FileResponse(
                filepath,
                media_type="application/pdf",
                filename=filename
            )
        else:
            return {"error": "Failed to generate PDF"}

    except Exception as e:
        print(f"PDF Download Error: {str(e)}")
        return {"error": f"Failed to generate PDF: {str(e)}"}


# ═══════════════════════════════════════════════════════════════
# ADMIN MANAGEMENT ENDPOINTS
# ═══════════════════════════════════════════════════════════════

# In-memory storage (replace with database in production)
admin_database = {
    "hero@macvaarai.com": {
        "admin_id": "hero_001",
        "name": "Hero Admin",
        "password_hash": "admin123",  # In production, hash passwords!
        "role": "hero_admin",
        "hospital_id": None,
        "access_key": None,
        "granted_models": [],
        "is_active": True,
    },
    "raj@apollo.com": {
        "admin_id": "admin_001",
        "name": "Dr. Raj Kumar",
        "password_hash": "admin123",
        "role": "hospital_admin",
        "hospital_id": "APL-001",
        "access_key": "ACCESS123",
        "granted_models": ["eye", "covid", "ecg", "skin"],
        "is_active": True,
    }
}

hospitals_database = {
    "APL-001": {
        "hospital_id": "APL-001",
        "name": "Apollo Hospital",
        "email": "admin@apollo.com",
        "phone": "+91-9876543210",
        "address": "123 Medical Center Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip_code": "400001",
        "admin_name": "Dr. Raj Kumar",
        "admin_email": "raj@apollo.com",
        "subscribed_models": ["eye", "covid", "ecg", "skin"],
        "is_active": True,
        "created_at": "2026-01-01",
        "created_by": "hero_001"
    }
}

users_database = {
    "user_001": {
        "user_id": "user_001",
        "name": "aara",
        "email": "aara@example.com",
        "hospital_id": "APL-001",
        "role": "patient",
        "joined": "2025-12-15",
        "status": "active"
    }
}

appointments_database = {
    "apt_001": {
        "appointment_id": "apt_001",
        "patient_name": "John Doe",
        "hospital_id": "APL-001",
        "doctor": "Dr. Smith",
        "date_time": "2026-06-05 2:00 PM",
        "type": "Eye Checkup",
        "status": "scheduled"
    }
}

access_logs_database = []


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class HospitalRequest(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zip_code: str
    admin_name: str
    admin_email: str
    subscribed_models: list = []


class GrantAccessRequest(BaseModel):
    admin_name: str
    admin_email: str
    hospital_id: str
    granted_models: list  # Models to grant access to


class UserRequest(BaseModel):
    name: str
    email: str
    hospital_id: str
    role: str


@app.post("/admin/login")
async def admin_login(request: AdminLoginRequest):
    """Admin authentication endpoint"""
    admin = admin_database.get(request.email)

    if not admin or admin["password_hash"] != request.password:
        return {
            "status": "error",
            "error": "Invalid email or password"
        }

    if not admin["is_active"]:
        return {
            "status": "error",
            "error": "Admin account is inactive"
        }

    # Log access
    access_logs_database.append({
        "admin_id": admin["admin_id"],
        "action": "login",
        "timestamp": str(__import__('datetime').datetime.now())
    })

    return {
        "status": "success",
        "token": f"token_{admin['admin_id']}",
        "role": admin["role"],
        "admin_id": admin["admin_id"],
        "hospital_id": admin.get("hospital_id"),
        "hospital_name": next((h["name"] for h in hospitals_database.values() if h["hospital_id"] == admin.get("hospital_id")), None),
        "access_key": admin.get("access_key"),
        "granted_models": admin.get("granted_models", []),
        "name": admin["name"]
    }


@app.post("/admin/login-access-key")
async def admin_login_access_key(access_key: str):
    """Login using access key (hospital admin)"""
    for email, admin in admin_database.items():
        if admin.get("access_key") == access_key:
            if not admin["is_active"]:
                return {"status": "error", "error": "Admin account is inactive"}

            access_logs_database.append({
                "admin_id": admin["admin_id"],
                "action": "login_with_key",
                "timestamp": str(__import__('datetime').datetime.now())
            })

            return {
                "status": "success",
                "token": f"token_{admin['admin_id']}",
                "role": admin["role"],
                "admin_id": admin["admin_id"],
                "hospital_id": admin.get("hospital_id"),
                "hospital_name": next((h["name"] for h in hospitals_database.values() if h["hospital_id"] == admin.get("hospital_id")), None),
                "granted_models": admin.get("granted_models", []),
                "name": admin["name"]
            }

    return {"status": "error", "error": "Invalid access key"}


@app.get("/admin/available-models")
async def get_available_models():
    """Get all available AI models"""
    return {
        "status": "success",
        "models": AVAILABLE_MODELS
    }


@app.get("/admin/hospitals")
async def get_hospitals(admin_role: str = None):
    """Get all hospitals with their access tokens (hero admin) or filtered by hospital (hospital admin)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT hospital_id, name, email, phone, address, city, state, zip_code, admin_name, admin_email, subscribed_models, access_token, token_status, num_doctors, num_beds, is_active, created_at, created_by FROM hospitals WHERE is_active = 1")
        hospitals = []
        for row in cursor.fetchall():
            hospital = dict(row)
            # Parse subscribed_models if it's a string
            if isinstance(hospital.get('subscribed_models'), str):
                try:
                    hospital['subscribed_models'] = json.loads(hospital['subscribed_models'])
                except:
                    hospital['subscribed_models'] = []
            hospitals.append(hospital)
        conn.close()
        return {"status": "success", "hospitals": hospitals}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/verify-hospital-token")
async def verify_hospital_token(access_token: str = Form(...)):
    """Verify hospital access token and return hospital details"""
    try:
        token = access_token.strip()
        print(f"[DEBUG] Verifying token: {token[:20]}...")

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT hospital_id, name, email, phone, address, city, state, zip_code, admin_name, admin_email, subscribed_models, token_status, num_doctors, num_beds FROM hospitals WHERE access_token = ? AND token_status = 'active' AND is_active = 1",
            (token,)
        )

        hospital = cursor.fetchone()
        conn.close()

        print(f"[DEBUG] Hospital found: {hospital is not None}")

        if not hospital:
            print(f"[DEBUG] No hospital found for token")
            return {"status": "error", "message": "Invalid or inactive token"}

        # Convert Row to dict
        hospital_dict = {
            "hospital_id": hospital[0],
            "name": hospital[1],
            "email": hospital[2],
            "phone": hospital[3],
            "address": hospital[4],
            "city": hospital[5],
            "state": hospital[6],
            "zip_code": hospital[7],
            "admin_name": hospital[8],
            "admin_email": hospital[9],
            "subscribed_models": hospital[10],
            "token_status": hospital[11],
            "num_doctors": hospital[12],
            "num_beds": hospital[13]
        }

        # Parse subscribed_models
        if isinstance(hospital_dict.get('subscribed_models'), str):
            try:
                hospital_dict['subscribed_models'] = json.loads(hospital_dict['subscribed_models'])
            except:
                hospital_dict['subscribed_models'] = []

        return {
            "status": "success",
            "hospital": hospital_dict
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/admin/hospital-by-token/{access_token}")
async def get_hospital_by_token(access_token: str):
    """Get hospital details by access token"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM hospitals WHERE access_token = ? AND is_active = 1",
            (access_token,)
        )

        hospital = cursor.fetchone()
        conn.close()

        if not hospital:
            return {"status": "error", "message": "Hospital not found"}

        hospital_dict = dict(hospital)
        if isinstance(hospital_dict.get('subscribed_models'), str):
            try:
                hospital_dict['subscribed_models'] = json.loads(hospital_dict['subscribed_models'])
            except:
                hospital_dict['subscribed_models'] = []

        return {"status": "success", "hospital": hospital_dict}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/hospitals")
async def create_hospital(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zip_code: str = Form(...),
    admin_name: str = Form(...),
    admin_email: str = Form(...),
    subscribed_models: str = Form("[]"),
    num_doctors: int = Form(0),
    num_beds: int = Form(0),
    admin_id: str = None
):
    """Create new hospital with unique access token (hero admin only)"""
    try:
        import uuid
        import secrets

        # Parse subscribed_models
        try:
            models_list = json.loads(subscribed_models) if isinstance(subscribed_models, str) else subscribed_models
        except:
            models_list = []

        hospital_id = f"HSP-{uuid.uuid4().hex[:8].upper()}"
        # Generate unique access token
        access_token = f"{hospital_id}_TOKEN_{secrets.token_hex(16).upper()}"

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO hospitals
            (hospital_id, name, email, phone, address, city, state, zip_code, admin_name, admin_email, subscribed_models, access_token, token_status, num_doctors, num_beds, is_active, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, 1, ?, ?)
        ''', (
            hospital_id,
            name,
            email,
            phone,
            address,
            city,
            state,
            zip_code,
            admin_name,
            admin_email,
            json.dumps(models_list),
            access_token,
            int(num_doctors),
            int(num_beds),
            datetime.now().isoformat(),
            admin_id
        ))
        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Hospital {name} created successfully",
            "hospital_id": hospital_id,
            "access_token": access_token,
            "token_status": "active"
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/hospitals/{hospital_id}/upload-logo")
async def upload_hospital_logo(hospital_id: str, logo: UploadFile = File(...)):
    """Upload hospital logo"""
    try:
        import os
        import uuid

        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if logo.content_type not in allowed_types:
            return {"status": "error", "error": "Only image files (JPEG, PNG, GIF, WEBP) allowed"}

        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/logos"
        os.makedirs(upload_dir, exist_ok=True)

        # Generate unique filename
        file_ext = logo.filename.split(".")[-1]
        filename = f"{hospital_id}_{uuid.uuid4().hex[:8]}.{file_ext}"
        filepath = os.path.join(upload_dir, filename)

        # Save file
        with open(filepath, "wb") as f:
            content = await logo.read()
            f.write(content)

        # Update database with logo URL
        logo_url = f"/uploads/logos/{filename}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE hospitals SET logo_url = ? WHERE hospital_id = ?",
            (logo_url, hospital_id)
        )
        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": "Logo uploaded successfully",
            "logo_url": logo_url
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.put("/admin/hospitals/{hospital_id}")
async def update_hospital(
    hospital_id: str,
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zip_code: str = Form(...),
    admin_name: str = Form(...),
    admin_email: str = Form(...),
    subscribed_models: str = Form("[]"),
    num_doctors: int = Form(0),
    num_beds: int = Form(0),
    admin_id: str = None
):
    """Update hospital details"""
    try:
        # Parse subscribed_models
        try:
            models_list = json.loads(subscribed_models) if isinstance(subscribed_models, str) else subscribed_models
        except:
            models_list = []

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE hospitals
            SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?,
                admin_name = ?, admin_email = ?, subscribed_models = ?, num_doctors = ?, num_beds = ?
            WHERE hospital_id = ?
        ''', (
            name,
            email,
            phone,
            address,
            city,
            state,
            zip_code,
            admin_name,
            admin_email,
            json.dumps(models_list),
            int(num_doctors),
            int(num_beds),
            hospital_id
        ))
        conn.commit()
        conn.close()

        if cursor.rowcount == 0:
            return {"status": "error", "error": "Hospital not found"}

        return {"status": "success", "message": "Hospital updated successfully"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.delete("/admin/hospitals/{hospital_id}")
async def delete_hospital(hospital_id: str, admin_id: str = None):
    """Delete hospital (deactivate)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE hospitals SET is_active = 0 WHERE hospital_id = ?", (hospital_id,))

        if cursor.rowcount == 0:
            conn.close()
            return {"status": "error", "error": "Hospital not found"}

        conn.commit()
        conn.close()
        return {"status": "success", "message": "Hospital deactivated"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/hospital-admins")
async def grant_hospital_admin(request: GrantAccessRequest, admin_id: str = None):
    """Grant hospital admin access to a user with specific models"""
    if request.hospital_id not in hospitals_database:
        return {"status": "error", "error": "Hospital not found"}

    new_admin_id = f"admin_{len(admin_database)}"
    access_key = str(uuid.uuid4())[:12].upper()

    admin_database[request.admin_email] = {
        "admin_id": new_admin_id,
        "name": request.admin_name,
        "password_hash": "admin123",  # Default password
        "role": "hospital_admin",
        "hospital_id": request.hospital_id,
        "access_key": access_key,
        "granted_models": request.granted_models,
        "is_active": True,
    }

    access_logs_database.append({
        "admin_id": admin_id,
        "action": "granted_hospital_admin_access",
        "resource": new_admin_id,
        "hospital_id": request.hospital_id,
        "timestamp": str(__import__('datetime').datetime.now())
    })

    return {
        "status": "success",
        "message": f"Admin access granted to {request.admin_name}",
        "admin_id": new_admin_id,
        "access_key": access_key,
        "granted_models": request.granted_models
    }


@app.delete("/admin/hospital-admins/{admin_id}")
async def revoke_hospital_admin(admin_id: str, revoked_by: str = None):
    """Revoke hospital admin access"""
    for email, admin in admin_database.items():
        if admin["admin_id"] == admin_id:
            admin["is_active"] = False
            access_logs_database.append({
                "admin_id": revoked_by,
                "action": "revoked_hospital_admin_access",
                "resource": admin_id,
                "timestamp": str(__import__('datetime').datetime.now())
            })
            return {"status": "success", "message": "Admin access revoked"}

    return {"status": "error", "error": "Admin not found"}


@app.get("/admin/users")
async def get_users(hospital_id: str = None, admin_role: str = None):
    """Get all users (hero admin) or filtered by hospital (hospital admin)"""
    if admin_role == "hospital_admin" and hospital_id:
        filtered = {k: v for k, v in users_database.items() if v["hospital_id"] == hospital_id}
        return {"status": "success", "users": list(filtered.values())}

    return {"status": "success", "users": list(users_database.values())}


@app.post("/admin/users")
async def create_user(user: UserRequest, admin_id: str = None):
    """Create new user"""
    user_id = f"user_{len(users_database) + 1:03d}"
    users_database[user_id] = {
        "user_id": user_id,
        "name": user.name,
        "email": user.email,
        "hospital_id": user.hospital_id,
        "role": user.role,
        "joined": str(__import__('datetime').datetime.now().date()),
        "status": "active"
    }

    access_logs_database.append({
        "admin_id": admin_id,
        "action": "created_user",
        "resource": user_id,
        "hospital_id": user.hospital_id,
        "timestamp": str(__import__('datetime').datetime.now())
    })

    return {"status": "success", "message": "User created", "user_id": user_id}


@app.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, admin_id: str = None):
    """Delete user"""
    if user_id not in users_database:
        return {"status": "error", "error": "User not found"}

    hospital_id = users_database[user_id]["hospital_id"]
    del users_database[user_id]

    access_logs_database.append({
        "admin_id": admin_id,
        "action": "deleted_user",
        "resource": user_id,
        "hospital_id": hospital_id,
        "timestamp": str(__import__('datetime').datetime.now())
    })

    return {"status": "success", "message": "User deleted"}


@app.get("/admin/appointments")
async def get_appointments(hospital_id: str = None, admin_role: str = None):
    """Get all appointments (hero admin) or filtered by hospital (hospital admin)"""
    if admin_role == "hospital_admin" and hospital_id:
        filtered = {k: v for k, v in appointments_database.items() if v["hospital_id"] == hospital_id}
        return {"status": "success", "appointments": list(filtered.values())}

    return {"status": "success", "appointments": list(appointments_database.values())}


@app.delete("/admin/appointments/{appointment_id}")
async def cancel_appointment(appointment_id: str, admin_id: str = None):
    """Cancel appointment"""
    if appointment_id not in appointments_database:
        return {"status": "error", "error": "Appointment not found"}

    hospital_id = appointments_database[appointment_id]["hospital_id"]
    del appointments_database[appointment_id]

    access_logs_database.append({
        "admin_id": admin_id,
        "action": "cancelled_appointment",
        "resource": appointment_id,
        "hospital_id": hospital_id,
        "timestamp": str(__import__('datetime').datetime.now())
    })

    return {"status": "success", "message": "Appointment cancelled"}


@app.get("/admin/access-logs")
async def get_access_logs(hospital_id: str = None, admin_role: str = None):
    """Get access logs"""
    if admin_role == "hospital_admin" and hospital_id:
        filtered = [log for log in access_logs_database if log.get("hospital_id") == hospital_id]
        return {"status": "success", "logs": filtered}

    return {"status": "success", "logs": access_logs_database}


# ==================== PATIENT HEALTH RECORDS ====================

@app.get("/admin/patients/{hospital_id}")
async def get_hospital_patients(hospital_id: str):
    """Get all patients in a hospital"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE hospital_id = ? AND role = 'patient'", (hospital_id,))
        patients = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "patients": patients}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/admin/patient-diseases/{patient_id}")
async def get_patient_diseases(patient_id: str):
    """Get all diseases for a patient"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM patient_diseases WHERE patient_id = ? ORDER BY diagnosed_date DESC", (patient_id,))
        diseases = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "diseases": diseases}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==================== PATIENTS MANAGEMENT ====================

@app.get("/admin/patients/{hospital_id}")
async def get_hospital_patients(hospital_id: str):
    """Get all patients for a hospital"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE hospital_id = ? AND role = 'patient' ORDER BY name", (hospital_id,))
        patients = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "patients": patients}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/patients")
async def create_patient(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...) ,
    hospital_id: str = Form(...),
    date_of_birth: str = Form("") ,
    gender: str = Form("") ,
    address: str = Form("") ,
    role: str = Form("patient")
):
    """Create a new patient"""
    try:
        user_id = f"patient_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        # Note: phone, date_of_birth, gender, address stored for reference but not in users table yet
        cursor.execute('''
            INSERT INTO users
            (user_id, name, email, hospital_id, role, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        ''', (user_id, name, email, hospital_id, role))
        conn.commit()
        conn.close()
        return {"status": "success", "user_id": user_id, "message": "Patient created successfully"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/patient-diseases")
async def add_patient_disease(
    patient_id: str = Form(...),
    hospital_id: str = Form(...),
    disease_name: str = Form(...),
    diagnosed_date: str = Form(...),
    notes: str = Form("")
):
    """Add a disease record for a patient"""
    try:
        disease_id = f"dis_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO patient_diseases
            (disease_id, patient_id, hospital_id, disease_name, diagnosed_date, status, notes)
            VALUES (?, ?, ?, ?, ?, 'active', ?)
        ''', (disease_id, patient_id, hospital_id, disease_name, diagnosed_date, notes))
        conn.commit()
        conn.close()
        return {"status": "success", "disease_id": disease_id}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/admin/patient-tests/{patient_id}")
async def get_patient_tests(patient_id: str):
    """Get all test results for a patient"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM patient_tests WHERE patient_id = ? ORDER BY test_date DESC", (patient_id,))
        tests = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "tests": tests}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/patient-tests")
async def add_patient_test(patient_id: str, hospital_id: str, test_name: str, model_used: str, test_date: str, result: str = ""):
    """Add a test result for a patient"""
    try:
        import uuid
        test_id = f"test_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO patient_tests
            (test_id, patient_id, hospital_id, test_name, model_used, test_date, result, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
        ''', (test_id, patient_id, hospital_id, test_name, model_used, test_date, result))
        conn.commit()
        conn.close()
        return {"status": "success", "test_id": test_id}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/admin/patient-prescriptions/{patient_id}")
async def get_patient_prescriptions(patient_id: str):
    """Get all prescriptions for a patient"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM patient_prescriptions WHERE patient_id = ? ORDER BY prescribed_date DESC", (patient_id,))
        prescriptions = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "prescriptions": prescriptions}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/patient-prescriptions")
async def add_patient_prescription(
    patient_id: str,
    hospital_id: str,
    medication_name: str,
    dosage: str,
    frequency: str,
    duration: str,
    prescribed_date: str,
    expiry_date: str = "",
    doctor_name: str = "",
    notes: str = ""
):
    """Add a prescription for a patient"""
    try:
        import uuid
        prescription_id = f"presc_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO patient_prescriptions
            (prescription_id, patient_id, hospital_id, medication_name, dosage, frequency, duration, prescribed_date, expiry_date, doctor_name, notes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ''', (prescription_id, patient_id, hospital_id, medication_name, dosage, frequency, duration, prescribed_date, expiry_date, doctor_name, notes))
        conn.commit()
        conn.close()
        return {"status": "success", "prescription_id": prescription_id}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/admin/hospital-subscription/{hospital_id}")
async def get_hospital_subscription(hospital_id: str):
    """Get subscription and payment status for a hospital"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hospital_subscriptions WHERE hospital_id = ?", (hospital_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"status": "success", "subscription": dict(row)}
        else:
            return {"status": "error", "error": "No subscription found"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==================== SUPPORT TICKETS ====================

@app.get("/admin/support-tickets")
async def get_all_support_tickets(hospital_id: str = None):
    """Get all support tickets or filtered by hospital (for super admin)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if hospital_id:
            cursor.execute("SELECT * FROM support_tickets WHERE hospital_id = ? ORDER BY created_at DESC", (hospital_id,))
        else:
            cursor.execute("SELECT * FROM support_tickets ORDER BY created_at DESC")

        tickets = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "tickets": tickets}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/support-tickets")
async def create_support_ticket(
    hospital_id: str,
    admin_id: str,
    admin_name: str,
    admin_email: str,
    subject: str,
    issue_type: str,
    message: str,
    priority: str = "normal"
):
    """Create a new support ticket"""
    try:
        import uuid
        ticket_id = f"ticket_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO support_tickets
            (ticket_id, hospital_id, admin_id, admin_name, admin_email, subject, issue_type, message, priority, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
        ''', (ticket_id, hospital_id, admin_id, admin_name, admin_email, subject, issue_type, message, priority))
        conn.commit()
        conn.close()
        return {"status": "success", "ticket_id": ticket_id, "message": "Support ticket created successfully"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.put("/admin/support-tickets/{ticket_id}")
async def respond_to_support_ticket(ticket_id: str, response: str, admin_id: str):
    """Respond to a support ticket (super admin only)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE support_tickets
            SET response = ?, responded_by = ?, responded_at = ?, status = 'resolved'
            WHERE ticket_id = ?
        ''', (response, admin_id, datetime.now().isoformat(), ticket_id))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Ticket response recorded"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==================== HOSPITAL FEEDBACK ====================

@app.get("/admin/feedback")
async def get_all_feedback(hospital_id: str = None):
    """Get all feedback or filtered by hospital (for super admin)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if hospital_id:
            cursor.execute("SELECT * FROM hospital_feedback WHERE hospital_id = ? ORDER BY created_at DESC", (hospital_id,))
        else:
            cursor.execute("SELECT * FROM hospital_feedback ORDER BY created_at DESC")

        feedback = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "feedback": feedback}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/feedback")
async def create_feedback(
    hospital_id: str = Form(...),
    hospital_name: str = Form(...),
    admin_id: str = Form(...),
    admin_name: str = Form(...),
    subject: str = Form(...),
    feedback_type: str = Form(...),
    message: str = Form(...),
    priority: str = Form("normal")
):
    """Create feedback from hospital admin"""
    try:
        feedback_id = f"fb_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO hospital_feedback
            (feedback_id, hospital_id, hospital_name, admin_id, admin_name, subject, feedback_type, message, priority, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
        ''', (feedback_id, hospital_id, hospital_name, admin_id, admin_name, subject, feedback_type, message, priority))
        conn.commit()
        conn.close()
        return {"status": "success", "feedback_id": feedback_id, "message": "Feedback submitted successfully"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.put("/admin/feedback/{feedback_id}")
async def respond_to_feedback(
    feedback_id: str,
    response: str = Form(...),
    admin_id: str = Form(...)
):
    """Respond to feedback (super admin only)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE hospital_feedback
            SET response = ?, responded_by = ?, responded_at = ?, status = 'resolved'
            WHERE feedback_id = ?
        ''', (response, admin_id, datetime.now().isoformat(), feedback_id))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Feedback response recorded"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==================== CONSULTATIONS ====================

@app.get("/admin/consultations")
async def get_all_consultations(hospital_id: str = None):
    """Get all consultation requests or filtered by hospital (for super admin)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if hospital_id:
            cursor.execute("SELECT * FROM consultations WHERE hospital_id = ? ORDER BY created_at DESC", (hospital_id,))
        else:
            cursor.execute("SELECT * FROM consultations ORDER BY created_at DESC")

        consultations = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "consultations": consultations}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/consultations")
async def create_consultation(
    hospital_id: str = Form(...),
    hospital_name: str = Form(...),
    admin_id: str = Form(...),
    admin_name: str = Form(...),
    topic: str = Form(...),
    preferred_date: str = Form(...),
    preferred_time: str = Form(...),
    duration: int = Form(60),
    description: str = Form("")
):
    """Create consultation request from hospital admin"""
    try:
        consultation_id = f"cons_{str(uuid.uuid4())[:8]}"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO consultations
            (consultation_id, hospital_id, hospital_name, admin_id, admin_name, topic, preferred_date, preferred_time, duration, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        ''', (consultation_id, hospital_id, hospital_name, admin_id, admin_name, topic, preferred_date, preferred_time, duration, description))
        conn.commit()
        conn.close()
        return {"status": "success", "consultation_id": consultation_id, "message": "Consultation request created successfully"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.put("/admin/consultations/{consultation_id}")
async def respond_to_consultation(
    consultation_id: str,
    confirmed_date: str = Form(...),
    confirmed_time: str = Form(...),
    response: str = Form(...),
    admin_id: str = Form(...)
):
    """Confirm consultation and send response (super admin only)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE consultations
            SET confirmed_date = ?, confirmed_time = ?, response = ?, responded_by = ?, responded_at = ?, status = 'confirmed'
            WHERE consultation_id = ?
        ''', (confirmed_date, confirmed_time, response, admin_id, datetime.now().isoformat(), consultation_id))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Consultation confirmed"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==================== AI MODELS MANAGEMENT ====================

@app.get("/admin/models")
async def get_all_models():
    """Get all AI models with pricing and details"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ai_models ORDER BY category DESC, price DESC")
        models = []
        for row in cursor.fetchall():
            model = dict(row)
            # Parse JSON fields
            model['features'] = json.loads(model.get('features', '[]'))
            model['diseases_trained'] = json.loads(model.get('diseases_trained', '[]'))
            models.append(model)
        conn.close()
        return {"status": "success", "models": models}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/models")
async def create_model(
    model_id: str,
    name: str,
    category: str,
    price: float,
    description: str,
    features: str = "[]",
    diseases_trained: str = "[]",
    accuracy: str = "0%",
    training_data: str = ""
):
    """Create new AI model"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ai_models
            (model_id, name, category, price, description, features, diseases_trained, accuracy, training_data, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ''', (model_id, name, category, price, description, features, diseases_trained, accuracy, training_data))
        conn.commit()
        conn.close()
        return {"status": "success", "model_id": model_id}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.put("/admin/models/{model_id}")
async def update_model(
    model_id: str,
    price: Optional[float] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    category: Optional[str] = None,
    accuracy: Optional[str] = None
):
    """Update model details (price, name, description, etc.)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        update_fields = ["updated_at = ?"]
        params = [datetime.now().isoformat()]

        if price is not None:
            update_fields.append("price = ?")
            params.append(price)
        if name:
            update_fields.append("name = ?")
            params.append(name)
        if description:
            update_fields.append("description = ?")
            params.append(description)
        if category:
            update_fields.append("category = ?")
            params.append(category)
        if accuracy:
            update_fields.append("accuracy = ?")
            params.append(accuracy)

        params.append(model_id)

        query = f"UPDATE ai_models SET {', '.join(update_fields)} WHERE model_id = ?"
        cursor.execute(query, params)
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Model updated"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.delete("/admin/models/{model_id}")
async def delete_model(model_id: str):
    """Delete/deactivate model"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE ai_models SET status = 'inactive' WHERE model_id = ?", (model_id,))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Model deactivated"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


#import tempfile
# import asyncio#from fastapi import FastAPI, UploadFile, File
# from langdetect import detect
# from llm.ai_video_assistant import (
#     create_session,
#     generate_token,
#     transcribe_audio,
#     generate_ai_response,
#     text_to_speech,
#     save_call_history,
#     live_audio_handler,   # new
# )



# @app.get("/video/session")
# def get_video_session():
#     """Create a new video session and return session_id + token."""
#     session_id = create_session()
#     token = generate_token(session_id)
#     return {"session_id": session_id, "token": token}

# @app.post("/video/process-audio")
# async def process_audio(file: UploadFile = File(...)):
#     """Process uploaded audio: transcribe -> AI response -> TTS -> save history."""
#     try:
#         # Save uploaded audio temporarily
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
#             tmp.write(await file.read())
#             tmp_path = tmp.name

#         # Step 1: Transcribe user audio
#         user_text = transcribe_audio(tmp_path)

#         # Step 2: Detect language
#         try:
#             lang_code = detect(user_text)
#         except Exception:
#             lang_code = "en"

#         # Step 3: Generate AI response in same language
#         ai_text = generate_ai_response(user_text, lang_code)

#         # Step 4: Convert AI reply to speech
#         ai_audio_path = text_to_speech(ai_text, lang_code)

#         # Step 5: Save call history
#         save_call_history(user_text, ai_text, lang_code)

#         return {
#             "status": "success",
#             "language": lang_code,
#             "user_text": user_text,
#             "ai_text": ai_text,
#             "ai_audio_file": ai_audio_path,
#         }

#     except Exception as e:
#         return {"status": "error", "message": str(e)}


# @app.post("/video/live")
# async def start_live_ai(session_id: str):
#     """
#     Start AI bot for a given session.
#     It connects to Vonage Media Stream websocket and responds live.
#     """
#     try:
#         # Build the Vonage Media Stream WebSocket URL
#         # (this is a placeholder – replace with your Vonage Streams endpoint)
#         ws_url = f"wss://media-stream.vonage.com/session/{session_id}"

#         # Launch live audio handler in background
#         asyncio.create_task(live_audio_handler(ws_url))

#         return {"status": "live_ai_started", "session_id": session_id, "ws_url": ws_url}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}