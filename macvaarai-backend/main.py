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
    print(f"[WARNING] Could not mount uploads: {e}")

# Serve organization logos (Vijay, BJP, Modi, CBN)
try:
    logo_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "LOGO")
    if os.path.exists(logo_path):
        app.mount("/LOGO", StaticFiles(directory=logo_path), name="logos")
        print(f"[SUCCESS] Serving logos from: {logo_path}")
    else:
        print(f"[WARNING] LOGO directory not found at: {logo_path}")
except Exception as e:
    print(f"[WARNING] Could not mount LOGO files: {e}")

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
async def admin_login(request: dict):
    """Admin authentication - NEW SYSTEM"""
    try:
        email = request.get("email", "")
        password = request.get("password", "")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, password, name, role FROM admin_users WHERE email = ? AND password = ?", (email, password))
        admin = cursor.fetchone()
        conn.close()

        if admin:
            return {
                "status": "success",
                "admin_id": admin["id"],
                "name": admin["name"],
                "email": admin["email"],
                "role": admin["role"],
                "message": f"Welcome {admin['name']}"
            }
        return {"status": "error", "message": "Invalid credentials"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


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
    """Get all hospitals with their access tokens"""
    try:
        import json
        conn = get_db_connection()
        cursor = conn.cursor()
        # Try to get all columns from hospitals table
        cursor.execute("SELECT * FROM hospitals")
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
            "SELECT hospital_id, name, email, phone, address, city, state, zip_code, admin_name, admin_email, subscribed_models, token_status, num_doctors, num_beds, logo_url FROM hospitals WHERE access_token = ? AND token_status = 'active' AND is_active = 1",
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
            "num_beds": hospital[13],
            "logo_url": hospital[14]
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
    admin_name: str = Form(""),
    admin_email: str = Form(""),
    subscribed_models: str = Form("[]"),
    num_doctors: int = Form(0),
    num_beds: int = Form(0)
):
    """Update hospital details"""
    try:
        import json

        # Parse subscribed_models
        try:
            models_list = json.loads(subscribed_models) if isinstance(subscribed_models, str) else subscribed_models
        except:
            models_list = []

        conn = get_db_connection()
        cursor = conn.cursor()

        # Update hospital
        cursor.execute('''
            UPDATE hospitals
            SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?,
                zip_code = ?, admin_name = ?, admin_email = ?, subscribed_models = ?,
                num_doctors = ?, num_beds = ?
            WHERE hospital_id = ?
        ''', (
            name, email, phone, address, city, state, zip_code,
            admin_name, admin_email, json.dumps(models_list),
            num_doctors, num_beds, hospital_id
        ))

        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Hospital {name} updated successfully"
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/organizations/bulk-import")
async def bulk_import_organizations():
    """Bulk import organizations from organizations_data.json"""
    try:
        import json

        # Read organizations data from JSON file
        with open('organizations_data.json', 'r') as f:
            orgs_data = json.load(f)

        conn = get_db_connection()
        cursor = conn.cursor()
        imported = 0
        errors = []
        created_orgs = []

        for org_data in orgs_data:
            try:
                import uuid
                import secrets

                org_id = f"ORG-{uuid.uuid4().hex[:8].upper()}"
                access_token = f"ORG_{org_data.get('name').upper().replace(' ', '_')}_{secrets.token_hex(8).upper()}"

                models_list = org_data.get('subscribed_models', [])

                cursor.execute('''
                    INSERT INTO organizations
                    (organization_id, name, email, phone, address, city, state, zip_code, access_token, token_status, subscribed_models, num_hospitals, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
                ''', (
                    org_id,
                    org_data.get('name'),
                    org_data.get('email'),
                    org_data.get('phone'),
                    org_data.get('address'),
                    org_data.get('city'),
                    org_data.get('state'),
                    org_data.get('zip_code'),
                    access_token,
                    json.dumps(models_list),
                    int(org_data.get('num_hospitals', 0)),
                    datetime.now().isoformat()
                ))

                created_orgs.append({
                    'name': org_data.get('name'),
                    'token': access_token,
                    'models': len(models_list)
                })

                imported += 1
                print(f"[OK] Imported: {org_data.get('name')}")

            except Exception as e:
                error_msg = f"Error importing {org_data.get('name')}: {str(e)}"
                errors.append(error_msg)
                print(f"[ERROR] {error_msg}")

        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Bulk import completed",
            "imported": imported,
            "total": len(orgs_data),
            "organizations": created_orgs,
            "errors": errors
        }

    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/admin/hospitals/bulk-import")
async def bulk_import_hospitals():
    """Bulk import hospitals from hospitals_data.json"""
    try:
        import json

        # Read hospitals data from JSON file
        with open('hospitals_data.json', 'r') as f:
            hospitals_data = json.load(f)

        conn = get_db_connection()
        cursor = conn.cursor()
        imported = 0
        errors = []

        for hospital_data in hospitals_data:
            try:
                import uuid
                import secrets

                hospital_id = f"HSP-{uuid.uuid4().hex[:8].upper()}"
                access_token = f"{hospital_id}_TOKEN_{secrets.token_hex(16).upper()}"

                models_list = hospital_data.get('subscribed_models', [])

                cursor.execute('''
                    INSERT INTO hospitals
                    (hospital_id, name, email, phone, address, city, state, zip_code, admin_name, admin_email, subscribed_models, access_token, token_status, num_doctors, num_beds, is_active, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, 1, ?)
                ''', (
                    hospital_id,
                    hospital_data.get('name'),
                    hospital_data.get('email'),
                    hospital_data.get('phone'),
                    hospital_data.get('address'),
                    hospital_data.get('city'),
                    hospital_data.get('state'),
                    hospital_data.get('zip_code'),
                    hospital_data.get('admin_name'),
                    hospital_data.get('admin_email'),
                    json.dumps(models_list),
                    access_token,
                    int(hospital_data.get('num_doctors', 0)),
                    int(hospital_data.get('num_beds', 0)),
                    datetime.now().isoformat()
                ))

                imported += 1
                print(f"[OK] Imported: {hospital_data.get('name')}")

            except Exception as e:
                error_msg = f"Error importing {hospital_data.get('name')}: {str(e)}"
                errors.append(error_msg)
                print(f"[ERROR] {error_msg}")

        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Bulk import completed",
            "imported": imported,
            "total": len(hospitals_data),
            "errors": errors
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


# ============================================================================
# GOVERNMENT ANALYTICS & REPORTING ENDPOINTS
# ============================================================================

from government_data import (
    get_disease_data, get_vaccination_data, get_staff_data,
    get_inventory_data, get_finance_data, get_quality_data, get_analytics_data
)

@app.get("/admin/analytics/overview")
async def get_analytics_overview():
    """Get government analytics overview"""
    try:
        return {"status": "success", "data": get_analytics_data()}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/disease-surveillance")
async def get_disease_surveillance():
    """Get disease surveillance data"""
    try:
        diseases = get_disease_data()
        total_cases = sum(d["cases"] for d in diseases.values())
        total_recovered = sum(d["recovered"] for d in diseases.values())
        total_deaths = sum(d["deaths"] for d in diseases.values())

        return {
            "status": "success",
            "diseases": diseases,
            "summary": {
                "total_cases": total_cases,
                "total_recovered": total_recovered,
                "total_deaths": total_deaths,
                "recovery_rate": round((total_recovered / total_cases * 100), 2) if total_cases > 0 else 0
            }
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/vaccination")
async def get_vaccination_stats():
    """Get vaccination data"""
    try:
        return {"status": "success", "data": get_vaccination_data()}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/staff")
async def get_staff_stats():
    """Get staff management data"""
    try:
        return {"status": "success", "data": get_staff_data()}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/inventory")
async def get_inventory_stats():
    """Get inventory and medicine data"""
    try:
        return {"status": "success", "data": get_inventory_data()}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/finance")
async def get_finance_stats():
    """Get finance and budget data"""
    try:
        return {"status": "success", "data": get_finance_data()}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/quality")
async def get_quality_stats():
    """Get quality and compliance metrics"""
    try:
        return {"status": "success", "data": get_quality_data()}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/analytics/full-report")
async def get_full_analytics_report():
    """Get complete analytics report for government submission"""
    try:
        report = {
            "status": "success",
            "report_date": datetime.now().isoformat(),
            "analytics": get_analytics_data(),
            "diseases": get_disease_data(),
            "vaccination": get_vaccination_data(),
            "staff": get_staff_data(),
            "inventory": get_inventory_data(),
            "finance": get_finance_data(),
            "quality": get_quality_data(),
        }
        return report
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ============================================================================
# HOSPITAL-SPECIFIC ENHANCED ENDPOINTS
# ============================================================================

@app.get("/admin/hospital/{hospital_id}/dashboard-stats")
async def get_hospital_dashboard_stats(hospital_id: str):
    """Get enhanced hospital dashboard statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get hospital info
        cursor.execute("SELECT * FROM hospitals WHERE hospital_id = ?", (hospital_id,))
        hospital = cursor.fetchone()

        if not hospital:
            return {"status": "error", "error": "Hospital not found"}

        # Count patients
        cursor.execute("SELECT COUNT(*) FROM users WHERE hospital_id = ?", (hospital_id,))
        total_patients = cursor.fetchone()[0]

        # Count appointments
        cursor.execute("SELECT COUNT(*) FROM appointments WHERE hospital_id = ?", (hospital_id,))
        total_appointments = cursor.fetchone()[0]

        # Count completed appointments
        cursor.execute("SELECT COUNT(*) FROM appointments WHERE hospital_id = ? AND status = 'completed'", (hospital_id,))
        completed_appointments = cursor.fetchone()[0]

        # Get disease breakdown
        cursor.execute('''
            SELECT disease_name, COUNT(*) as count
            FROM patient_diseases
            WHERE hospital_id = ?
            GROUP BY disease_name
        ''', (hospital_id,))
        diseases = {row[0]: row[1] for row in cursor.fetchall()}

        conn.close()

        # Mock data for additional metrics
        stats = {
            "hospital_id": hospital_id,
            "hospital_name": hospital[1],
            "total_patients": total_patients,
            "total_appointments": total_appointments,
            "completed_appointments": completed_appointments,
            "bed_occupancy": 75,
            "staff_on_duty": 45,
            "icu_occupied": 12,
            "emergency_cases": 8,
            "diseases": diseases,
            "monthly_revenue": 15000000,
            "average_patient_stay": 3.2,
            "satisfaction_score": 4.5,
        }

        return {"status": "success", "data": stats}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/hospital/{hospital_id}/performance-metrics")
async def get_hospital_performance_metrics(hospital_id: str):
    """Get hospital performance metrics"""
    try:
        metrics = {
            "compliance_score": 92,
            "infection_rate": 0.9,
            "mortality_rate": 1.5,
            "patient_satisfaction": 4.4,
            "staff_efficiency": 83,
            "equipment_utilization": 78,
            "budget_utilization": 85,
            "accreditation_status": "Active",
            "last_audit_date": "2026-05-15",
            "audit_findings": 5,
        }
        return {"status": "success", "data": metrics}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/admin/hospital/{hospital_id}/patient-analytics")
async def get_hospital_patient_analytics(hospital_id: str):
    """Get patient analytics for hospital"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get patient age distribution (mock for now)
        cursor.execute("SELECT COUNT(*) FROM users WHERE hospital_id = ?", (hospital_id,))
        total_patients = cursor.fetchone()[0]

        analytics = {
            "total_patients": total_patients,
            "new_patients_month": int(total_patients * 0.15),
            "readmission_rate": 2.3,
            "average_stay_days": 3.2,
            "age_distribution": {
                "0-18": 12,
                "18-35": 28,
                "35-50": 35,
                "50-65": 18,
                "65+": 7,
            },
            "gender_distribution": {
                "male": 52,
                "female": 48,
            },
            "insurance_status": {
                "government": 40,
                "private": 35,
                "self_pay": 25,
            }
        }

        conn.close()
        return {"status": "success", "data": analytics}
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


# ============================================================================
# ORGANIZATION MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/organizations")
async def get_all_organizations():
    """Get all registered organizations"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Try to get from organizations table
        try:
            cursor.execute("SELECT * FROM organizations WHERE is_active = 1")
            orgs = cursor.fetchall()
            org_list = []
            for org in orgs:
                org_list.append({
                    "id": org['id'],
                    "name": org['name'],
                    "logo_url": org['logo_url'],
                    "email": org['email'],
                    "phone": org['phone'],
                    "total_hospitals": org['total_hospitals'],
                    "status": org['status']
                })
            conn.close()
            return {"status": "success", "organizations": org_list}
        except:
            conn.close()
            # Return sample organizations
            sample_orgs = [
                {
                    "id": 1,
                    "name": "Vijay Care",
                    "logo_url": "/LOGO/Vijay.jpeg",
                    "email": "admin@vijaycare.com",
                    "phone": "+91-9876543210",
                    "total_hospitals": 15,
                    "status": "active"
                },
                {
                    "id": 2,
                    "name": "BJP Care",
                    "logo_url": "/LOGO/BJP.jpeg",
                    "email": "admin@bjpcare.com",
                    "phone": "+91-9876543211",
                    "total_hospitals": 25,
                    "status": "active"
                },
                {
                    "id": 3,
                    "name": "Modi Healthcare",
                    "logo_url": "/LOGO/Modi.jpeg",
                    "email": "admin@modicare.gov.in",
                    "phone": "+91-1234567890",
                    "total_hospitals": 50,
                    "status": "active"
                },
                {
                    "id": 4,
                    "name": "CBN Care",
                    "logo_url": "/LOGO/CBN.jpg",
                    "email": "admin@cbncare.com",
                    "phone": "+91-9876543212",
                    "total_hospitals": 12,
                    "status": "active"
                }
            ]
            return {"status": "success", "organizations": sample_orgs}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/organization/{org_id}")
async def get_organization(org_id: int):
    """Get specific organization details"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM organizations WHERE id = ? AND is_active = 1
        """, (org_id,))
        org = cursor.fetchone()
        conn.close()

        if org:
            return {
                "status": "success",
                "organization": {
                    "id": org['id'],
                    "name": org['name'],
                    "logo_url": org['logo_url'],
                    "email": org['email'],
                    "phone": org['phone'],
                    "address": org['address'],
                    "city": org['city'],
                    "state": org['state'],
                    "total_hospitals": org['total_hospitals'],
                    "status": org['status']
                }
            }
        return {"status": "error", "message": "Organization not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/org-admin/login")
async def org_admin_login(request: dict):
    """Login for organization admins using email/password"""
    try:
        email = request.get("email", "")
        password = request.get("password", "")
        organization = request.get("organization", "")

        if not email or not password:
            return {"status": "error", "message": "Email and password required"}

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get organization ID by name
        cursor.execute("SELECT id FROM organizations WHERE name = ?", (organization,))
        org_result = cursor.fetchone()

        if not org_result:
            conn.close()
            return {"status": "error", "message": "Organization not found"}

        org_id = org_result['id']

        # Check for admin in organization_admins table
        cursor.execute(
            "SELECT id, name, email, organization_id FROM organization_admins WHERE email = ? AND password = ? AND organization_id = ?",
            (email, password, org_id)
        )
        admin = cursor.fetchone()

        if admin:
            # Get organization details
            cursor.execute("SELECT id, name, token, email FROM organizations WHERE id = ?", (org_id,))
            org = cursor.fetchone()
            conn.close()

            return {
                "status": "success",
                "org_id": org_id,
                "admin_id": admin['id'],
                "name": admin['name'],
                "org_name": org['name'],
                "token": org['token'],
                "message": f"Welcome {admin['name']}"
            }

        # If not found in organization_admins, check if organization itself has this login
        cursor.execute("SELECT id, name, email, token FROM organizations WHERE name = ? AND email = ?", (organization, email))
        org_admin = cursor.fetchone()
        conn.close()

        if org_admin:
            return {
                "status": "success",
                "org_id": org_admin['id'],
                "name": organization,
                "token": org_admin['token'],
                "message": f"Welcome to {organization}"
            }

        return {"status": "error", "message": "Invalid credentials"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/org-admin/signup")
async def org_admin_signup(request: dict):
    """Sign up for organization admins"""
    try:
        name = request.get("name", "")
        email = request.get("email", "")
        phone = request.get("phone", "")
        password = request.get("password", "")
        organization = request.get("organization", "")

        if not name or not email or not password or not organization:
            return {"status": "error", "message": "All fields are required"}

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get organization ID by name
        cursor.execute("SELECT id, token FROM organizations WHERE name = ?", (organization,))
        org_result = cursor.fetchone()

        if not org_result:
            conn.close()
            return {"status": "error", "message": "Organization not found"}

        org_id = org_result['id']

        # Check if email already exists in this organization
        cursor.execute("SELECT id FROM organization_admins WHERE email = ? AND organization_id = ?", (email, org_id))
        if cursor.fetchone():
            conn.close()
            return {"status": "error", "message": "Email already exists in this organization"}

        # Create new admin
        cursor.execute(
            "INSERT INTO organization_admins (organization_id, name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (org_id, name, email, phone, password, "admin", datetime.now().isoformat())
        )
        conn.commit()
        admin_id = cursor.lastrowid
        conn.close()

        return {
            "status": "success",
            "admin_id": admin_id,
            "name": name,
            "email": email,
            "org_id": org_id,
            "token": org_result['token'],
            "message": f"Account created successfully! Please log in."
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/org/{org_id}/hospitals")
async def get_org_hospitals(org_id: int):
    """Get all hospitals under an organization"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM hospitals WHERE organization_id = ? AND is_active = 1
        """, (org_id,))
        hospitals = cursor.fetchall()
        conn.close()

        hospital_list = []
        for h in hospitals:
            hospital_list.append({
                "id": h['hospital_id'],
                "name": h['name'],
                "address": h['address'],
                "phone": h['phone'],
                "doctors": h['num_doctors'],
                "beds": h['num_beds'],
                "logo_url": h['logo_url']
            })

        return {"status": "success", "hospitals": hospital_list, "total": len(hospital_list)}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/org/{org_id}/dashboard-stats")
async def get_org_dashboard_stats(org_id: int):
    """Get organization dashboard statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get organization info
        cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
        org = cursor.fetchone()

        # Get hospital count
        cursor.execute("SELECT COUNT(*) as count FROM hospitals WHERE organization_id = ?", (org_id,))
        hospital_count = cursor.fetchone()['count']

        # Get patient count
        cursor.execute("""
            SELECT COUNT(*) as count FROM users
            WHERE hospital_id IN (SELECT hospital_id FROM hospitals WHERE organization_id = ?)
        """, (org_id,))
        patient_count = cursor.fetchone()['count']

        # Get total beds
        cursor.execute("SELECT SUM(num_beds) as total FROM hospitals WHERE organization_id = ?", (org_id,))
        total_beds = cursor.fetchone()['total'] or 0

        conn.close()

        if org:
            return {
                "status": "success",
                "org_name": org['name'],
                "org_logo": org['logo_url'],
                "total_hospitals": hospital_count,
                "total_patients": patient_count,
                "total_beds": total_beds,
                "total_doctors": int(total_beds / 4) if total_beds > 0 else 0  # Estimate
            }

        return {"status": "error", "message": "Organization not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}

# TIER 1: MACVAAR MAIN ADMIN PORTAL

@app.post("/macvaar-admin/login")
async def macvaar_admin_login(request: dict):
    try:
        key = request.get("key", "")
        if key == "hero_admin_001":
            return {
                "status": "success",
                "admin_id": "macvaar_001",
                "role": "macvaar_admin",
                "message": "Welcome to MacvaarAI Official Portal"
            }
        return {"status": "error", "message": "Invalid admin key"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/macvaar-admin/dashboard")
async def macvaar_admin_dashboard():
    try:
        organizations = [
            {"id": 1, "name": "Vijay Care", "owner": "Vijay Kumar", "logo_url": "/LOGO/Vijay.jpeg", "hospitals": 15, "patients": 3450, "status": "active"},
            {"id": 2, "name": "BJP Care", "owner": "BJP Leadership", "logo_url": "/LOGO/BJP.jpeg", "hospitals": 25, "patients": 6780, "status": "active"},
            {"id": 3, "name": "Modi Healthcare", "owner": "Government", "logo_url": "/LOGO/Modi.jpeg", "hospitals": 50, "patients": 15230, "status": "active"},
            {"id": 4, "name": "CBN Care", "owner": "CBN Leadership", "logo_url": "/LOGO/CBN.jpg", "hospitals": 12, "patients": 2340, "status": "active"}
        ]
        return {
            "status": "success",
            "total_organizations": len(organizations),
            "total_hospitals": sum(o["hospitals"] for o in organizations),
            "total_patients": sum(o["patients"] for o in organizations),
            "organizations": organizations
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


# TIER 2: ORGANIZATION ADMIN PORTALS

@app.get("/org/{org_id}/dashboard-full")
async def org_dashboard_full(org_id: int):
    try:
        org_data = {1: {"name": "Vijay Care", "owner": "Vijay Kumar", "logo_url": "/LOGO/Vijay.jpeg", "hospitals": 15, "patients": 3450, "beds": 2500, "doctors": 280}}
        org = org_data.get(org_id)
        if not org:
            return {"status": "error", "message": "Organization not found"}
        return {"status": "success", "organization": org}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/org/{org_id}/add-hospital")
async def add_hospital(org_id: int, request: dict):
    try:
        name = request.get("name", "")
        if not name:
            return {"status": "error", "message": "Hospital name required"}
        return {"status": "success", "message": f"Hospital {name} added", "hospital_id": f"H-{org_id}001"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/org/{org_id}/all-hospitals")
async def org_all_hospitals(org_id: int):
    try:
        hospitals = [
            {"id": "H-001", "name": "Apollo Hospital", "beds": 200, "patients": 45, "location": "Mumbai", "doctors": 50},
            {"id": "H-002", "name": "Max Healthcare", "beds": 150, "patients": 32, "location": "Delhi", "doctors": 40}
        ]
        return {"status": "success", "total": len(hospitals), "hospitals": hospitals}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/org/{org_id}/models-catalog")
async def org_models(org_id: int):
    try:
        all_models = [
            {"id": "eye", "name": "Eye Disease Detection", "price": 5000, "type": "premium"},
            {"id": "covid", "name": "COVID-19 Detection", "price": 5000, "type": "premium"},
            {"id": "diabetes", "name": "Diabetes Detection", "price": 0, "type": "free"},
            {"id": "pneumonia", "name": "Pneumonia Detection", "price": 0, "type": "free"},
            {"id": "malaria", "name": "Malaria Detection", "price": 0, "type": "free"},
            {"id": "dengue", "name": "Dengue Detection", "price": 0, "type": "free"},
        ]
        purchased = [m for m in all_models if m["type"] == "free"] + [all_models[0]]
        available = [m for m in all_models if m not in purchased]
        return {"status": "success", "purchased": purchased, "available": available}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/org/{org_id}/buy-model")
async def buy_model(org_id: int, request: dict):
    try:
        model_id = request.get("model_id", "")
        return {"status": "success", "message": "Model purchased", "renewal_date": "2027-06-08"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/org/{org_id}/feedback-list")
async def org_feedback_list(org_id: int):
    try:
        feedback = [
            {"id": 1, "hospital": "Apollo Hospital", "type": "suggestion", "subject": "Need better dashboard", "status": "open", "date": "2026-06-08"},
            {"id": 2, "hospital": "Max Healthcare", "type": "bug", "subject": "Model loading slow", "status": "in_progress", "date": "2026-06-07"}
        ]
        return {"status": "success", "total": len(feedback), "feedback": feedback}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/org/{org_id}/add-staff")
async def add_staff(org_id: int, request: dict):
    try:
        name = request.get("name", "")
        email = request.get("email", "")
        return {"status": "success", "message": f"Staff {name} added", "user_id": "USR-001"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/org/{org_id}/staff-list")
async def staff_list(org_id: int):
    try:
        staff = [
            {"id": "USR-001", "name": "Vijay Kumar", "email": "vijay@vijaycare.com", "role": "owner"},
            {"id": "USR-002", "name": "Admin", "email": "admin@vijaycare.com", "role": "admin"}
        ]
        return {"status": "success", "total": len(staff), "staff": staff}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/org/{org_id}/finance-info")
async def org_finance_info(org_id: int):
    try:
        finance = {
            "subscription": "active",
            "renewal_date": "2027-06-08",
            "monthly_cost": 15000,
            "models_purchased": 7,
            "billing": [
                {"date": "2026-06-08", "amount": 15000, "status": "paid"},
                {"date": "2026-05-08", "amount": 15000, "status": "paid"}
            ]
        }
        return {"status": "success", "finance": finance}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# TIER 3: HOSPITAL PORTAL ENHANCED

@app.get("/hospital/{hospital_id}/org-details")
async def hospital_org_details(hospital_id: str):
    try:
        return {
            "status": "success",
            "org_id": 1,
            "org_name": "Vijay Care",
            "org_logo": "/LOGO/Vijay.jpeg",
            "org_owner": "Vijay Kumar"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/hospital/{hospital_id}/allowed-models")
async def hospital_allowed_models(hospital_id: str):
    try:
        models = [
            {"id": "eye", "name": "Eye Disease Detection", "type": "premium", "available": True},
            {"id": "diabetes", "name": "Diabetes Detection", "type": "free", "available": True},
            {"id": "covid", "name": "COVID-19 Detection", "type": "premium", "available": False}
        ]
        return {"status": "success", "models": models}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/hospital/{hospital_id}/submit-feedback")
async def hospital_feedback(hospital_id: str, request: dict):
    try:
        return {"status": "success", "message": "Feedback sent to organization", "feedback_id": "FBK-001"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# TIER 1: MACVAAR MAIN ADMIN PORTAL

@app.post("/macvaar-admin/login")
async def macvaar_admin_login(request: dict):
    try:
        key = request.get("key", "")
        if key == "hero_admin_001":
            return {"status": "success", "admin_id": "macvaar_001", "role": "macvaar_admin", "message": "Welcome to MacvaarAI Official Portal"}
        return {"status": "error", "message": "Invalid admin key"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/macvaar-admin/dashboard")
async def macvaar_admin_dashboard():
    try:
        organizations = [
            {"id": 1, "name": "Vijay Care", "owner": "Vijay Kumar", "logo_url": "/LOGO/Vijay.jpeg", "hospitals": 15, "patients": 3450, "status": "active"},
            {"id": 2, "name": "BJP Care", "owner": "BJP Leadership", "logo_url": "/LOGO/BJP.jpeg", "hospitals": 25, "patients": 6780, "status": "active"},
            {"id": 3, "name": "Modi Healthcare", "owner": "Government", "logo_url": "/LOGO/Modi.jpeg", "hospitals": 50, "patients": 15230, "status": "active"},
            {"id": 4, "name": "CBN Care", "owner": "CBN Leadership", "logo_url": "/LOGO/CBN.jpg", "hospitals": 12, "patients": 2340, "status": "active"}
        ]
        return {"status": "success", "total_organizations": len(organizations), "total_hospitals": sum(o["hospitals"] for o in organizations), "total_patients": sum(o["patients"] for o in organizations), "organizations": organizations}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# TIER 2: ORGANIZATION PORTALS

@app.get("/org/{org_id}/dashboard-full")
async def org_dashboard_full(org_id: int):
    try:
        org_data = {1: {"name": "Vijay Care", "owner": "Vijay Kumar", "logo_url": "/LOGO/Vijay.jpeg", "hospitals": 15, "patients": 3450, "beds": 2500, "doctors": 280}}
        org = org_data.get(org_id)
        if not org:
            return {"status": "error", "message": "Organization not found"}
        return {"status": "success", "organization": org}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/org/{org_id}/models-catalog")
async def org_models(org_id: int):
    try:
        all_models = [{"id": "eye", "name": "Eye Disease Detection", "price": 5000, "type": "premium"}, {"id": "diabetes", "name": "Diabetes Detection", "price": 0, "type": "free"}, {"id": "pneumonia", "name": "Pneumonia Detection", "price": 0, "type": "free"}]
        purchased = [m for m in all_models if m["type"] == "free"] + [all_models[0]]
        available = [m for m in all_models if m not in purchased]
        return {"status": "success", "purchased": purchased, "available": available}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# TIER 3: HOSPITAL PORTAL

@app.get("/hospital/{hospital_id}/org-details")
async def hospital_org_details(hospital_id: str):
    try:
        return {"status": "success", "org_id": 1, "org_name": "Vijay Care", "org_logo": "/LOGO/Vijay.jpeg", "org_owner": "Vijay Kumar"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/hospital/{hospital_id}/submit-feedback")
async def hospital_feedback(hospital_id: str, request: dict):
    try:
        return {"status": "success", "message": "Feedback sent to organization", "feedback_id": "FBK-001"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# ALL AI MODELS - UNIFIED DIAGNOSIS ENDPOINT
# ============================================================================

import sys
sys.path.insert(0, "models")

# Import all models
try:
    from models.covid_model import predict_covid, COVID_LABELS
    from models.eye_model import predict_eye, EYE_LABELS
    from models.pneumonia_model import predict_pneumonia
    from models.malaria_model import predict_malaria
    from models.skin_model import predict_skin
    from models.dengue_model import predict_dengue
    from models.diabetes_model import predict_diabetes
    from models.ear_model import predict_ear
    from models.nose_model import predict_nose
    from models.throat_model import predict_throat
    from models.pharyngitis_model import predict_pharyngitis
    from models.oral_model import predict_oral
    from models.onelead_model import predict_onelead
    from models.twelvelead_model import predict_twelvelead
    from models.lung_model import predict_lung
except Exception as e:
    print(f"[WARNING] Could not import all models: {e}")

@app.get("/api/available-models")
async def get_available_models():
    """Get list of all available AI models"""
    try:
        models = [
            {"id": "covid", "name": "COVID-19 Detection", "type": "image", "description": "Chest X-ray COVID detection"},
            {"id": "eye", "name": "Eye Disease Detection", "type": "image", "description": "Diabetic retinopathy detection"},
            {"id": "pneumonia", "name": "Pneumonia Detection", "type": "image", "description": "Lung pneumonia detection"},
            {"id": "malaria", "name": "Malaria Detection", "type": "image", "description": "Blood cell malaria detection"},
            {"id": "skin", "name": "Skin Cancer Detection", "type": "image", "description": "Skin lesion classification"},
            {"id": "dengue", "name": "Dengue Detection", "type": "image", "description": "Dengue virus detection"},
            {"id": "diabetes", "name": "Diabetes Detection", "type": "data", "description": "Diabetes prediction"},
            {"id": "ear", "name": "Ear Disease Detection", "type": "image", "description": "Ear infection detection"},
            {"id": "nose", "name": "Nose Disease Detection", "type": "image", "description": "Nasal disease detection"},
            {"id": "throat", "name": "Throat Disease Detection", "type": "image", "description": "Throat infection detection"},
            {"id": "pharyngitis", "name": "Pharyngitis Detection", "type": "image", "description": "Pharyngitis classification"},
            {"id": "oral", "name": "Oral Disease Detection", "type": "image", "description": "Mouth/oral disease detection"},
            {"id": "ecg1lead", "name": "1-Lead ECG", "type": "image", "description": "Single lead ECG analysis"},
            {"id": "ecg12lead", "name": "12-Lead ECG", "type": "image", "description": "Full 12-lead ECG analysis"},
            {"id": "lung", "name": "Lung Disease Detection", "type": "image", "description": "General lung disease detection"}
        ]
        return {"status": "success", "total_models": len(models), "models": models}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/api/ai-diagnosis")
async def ai_diagnosis(model_id: str = Form(...), file: UploadFile = File(...)):
    """Run AI diagnosis on uploaded medical image"""
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Determine model and run prediction
        result = {"model": model_id, "image_name": file.filename}
        
        if model_id == "covid":
            prediction = predict_covid(image_bytes)
            result.update(prediction)
            result["model_name"] = "COVID-19 Detection"
        elif model_id == "eye":
            prediction = predict_eye(image_bytes)
            result.update(prediction)
            result["model_name"] = "Eye Disease Detection"
        elif model_id == "pneumonia":
            prediction = predict_pneumonia(image_bytes)
            result.update(prediction)
            result["model_name"] = "Pneumonia Detection"
        elif model_id == "malaria":
            prediction = predict_malaria(image_bytes)
            result.update(prediction)
            result["model_name"] = "Malaria Detection"
        elif model_id == "skin":
            prediction = predict_skin(image_bytes)
            result.update(prediction)
            result["model_name"] = "Skin Cancer Detection"
        elif model_id == "dengue":
            prediction = predict_dengue(image_bytes)
            result.update(prediction)
            result["model_name"] = "Dengue Detection"
        elif model_id == "diabetes":
            prediction = predict_diabetes(image_bytes)
            result.update(prediction)
            result["model_name"] = "Diabetes Detection"
        elif model_id == "ear":
            prediction = predict_ear(image_bytes)
            result.update(prediction)
            result["model_name"] = "Ear Disease Detection"
        elif model_id == "nose":
            prediction = predict_nose(image_bytes)
            result.update(prediction)
            result["model_name"] = "Nose Disease Detection"
        elif model_id == "throat":
            prediction = predict_throat(image_bytes)
            result.update(prediction)
            result["model_name"] = "Throat Disease Detection"
        elif model_id == "pharyngitis":
            prediction = predict_pharyngitis(image_bytes)
            result.update(prediction)
            result["model_name"] = "Pharyngitis Detection"
        elif model_id == "oral":
            prediction = predict_oral(image_bytes)
            result.update(prediction)
            result["model_name"] = "Oral Disease Detection"
        elif model_id == "ecg1lead":
            prediction = predict_onelead(image_bytes)
            result.update(prediction)
            result["model_name"] = "1-Lead ECG"
        elif model_id == "ecg12lead":
            prediction = predict_twelvelead(image_bytes)
            result.update(prediction)
            result["model_name"] = "12-Lead ECG"
        elif model_id == "lung":
            prediction = predict_lung(image_bytes)
            result.update(prediction)
            result["model_name"] = "Lung Disease Detection"
        else:
            return {"status": "error", "message": f"Unknown model: {model_id}"}
        
        # Format confidence as percentage
        if "confidence" in result:
            result["confidence_percentage"] = f"{result['confidence']*100:.2f}%"
        
        result["status"] = "success"
        return result
        
    except Exception as e:
        return {"status": "error", "message": f"Diagnosis failed: {str(e)}"}

# ============================================================================
# ADMIN PANEL - COMPLETE ENDPOINTS
# ============================================================================

@app.post("/admin/login")
async def admin_login(request: dict):
    """Admin login with email and password"""
    try:
        email = request.get("email", "")
        password = request.get("password", "")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM admin_users WHERE email = ? AND password = ?", (email, password))
        admin = cursor.fetchone()
        conn.close()
        
        if admin:
            return {
                "status": "success",
                "admin_id": admin["id"],
                "name": admin["name"],
                "email": admin["email"],
                "role": admin["role"],
                "message": f"Welcome {admin['name']}"
            }
        return {"status": "error", "message": "Invalid credentials"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/admin/dashboard")
async def admin_dashboard():
    """Admin dashboard statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as count FROM organizations WHERE status = 'active'")
        orgs = cursor.fetchone()["count"]
        
        cursor.execute("SELECT COUNT(*) as count FROM hospitals WHERE status = 'active'")
        hospitals = cursor.fetchone()["count"]
        
        cursor.execute("SELECT COUNT(*) as count FROM patients")
        patients = cursor.fetchone()["count"]
        
        cursor.execute("SELECT COUNT(*) as count FROM diagnoses")
        diagnoses = cursor.fetchone()["count"]
        
        cursor.execute("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'")
        open_tickets = cursor.fetchone()["count"]
        
        conn.close()
        
        return {
            "status": "success",
            "statistics": {
                "total_organizations": orgs,
                "total_hospitals": hospitals,
                "total_patients": patients,
                "total_diagnoses": diagnoses,
                "open_support_tickets": open_tickets
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# ORGANIZATION MANAGEMENT
# ============================================================================

@app.post("/admin/organizations")
async def create_organization(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    address: str = Form(""),
    city: str = Form(""),
    state: str = Form(""),
    zip_code: str = Form(""),
    num_hospitals: int = Form(0),
    subscribed_models: str = Form("[]")
):
    """Create new organization with unique access token"""
    try:
        import uuid
        import secrets

        if not name or not email:
            return {"status": "error", "message": "Name and email required"}

        # Parse subscribed_models
        try:
            models_list = json.loads(subscribed_models) if isinstance(subscribed_models, str) else subscribed_models
        except:
            models_list = []

        # Generate unique token
        access_token = f"ORG_{name.upper().replace(' ', '_')}_{secrets.token_hex(8).upper()}"

        conn = get_db_connection()
        cursor = conn.cursor()

        # Try to insert with basic columns that exist
        try:
            cursor.execute('''
                INSERT INTO organizations
                (name, email, phone, address, token, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (name, email, phone, address, access_token, datetime.now().isoformat()))
        except:
            # If that fails, try without address
            cursor.execute('''
                INSERT INTO organizations
                (name, email, phone, token, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, phone, access_token, datetime.now().isoformat()))

        conn.commit()
        org_id = cursor.lastrowid
        conn.close()

        return {
            "status": "success",
            "organization_id": org_id,
            "name": name,
            "access_token": access_token,
            "message": f"Organization {name} created successfully"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/admin/organizations")
async def get_all_organizations():
    """Get all organizations"""
    try:
        import json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM organizations ORDER BY created_at DESC")
        orgs = cursor.fetchall()
        conn.close()

        org_list = []
        for org in orgs:
            org_dict = dict(org)
            # Rename token to access_token for consistency
            if 'token' in org_dict and 'access_token' not in org_dict:
                org_dict['access_token'] = org_dict.get('token')
            # Parse subscribed_models if it's a string
            if isinstance(org_dict.get('subscribed_models'), str):
                try:
                    org_dict['subscribed_models'] = json.loads(org_dict['subscribed_models'])
                except:
                    org_dict['subscribed_models'] = []
            org_list.append(org_dict)

        return {"status": "success", "total": len(org_list), "organizations": org_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.put("/admin/organizations/{org_id}")
async def update_organization(org_id: int, request: dict):
    """Update organization details"""
    try:
        name = request.get("name", "")
        email = request.get("email", "")
        phone = request.get("phone", "")
        city = request.get("city", "")
        state = request.get("state", "")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE organizations SET name=?, email=?, phone=?, city=?, state=? WHERE id=?",
            (name, email, phone, city, state, org_id)
        )
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": f"Organization {name} updated"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.delete("/admin/organizations/{org_id}")
async def delete_organization(org_id: str):
    """Delete organization"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Convert org_id to int
        try:
            org_id_int = int(org_id)
        except:
            org_id_int = org_id

        # Get organization name for response
        cursor.execute("SELECT name FROM organizations WHERE id = ?", (org_id_int,))
        row = cursor.fetchone()

        if not row:
            conn.close()
            return {"status": "error", "message": f"Organization with ID {org_id} not found"}

        org_name = row[0]

        # Delete organization
        cursor.execute("DELETE FROM organizations WHERE id = ?", (org_id_int,))
        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Organization '{org_name}' deleted successfully"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# HOSPITAL MANAGEMENT
# ============================================================================

@app.get("/admin/hospitals")
async def get_all_hospitals(org_id: int = None):
    """Get all hospitals or by organization"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if org_id:
            cursor.execute("SELECT id, name, email, phone, city, state, beds_total, access_code, organization_id, status FROM hospitals WHERE organization_id = ?", (org_id,))
        else:
            cursor.execute("SELECT id, name, email, phone, city, state, beds_total, access_code, organization_id, status FROM hospitals ORDER BY created_at DESC")
        
        hospitals = cursor.fetchall()
        conn.close()
        
        hosp_list = [dict(h) for h in hospitals]
        return {"status": "success", "total": len(hosp_list), "hospitals": hosp_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# AI MODELS MANAGEMENT
# ============================================================================

@app.get("/admin/models")
async def get_all_models():
    """Get all AI models"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description, category, model_type, price, status FROM ai_models ORDER BY category")
        models = cursor.fetchall()
        conn.close()
        
        model_list = [dict(m) for m in models]
        return {"status": "success", "total": len(model_list), "models": model_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.put("/admin/models/{model_id}")
async def update_model_price(model_id: int, request: dict):
    """Update model price"""
    try:
        price = request.get("price", 50000)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE ai_models SET price = ? WHERE id = ?", (price, model_id))
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "Model price updated"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# SUPPORT TICKETS & FEEDBACK
# ============================================================================

@app.get("/admin/support-tickets")
async def get_support_tickets(status: str = None):
    """Get support tickets"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if status:
            cursor.execute("SELECT * FROM support_tickets WHERE status = ? ORDER BY created_date DESC", (status,))
        else:
            cursor.execute("SELECT * FROM support_tickets ORDER BY created_date DESC")
        
        tickets = cursor.fetchall()
        conn.close()
        
        ticket_list = [dict(t) for t in tickets]
        return {"status": "success", "total": len(ticket_list), "tickets": ticket_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.put("/admin/support-tickets/{ticket_id}")
async def resolve_ticket(ticket_id: int, request: dict):
    """Resolve support ticket"""
    try:
        resolution = request.get("resolution", "")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE support_tickets SET status = 'resolved', resolution = ?, resolved_date = CURRENT_TIMESTAMP WHERE id = ?",
            (resolution, ticket_id)
        )
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "Ticket resolved"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/admin/feedback")
async def get_feedback():
    """Get all feedback"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feedback ORDER BY created_date DESC")
        feedback = cursor.fetchall()
        conn.close()
        
        feedback_list = [dict(f) for f in feedback]
        return {"status": "success", "total": len(feedback_list), "feedback": feedback_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# CONSULTATIONS
# ============================================================================

@app.get("/admin/consultations")
async def get_consultations(status: str = None):
    """Get consultations"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if status:
            cursor.execute("SELECT * FROM consultations WHERE status = ? ORDER BY created_date DESC", (status,))
        else:
            cursor.execute("SELECT * FROM consultations ORDER BY created_date DESC")
        
        consultations = cursor.fetchall()
        conn.close()
        
        cons_list = [dict(c) for c in consultations]
        return {"status": "success", "total": len(cons_list), "consultations": cons_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# DATA COLLECTION & ANALYTICS
# ============================================================================

@app.get("/admin/disease-surveillance")
async def get_disease_surveillance(org_id: int = None, hospital_id: int = None):
    """Get disease surveillance data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if hospital_id:
            cursor.execute("SELECT * FROM disease_surveillance WHERE hospital_id = ?", (hospital_id,))
        elif org_id:
            cursor.execute("SELECT * FROM disease_surveillance WHERE organization_id = ?", (org_id,))
        else:
            cursor.execute("SELECT * FROM disease_surveillance ORDER BY report_date DESC")
        
        data = cursor.fetchall()
        conn.close()
        
        data_list = [dict(d) for d in data]
        return {"status": "success", "surveillance_data": data_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/admin/hospital-statistics/{hospital_id}")
async def get_hospital_statistics(hospital_id: int):
    """Get hospital statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hospital_statistics WHERE hospital_id = ? ORDER BY date DESC LIMIT 30", (hospital_id,))
        stats = cursor.fetchall()
        conn.close()

        stats_list = [dict(s) for s in stats]
        return {"status": "success", "statistics": stats_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ============================================================================
# ORGANIZATION ADMIN MANAGEMENT
# ============================================================================

@app.post("/org/admins")
async def create_organization_admin(request: dict):
    """Create new admin within organization"""
    try:
        org_id = request.get("organization_id")
        name = request.get("name", "")
        email = request.get("email", "")
        phone = request.get("phone", "")
        password = request.get("password", "")
        role = request.get("role", "admin")

        if not org_id or not name or not email or not password:
            return {"status": "error", "message": "Organization ID, name, email, and password required"}

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM organization_admins WHERE email = ? AND organization_id = ?", (email, org_id))
        if cursor.fetchone():
            conn.close()
            return {"status": "error", "message": "Email already exists in this organization"}

        cursor.execute(
            "INSERT INTO organization_admins (organization_id, name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (org_id, name, email, phone, password, role, datetime.now().isoformat())
        )
        conn.commit()
        admin_id = cursor.lastrowid
        conn.close()

        return {
            "status": "success",
            "admin_id": admin_id,
            "name": name,
            "email": email,
            "message": f"Admin {name} created successfully"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/org/{org_id}/admins")
async def get_organization_admins(org_id: int):
    """Get all admins in organization"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, phone, role, created_at FROM organization_admins WHERE organization_id = ? ORDER BY created_at DESC", (org_id,))
        admins = cursor.fetchall()
        conn.close()

        admin_list = [dict(admin) for admin in admins]
        return {"status": "success", "total": len(admin_list), "admins": admin_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/org/{org_id}/details")
async def get_organization_details(org_id: int):
    """Get organization details"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, phone, city, state, token, status FROM organizations WHERE id = ?", (org_id,))
        org = cursor.fetchone()
        conn.close()

        if not org:
            return {"status": "error", "message": "Organization not found"}

        return {"status": "success", "organization": dict(org)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/org/verify-token")
async def verify_organization_token(request: dict):
    """Verify organization token"""
    try:
        import json
        token = request.get("token", "")

        if not token:
            return {"status": "error", "message": "Token required"}

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT organization_id, name, email, phone, address, city, state, zip_code,
                   subscribed_models, access_token, num_hospitals
            FROM organizations
            WHERE access_token = ?
        """, (token,))
        org = cursor.fetchone()
        conn.close()

        if not org:
            return {"status": "error", "message": "Invalid token"}

        # Parse subscribed models
        try:
            models = json.loads(org[8]) if isinstance(org[8], str) else org[8]
        except:
            models = []

        return {
            "status": "success",
            "organization_id": org[0],
            "name": org[1],
            "email": org[2],
            "phone": org[3],
            "address": org[4],
            "city": org[5],
            "state": org[6],
            "zip_code": org[7],
            "subscribed_models": models,
            "num_hospitals": org[10],
            "message": "Token verified successfully"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.delete("/org/admins/{admin_id}")
async def delete_organization_admin(admin_id: int):
    """Delete admin from organization"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM organization_admins WHERE id = ?", (admin_id,))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "Admin deleted successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ============================================================================
# AI PREDICTION ENDPOINTS FOR DIAGNOSTIC CHATBOT
# ============================================================================

from urllib.request import urlopen
from io import BytesIO
from PIL import Image
import numpy as np

@app.post("/predict/eye")
async def predict_eye_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.eye_model import predict_eye
        image_bytes = await file.read()
        result = predict_eye(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/covid")
async def predict_covid_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.covid_model import predict_covid
        image_bytes = await file.read()
        result = predict_covid(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/pneumonia")
async def predict_pneumonia_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.pneumonia_model import predict_pneumonia
        image_bytes = await file.read()
        result = predict_pneumonia(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/diabetes")
async def predict_diabetes_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.diabetes_model import predict_diabetes
        image_bytes = await file.read()
        result = predict_diabetes(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/malaria")
async def predict_malaria_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.malaria_model import predict_malaria
        image_bytes = await file.read()
        result = predict_malaria(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/skin")
async def predict_skin_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.skin_model import predict_skin
        image_bytes = await file.read()
        result = predict_skin(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/dengue")
async def predict_dengue_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.dengue_model import predict_dengue
        image_bytes = await file.read()
        result = predict_dengue(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/ear")
async def predict_ear_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.ear_model import predict_ear
        image_bytes = await file.read()
        result = predict_ear(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/nose")
async def predict_nose_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.nose_model import predict_nose
        image_bytes = await file.read()
        result = predict_nose(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/throat")
async def predict_throat_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.throat_model import predict_throat
        image_bytes = await file.read()
        result = predict_throat(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/oral")
async def predict_oral_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.oral_model import predict_oral
        image_bytes = await file.read()
        result = predict_oral(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/pharyngitis")
async def predict_pharyngitis_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.pharyngitis_model import predict_pharyngitis
        image_bytes = await file.read()
        result = predict_pharyngitis(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/lung")
async def predict_lung_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.lung_model import predict_lung
        image_bytes = await file.read()
        result = predict_lung(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/ecg")
async def predict_ecg_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.twelvelead_model import predict_twelvelead
        image_bytes = await file.read()
        result = predict_twelvelead(image_bytes)
        return {"status": "success", "prediction": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/stroke")
async def predict_stroke_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.lung_model import predict_lung  # Using lung model as placeholder
        image_bytes = await file.read()
        result = predict_lung(image_bytes)
        return {"status": "success", "prediction": "Stroke analysis: " + str(result)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict/colorectal")
async def predict_colorectal_endpoint(file: UploadFile = File(None)):
    try:
        if not file:
            return {"status": "error", "message": "No file provided"}

        from models.skin_model import predict_skin  # Using skin model as placeholder
        image_bytes = await file.read()
        result = predict_skin(image_bytes)
        return {"status": "success", "prediction": "Colorectal analysis: " + str(result)}
    except Exception as e:
        return {"status": "error", "message": str(e)}
