"""
Add organizations manually with all details
Run: python add_organizations_manual.py
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

# Organization data with all details
organizations_data = [
    {
        "name": "Vijay Care",
        "slug": "vijay-care",
        "email": "admin@vijaycare.com",
        "phone": "+91-98765-43210",
        "address": "123 Healthcare Lane",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600001",
        "num_hospitals": 3,
        "subscribed_models": ["eye", "covid", "diabetes", "pneumonia"]  # 4 models
    },
    {
        "name": "COVID Response Team",
        "slug": "covid-response",
        "email": "admin@covidresponse.com",
        "phone": "+91-97654-32109",
        "address": "456 Medical Plaza",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600002",
        "num_hospitals": 5,
        "subscribed_models": ["covid", "pneumonia", "tb", "malaria"]  # 4 different models
    },
    {
        "name": "Diagnostic Excellence",
        "slug": "diagnostic-excellence",
        "email": "admin@diagnostic.com",
        "phone": "+91-96543-21098",
        "address": "789 Wellness Center",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600003",
        "num_hospitals": 2,
        "subscribed_models": ["eye", "covid", "pneumonia", "malaria", "diabetes", "dengue", "skin"]  # 7 models
    },
    {
        "name": "Premier Healthcare Network",
        "slug": "premier-healthcare",
        "email": "admin@premierhealthcare.com",
        "phone": "+91-95432-10987",
        "address": "999 Medical Complex",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip_code": "600004",
        "num_hospitals": 8,
        # ALL 18 models
        "subscribed_models": [
            "covid", "eye", "pneumonia", "tb", "malaria", "dengue", "diabetes",
            "kidney", "throat", "lung", "skin", "ecg", "stroke", "colorectal",
            "ear", "nose", "oral", "pharyngitis"
        ]
    }
]

def add_organizations():
    conn = get_db_connection()
    cursor = conn.cursor()

    print("=" * 80)
    print("ADDING ORGANIZATIONS WITH ALL DETAILS")
    print("=" * 80)
    print()

    created_tokens = []

    for org_data in organizations_data:
        try:
            # Generate unique IDs and token
            org_id = f"ORG-{uuid.uuid4().hex[:8].upper()}"
            access_token = f"ORG_{org_data.get('name').upper().replace(' ', '_')}_{secrets.token_hex(8).upper()}"

            # Get model list
            models_list = org_data.get('subscribed_models', [])

            # Insert into database
            cursor.execute('''
                INSERT INTO organizations
                (organization_id, name, email, phone, address, city, state, zip_code,
                 access_token, token_status, subscribed_models, num_hospitals, created_at)
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

            created_tokens.append({
                'name': org_data.get('name'),
                'token': access_token,
                'models': len(models_list),
                'url': f"http://localhost:5173/{org_data.get('slug')}-org/login"
            })

            print(f"[OK] Added: {org_data.get('name')}")
            print(f"     Token: {access_token}")
            print(f"     Models: {len(models_list)}")
            print(f"     URL: http://localhost:5173/{org_data.get('slug')}-org/login")
            print()

        except Exception as e:
            print(f"[ERROR] Failed to add {org_data.get('name')}: {str(e)}")
            print()

    # Commit changes
    conn.commit()
    conn.close()

    # Print summary
    print("=" * 80)
    print("ORGANIZATIONS ADDED SUCCESSFULLY!")
    print("=" * 80)
    print()
    print("SAVE THESE TOKENS:")
    print()

    for token_info in created_tokens:
        print(f"Organization: {token_info['name']}")
        print(f"Token: {token_info['token']}")
        print(f"Models: {token_info['models']} models")
        print(f"URL: {token_info['url']}")
        print()

    print("=" * 80)
    print("Now you can test each organization with their unique token!")
    print("=" * 80)

if __name__ == "__main__":
    add_organizations()
