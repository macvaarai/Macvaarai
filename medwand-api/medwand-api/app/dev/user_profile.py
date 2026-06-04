from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from ..dev.app_dev import get_db_connection
from datetime import datetime
from fastapi import Body
from datetime import datetime, timedelta
import random

otp_store = {}
router = APIRouter()

class RegisterRequest(BaseModel):
    name: str
    contact: str  # either email or mobile
    password: str
    gender: str
    age: int
    aadhar: Optional[str]
    appointment_id: Optional[str]

class LoginRequest(BaseModel):
    contact: str
    password: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str]
    contact: Optional[str]
    password: Optional[str]
    gender: Optional[str]
    age: Optional[int]
    aadhar: Optional[str]
    appointment_id: Optional[str]

@router.post("/api/v1/register", tags=["Auth"])
async def register_user(request: RegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT INTO user_profiles (name, aadhar, appointment_id, password, gender, age, contact)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        ''',
        (
            request.name,
            request.aadhar, 
            request.appointment_id,
            request.password,
            request.gender,
            request.age,
            request.contact,
        )
    )
    user_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()

    return {"message": "User registered", "user_id": user_id}

@router.post("/api/v1/login", tags=["Auth"])
async def login_user(request: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM user_profiles WHERE contact = %s AND password = %s', (request.contact, request.password))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found or password incorrect")

    return {"message": "Login successful", "user_id": user[0], "name": user[1]}

@router.get("/api/v1/search", tags=["Profile Search"])
async def search_user(
    name: Optional[str] = Query(None),
    contact: Optional[str] = Query(None),
    aadhar: Optional[str] = Query(None),
    appointment_id: Optional[str] = Query(None)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = 'SELECT * FROM user_profiles WHERE 1=1'
    values = []

    if name:
        query += ' AND name ILIKE %s'
        values.append(f"%{name}%")
    if contact:
        query += ' AND contact = %s'
        values.append(contact)
    if aadhar:
        query += ' AND aadhar = %s'
        values.append(aadhar)
    if appointment_id:
        query += ' AND appointment_id = %s'
        values.append(appointment_id)

    cursor.execute(query, tuple(values))
    rows = cursor.fetchall()
    conn.close()

    results = [
        {
            "id": row[0],
            "name": row[1],
            "aadhar": row[2],
            "appointment_id": row[3],
            "password": row[4],
            "gender": row[5],
            "age": row[6],
            "contact": row[7],
            
        }
        for row in rows
    ]

    return {"results": results}

@router.put("/api/v1/profile/{user_id}", tags=["Profile"])
async def update_profile(user_id: int, request: UpdateProfileRequest):
    updates = []
    values = []

    if request.name:
        updates.append("name = %s")
        values.append(request.name)
    if request.contact:
        updates.append("contact = %s")
        values.append(request.contact)
    if request.password:
        updates.append("password = %s")
        values.append(request.password)
    if request.gender:
        updates.append("gender = %s")
        values.append(request.gender)
    if request.age:
        updates.append("age = %s")
        values.append(request.age)
    if request.aadhar:
        updates.append("aadhar = %s")
        values.append(request.aadhar)
    if request.appointment_id:
        updates.append("appointment_id = %s")
        values.append(request.appointment_id)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    query = f'UPDATE user_profiles SET {", ".join(updates)} WHERE id = %s'
    values.append(user_id)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, tuple(values))
    conn.commit()
    conn.close()

    return {"message": "Profile updated"}

@router.delete("/api/v1/profile/{user_id}", tags=["Profile"])
async def delete_profile(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM user_profiles WHERE id = %s', (user_id,))
    conn.commit()
    conn.close()

    return {"message": "Profile deleted"}

@router.post("/api/v1/send-otp", tags=["Auth"])  
async def send_otp(contact: str = Body(..., embed=True)):  
    otp = str(random.randint(100000, 999999))  
    expires_at = datetime.utcnow() + timedelta(minutes=5)  
    otp_store[contact] = {"otp": otp, "expires_at": expires_at}  
    print(f"OTP for {contact} is {otp}")  
    return {"message": f"OTP sent to {contact}", "expires_at": expires_at}  


@router.post("/api/v1/verify-otp", tags=["Auth"])  
async def verify_otp(contact: str = Body(...), otp: str = Body(...)):  
    record = otp_store.get(contact)  
    if not record:  
        raise HTTPException(status_code=400, detail="OTP not requested")  
    if datetime.utcnow() > record["expires_at"]:  
        del otp_store[contact]  
        raise HTTPException(status_code=400, detail="OTP expired")  
    if record["otp"] != otp:  
        raise HTTPException(status_code=400, detail="Invalid OTP")  
    del otp_store[contact]  
    return {"message": "OTP verified successfully"}  


@router.post("/api/v1/forgot-password", tags=["Auth"])  
async def forgot_password(contact: str = Body(..., embed=True)):  
    return await send_otp(contact)