"""
Add password authentication for patient accounts
"""

import sqlite3
import hashlib
from datetime import datetime

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def setup_patient_auth():
    """Add password column and demo patient credentials"""

    db = sqlite3.connect('health_platform.db')
    cursor = db.cursor()

    print("=" * 70)
    print("SETTING UP PATIENT AUTHENTICATION")
    print("=" * 70)

    # Check if password column exists
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN password TEXT")
        print("[OK] Added 'password' column to users table")
    except:
        print("[INFO] Password column already exists")

    # Update demo patients with passwords
    demo_credentials = [
        {
            'user_id': 'user_001',
            'name': 'aara',
            'email': 'aara@example.com',
            'password': 'patient123'
        },
        {
            'user_id': 'user_002',
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123'
        }
    ]

    print("\n[DEMO PATIENT ACCOUNTS]")
    for patient in demo_credentials:
        password_hash = hash_password(patient['password'])
        cursor.execute(
            "UPDATE users SET password = ? WHERE user_id = ?",
            (password_hash, patient['user_id'])
        )
        print(f"\n[OK] Patient: {patient['name']}")
        print(f"  Email: {patient['email']}")
        print(f"  Password: {patient['password']}")
        print(f"  User ID: {patient['user_id']}")

    db.commit()
    db.close()

    print("\n" + "=" * 70)
    print("[SUCCESS] Patient authentication setup complete!")
    print("=" * 70)

    # Display login instructions
    print("\n[PATIENT LOGIN CREDENTIALS]\n")
    for patient in demo_credentials:
        print(f"Account 1:")
        print(f"  Email: {patient['email']}")
        print(f"  Password: {patient['password']}")
        print()

if __name__ == "__main__":
    setup_patient_auth()
