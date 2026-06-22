# 🏗️ THREE-TIER ARCHITECTURE - Complete System Structure

## 📊 SYSTEM HIERARCHY

```
┌──────────────────────────────────────────────────────┐
│     MACVAAR MAIN PORTAL (Official)                   │
│     ├─ Create Organizations                          │
│     ├─ Manage All Organizations                      │
│     ├─ View Analytics                                │
│     └─ System Settings                               │
└──────────────────┬───────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┐
        │          │          │          │
        ↓          ↓          ↓          ↓
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ Vijay  │ │  BJP   │ │ Modi   │ │  CBN   │
    │ Care   │ │  Care  │ │ Care   │ │  Care  │
    │Portal  │ │Portal  │ │Portal  │ │Portal  │
    └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘
         │          │          │          │
    ┌────┴────┬─────┘          │          │
    │         │                │          │
    ↓         ↓                ↓          ↓
Hospital 1  Hospital 2    Hospital 3  Hospital 4
Portal      Portal        Portal      Portal
(Vijay)     (Vijay)       (BJP)       (Modi)
```

---

## 🔐 TIER 1: MACVAAR MAIN PORTAL

### **Purpose:**
- MacvaarAI official administration
- Create new organizations
- Manage all organizations
- View system-wide analytics
- Control access

### **Features:**

**Dashboard:**
```
✅ Welcome: "MacvaarAI Official Portal"
✅ Statistics:
   - Total Organizations: 4
   - Total Hospitals: 100+
   - Total Patients: 20,000+
✅ Organization Cards (All 4):
   - Vijay Care (15 hospitals)
   - BJP Care (25 hospitals)
   - Modi Healthcare (50 hospitals)
   - CBN Care (12 hospitals)

✅ Tabs:
   - 📊 Dashboard (Welcome + Stats)
   - 🏢 Organizations (Manage all)
   - ⚙️ Settings
   - 📈 Analytics
```

**Manage Organizations:**
```
✅ View all organizations
✅ Add new organization:
   - Organization name
   - Owner name & email
   - Logo upload
   - Initial settings
✅ Edit organization details
✅ View organization hospitals
✅ View organization stats
✅ Delete organization
✅ Deactivate/Activate organization
```

**Access Control:**
```
✅ MacvaarAI Admin only
✅ Login: hero_admin_001
✅ Super admin key required
✅ Full system control
```

---

## 🏢 TIER 2: ORGANIZATION PORTALS (Vijay, BJP, Modi, CBN)

### **Purpose:**
- Organization CM/Owner management
- Hospital management
- Access control
- Features: AI models, feedback, support
- Finance and subscriptions

### **Vijay Care Portal Example:**

**Header:**
```
[Vijay Logo (Round)] VIJAY CARE
Organization Admin Portal
Owner: Vijay Kumar
Email: vijay@vijaycare.com
```

**Dashboard:**
```
Statistics Cards:
├─ Total Hospitals: 15
├─ Total Patients: 3,450
├─ Total Beds: 2,500
└─ Total Doctors: 280

Quick Actions:
├─ [Add Hospital]
├─ [Manage Hospitals]
├─ [View Analytics]
└─ [Manage Users]
```

**Tabs:**

**1. 📊 Dashboard**
```
✅ Organization overview
✅ Statistics (hospitals, patients, doctors)
✅ Recent activities
✅ Quick actions
```

**2. 🏥 Hospitals Management**
```
✅ List all hospitals under organization
✅ Add new hospital:
   - Hospital name
   - Location
   - Number of beds
   - Logo upload
   - Contact info
✅ Edit hospital details
✅ View hospital stats
✅ Grant/Revoke hospital access
✅ Manage hospital admins
✅ Delete hospital
```

**3. 💊 AI Models**
```
✅ View available AI models (12 total)
✅ Purchase premium models:
   - Eye Disease Detection (₹5000/year)
   - COVID-19 Detection (₹5000/year)
   - ECG Analysis (₹5000/year)
   - Skin Cancer Detection (₹5000/year)
   - Breast Cancer Detection (₹5000/year)
   - TB Detection (₹5000/year)
   - Stroke Prediction (₹5000/year)
✅ Free models included:
   - Diabetes Detection
   - Pneumonia Detection
   - Malaria Detection
   - Dengue Detection
   - Kidney Disease Detection

✅ Manage which hospitals have access
✅ View usage statistics
✅ Configure model settings
✅ View model performance
```

**4. 👥 Users & Access**
```
✅ Add hospital administrators:
   - Name
   - Email
   - Phone
   - Hospital assignment
   - Role (Admin, Manager, etc.)

✅ Manage user permissions:
   - Give hospital access
   - Remove hospital access
   - Change roles

✅ View active users
✅ Deactivate users
✅ Reset passwords
```

**5. 💬 Feedback & Support**
```
✅ View all feedback from hospitals:
   - Subject
   - Type (Suggestion, Bug, Feature Request)
   - Priority
   - Status
   - Response from MacvaarAI

✅ View support tickets:
   - Issue description
   - Status (Open, In Progress, Resolved)
   - Priority
   - Assigned to
   - Timeline

✅ Send message to MacvaarAI support
✅ Track support status
```

**6. 💰 Finance**
```
✅ Subscription management:
   - Current subscription
   - Renewal date
   - Payment method

✅ Model purchases:
   - View purchased models
   - Renewal dates
   - Cost tracking

✅ Billing history:
   - Invoice listing
   - Payment receipts
   - Download invoices

✅ Payment details:
   - Update payment method
   - Billing address
```

**7. ⚙️ Settings**
```
✅ Organization settings:
   - Organization name
   - Owner details
   - Logo
   - Contact information

✅ Access control:
   - Who can create hospitals
   - Who can purchase models
   - Who can manage users

✅ Notifications:
   - Email alerts
   - Feedback notifications
   - Support ticket alerts

✅ Security:
   - Change password
   - Two-factor auth
```

---

## 🏥 TIER 3: HOSPITAL PORTALS (Enhanced)

### **Purpose:**
- Hospital staff management
- Patient management
- Use AI models (granted access)
- Submit feedback & support
- View organization information

### **Hospital Portal Header:**

**BEFORE (Current):**
```
[Hospital Logo] Apollo Hospital
Hospital Admin Portal
```

**AFTER (Enhanced):**
```
[Organization Logo (Round)] [Hospital Logo (Round)]
VIJAY CARE > Apollo Hospital  [Organization Name]
Hospital Admin Portal
```

### **Enhanced Features:**

**1. Dashboard Tab**
```
✅ Hospital branding:
   - Organization logo (top left, round)
   - Organization name display
   - Hospital name
   - Hospital logo

✅ Statistics:
   - Patients
   - Appointments
   - AI Reports
   - Admins

✅ Organization info card:
   - Organization: Vijay Care
   - Owner: Vijay Kumar
   - Support email
   - Contact info
```

**2. AI Models Tab (With Access Control)**
```
✅ Show ONLY models granted by organization:
   - If organization purchased "Eye Disease": Show it
   - If organization didn't purchase "Skin Cancer": Hide it
   - Free models: Always available

✅ Model usage tracking:
   - How many times used this month
   - Quota remaining
   - Organization model status

✅ Use model:
   - Upload image
   - Get diagnosis
   - Save report
```

**3. All Other Tabs**
```
✅ Keep existing functionality
✅ Add organization name everywhere:
   - Page headers
   - Reports
   - Feedback

✅ Add round logos:
   - Organization logo (navigation bar)
   - Hospital logo (in cards)
   - Profile areas
```

### **Hospital Portal Color/Branding:**

```
Vijay Care Hospital:
├─ Primary color: Yellow/Gold
├─ Organization logo: Vijay.jpeg
└─ All pages branded with Vijay theme

BJP Care Hospital:
├─ Primary color: Orange/Saffron
├─ Organization logo: BJP.jpeg
└─ All pages branded with BJP theme

Modi Healthcare Hospital:
├─ Primary color: Blue
├─ Organization logo: Modi.jpeg
└─ All pages branded with Modi theme

CBN Care Hospital:
├─ Primary color: Blue
├─ Organization logo: CBN.jpg
└─ All pages branded with CBN theme
```

---

## 🔄 USER FLOWS

### **Flow 1: Create Organization (MacvaarAI Admin)**

```
MacvaarAI Portal Login
    ↓
Click [Add Organization]
    ↓
Form:
  - Name: "Vijay Care"
  - Owner: "Vijay Kumar"
  - Email: "vijay@vijaycare.com"
  - Logo: [Upload]
    ↓
✅ Organization created
✅ Organization Portal ready
✅ Access token generated
    ↓
Send token to Vijay Kumar
```

### **Flow 2: Organization Owner Adds Hospital (Vijay Care Admin)**

```
Vijay Care Portal Login
    ↓
Click [Add Hospital]
    ↓
Form:
  - Name: "Apollo Hospital"
  - Location: "Mumbai"
  - Beds: 200
  - Logo: [Upload]
    ↓
✅ Hospital created
✅ Hospital Portal ready
✅ Access token generated
    ↓
Send token to Hospital Admin
```

### **Flow 3: Purchase AI Models (Vijay Care Admin)**

```
Vijay Care Portal
    ↓
Click [AI Models] tab
    ↓
See Free Models: ✅ (Diabetes, Pneumonia, etc.)
See Premium Models: ❌ (Locked)
    ↓
Click [Purchase] on Eye Disease
    ↓
Confirm Purchase (₹5000/year)
    ↓
✅ Model purchased
✅ All hospitals in Vijay Care can now use it
    ↓
Hospital sees model in their portal
```

### **Flow 4: Hospital Admin Uses AI Model (Apollo Hospital)**

```
Hospital Portal Login
    ↓
Click [AI Models] tab
    ↓
See models granted by Vijay Care:
├─ Eye Disease Detection ✅ (Purchased by Vijay)
├─ Diabetes Detection ✅ (Free)
├─ COVID-19 ❌ (Not purchased)
└─ etc.
    ↓
Click [Eye Disease Detection]
    ↓
Upload image
    ↓
Get diagnosis
    ↓
Save report
```

### **Flow 5: Feedback Management**

```
Hospital Admin
    ↓
Click [Feedback] in Hospital Portal
    ↓
Submit feedback to Vijay Care organization
    ↓
↓
Vijay Care Admin
    ↓
Sees feedback in [Feedback & Support] tab
    ↓
Responds to hospital
    ↓
↓
Hospital sees response in their feedback section
```

---

## 📁 ROUTING STRUCTURE

```
TIER 1: MacvaarAI Portal
├─ /macvaar/login
├─ /macvaar/dashboard
├─ /macvaar/organizations
├─ /macvaar/settings
└─ /macvaar/analytics

TIER 2: Organization Portals
├─ /org/login
├─ /org/{org_id}/dashboard
├─ /org/{org_id}/hospitals
├─ /org/{org_id}/ai-models
├─ /org/{org_id}/users
├─ /org/{org_id}/feedback
├─ /org/{org_id}/finance
└─ /org/{org_id}/settings

TIER 3: Hospital Portals
├─ /hospital/login
├─ /hospital/{hospital_id}/dashboard
├─ /hospital/{hospital_id}/ai-models
├─ /hospital/{hospital_id}/patients
├─ /hospital/{hospital_id}/appointments
├─ /hospital/{hospital_id}/reports
├─ /hospital/{hospital_id}/admins
├─ /hospital/{hospital_id}/feedback
└─ /hospital/{hospital_id}/settings
```

---

## 🔐 ACCESS CONTROL

```
MacvaarAI Admin:
└─ Can access everything
   ├─ Create organizations
   ├─ Manage organizations
   ├─ View all data
   └─ System settings

Organization Owner (Vijay CM):
└─ Can access Vijay Care only
   ├─ Add hospitals
   ├─ Manage hospitals
   ├─ Purchase AI models
   ├─ Manage staff
   ├─ View feedback
   └─ Manage finance

Organization Owner (BJP Leader):
└─ Can access BJP Care only
   ├─ Add hospitals
   ├─ Manage hospitals
   └─ (same as above)

Hospital Admin (Apollo):
└─ Can access Apollo Hospital only
   ├─ Manage patients
   ├─ Use AI models (if granted)
   ├─ View reports
   ├─ Send feedback
   └─ Manage staff
```

---

## 📊 DATABASE SCHEMA

```
Tables Needed:

organizations
├─ id
├─ name
├─ owner_id
├─ logo_url
├─ status
└─ created_at

hospitals
├─ id
├─ organization_id
├─ name
├─ logo_url
├─ beds
├─ location
└─ created_at

users
├─ id
├─ email
├─ password
├─ role (admin, org_owner, hospital_admin)
├─ organization_id
├─ hospital_id
└─ created_at

ai_models
├─ id
├─ name
├─ price
├─ type (free/premium)
└─ created_at

organization_models
├─ id
├─ organization_id
├─ model_id
├─ purchased_date
├─ renewal_date
└─ status

hospital_feedback
├─ id
├─ hospital_id
├─ organization_id
├─ subject
├─ type
├─ message
├─ status
└─ created_at
```

---

## ✨ COMPLETE SYSTEM

```
USER ROLES:

1. MacvaarAI Admin
   └─ Create & manage organizations
   └─ View all system data
   └─ System-wide settings

2. Organization Owner (CM, Leader)
   └─ Manage hospitals in organization
   └─ Purchase AI models
   └─ Manage organization staff
   └─ View feedback from hospitals
   └─ Manage finance & subscriptions

3. Hospital Admin
   └─ Manage patients
   └─ Use granted AI models
   └─ View reports
   └─ Send feedback to organization
   └─ Manage hospital staff

4. Hospital Doctor
   └─ View assigned patients
   └─ Use AI models
   └─ View patient records
   └─ Add diagnosis notes

5. Hospital Patient
   └─ View own medical records
   └─ View AI diagnosis results
   └─ Book appointments
```

---

## 🎯 IMPLEMENTATION PHASES

**Phase 1: MacvaarAI Portal**
- Create main admin portal
- Organization management
- User login/authentication

**Phase 2: Organization Portals**
- Create organization-specific dashboards
- Hospital management
- AI model purchase system
- Feedback system

**Phase 3: Enhance Hospital Portals**
- Add round logos
- Add organization branding
- Add organization information
- Access control for AI models

**Phase 4: Complete Integration**
- Connect all three tiers
- Test end-to-end flows
- Security audit
- Deployment

---

This is the complete three-tier architecture ready for implementation!
