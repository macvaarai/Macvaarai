from fastapi import FastAPI, HTTPException, Header, Query, Request, status, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from enum import Enum
from fastapi.staticfiles import StaticFiles
import base64
import os
import uuid
import boto3
import json
import psycopg2
import logging
from fastapi.openapi.utils import get_openapi
from starlette.middleware.base import BaseHTTPMiddleware
import time
#register_profile_apis


# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class AidevResultsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Apply middleware only for this route
        if path == "/api/v1/aidev/results":
            start_time = time.time()
            method = request.method
            client_ip = request.client.host

            logging.info(f"[Middleware] {method} call to {path} from {client_ip}")

            response = await call_next(request)

            duration = round(time.time() - start_time, 3)
            logging.info(f"[Middleware] {path} processed in {duration} seconds")
            response.headers["X-Process-Time"] = str(duration)
            return response

        return await call_next(request)
    
app = FastAPI()

app.add_middleware(AidevResultsMiddleware)

app.mount("/files", StaticFiles(directory="E:/medwan/medwand-api/mnt/data/uploads"), name="files")

REGION = "us-east-2"
SECRET_NAME = "bhai/dev/credentials"

class CallbackTypeEnum(str, Enum):
    none = "None"
    full = "Full"
    html = "Html"

class AuthTypeEnum(str, Enum):
    none = "None"
    keysecret = "KeySecret"
    bearer = "Bearer"
    apitoken = "ApiToken"
    custom = "Custom"

class Reading(BaseModel):
    SortOrder: int
    DeviceName: str
    DeviceModel: str
    DeviceSerial: str
    DeviceFirmware: str
    Sensor: str
    SensorId: str
    SensorMode: str
    SensorSettings: str
    SensorData: str

class ReportData(BaseModel):
    AppointmentId: str = Field(..., alias="appointmentId")
    DoctorName: Optional[str] = Field(None, alias="doctorName")
    PatientName: Optional[str] = Field(None, alias="patientName")
    ExamType: Optional[str] = Field(None, alias="examType")
    DoctorEnterDateUtc: Optional[str] = Field(None, alias="doctorEnterDateUtc")
    PatientEnterDateUtc: Optional[str] = Field(None, alias="patientEnterDateUtc")
    StartDateUtc: Optional[str] = Field(None, alias="startDateUtc")
    EndDateUtc: Optional[str] = Field(None, alias="endDateUtc")
    DurationInMinutes: Optional[str] = Field(None, alias="durationInMinutes")
    PractitionerNotes: Optional[str] = Field(None, alias="practitionerNotes")
    PatientNotes: Optional[str] = Field(None, alias="patientNotes")
    HtmlDocument: Optional[str] = Field(None, alias="htmlDocument")
    Readings: Optional[List[Reading]] = Field(default_factory=list)

    class Config:
        allow_population_by_field_name = True
        allow_population_by_alias = True
        alias_generator = lambda s: s[0].lower() + s[1:] if s else s
        json_schema_extra = {
            "example": {
                "AppointmentId": "appt001",
                "DoctorName": "Dr. Smith",
                "PatientName": "John Doe",
                "ExamType": "OnSite",
                "DoctorEnterDateUtc": "2025-06-07T08:47:20.1234567",
                "PatientEnterDateUtc": "2025-06-07T08:48:55.4777289",
                "StartDateUtc": "2025-06-07T08:48:55.4777361",
                "EndDateUtc": "2025-06-07T08:49:49.9143278",
                "DurationInMinutes": "1",
                "PractitionerNotes": "No major concerns",
                "PatientNotes": "Feeling good",
                "HtmlDocument": "<div><h3>Vitals Report</h3><p>BP: 120/80</p><p>Pulse: 72</p></div>",
                "Readings": [
                    {
                        "SortOrder": 1,
                        "DeviceName": "MedWand Device",
                        "DeviceModel": "Generation2",
                        "DeviceSerial": "(01)00860004311607(11)210326(21)00000089",
                        "DeviceFirmware": "2.1.0.2",
                        "Sensor": "PulseRate",
                        "SensorId": "11)21032600000089",
                        "SensorMode": "Default",
                        "SensorSettings": "",
                        "SensorData": "86"
                    },
                    {
                        "SortOrder": 2,
                        "DeviceName": "MedWand Device",
                        "DeviceModel": "Generation2",
                        "DeviceSerial": "(01)00860004311607(11)210326(21)00000089",
                        "DeviceFirmware": "2.1.0.2",
                        "Sensor": "SpO2",
                        "SensorId": "11)21032600000089",
                        "SensorMode": "Default",
                        "SensorSettings": "",
                        "SensorData": "100"
                    },
                    {
                        "SortOrder": 3,
                        "DeviceName": "MedWand Device",
                        "DeviceModel": "Generation2",
                        "DeviceSerial": "(01)00860004311607(11)210326(21)00000089",
                        "DeviceFirmware": "2.1.0.2",
                        "Sensor": "Temperature",
                        "SensorId": "11)21032600000089",
                        "SensorMode": "Default",
                        "SensorSettings": "",
                        "SensorData": "98.6"
                    }
                ]
            }
        }

async def get_auth_headers(
    auth_type: AuthTypeEnum = Query(AuthTypeEnum.none),
    key: Optional[str] = Header(None),
    secret: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    apitoken: Optional[str] = Header(None),
    custom_token: Optional[str] = Header(None),
) -> None:
    if auth_type == AuthTypeEnum.bearer and (not authorization or not authorization.startswith("Bearer ")):
        raise HTTPException(status_code=401, detail="Invalid Bearer token")
    if auth_type == AuthTypeEnum.keysecret and (not key or not secret):
        raise HTTPException(status_code=401, detail="Missing key/secret")
    if auth_type == AuthTypeEnum.apitoken and not apitoken:
        raise HTTPException(status_code=401, detail="Missing API token")
    if auth_type == AuthTypeEnum.custom and not custom_token:
        raise HTTPException(status_code=401, detail="Missing custom token")

def get_secret():
    client = boto3.client("secretsmanager", region_name=REGION)
    secret = client.get_secret_value(SecretId=SECRET_NAME)
    return json.loads(secret["SecretString"])

def get_db_connection():
    secret = get_secret()
    return psycopg2.connect(
        host=secret["host"],
        port=5432,
        database=secret["dbname"],
        user=secret["username"],
        password=secret["password"]
    )

@app.post("/api/v1/aidev/results", tags=["MedWand Callback"])
async def receive_medwand_report(
    payload: ReportData,
    callback_type: CallbackTypeEnum = Query(CallbackTypeEnum.full),
    auth_type: AuthTypeEnum = Query(AuthTypeEnum.none),
    headers: None = Depends(get_auth_headers)
):
    logging.info("Received payload: %s", payload.dict(by_alias=True))

    if callback_type == CallbackTypeEnum.html and not payload.HtmlDocument:
        raise HTTPException(status_code=400, detail="HtmlDocument required when CallbackType is Html")

    UPLOAD_DIR = "/mnt/data/uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    for reading in payload.Readings:
        sensor_data = reading.SensorData
        sensor_type = reading.Sensor
        appointment_id = payload.AppointmentId

        if not sensor_data:
            continue

        logging.info(f"Reading: Sensor={sensor_type}, DataLength={len(sensor_data)}")

        try:
            if sensor_data.startswith("data:"):
                sensor_data = sensor_data.split(",")[-1]

            missing_padding = len(sensor_data) % 4
            if missing_padding:
                sensor_data += '=' * (4 - missing_padding)

            decoded_data = base64.b64decode(sensor_data, validate=True)

            if decoded_data.startswith(b'\x89PNG'):
                file_ext = "png"
                tag = "image"
            elif decoded_data.startswith(b'RIFF') and b'WAVE' in decoded_data[8:16]:
                file_ext = "wav"
                tag = "audio"
            elif decoded_data.startswith(b'ID3') or decoded_data[:2] == b'\xff\xfb':
                file_ext = "mp3"
                tag = "audio"
            else:
                file_ext = None
                tag = "unknown"

            if file_ext:
                unique_id = uuid.uuid4().hex[:8]
                filename = f"{sensor_type}{appointment_id}{unique_id}.{file_ext}"
                filepath = os.path.join(UPLOAD_DIR, filename)
                with open(filepath, "wb") as f:
                    f.write(decoded_data)

                public_url = f"https://macvaarai.com/files/{filename}"
                reading.SensorMode = tag
                reading.SensorSettings = public_url

                logging.info(f"Decoded {sensor_type}, saved as {filename}")

        except Exception as e:
            logging.warning(f"SensorData decode failed for {reading.Sensor}: {e}")

    for reading in payload.Readings:
        reading.SensorData = None
    logging.info("Saving this final payload to DB: %s", payload.dict(by_alias=True))

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO medwand_reports (
                "appointmentId", "doctorName", "patientName", "examType", "reportJson"
            ) VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT ("appointmentId") DO UPDATE SET "reportJson" = EXCLUDED."reportJson"
            ''',
            (
                payload.AppointmentId,
                payload.DoctorName,
                payload.PatientName,
                payload.ExamType,
                json.dumps({"data": payload.dict(by_alias=True)})
            )
        )
        cursor.execute('SELECT id FROM user_profiles WHERE appointment_id = %s', (payload.AppointmentId,))
        exists = cursor.fetchone()

        if not exists:
            cursor.execute(
                '''
                INSERT INTO user_profiles (name, aadhar, appointment_id, password, gender, age, contact)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ''',
                (
                    payload.PatientName, None, payload.AppointmentId, None, None, None, None
                )
            )
        conn.commit()
        conn.close()

        msg = "HTML report received" if callback_type == CallbackTypeEnum.html else "Full report saved"
        logging.info("Database insert/update successful: %s", msg)
        return JSONResponse(status_code=200, content={"status": "success", "message": msg})

    except Exception as e:
        logging.error("Database operation failed: %s", str(e))
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/v1/reports/{appointment_id}", tags=["Report Retrieval"])
async def get_report_by_id(appointment_id: str):
    logging.info("Fetching report for: %s", appointment_id)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT "reportJson" FROM medwand_reports WHERE "appointmentId" = %s', (appointment_id,))
        result = cursor.fetchone()
        conn.close()

        if not result:
            raise HTTPException(status_code=404, detail="Report not found")

        return JSONResponse(content=result[0])
    except Exception as e:
        logging.error("Failed to fetch report: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/", tags=["System Info"])
async def root():
    return {"status": "ok", "message": "API is running"}

@app.get("/api/v1/aidev/results", tags=["Docs Redirect"])
async def redirect_to_docs():
    return RedirectResponse(url="/docs")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logging.warning("Validation error: %s", exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Invalid input. Check payload format.",
            "errors": exc.errors(),
        },
    )

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="MedWand Callback API",
        version="1.0.0",
        description="API for MedWand callback integration",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

from .user_profile import router as profile_router
app.include_router(profile_router)

@app.get("/api/v1/appointments", tags=["Report Retrieval"])
async def get_all_appointments():
    logging.info("Fetching all appointments")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM public.medwand_reports ORDER BY "appointmentId" ASC')
        rows = cursor.fetchall()
        col_names = [desc[0] for desc in cursor.description]

        conn.close()

        data = []
        for row in rows:
            record = dict(zip(col_names, row))
            try:
                report = record["reportJson"]
                if isinstance(report, str):
                    report = json.loads(report)
                report = report.get("data", {})
                record.update(report)
                del record["reportJson"]
            except Exception as e:
                logging.warning(f"Failed to parse reportJson for appointmentId={record.get('appointmentId')}: {e}")
            data.append(record)
        return JSONResponse(content=data)

    except Exception as e:
        logging.error("Failed to fetch appointments: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/v1/appointments/ids", tags=["Report Retrieval"])
async def get_appointment_ids():
    logging.info("Fetching appointment IDs only")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT "appointmentId" FROM medwand_reports ORDER BY "appointmentId" ASC')
        rows = cursor.fetchall()
        conn.close()

        ids = [row[0] for row in rows if row[0]]
        return {"appointmentIds": ids}
    except Exception as e:
        logging.error("Failed to fetch appointment IDs: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
