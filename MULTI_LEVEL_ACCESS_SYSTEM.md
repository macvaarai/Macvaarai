# 🏢 Multi-Level Access Control System

## 🎯 WHAT THE USER WANTS

```
HIERARCHY:
┌─────────────────────────────────────────┐
│    MACVAAR SUPER ADMIN                  │
│    (Main Company)                       │
└────────────┬────────────────────────────┘
             │
             ├─ Gives access to ↓
             │
┌────────────┴─────────────────────────────────────┐
│                                                  │
│  PARTY ADMINS (Organizations)                   │
│  ├─ Vijay Care (Party Admin)                    │
│  ├─ BJP Care (Party Admin)                      │
│  ├─ Uday Care (Party Admin)                     │
│  └─ Modi Care (Party Admin)                     │
│                                                  │
└────────────┬─────────────────────────────────────┘
             │
             ├─ Each party gives access to ↓
             │
┌────────────┴──────────────────────────┐
│   HOSPITALS UNDER THAT PARTY          │
│   ├─ Vijay Care Hospital 1            │
│   ├─ Vijay Care Hospital 2            │
│   ├─ BJP Care Hospital 1              │
│   ├─ BJP Care Hospital 2              │
│   └─ ... more hospitals               │
└────────────┬──────────────────────────┘
             │
             ├─ Hospital gives access to ↓
             │
┌────────────┴──────────────────────────┐
│   HOSPITAL USERS                      │
│   ├─ Patients                         │
│   ├─ Doctors                          │
│   ├─ Hospital Admins                  │
│   └─ Staff                            │
└───────────────────────────────────────┘
```

---

## 📊 CURRENT VS NEW SYSTEM

### **Current System:**
```
MacvaarAI Super Admin
    ↓
Hospitals (Direct)
    ↓
Patients/Doctors
```

### **New System (Multi-Level):**
```
MacvaarAI Super Admin
    ↓
Party/Organization Admin (Vijay, BJP, Uday, Modi, etc.)
    ↓
Hospital Admin (Under that party)
    ↓
Patients/Doctors
```

---

## 🗄️ DATABASE SCHEMA NEEDED

### **NEW TABLE 1: Organizations/Parties**

```sql
CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    logo_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(10),
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    owner_phone VARCHAR(20),
    total_hospitals INT DEFAULT 0,
    created_by INT,  -- Super Admin ID
    created_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(50)  -- active, inactive, suspended
);

EXAMPLE DATA:
├─ Organization 1: Vijay Care
│  ├─ ID: 1
│  ├─ Name: Vijay Care
│  ├─ Owner: Vijay Kumar
│  ├─ Hospitals: 3
│  └─ Status: Active
│
├─ Organization 2: BJP Care
│  ├─ ID: 2
│  ├─ Name: BJP Care
│  ├─ Owner: BJP Leadership
│  ├─ Hospitals: 5
│  └─ Status: Active
│
└─ Organization 3: Modi Care
   ├─ ID: 3
   ├─ Name: Modi Care
   ├─ Owner: Government
   ├─ Hospitals: 10
   └─ Status: Active
```

### **NEW TABLE 2: Organization Admins**

```sql
CREATE TABLE organization_admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(100),  -- org_admin, org_manager, org_support
    access_level VARCHAR(50),  -- full, limited
    created_at TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

EXAMPLE DATA:
├─ Admin 1: Vijay Care
│  ├─ Name: Vijay Kumar
│  ├─ Organization: Vijay Care
│  ├─ Role: org_admin
│  └─ Access: Full (Can see all hospitals)
│
├─ Admin 2: BJP Care
│  ├─ Name: BJP Admin
│  ├─ Organization: BJP Care
│  ├─ Role: org_admin
│  └─ Access: Full
│
└─ Admin 3: Modi Care
   ├─ Name: Modi Care Manager
   ├─ Organization: Modi Care
   ├─ Role: org_manager
   └─ Access: Limited
```

### **UPDATE EXISTING TABLE: Hospitals**

```sql
ALTER TABLE hospitals ADD COLUMN organization_id INT;
ALTER TABLE hospitals ADD FOREIGN KEY (organization_id) REFERENCES organizations(id);

EXAMPLE:
Hospital 1: Apollo Hospital
├─ Organization: Vijay Care
├─ Hospital ID: H-001
└─ Org ID: 1 (Vijay Care)

Hospital 2: Max Hospital
├─ Organization: BJP Care
├─ Hospital ID: H-002
└─ Org ID: 2 (BJP Care)
```

### **UPDATE EXISTING TABLE: Users**

```sql
ALTER TABLE users ADD COLUMN organization_id INT;
ALTER TABLE users ADD COLUMN role_type VARCHAR(100);
-- role_type: super_admin, org_admin, hospital_admin, doctor, patient, staff

EXAMPLE ROLES:
├─ Super Admin: Can see all organizations & hospitals
├─ Org Admin: Can see only their organization's hospitals
├─ Hospital Admin: Can see only their hospital
├─ Doctor: Can see only their hospital's patients
└─ Patient: Can see only themselves
```

---

## 🔐 ACCESS CONTROL LOGIC

### **Super Admin Permissions:**
```
✅ View all organizations
✅ Create new organizations
✅ Edit any organization
✅ Delete organizations
✅ View all hospitals (all orgs)
✅ View all users (all orgs)
✅ View all analytics (global)
✅ Manage all org admins
✅ Manage billing
```

### **Organization Admin Permissions:**
```
✅ View their organization details
✅ View all hospitals in their organization
✅ Create new hospital (in their org)
✅ Edit hospitals (in their org)
✅ Delete hospitals (in their org)
✅ View all users in their hospitals
✅ View analytics for their org
✅ Add hospital admins
✅ Manage organization staff
❌ View other organizations
❌ Create new organizations
❌ View global analytics
```

### **Hospital Admin Permissions:**
```
✅ View their hospital details
✅ View their hospital's patients
✅ View their hospital's doctors
✅ Create appointments
✅ View reports
✅ Add staff
✅ View hospital analytics
❌ View other hospitals
❌ Manage organization
❌ Create new hospitals
```

---

## 🌐 DASHBOARD HIERARCHY

### **Super Admin Dashboard:**
```
┌─────────────────────────────────────┐
│  MACVAAR SUPER ADMIN DASHBOARD      │
├─────────────────────────────────────┤
│ Tabs:                               │
│ ├─ 📊 Overview (All data)          │
│ ├─ 🏢 Organizations (Manage)        │
│ ├─ 🏥 All Hospitals (Manage)        │
│ ├─ 👥 All Users (Manage)            │
│ ├─ 💰 Billing & Revenue             │
│ ├─ 📈 Global Analytics              │
│ ├─ 🔧 System Settings               │
│ └─ 👨‍💼 Manage Org Admins             │
└─────────────────────────────────────┘

Can see:
├─ Vijay Care (Org 1)
│  ├─ Hospital 1
│  ├─ Hospital 2
│  └─ Hospital 3
├─ BJP Care (Org 2)
│  ├─ Hospital A
│  └─ Hospital B
└─ Modi Care (Org 3)
   ├─ Hospital X
   └─ Hospital Y
```

### **Organization Admin Dashboard:**
```
┌─────────────────────────────────────┐
│  VIJAY CARE ADMIN DASHBOARD         │
├─────────────────────────────────────┤
│ Tabs:                               │
│ ├─ 📊 Organization Overview         │
│ ├─ 🏥 My Hospitals (3)              │
│ ├─ 👥 My Users                      │
│ ├─ 📈 Organization Analytics        │
│ ├─ 💳 Billing                       │
│ ├─ ⚙️ Org Settings                  │
│ └─ 👨‍⚕️ Hospital Admins               │
└─────────────────────────────────────┘

Can see:
├─ Vijay Care Hospital 1
│  ├─ 45 Patients
│  ├─ 50 Doctors
│  └─ 12 Appointments
├─ Vijay Care Hospital 2
│  ├─ 32 Patients
│  ├─ 40 Doctors
│  └─ 8 Appointments
└─ Vijay Care Hospital 3
   ├─ 28 Patients
   ├─ 35 Doctors
   └─ 6 Appointments
```

### **Hospital Admin Dashboard:**
```
┌─────────────────────────────────────┐
│  HOSPITAL ADMIN DASHBOARD           │
├─────────────────────────────────────┤
│ Tabs:                               │
│ ├─ 📊 Dashboard                     │
│ ├─ 💊 AI Models                     │
│ ├─ 👥 Patients                      │
│ ├─ 👨‍⚕️ Doctors                       │
│ ├─ 📅 Appointments                  │
│ ├─ 📋 Reports                       │
│ ├─ ⚙️ Hospital Settings             │
│ └─ 👨‍⚕️ Staff Management              │
└─────────────────────────────────────┘

Can see:
└─ Only their hospital's data
```

---

## 🔑 LOGIN SYSTEM

### **Different Login Types:**

```
1. SUPER ADMIN LOGIN
   ├─ URL: http://localhost:5173/superadmin/login
   ├─ Key: hero_admin_001
   ├─ Access: All organizations & hospitals
   └─ Dashboard: Global dashboard

2. ORGANIZATION ADMIN LOGIN
   ├─ URL: http://localhost:5173/org-admin/login
   ├─ Token: ORG_TOKEN_2024_SECURE_ABC123 (per org)
   ├─ Access: Only their organization's hospitals
   └─ Dashboard: Organization dashboard

3. HOSPITAL ADMIN LOGIN
   ├─ URL: http://localhost:5173/hospital/login
   ├─ Token: HOSPITAL_TOKEN_2024_SECURE_XYZ (per hospital)
   ├─ Access: Only their hospital
   └─ Dashboard: Hospital dashboard

4. DOCTOR LOGIN
   ├─ URL: http://localhost:5173/doctor/login
   ├─ Email: doctor@hospital.com
   ├─ Password: password123
   └─ Access: Their hospital's patients

5. PATIENT LOGIN
   ├─ URL: http://localhost:5173/patient/login
   ├─ Email: patient@email.com
   ├─ Password: password123
   └─ Access: Only themselves
```

---

## 📱 UI FLOW

### **Super Admin Creates Organization:**

```
Super Admin Dashboard
    ↓
Click: "Create Organization"
    ↓
Form Opens:
├─ Organization Name: "Vijay Care"
├─ Owner Name: "Vijay Kumar"
├─ Owner Email: "vijay@care.com"
├─ Owner Phone: "+91-9876543210"
├─ Address: "Mumbai, Maharashtra"
└─ Logo: [Upload logo]
    ↓
Click: "Create"
    ↓
✅ Organization Created!
   ├─ Org ID: 1
   ├─ Org Token: ORG_TOKEN_2024_SECURE_ABC123
   └─ Ready for use

System sends email to Vijay:
├─ Subject: "Vijay Care Account Created"
├─ Token: ORG_TOKEN_2024_SECURE_ABC123
├─ Login URL: http://localhost:5173/org-admin/login
└─ Instructions: How to add hospitals
```

### **Organization Admin Adds Hospital:**

```
Organization Admin (Vijay Care) Dashboard
    ↓
Click: "Add Hospital"
    ↓
Form Opens:
├─ Hospital Name: "Vijay Care Hospital 1"
├─ Address: "123 Medical Street"
├─ Doctors: 50
├─ Beds: 200
└─ Logo: [Upload logo]
    ↓
Click: "Create"
    ↓
✅ Hospital Created!
   ├─ Hospital ID: H-001
   ├─ Hospital Token: APL_TOKEN_2024_SECURE_XYZ
   ├─ Organization: Vijay Care
   └─ Status: Active

System sends email to Hospital Admin:
├─ Subject: "Hospital Account Created"
├─ Token: APL_TOKEN_2024_SECURE_XYZ
├─ Login URL: http://localhost:5173/hospital/login
└─ Access to: All AI models
```

### **Hospital Admin Uses System:**

```
Hospital Admin Login
    ↓
Enters Token: APL_TOKEN_2024_SECURE_XYZ
    ↓
Hospital Dashboard Loads:
├─ Hospital: Vijay Care Hospital 1
├─ Patients: 45
├─ Appointments: 12
├─ Doctors: 50
└─ Features: All available
    ↓
Can:
├─ Add patients
├─ Use AI models
├─ Book appointments
├─ View reports
├─ Manage doctors
└─ Send feedback to Org Admin
```

---

## 🔄 DATA ISOLATION

### **Each Level Sees Only Their Data:**

```
SUPER ADMIN sees:
├─ Vijay Care
│  ├─ Hospital 1 (45 patients)
│  ├─ Hospital 2 (32 patients)
│  └─ Hospital 3 (28 patients)
├─ BJP Care
│  ├─ Hospital A (50 patients)
│  └─ Hospital B (40 patients)
└─ Modi Care
   ├─ Hospital X (60 patients)
   └─ Hospital Y (55 patients)
Total visibility: ALL

ORG ADMIN (Vijay Care) sees:
├─ Hospital 1 (45 patients)
├─ Hospital 2 (32 patients)
└─ Hospital 3 (28 patients)
Total visibility: Only Vijay Care

HOSPITAL ADMIN sees:
└─ Hospital 1 (45 patients)
Total visibility: Only Hospital 1
```

---

## 💾 SAMPLE DATA STRUCTURE

### **After Setup:**

```
Organizations:
├─ ID: 1, Name: "Vijay Care", Owner: "Vijay Kumar"
├─ ID: 2, Name: "BJP Care", Owner: "BJP Leadership"
├─ ID: 3, Name: "Uday Care", Owner: "Uday Kumar"
└─ ID: 4, Name: "Modi Care", Owner: "Government"

Hospitals:
├─ H-001, "Vijay Care Hospital 1", Org: 1 (Vijay Care)
├─ H-002, "Vijay Care Hospital 2", Org: 1 (Vijay Care)
├─ H-003, "BJP Care Hospital", Org: 2 (BJP Care)
├─ H-004, "Uday Care Hospital", Org: 3 (Uday Care)
└─ H-005, "Modi Government Hospital", Org: 4 (Modi Care)

Organization Admins:
├─ Admin 1: Vijay Kumar (Org: Vijay Care)
├─ Admin 2: BJP Admin (Org: BJP Care)
├─ Admin 3: Uday Admin (Org: Uday Care)
└─ Admin 4: Modi Admin (Org: Modi Care)

Users:
├─ Patient 1 (Hospital: H-001, Org: Vijay Care)
├─ Doctor 1 (Hospital: H-001, Org: Vijay Care)
├─ Patient 2 (Hospital: H-003, Org: BJP Care)
└─ Doctor 2 (Hospital: H-003, Org: BJP Care)
```

---

## 📊 ANALYTICS BY LEVEL

### **Super Admin Analytics:**
```
Global Overview:
├─ Total Organizations: 4
├─ Total Hospitals: 20
├─ Total Patients: 1,200
├─ Total Doctors: 500
├─ Total Revenue: ₹50 Lakh
└─ System Health: 99.5%

Per Organization:
├─ Vijay Care: 3 hospitals, 105 patients
├─ BJP Care: 5 hospitals, 220 patients
├─ Uday Care: 4 hospitals, 180 patients
└─ Modi Care: 8 hospitals, 695 patients
```

### **Organization Admin Analytics:**
```
Vijay Care Overview:
├─ Total Hospitals: 3
├─ Total Patients: 105
├─ Total Doctors: 140
├─ Total Revenue: ₹12 Lakh
└─ Organization Health: 98%

Per Hospital:
├─ Hospital 1: 45 patients, 50 doctors
├─ Hospital 2: 32 patients, 45 doctors
└─ Hospital 3: 28 patients, 45 doctors
```

### **Hospital Admin Analytics:**
```
Vijay Care Hospital 1:
├─ Total Patients: 45
├─ Total Doctors: 50
├─ Appointments: 12
├─ AI Reports: 8
└─ Revenue: ₹4 Lakh
```

---

## 🔐 SECURITY & ACCESS TOKENS

### **Token Types:**

```
SUPER ADMIN KEY:
└─ hero_admin_001
   ├─ Fixed key
   ├─ Can't revoke
   ├─ Full access
   └─ Don't share!

ORGANIZATION TOKEN:
├─ ORG_TOKEN_2024_SECURE_[UNIQUE_STRING]
├─ Per organization
├─ Can revoke anytime
├─ Access: That org's hospitals
└─ Example: ORG_TOKEN_2024_SECURE_ABC123XYZ

HOSPITAL TOKEN:
├─ HOSPITAL_TOKEN_2024_SECURE_[UNIQUE_STRING]
├─ Per hospital
├─ Can revoke anytime
├─ Access: That hospital only
└─ Example: APL_TOKEN_2024_SECURE_XYZ789MNO
```

---

## ✅ HOW TO IMPLEMENT

### **Steps (When Ready):**

```
Step 1: Create new database tables
├─ organizations
└─ organization_admins

Step 2: Update existing tables
├─ hospitals (add organization_id)
└─ users (add organization_id, role_type)

Step 3: Create new login endpoints
├─ /org-admin/login
├─ /org-admin/verify-token
└─ /org-admin/dashboard

Step 4: Create new dashboard
├─ OrganizationAdminDashboard.jsx
├─ CreateOrganizationForm.jsx
├─ ManageHospitalsForm.jsx
└─ OrganizationAnalytics.jsx

Step 5: Update existing code
├─ Add organization_id checks
├─ Add data filtering by org
├─ Update API endpoints
└─ Add access control

Step 6: Create organization management
├─ Create organization
├─ Edit organization
├─ Delete organization
├─ View all org hospitals
└─ View org analytics
```

---

## 🎯 BENEFITS OF THIS SYSTEM

```
For Super Admin (MacvaarAI):
✅ Can manage multiple organizations
✅ Scale to 100+ organizations
✅ Separate billing per org
✅ Easy monitoring
✅ Complete control

For Organization Admin (Vijay Care):
✅ Can manage multiple hospitals
✅ Only see their data
✅ Control all their hospitals
✅ Own dashboard
✅ Own analytics

For Hospital Admin:
✅ Same as current system
✅ Still have full hospital access
✅ Add to better organization

For Patients/Doctors:
✅ Transparent hierarchy
✅ Know which organization owns hospital
✅ Better trust
```

---

## 📌 REMEMBER

```
This is a FUTURE feature!

When ready to implement:
1. Come back to this document
2. Follow the steps
3. Create the tables
4. Create the login/dashboards
5. Test thoroughly

Status: ⏳ PLANNED
Cost: $0 (all custom code)
Time: 3-5 days of development
Complexity: Medium-High
```

---

**Ready to implement whenever you are!** 🚀
