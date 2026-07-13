from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import os
from datetime import datetime, timedelta
import secrets
import bcrypt
import jwt
from supabase import create_client, Client

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter(prefix="/api/org-auth", tags=["organization-auth"])


# ===== Pydantic Models =====
class OrgCredentialsCreate(BaseModel):
    org_id: str
    org_type: str  # 'school', 'hospital', 'police', 'women_org', 'office', 'district'
    org_name: str
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class OrgLoginRequest(BaseModel):
    username: str
    password: str


class OrgLoginResponse(BaseModel):
    token: str
    org_id: str
    org_name: str
    org_type: str
    expires_in: int


class ChangePasswordRequest(BaseModel):
    username: str
    old_password: str
    new_password: str = Field(..., min_length=6)


# ===== Helper Functions =====
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def create_jwt_token(org_id: str, username: str, expires_in: int = 3600) -> str:
    """Create JWT token for org session"""
    payload = {
        'org_id': org_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(seconds=expires_in),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


# ===== Endpoints =====

@router.post("/register-credentials")
async def register_org_credentials(credentials: OrgCredentialsCreate):
    """
    Register organization credentials during org creation.
    Called by Vijay Admin when creating a new organization.
    """
    try:
        # Check if username already exists
        existing = supabase.table("organization_credentials").select("*").eq("username", credentials.username).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Hash password
        password_hash = hash_password(credentials.password)

        # Insert into Supabase
        data = {
            "org_id": credentials.org_id,
            "org_type": credentials.org_type,
            "org_name": credentials.org_name,
            "email": credentials.email,
            "username": credentials.username,
            "password_hash": password_hash,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        result = supabase.table("organization_credentials").insert(data).execute()

        return {
            "message": "Organization credentials registered successfully",
            "org_id": credentials.org_id,
            "username": credentials.username
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/login", response_model=OrgLoginResponse)
async def org_login(login_data: OrgLoginRequest):
    """
    Authenticate organization user with username/password.
    Returns JWT token for Care Portal access.
    """
    try:
        # Find org by username
        result = supabase.table("organization_credentials").select("*").eq("username", login_data.username).execute()

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )

        org_cred = result.data[0]

        # Verify password
        if not verify_password(login_data.password, org_cred['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )

        if not org_cred['is_active']:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organization account is inactive"
            )

        # Create session token
        token = create_jwt_token(org_cred['org_id'], org_cred['username'])
        expires_in = 3600

        # Store session in org_sessions table
        session_data = {
            "org_id": org_cred['org_id'],
            "username": org_cred['username'],
            "token": token,
            "expires_at": (datetime.utcnow() + timedelta(seconds=expires_in)).isoformat()
        }
        supabase.table("org_sessions").insert(session_data).execute()

        # Update last_login
        supabase.table("organization_credentials").update({"last_login": datetime.utcnow().isoformat()}).eq("org_id", org_cred['org_id']).execute()

        return OrgLoginResponse(
            token=token,
            org_id=org_cred['org_id'],
            org_name=org_cred['org_name'],
            org_type=org_cred['org_type'],
            expires_in=expires_in
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/change-password")
async def change_org_password(change_pwd: ChangePasswordRequest):
    """
    Allow organization to change their password.
    Called from org account settings page.
    """
    try:
        # Find org by username
        result = supabase.table("organization_credentials").select("*").eq("username", change_pwd.username).execute()

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username"
            )

        org_cred = result.data[0]

        # Verify old password
        if not verify_password(change_pwd.old_password, org_cred['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )

        # Hash new password
        new_password_hash = hash_password(change_pwd.new_password)

        # Update password in Supabase
        supabase.table("organization_credentials").update({
            "password_hash": new_password_hash,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("org_id", org_cred['org_id']).execute()

        # Invalidate all existing sessions
        supabase.table("org_sessions").delete().eq("org_id", org_cred['org_id']).execute()

        return {
            "message": "Password changed successfully. Please login again.",
            "org_id": org_cred['org_id']
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/validate-token")
async def validate_org_token(token: str):
    """
    Validate JWT token for Care Portal access.
    """
    try:
        # Check if token exists in sessions table
        result = supabase.table("org_sessions").select("*").eq("token", token).execute()

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )

        session = result.data[0]

        # Check if session is expired
        expires_at = datetime.fromisoformat(session['expires_at'])
        if datetime.utcnow() > expires_at:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )

        # Get org details
        org_result = supabase.table("organization_credentials").select("*").eq("org_id", session['org_id']).execute()
        org = org_result.data[0]

        return {
            "valid": True,
            "org_id": org['org_id'],
            "org_name": org['org_name'],
            "org_type": org['org_type'],
            "username": org['username'],
            "email": org['email']
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token validation failed"
        )


@router.post("/logout")
async def org_logout(token: str):
    """
    Logout organization user and invalidate token.
    """
    try:
        supabase.table("org_sessions").delete().eq("token", token).execute()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
