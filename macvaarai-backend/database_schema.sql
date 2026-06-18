-- COMPLETE DATABASE SCHEMA FOR MACVAAR HEALTHCARE PLATFORM

-- 1. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'super_admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    logo_url TEXT,
    token TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- 3. ORGANIZATION OWNERS/ADMINS
CREATE TABLE IF NOT EXISTS organization_admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'org_admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 4. HOSPITALS
CREATE TABLE IF NOT EXISTS hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    logo_url TEXT,
    access_code TEXT UNIQUE,
    beds_total INTEGER,
    status TEXT DEFAULT 'active',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- 5. HOSPITAL STAFF
CREATE TABLE IF NOT EXISTS hospital_staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'doctor',
    specialization TEXT,
    license_number TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- 6. AI MODELS
CREATE TABLE IF NOT EXISTS ai_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    model_type TEXT,
    input_format TEXT,
    output_format TEXT,
    accuracy REAL,
    price REAL DEFAULT 50000,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORGANIZATION PURCHASED MODELS
CREATE TABLE IF NOT EXISTS organization_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (model_id) REFERENCES ai_models(id),
    UNIQUE(organization_id, model_id)
);

-- 8. HOSPITAL MODEL ACCESS
CREATE TABLE IF NOT EXISTS hospital_model_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    assigned_by INTEGER,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (model_id) REFERENCES ai_models(id),
    FOREIGN KEY (assigned_by) REFERENCES hospital_staff(id),
    UNIQUE(hospital_id, model_id)
);

-- 9. PATIENTS
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    blood_group TEXT,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- 10. AI DIAGNOSES
CREATE TABLE IF NOT EXISTS diagnoses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    hospital_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    image_url TEXT,
    disease_name TEXT NOT NULL,
    confidence REAL NOT NULL,
    severity TEXT,
    recommendation TEXT,
    diagnosis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (model_id) REFERENCES ai_models(id),
    FOREIGN KEY (staff_id) REFERENCES hospital_staff(id)
);

-- 11. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT UNIQUE,
    hospital_id INTEGER,
    organization_id INTEGER,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    assigned_to INTEGER,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    resolution TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id)
);

-- 12. FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER,
    organization_id INTEGER,
    feedback_type TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER,
    status TEXT DEFAULT 'new',
    reviewed_by INTEGER,
    response TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id)
);

-- 13. CONSULTATIONS
CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    hospital_staff_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    consultation_type TEXT,
    status TEXT DEFAULT 'pending',
    scheduled_time TIMESTAMP,
    video_link TEXT,
    chat_messages TEXT,
    resolution TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (hospital_staff_id) REFERENCES hospital_staff(id),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- 14. DISEASE SURVEILLANCE DATA
CREATE TABLE IF NOT EXISTS disease_surveillance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    organization_id INTEGER,
    disease_name TEXT NOT NULL,
    case_count INTEGER DEFAULT 0,
    death_count INTEGER DEFAULT 0,
    recovery_count INTEGER DEFAULT 0,
    severity_level TEXT,
    vaccination_rate REAL,
    report_date DATE,
    notes TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 15. HOSPITAL STATISTICS
CREATE TABLE IF NOT EXISTS hospital_statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    total_patients INTEGER DEFAULT 0,
    admitted_today INTEGER DEFAULT 0,
    discharged_today INTEGER DEFAULT 0,
    deaths_today INTEGER DEFAULT 0,
    available_beds INTEGER DEFAULT 0,
    occupancy_rate REAL DEFAULT 0,
    ai_diagnoses_today INTEGER DEFAULT 0,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- 16. BILLING/INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    model_id INTEGER,
    invoice_number TEXT UNIQUE,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending',
    payment_date TIMESTAMP,
    due_date TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (model_id) REFERENCES ai_models(id)
);

-- 17. PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT UNIQUE,
    reset_type TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_org_status ON organizations(status);
CREATE INDEX idx_hospital_org ON hospitals(organization_id);
CREATE INDEX idx_hospital_status ON hospitals(status);
CREATE INDEX idx_patient_hospital ON patients(hospital_id);
CREATE INDEX idx_diagnosis_patient ON diagnoses(patient_id);
CREATE INDEX idx_ticket_status ON support_tickets(status);
CREATE INDEX idx_feedback_hospital ON feedback(hospital_id);
CREATE INDEX idx_consultation_status ON consultations(status);
CREATE INDEX idx_surveillance_hospital ON disease_surveillance(hospital_id);

-- INSERT DEFAULT ADMIN
INSERT OR IGNORE INTO admin_users (email, password, name, phone, role)
VALUES ('anbu@1001', 'anbu@1001', 'Admin User', '+91-9876543210', 'super_admin');

-- INSERT 18 AI MODELS
INSERT OR IGNORE INTO ai_models (name, description, category, model_type, price) VALUES
('COVID-19 Detection', 'Chest X-ray COVID detection', 'Respiratory', 'Image', 50000),
('Eye Disease Detection', 'Diabetic retinopathy detection', 'Ophthalmology', 'Image', 50000),
('Pneumonia Detection', 'Lung pneumonia detection', 'Respiratory', 'Image', 50000),
('Malaria Detection', 'Blood smear malaria detection', 'Hematology', 'Image', 50000),
('Skin Cancer Detection', 'Skin lesion classification', 'Dermatology', 'Image', 50000),
('Dengue Detection', 'Dengue virus detection', 'Infectious', 'Image', 50000),
('Diabetes Detection', 'Diabetes prediction', 'Metabolic', 'Data', 50000),
('Ear Disease Detection', 'Ear infection detection', 'ENT', 'Image', 50000),
('Nose Disease Detection', 'Nasal disease detection', 'ENT', 'Image', 50000),
('Throat Disease Detection', 'Throat infection detection', 'ENT', 'Image', 50000),
('Pharyngitis Detection', 'Pharyngitis classification', 'ENT', 'Image', 50000),
('Oral Disease Detection', 'Mouth/oral disease detection', 'Dentistry', 'Image', 50000),
('Colorectal Detection', 'Colorectal lesion detection', 'Gastroenterology', 'Image', 50000),
('Lung Disease Detection', 'General lung disease detection', 'Respiratory', 'Image', 50000),
('1-Lead ECG Analysis', 'Single lead ECG analysis', 'Cardiology', 'ECG', 50000),
('1-Lead ECG Advanced', 'Advanced single lead ECG', 'Cardiology', 'ECG', 50000),
('12-Lead ECG Analysis', 'Full 12-lead ECG analysis', 'Cardiology', 'ECG', 50000),
('Additional Diagnostic Model', 'Multi-purpose diagnostic model', 'General', 'Image', 50000);
