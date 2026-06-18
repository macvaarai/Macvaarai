import sqlite3
import os

# Connect to database
db_path = "health_platform.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Initializing database...")

# Read and execute schema
with open("database_schema.sql", "r") as f:
    schema = f.read()
    cursor.executescript(schema)

conn.commit()
conn.close()

print("[SUCCESS] Database initialized successfully!")
print(f"[SUCCESS] File: {db_path}")
print("[SUCCESS] Admin user created: anbu@1001 / anbu@1001")
print("[SUCCESS] 18 AI models inserted at 50,000 each")
print("[SUCCESS] All 17 tables created")
