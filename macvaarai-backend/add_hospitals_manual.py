"""
Add hospitals manually with all details
Run: python add_hospitals_manual.py
"""

import sqlite3
import json
import uuid
import secrets
from datetime import datetime

def get_db_connection():
    conn = sqlite3.connect('health_platform.db')
    conn.row_factory = sqlite3.Row
    return conn

# Hospital data with all details
hospitals_data = [
    {
        "name": "Stanley Medical College and Hospital",
        "slug": "stanley",
        "email": "deansmc@tn.gov.in",
        "phone": "+91-44-25305112",
        "address": "Old Washermanpet",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600001",
        "admin_name": "Stanley Dean",
        "admin_email": "stanleycollege19@gmail.com",
        "num_doctors": 150,
        "num_beds": 800,
        "subscribed_models": ["eye"]  # ONLY Eye Disease Detection
    },
    {
        "name": "Kilpauk Medical College",
        "slug": "kilpauk",
        "email": "glmcdean2018@gmail.com",
        "phone": "+91-44-28364951",
        "address": "Poonamallee High Rd, Kilpauk",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600010",
        "admin_name": "Kilpauk Dean",
        "admin_email": "kilpauk.admin@gmail.com",
        "num_doctors": 120,
        "num_beds": 600,
        "subscribed_models": ["covid"]  # ONLY COVID-19 Detection
    },
    {
        "name": "TN Government Omandurar Medical College",
        "slug": "omandurar",
        "email": "omandurar@tn.gov.in",
        "phone": "+91-44-25333319",
        "address": "169, Wallahja Rd, Police Quarters, Triplicane",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600002",
        "admin_name": "Omandurar Dean",
        "admin_email": "omandurar.dean@tn.gov.in",
        "num_doctors": 130,
        "num_beds": 700,
        "subscribed_models": ["pneumonia"]  # ONLY Pneumonia Detection
    },
    {
        "name": "Madras Medical College (MMC)",
        "slug": "mmc",
        "email": "deannmc@tn.gov.in",
        "phone": "+91-44-25305112",
        "address": "No. 1, EVR Periyar Salai, Park Town",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600003",
        "admin_name": "MMC Dean",
        "admin_email": "madras.medical@tn.gov.in",
        "num_doctors": 160,
        "num_beds": 900,
        "subscribed_models": ["malaria"]  # ONLY Malaria Detection
    }
]

def add_hospitals():
    conn = get_db_connection()
    cursor = conn.cursor()

    print("=" * 80)
    print("ADDING HOSPITALS WITH ALL DETAILS")
    print("=" * 80)
    print()

    created_tokens = []

    for hospital_data in hospitals_data:
        try:
            # Generate unique IDs and token
            hospital_id = f"HSP-{uuid.uuid4().hex[:8].upper()}"
            access_token = f"{hospital_id}_TOKEN_{secrets.token_hex(16).upper()}"

            # Get model list
            models_list = hospital_data.get('subscribed_models', [])

            # Insert into database
            cursor.execute('''
                INSERT INTO hospitals
                (hospital_id, name, email, phone, address, city, state, zip_code,
                 admin_name, admin_email, subscribed_models, access_token,
                 token_status, num_doctors, num_beds, is_active, created_at)
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

            created_tokens.append({
                'name': hospital_data.get('name'),
                'token': access_token,
                'models': models_list,
                'url': f"http://localhost:5173/{hospital_data.get('slug')}-hospital/login"
            })

            print(f"[OK] Added: {hospital_data.get('name')}")
            print(f"     Token: {access_token}")
            print(f"     Models: {models_list}")
            print(f"     URL: http://localhost:5173/{hospital_data.get('slug')}-hospital/login")
            print()

        except Exception as e:
            print(f"[ERROR] Failed to add {hospital_data.get('name')}: {str(e)}")
            print()

    # Commit changes
    conn.commit()
    conn.close()

    # Print summary
    print("=" * 80)
    print("HOSPITALS ADDED SUCCESSFULLY!")
    print("=" * 80)
    print()
    print("SAVE THESE TOKENS:")
    print()

    for token_info in created_tokens:
        print(f"Hospital: {token_info['name']}")
        print(f"Token: {token_info['token']}")
        print(f"Models: {token_info['models']}")
        print(f"URL: {token_info['url']}")
        print()

    print("=" * 80)
    print("Now you can test each hospital with their unique token!")
    print("=" * 80)

if __name__ == "__main__":
    add_hospitals()
