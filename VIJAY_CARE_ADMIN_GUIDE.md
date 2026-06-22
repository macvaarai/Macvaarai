# 🏥 Vijay Care Admin Portal - Complete Guide

## 📍 **ACCESS PORTAL**

### **Admin Login**
```
URL: http://localhost:5173/admin/dashboard
Role: Super Admin (Hero Admin)
Access: All organizations, hospitals, models, users
```

---

## 🎯 **MAIN FEATURES**

### **1️⃣ DASHBOARD TAB**
- **Overview Statistics:**
  - Total Hospitals
  - Total Organizations  
  - Total Users
  - System Status

- **Quick Actions:**
  - Add new hospital
  - Add new organization
  - View system health
  - Recent activity log

---

### **2️⃣ ORGANIZATIONS TAB**
**Manage all healthcare organizations**

#### **View Organizations:**
- Vijay Care
- Modi Care
- BJP Care
- CBN Care

#### **For Each Organization:**
- ✅ Organization Name & Logo
- ✅ Email & Contact Info
- ✅ Number of Hospitals
- ✅ Number of Patients
- ✅ Status (Active/Inactive)
- ✅ Access Token (copy button)
- ✅ Edit / Delete options

#### **Add New Organization:**
```
Click: "+ Add Organization" button
Fill:
  - Organization Name
  - Email
  - Phone
  - Address
  - City, State, ZIP
  - Admin Name & Email
  - Select Models (12 available)
  
System generates: Access Token automatically
```

#### **Edit Organization:**
```
Click: Edit icon
Modify any details
Update model allocation
Click: Save Organization
```

#### **Organization Models (12 Premium):**
- Eye Disease Detection AI - $$$$$
- COVID-19 Detection AI - $$$$$
- ECG Analysis AI - $$$$$
- Skin Cancer Detection AI - $$$$$
- Tuberculosis Detection AI - $$$$$
- Diabetes Detection AI - $$$$$
- Pneumonia Detection AI - $$$$$
- Malaria Detection AI - $$$$$
- Dengue Detection AI - $$$$$
- Stroke Prediction AI - $$$$$
- Kidney Disease Detection AI - $$$$$
- Breast Cancer Detection AI - $$$$$

---

### **3️⃣ HOSPITALS TAB**
**Manage all hospital registrations**

#### **View All Hospitals:**
- Hospital Name + Logo
- Email & Contact Phone
- Number of Doctors
- Number of Beds
- Allocated Models (count)
- Access Token
- Edit / Delete / Copy Token

#### **Hospital Details Shown:**
```
Hospital Name: [name with logo]
Email: [hospital email]
Phone: [contact number]
Address: [full address]
City: [city]
State: [state]
ZIP Code: [zip]
Admin Name: [hospital admin name]
Admin Email: [admin email]
Doctors: [number]
Beds: [number]
Allocated Models: [list with green badges]
Access Token: [unique token] - Copy button
```

#### **Add Hospital:**
```
Click: "+ Add Hospital" button
Fill Hospital Details:
  - Hospital Name
  - Email
  - Phone
  - Address, City, State, ZIP
  - Admin Name & Email
  - Number of Doctors
  - Number of Beds

Select Models:
  - Check models hospital can access
  - Show all 12 Premium models
  - Price display: $$$$$

Click: "Create Hospital & Generate Token"
System generates: Unique access token
```

#### **Edit Hospital:**
```
Click: Edit icon (pencil)
Modify:
  - Hospital details (name, email, phone, etc)
  - Model allocation (add/remove models)
  
Click: Save Hospital
Changes applied immediately
```

#### **Copy Hospital Token:**
```
Click: "Copy Token" button
Token text visible in gray box
Automatically copied to clipboard
"Copied!" message for 2 seconds
Hospital can use this token to login
```

#### **Delete Hospital:**
```
Click: Delete icon (trash)
Confirmation popup appears
Confirm deletion
Hospital removed from system
```

---

### **4️⃣ AI MODELS TAB**
**Manage all AI diagnostic models**

#### **Model Table Display:**
| Column | Content |
|--------|---------|
| # | Model number (1-18) |
| Model Name | Name + AI suffix |
| Description | What it detects |
| Input Type | Image/Data type |
| Output Labels | Possible predictions |
| Model Type | Classification/Detection |
| Price | $$$$$ (All Premium) |
| Status | Active/Inactive |
| Actions | Edit / Delete |

#### **All 18 AI Models:**
```
1. 👁️ Eye Disease Detection AI
   - Input: Retinal Image
   - Output: DR / No DR
   - Type: Binary Classification
   - Price: $$$$$

2. 🦠 COVID-19 Detection AI
   - Input: Chest X-ray
   - Output: COVID / Normal / Pneumonia
   - Type: Multi-class
   - Price: $$$$$

3. ❤️ ECG Analysis AI (12-Lead)
   - Input: ECG Image
   - Output: Normal / Abnormal / Arrhythmia
   - Type: Multi-class
   - Price: $$$$$

4. 🩹 Skin Cancer Detection AI
   - Input: Skin Image
   - Output: Melanoma / Benign / Basal Cell
   - Type: Multi-class
   - Price: $$$$$

5. 🫁 Tuberculosis Detection AI
   - Input: Chest X-ray
   - Output: TB / Normal / Suspicious
   - Type: Classification
   - Price: $$$$$

6. 🗣️ Throat Analysis AI
   - Input: Throat Image
   - Output: Normal / Infected / Inflamed
   - Type: Classification
   - Price: $$$$$

7. 🫁 Lung Disease Detection AI
   - Input: Chest Image
   - Output: Nodule / Normal / Suspicious
   - Type: Detection
   - Price: $$$$$

8. 🔬 Colorectal Cancer AI
   - Input: Histopathology Image
   - Output: 8 tissue types
   - Type: Multi-class Detection
   - Price: $$$$$

9. 🧠 Stroke Prediction AI
   - Input: Patient Data
   - Output: High/Medium/Low Risk
   - Type: Risk Prediction
   - Price: $$$$$

10. 💉 Diabetes Prediction AI
    - Input: Medical Data
    - Output: Diabetic / Pre-diabetic / Normal
    - Type: Classification
    - Price: $$$$$

11. 🫁 Pneumonia Detection AI
    - Input: Chest X-ray
    - Output: Pneumonia / Normal / Viral
    - Type: Classification
    - Price: $$$$$

12. 🦟 Malaria Detection AI
    - Input: Blood Smear Image
    - Output: Infected / Uninfected
    - Type: Binary
    - Price: $$$$$

13. 🦟 Dengue Detection AI
    - Input: Blood Test
    - Output: Dengue / Non-Dengue
    - Type: Binary
    - Price: $$$$$

14. 🏥 Kidney Disease AI
    - Input: Lab Results
    - Output: 6 severity stages
    - Type: Severity Classification
    - Price: $$$$$

15. 👂 Ear Infection Detection AI
    - Input: Ear Image
    - Output: Infected / Healthy / Inflamed
    - Type: Classification
    - Price: $$$$$

16. 👃 Nasal Polyp Detection AI
    - Input: Nasal Image
    - Output: Polyp / Normal / Deviated
    - Type: Detection
    - Price: $$$$$

17. 🦷 Oral Cancer Detection AI
    - Input: Mouth Image
    - Output: Cancer / Benign / Suspicious
    - Type: Classification
    - Price: $$$$$

18. 🗣️ Pharyngitis Detection AI
    - Input: Throat Image
    - Output: Bacterial / Viral / Normal
    - Type: Classification
    - Price: $$$$$
```

#### **Edit Model:**
```
Click: Edit icon
Modal opens with form:
  - Model Name (with AI suffix)
  - Description
  - Input Type
  - Output Labels (comma separated)
  - Model Type (dropdown)
  - Price ($$$$$ - all premium)

Click: Save Model
Changes applied
```

#### **Delete Model:**
```
Click: Delete icon
Confirmation popup
Confirm deletion
Model removed (if not allocated to any hospital)
```

---

### **5️⃣ SUPPORT TAB**
**View support tickets and feedback**

#### **Support Tickets Section:**
- List of support requests
- Status: Open / Resolved
- From: Hospital/User name
- Subject & Description
- Respond to ticket button
- Resolution form

#### **Feedback Section:**
- User feedback list
- Rating (stars)
- Subject & Message
- Response field

---

## 🔐 **SECURITY FEATURES**

### **Token-Based Access:**
```
Each Hospital:
  - Unique Access Token (generated automatically)
  - Token format: HSP-[ID]_TOKEN_[HEX]
  - Token status: Active/Inactive
  - Can be copied for sharing with hospital admin

Each Organization:
  - Unique Access Token (generated automatically)
  - Token format: ORG_[NAME]_[HEX]
  - Token status: Active/Inactive
```

### **Role-Based Access:**
```
Super Admin (You):
  - Create/Edit/Delete Organizations
  - Create/Edit/Delete Hospitals
  - Manage Models
  - View All Data

Organization Admin:
  - View their hospitals
  - Manage their hospitals
  - Allocate models to hospitals
  
Hospital Admin:
  - Access only their hospital portal
  - Use allocated AI models
  - Manage patients
  - View reports
```

---

## 📊 **DASHBOARD STATISTICS**

```
Total Hospitals: [count]
Total Organizations: [count]
Total Users: [count]
Total Admins: [count]
System Status: ✅ Active
```

---

## 🌐 **ORGANIZATION LOGIN URLS**

### **For Organizations:**
```
Vijay Care: http://localhost:5173/vijay-care-org/login
Modi Care: http://localhost:5173/modi-care-org/login
BJP Care: http://localhost:5173/bjp-care-org/login
CBN Care: http://localhost:5173/cbn-care-org/login
```

### **For Hospitals:**
```
Generic: http://localhost:5173/hospital/login
Specific Hospital: http://localhost:5173/[hospital-slug]-hospital/login
```

---

## 🎨 **THEME & DESIGN**

### **Color Scheme:**
- Background: Dark gray (gray-900)
- Accent: Yellow (yellow-500, yellow-400)
- Headers: Yellow gradient borders
- Buttons: Blue (blue-600)
- Status: Green (success), Red (error)

### **Logos:**
- Vijay Care: /logos/Vijay.jpeg
- Modi Care: /logos/Modi.jpeg
- BJP Care: /logos/BJP.jpeg
- CBN Care: /logos/CBN.jpg
- Kilpauk: /logos/Kilpauk.jpg
- TN Government: /logos/TN.jpg

---

## ⚙️ **SYSTEM ENDPOINTS**

### **Backend API Base:**
```
http://localhost:8000
```

### **Key Endpoints:**
```
GET  /admin/organizations
POST /admin/organizations
GET  /admin/hospitals
POST /admin/hospitals
GET  /admin/available-models
GET  /admin/all-models
```

---

## 📋 **COMMON TASKS**

### **Add New Hospital to Vijay Care:**
1. Go to Hospitals tab
2. Click "+ Add Hospital"
3. Fill hospital details
4. Select 5 models (e.g., Eye, COVID, ECG, Pneumonia, Diabetes)
5. Click "Create Hospital & Generate Token"
6. Copy token and share with hospital admin
7. Hospital admin uses token to login

### **Allocate Model to Organization:**
1. Go to Organizations tab
2. Click Edit on organization
3. Check/uncheck models in model allocation section
4. Click "Save Organization"
5. All hospitals under org now have access to allocated models

### **View Hospital Diagnostics:**
1. Go to Hospitals tab
2. Click on hospital row
3. View:
   - Patient records
   - AI predictions made
   - Reports generated
   - Model usage stats

---

## 📱 **RESPONSIVE DESIGN**

- Works on Desktop (Recommended: 1920x1080)
- Tablet support (iPad, Android tablets)
- Mobile view available (portrait mode)
- Dark theme optimized for all screens

---

## ✅ **READY TO USE**

**Video Recording Checklist:**
- ✅ Show admin dashboard overview
- ✅ Demo adding new hospital
- ✅ Show hospital token generation
- ✅ Explain organization management
- ✅ Demonstrate model allocation
- ✅ Show hospital login with token
- ✅ Demo AI model predictions
- ✅ Explain security & access control

---

**Good luck with your video! 🎥**
