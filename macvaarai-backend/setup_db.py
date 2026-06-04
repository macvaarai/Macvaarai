#!/usr/bin/env python3
"""
AI Health Platform - Database Setup Script
Initialize SQLite database with all tables and demo data
"""

import sqlite3
import json
from datetime import datetime
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
from models_data import MODELS_DATABASE

DATABASE_FILE = "health_platform.db"

def create_connection():
    """Create database connection"""
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables(conn):
    """Create all required tables"""
    cursor = conn.cursor()

    # Admin Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS admin_users (
        admin_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        hospital_id TEXT,
        access_key TEXT UNIQUE,
        granted_models TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        granted_by TEXT
    )
    ''')

    # Hospitals Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS hospitals (
        hospital_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        admin_email TEXT NOT NULL,
        subscribed_models TEXT,
        access_token TEXT UNIQUE,
        token_status TEXT DEFAULT 'active',
        num_doctors INTEGER DEFAULT 0,
        num_beds INTEGER DEFAULT 0,
        logo_url TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
    )
    ''')

    # Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hospital_id TEXT,
        role TEXT NOT NULL,
        joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # Conversations/History Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS conversations (
        conversation_id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        type TEXT,
        model_used TEXT,
        messages TEXT,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    ''')

    # Appointments Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        appointment_id TEXT PRIMARY KEY,
        patient_name TEXT NOT NULL,
        hospital_id TEXT NOT NULL,
        doctor TEXT NOT NULL,
        date_time TEXT NOT NULL,
        appointment_type TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # Reports Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reports (
        report_id TEXT PRIMARY KEY,
        patient_id TEXT,
        hospital_id TEXT NOT NULL,
        model_used TEXT NOT NULL,
        result TEXT,
        pdf_path TEXT,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # Access Logs Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS access_logs (
        log_id TEXT PRIMARY KEY,
        admin_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        hospital_id TEXT,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
    )
    ''')

    # Patient Diseases Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS patient_diseases (
        disease_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        hospital_id TEXT NOT NULL,
        disease_name TEXT NOT NULL,
        diagnosed_date TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(user_id),
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # Patient Test Results Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS patient_tests (
        test_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        hospital_id TEXT NOT NULL,
        test_name TEXT NOT NULL,
        model_used TEXT,
        test_date TEXT NOT NULL,
        result TEXT,
        status TEXT DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(user_id),
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # Patient Prescriptions Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS patient_prescriptions (
        prescription_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        hospital_id TEXT NOT NULL,
        medication_name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        duration TEXT NOT NULL,
        prescribed_date TEXT NOT NULL,
        expiry_date TEXT,
        doctor_name TEXT,
        notes TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(user_id),
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # Hospital Payment/Subscription Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS hospital_subscriptions (
        subscription_id TEXT PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        subscribed_models TEXT,
        payment_status TEXT DEFAULT 'paid',
        payment_date TEXT,
        expiry_date TEXT,
        total_amount REAL,
        currency TEXT DEFAULT 'INR',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    )
    ''')

    # AI Models Pricing & Details Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ai_models (
        model_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL DEFAULT 0,
        currency TEXT DEFAULT 'INR',
        description TEXT,
        features TEXT,
        diseases_trained TEXT,
        accuracy TEXT,
        training_data TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Support Tickets/Feedback Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS support_tickets (
        ticket_id TEXT PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        admin_id TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        admin_email TEXT NOT NULL,
        subject TEXT NOT NULL,
        issue_type TEXT NOT NULL,
        message TEXT NOT NULL,
        priority TEXT DEFAULT 'normal',
        status TEXT DEFAULT 'open',
        response TEXT,
        responded_by TEXT,
        responded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
        FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
    )
    ''')

    # Hospital Feedback Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS hospital_feedback (
        feedback_id TEXT PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        hospital_name TEXT NOT NULL,
        admin_id TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        feedback_type TEXT NOT NULL,
        message TEXT NOT NULL,
        priority TEXT DEFAULT 'normal',
        status TEXT DEFAULT 'submitted',
        response TEXT,
        responded_by TEXT,
        responded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
        FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
    )
    ''')

    # Consultation Booking Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS consultations (
        consultation_id TEXT PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        hospital_name TEXT NOT NULL,
        admin_id TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        topic TEXT NOT NULL,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        duration INTEGER DEFAULT 60,
        description TEXT,
        status TEXT DEFAULT 'pending',
        confirmed_date TEXT,
        confirmed_time TEXT,
        response TEXT,
        responded_by TEXT,
        responded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
        FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
    )
    ''')

    conn.commit()
    print("[OK] All tables created successfully")

def insert_demo_data(conn):
    """Insert demo data"""
    cursor = conn.cursor()

    # Clear existing data
    cursor.execute('DELETE FROM admin_users')
    cursor.execute('DELETE FROM hospitals')
    cursor.execute('DELETE FROM users')
    cursor.execute('DELETE FROM appointments')
    cursor.execute('DELETE FROM patient_diseases')
    cursor.execute('DELETE FROM patient_tests')
    cursor.execute('DELETE FROM patient_prescriptions')
    cursor.execute('DELETE FROM hospital_subscriptions')
    cursor.execute('DELETE FROM support_tickets')
    cursor.execute('DELETE FROM hospital_feedback')
    cursor.execute('DELETE FROM consultations')
    cursor.execute('DELETE FROM ai_models')

    # Demo Admin Users
    demo_admins = [
        ('hero_001', 'Hero Admin', 'hero@macvaarai.com', 'admin123', 'hero_admin', None, None, '[]', 1, datetime.now().isoformat(), None),
        ('admin_001', 'Dr. Raj Kumar', 'raj@apollo.com', 'admin123', 'hospital_admin', 'APL-001', 'ACCESS123', '["eye","covid","ecg","skin","breast","tb","diabetes","pneumonia","malaria","dengue","stroke","kidney"]', 1, datetime.now().isoformat(), 'hero_001'),
    ]

    for admin in demo_admins:
        cursor.execute('''
        INSERT INTO admin_users
        (admin_id, name, email, password_hash, role, hospital_id, access_key, granted_models, is_active, created_at, granted_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', admin)

    # Demo Hospital (with all 12 models)
    demo_hospitals = [
        ('APL-001', 'Apollo Hospital', 'admin@apollo.com', '+91-9876543210', '123 Medical Center Road', 'Mumbai', 'Maharashtra', '400001', 'Dr. Raj Kumar', 'raj@apollo.com', '["eye","covid","ecg","skin","breast","tb","diabetes","pneumonia","malaria","dengue","stroke","kidney"]', 'APL_TOKEN_2024_SECURE_ABC123XYZ', 'active', 50, 200, 1, datetime.now().isoformat(), 'hero_001'),
    ]

    for hospital in demo_hospitals:
        cursor.execute('''
        INSERT INTO hospitals
        (hospital_id, name, email, phone, address, city, state, zip_code, admin_name, admin_email, subscribed_models, access_token, token_status, num_doctors, num_beds, is_active, created_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', hospital)

    # Demo Users
    demo_users = [
        ('user_001', 'aara', 'aara@example.com', 'APL-001', 'patient', datetime.now().isoformat(), 'active'),
        ('user_002', 'John Doe', 'john@example.com', 'APL-001', 'patient', datetime.now().isoformat(), 'active'),
    ]

    for user in demo_users:
        cursor.execute('''
        INSERT INTO users
        (user_id, name, email, hospital_id, role, joined, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', user)

    # Demo Appointments
    demo_appointments = [
        ('apt_001', 'John Doe', 'APL-001', 'Dr. Priya Sharma', '2026-06-05 2:00 PM', 'Eye Checkup', 'scheduled', datetime.now().isoformat()),
        ('apt_002', 'aara', 'APL-001', 'Dr. Smith', '2026-06-06 10:00 AM', 'COVID Test', 'scheduled', datetime.now().isoformat()),
    ]

    for appointment in demo_appointments:
        cursor.execute('''
        INSERT INTO appointments
        (appointment_id, patient_name, hospital_id, doctor, date_time, appointment_type, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', appointment)

    # Demo Patient Diseases
    demo_diseases = [
        ('dis_001', 'user_001', 'APL-001', 'Hypertension', '2026-05-15', 'active', 'High blood pressure - under control'),
        ('dis_002', 'user_001', 'APL-001', 'Type 2 Diabetes', '2026-04-20', 'active', 'Diagnosed 2 months ago'),
        ('dis_003', 'user_002', 'APL-001', 'Asthma', '2026-06-01', 'active', 'Mild asthma, triggered by allergens'),
    ]

    for disease in demo_diseases:
        cursor.execute('''
        INSERT INTO patient_diseases
        (disease_id, patient_id, hospital_id, disease_name, diagnosed_date, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', disease)

    # Demo Patient Tests
    demo_tests = [
        ('test_001', 'user_001', 'APL-001', 'Eye Examination', 'eye', '2026-06-01', 'Mild myopia detected', 'completed'),
        ('test_002', 'user_001', 'APL-001', 'COVID-19 Test', 'covid', '2026-05-20', 'Negative', 'completed'),
        ('test_003', 'user_002', 'APL-001', 'Chest X-Ray Analysis', 'lung', '2026-06-02', 'No abnormalities detected', 'completed'),
    ]

    for test in demo_tests:
        cursor.execute('''
        INSERT INTO patient_tests
        (test_id, patient_id, hospital_id, test_name, model_used, test_date, result, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', test)

    # Demo Patient Prescriptions
    demo_prescriptions = [
        ('presc_001', 'user_001', 'APL-001', 'Lisinopril', '10mg', 'Once daily', '30 days', '2026-05-15', '2026-08-15', 'Dr. Priya Sharma', 'For blood pressure control'),
        ('presc_002', 'user_001', 'APL-001', 'Metformin', '500mg', 'Twice daily', '30 days', '2026-04-20', '2026-08-20', 'Dr. Smith', 'For diabetes management'),
        ('presc_003', 'user_002', 'APL-001', 'Albuterol Inhaler', '100mcg', 'As needed', '60 days', '2026-06-01', '2026-08-01', 'Dr. Priya Sharma', 'For asthma relief'),
    ]

    for prescription in demo_prescriptions:
        cursor.execute('''
        INSERT INTO patient_prescriptions
        (prescription_id, patient_id, hospital_id, medication_name, dosage, frequency, duration, prescribed_date, expiry_date, doctor_name, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', prescription)

    # Demo Hospital Subscription
    demo_subscriptions = [
        ('sub_001', 'APL-001', '["eye","covid","ecg","skin","breast","tb","diabetes","pneumonia","malaria","dengue","stroke","kidney"]', 'paid', '2026-05-01', '2027-05-01', 120000.00, 'INR', 'Annual subscription for all 12 AI models'),
    ]

    for subscription in demo_subscriptions:
        cursor.execute('''
        INSERT INTO hospital_subscriptions
        (subscription_id, hospital_id, subscribed_models, payment_status, payment_date, expiry_date, total_amount, currency, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', subscription)

    # Insert All AI Models
    for model_id, model_data in MODELS_DATABASE.items():
        cursor.execute('''
        INSERT INTO ai_models
        (model_id, name, category, price, currency, description, features, diseases_trained, accuracy, training_data, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ''', (
            model_data['model_id'],
            model_data['name'],
            model_data['category'],
            model_data['price'],
            model_data['currency'],
            model_data['description'],
            json.dumps(model_data['features']),
            json.dumps(model_data['diseases_trained']),
            model_data['accuracy'],
            model_data['training_data']
        ))

    # Demo Support Tickets
    demo_tickets = [
        ('ticket_001', 'APL-001', 'admin_001', 'Dr. Raj Kumar', 'raj@apollo.com', 'Eye Model Not Working', 'technical_issue', 'Eye disease detection model is returning errors when processing images. Please check the model.', 'high', 'open', None, None, None),
        ('ticket_002', 'APL-001', 'admin_001', 'Dr. Raj Kumar', 'raj@apollo.com', 'Feature Request', 'feature_request', 'Can you add support for batch image processing? We have many images to analyze at once.', 'normal', 'open', None, None, None),
    ]

    for ticket in demo_tickets:
        cursor.execute('''
        INSERT INTO support_tickets
        (ticket_id, hospital_id, admin_id, admin_name, admin_email, subject, issue_type, message, priority, status, response, responded_by, responded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ticket)

    conn.commit()
    print("[OK] Demo data inserted successfully")

def main():
    """Main setup function"""
    print("\n[AI HEALTH PLATFORM] Database Setup\n")

    # Check if database exists
    db_exists = os.path.exists(DATABASE_FILE)

    if db_exists:
        print(f"[WARNING] Database {DATABASE_FILE} already exists")
        print("   Initializing tables and inserting demo data...")
    else:
        print(f"[INFO] Creating new database: {DATABASE_FILE}")

    # Connect and create
    conn = create_connection()

    try:
        create_tables(conn)
        insert_demo_data(conn)
        conn.close()

        print("\n[SUCCESS] Database setup completed successfully!\n")
        print("[DATABASE] File: health_platform.db")
        print("\n[DEMO ACCOUNTS]")
        print("   Hero Admin:")
        print("   - Email: hero@macvaarai.com")
        print("   - Password: admin123")
        print("   - Role: Full system control")
        print("\n   Hospital Admin:")
        print("   - Email: raj@apollo.com")
        print("   - Password: admin123")
        print("   - Access Key: ACCESS123")
        print("   - Role: Apollo Hospital management")
        print("\n[HOSPITALS CREATED]")
        print("   - Apollo Hospital (APL-001)")
        print("   - Models: All 12 AI Models (Eye, COVID-19, ECG, Skin, Breast, TB, Diabetes, Pneumonia, Malaria, Dengue, Stroke, Kidney)")
        print("\n[SAMPLE USERS]")
        print("   - aara (with diseases, tests, prescriptions)")
        print("   - John Doe (with diseases, tests, prescriptions)")
        print("\n[APPOINTMENTS] Sample appointments created")
        print("\n[PATIENT RECORDS ADDED]")
        print("   - 3 Diseases across 2 patients")
        print("   - 3 Test Results (Eye, COVID, Lung)")
        print("   - 3 Prescriptions (Lisinopril, Metformin, Albuterol)")
        print("\n[SUBSCRIPTION ADDED]")
        print("   - Apollo Hospital: 4 models, 50000 INR/year (Paid until 2027-05-01)")
        print("\n[READY] Start the backend with:")
        print("   python -m uvicorn main:app --reload\n")

    except Exception as e:
        print(f"\n[ERROR] {str(e)}\n")
        conn.close()
        exit(1)

if __name__ == "__main__":
    main()
