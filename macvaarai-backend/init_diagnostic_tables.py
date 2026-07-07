"""
Initialize diagnostic tables for the complete system
"""
import sqlite3
from datetime import datetime

def init_diagnostic_tables():
    """Create necessary tables for diagnostic system"""
    conn = sqlite3.connect("health_platform.db")
    cursor = conn.cursor()

    # Diagnoses table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS diagnoses (
            id TEXT PRIMARY KEY,
            patient_name TEXT,
            patient_age INTEGER,
            diagnosis_label TEXT,
            confidence REAL,
            specialty TEXT,
            urgency TEXT,
            fee INTEGER,
            report_text TEXT,
            created_at TEXT
        )
    """)

    # Consultations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS consultations (
            id TEXT PRIMARY KEY,
            doctor_id TEXT,
            patient_name TEXT,
            consultation_mode TEXT,
            scheduled_time TEXT,
            status TEXT,
            created_at TEXT
        )
    """)

    # Doctors table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            specialty TEXT,
            rating REAL,
            experience_years INTEGER,
            consultation_fee INTEGER,
            available BOOLEAN,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Diagnostic tables created successfully!")

if __name__ == "__main__":
    init_diagnostic_tables()
