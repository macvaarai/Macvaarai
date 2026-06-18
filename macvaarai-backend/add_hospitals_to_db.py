"""
Add hospitals to database - MINIMAL
Run: python add_hospitals_to_db.py
"""

import sqlite3
import uuid
import secrets

conn = sqlite3.connect('health_platform.db')
cursor = conn.cursor()

print("=" * 80)
print("ADDING HOSPITALS TO DATABASE")
print("=" * 80)
print()

hospitals_data = [
    ("Stanley Medical College and Hospital", "deansmc@tn.gov.in", "+91-44-25305112", "Old Washermanpet, Chennai", "stanley"),
    ("Kilpauk Medical College", "glmcdean2018@gmail.com", "+91-44-28364951", "Poonamallee High Rd, Kilpauk, Chennai", "kilpauk"),
    ("TN Government Omandurar Medical College", "omandurar@tn.gov.in", "+91-44-25333319", "169, Wallahja Rd, Triplicane, Chennai", "omandurar"),
    ("Madras Medical College (MMC)", "deannmc@tn.gov.in", "+91-44-25305112", "No. 1, EVR Periyar Salai, Park Town, Chennai", "mmc"),
]

tokens = []

for name, email, phone, address, slug in hospitals_data:
    try:
        token = f"HSP-{uuid.uuid4().hex[:8].upper()}_TOKEN_{secrets.token_hex(16).upper()}"

        # Try with just basic columns
        try:
            cursor.execute('''
                INSERT INTO hospitals (name, email, phone, address)
                VALUES (?, ?, ?, ?)
            ''', (name, email, phone, address))
        except:
            # If that fails, try with token column
            cursor.execute('''
                INSERT INTO hospitals (name, email, phone, address, token)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, phone, address, token))

        tokens.append((name, token, f"http://localhost:5173/{slug}-hospital/login"))
        print("[OK] Added: " + name)
        print("     Token: " + token)
        print()
    except Exception as e:
        print("[ERROR] " + name + ": " + str(e))
        print()

conn.commit()
conn.close()

print("=" * 80)
print("HOSPITALS ADDED!")
print("=" * 80)
print()
for name, token, url in tokens:
    print("Hospital: " + name)
    print("Token: " + token)
    print("URL: " + url)
    print()

print("=" * 80)
print("GO TO ADMIN DASHBOARD AND REFRESH!")
print("=" * 80)
