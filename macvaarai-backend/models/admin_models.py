# Admin Models for Multi-Tenant System

from enum import Enum
from datetime import datetime
import uuid

class AdminRole(str, Enum):
    HERO_ADMIN = "hero_admin"  # Super admin - controls everything
    HOSPITAL_ADMIN = "hospital_admin"  # Hospital-level admin
    DOCTOR = "doctor"
    STAFF = "staff"


class Hospital:
    """Hospital entity for multi-tenant system"""
    def __init__(
        self,
        hospital_id: str,
        name: str,
        email: str,
        phone: str,
        address: str,
        city: str,
        state: str,
        zip_code: str,
        admin_name: str,
        admin_email: str,
        subscribed_models: list = None,  # Models they have access to
        is_active: bool = True,
        created_at: datetime = None,
        created_by: str = None  # Hero admin who created it
    ):
        self.hospital_id = hospital_id
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.admin_name = admin_name
        self.admin_email = admin_email
        self.subscribed_models = subscribed_models or []
        self.is_active = is_active
        self.created_at = created_at or datetime.now()
        self.created_by = created_by

    def to_dict(self):
        return {
            "hospital_id": self.hospital_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "admin_name": self.admin_name,
            "admin_email": self.admin_email,
            "subscribed_models": self.subscribed_models,
            "is_active": self.is_active,
            "created_at": str(self.created_at),
            "created_by": self.created_by
        }


class AdminUser:
    """Admin user for hero or hospital level"""
    def __init__(
        self,
        admin_id: str,
        name: str,
        email: str,
        password_hash: str,
        role: AdminRole,
        hospital_id: str = None,  # Only for hospital admins
        access_key: str = None,  # Unique access key for hospital admins
        granted_models: list = None,  # Models they have access to
        is_active: bool = True,
        created_at: datetime = None,
        granted_by: str = None  # Hero admin who granted access
    ):
        self.admin_id = admin_id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.hospital_id = hospital_id
        self.access_key = access_key or str(uuid.uuid4())[:12].upper()
        self.granted_models = granted_models or []
        self.is_active = is_active
        self.created_at = created_at or datetime.now()
        self.granted_by = granted_by

    def to_dict(self):
        return {
            "admin_id": self.admin_id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "hospital_id": self.hospital_id,
            "access_key": self.access_key,
            "granted_models": self.granted_models,
            "is_active": self.is_active,
            "created_at": str(self.created_at),
            "granted_by": self.granted_by
        }


class AccessLog:
    """Track admin access and actions"""
    def __init__(
        self,
        log_id: str,
        admin_id: str,
        action: str,
        resource_type: str,
        resource_id: str,
        hospital_id: str = None,
        details: dict = None,
        timestamp: datetime = None
    ):
        self.log_id = log_id
        self.admin_id = admin_id
        self.action = action  # "create", "update", "delete", "view"
        self.resource_type = resource_type  # "user", "appointment", "hospital"
        self.resource_id = resource_id
        self.hospital_id = hospital_id
        self.details = details or {}
        self.timestamp = timestamp or datetime.now()

    def to_dict(self):
        return {
            "log_id": self.log_id,
            "admin_id": self.admin_id,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "hospital_id": self.hospital_id,
            "details": self.details,
            "timestamp": str(self.timestamp)
        }


# Available AI Models (12 Total) - All Premium with AI Suffix
AVAILABLE_MODELS = [
    {"id": "eye", "name": "Eye Disease Detection AI", "premium": True},
    {"id": "covid", "name": "COVID-19 Detection AI", "premium": True},
    {"id": "ecg", "name": "ECG Analysis AI", "premium": True},
    {"id": "skin", "name": "Skin Cancer Detection AI", "premium": True},
    {"id": "breast", "name": "Breast Cancer Detection AI", "premium": True},
    {"id": "tb", "name": "Tuberculosis Detection AI", "premium": True},
    {"id": "diabetes", "name": "Diabetes Detection AI", "premium": True},
    {"id": "pneumonia", "name": "Pneumonia Detection AI", "premium": True},
    {"id": "malaria", "name": "Malaria Detection AI", "premium": True},
    {"id": "dengue", "name": "Dengue Detection AI", "premium": True},
    {"id": "stroke", "name": "Stroke Prediction AI", "premium": True},
    {"id": "kidney", "name": "Kidney Disease Detection AI", "premium": True},
]
