# 🎥 Vijay Care Video Demo Script

## **PART 1: ADMIN DASHBOARD INTRO (2 min)**

```
"Welcome to Vijay Care Admin Portal - the complete healthcare AI management system.

This is where super admins manage:
✅ Organizations (Vijay Care, Modi Care, BJP Care, CBN Care)
✅ Hospitals under each organization
✅ 18 Premium AI diagnostic models
✅ Hospital access tokens
✅ User permissions and roles

Let me show you how it works..."
```

---

## **PART 2: NAVIGATE DASHBOARD (1 min)**

### **Show Dashboard Tab:**
```
"Here's the main dashboard. You can see:
- Total hospitals registered
- Total organizations
- Total users in system
- Overall system status

All data is real-time and updates as new hospitals are added."
```

### **Show Top Navigation:**
```
"Five main tabs for admin:

1. Dashboard - Overview & quick stats
2. Organizations - Manage all organizations
3. Hospitals - Manage all hospitals
4. AI Models - Manage all AI models
5. Support - View support tickets and feedback"
```

---

## **PART 3: ORGANIZATIONS (2 min)**

### **Show Organizations Tab:**
```
"Click on Organizations tab.

This shows all 4 organizations:
- Vijay Care (logo, email, phone)
- Modi Care
- BJP Care
- CBN Care

Each organization has:
✅ Logo display
✅ Contact information
✅ Number of hospitals
✅ Number of patients
✅ Status (Active)
✅ Access Token button
✅ Edit / Delete options"
```

### **Copy Organization Token:**
```
"Click 'Copy Token' button to copy the organization's access token.

This token allows the organization admin to login to their dashboard:
http://localhost:5173/vijay-care-org/login

They paste the token and get access to their portal."
```

### **Edit Organization:**
```
"Click Edit to modify:
- Organization name
- Email and contact details
- Address
- Admin information
- Select which AI models this org has access to

All 12 models available:
Eye AI, COVID-19 AI, ECG AI, Skin AI, TB AI, 
Diabetes AI, Pneumonia AI, Malaria AI, Dengue AI, 
Stroke AI, Kidney AI, Throat AI"
```

---

## **PART 4: HOSPITALS (3 min)**

### **Show Hospitals Tab:**
```
"Click on Hospitals tab.

This shows ALL hospitals registered in the system:
- Hospital name with logo
- Email
- Phone
- Number of doctors
- Number of beds
- Allocated models count
- Access token column
- Edit/Delete/Copy buttons

Each hospital has unique:
✅ Logo (matches hospital type)
✅ Access token (copied to clipboard)
✅ Model allocation
✅ Admin credentials"
```

### **Add New Hospital (Demo Flow):**
```
"Click '+Add Hospital' button.

Form fields to fill:
HOSPITAL DETAILS:
- Hospital Name
- Email
- Phone  
- Address
- City, State, ZIP Code

ADMIN DETAILS:
- Admin Name
- Admin Email

CAPACITY:
- Number of Doctors
- Number of Beds

MODEL ALLOCATION:
- Check which models this hospital can use
- Shows all 12 Premium models ($$$$$)
- Each model listed with price"
```

### **Save Hospital:**
```
"After filling all fields, click:
'Create Hospital & Generate Token'

System automatically:
✅ Creates hospital record in database
✅ Generates unique access token
✅ Assigns models
✅ Shows success message with token

This token is used by hospital admin to login:
http://localhost:5173/hospital/login"
```

### **Copy Hospital Token:**
```
"In the Access Token column, you see:
- Hospital logo
- Token text (in gray box)
- 'Copy Token' button

Click to copy token to clipboard.
Hospital admin can now use this to login."
```

### **Edit Hospital:**
```
"Click Edit icon (pencil).

Can modify:
- Hospital name
- Email/phone
- Address/location
- Admin details
- Add/remove model access
- Number of beds/doctors

Click Save to update."
```

---

## **PART 5: AI MODELS (2 min)**

### **Show AI Models Tab:**
```
"Click on AI Models tab.

Shows all 18 Premium AI models:
- Model name with emoji icon
- Description (what it detects)
- Input type (Image/Data)
- Output labels (possible predictions)
- Model type (Classification/Detection)
- Price: $$$$$ (all premium)
- Status: Active
- Edit/Delete buttons"
```

### **Show Model Details:**
```
"Here are the 18 models:

IMAGING MODELS:
1. 👁️ Eye Disease Detection AI
   Detects diabetic retinopathy in retinal images

2. 🦠 COVID-19 Detection AI
   Analyzes chest X-rays for COVID

3. ❤️ ECG Analysis AI
   Analyzes 12-lead ECG readings

4. 🩹 Skin Cancer Detection AI
   Classifies skin lesions (melanoma detection)

5. 🫁 Tuberculosis Detection AI
   Detects TB from chest X-rays

And 13 more...

All models use:
✅ Transfer Learning (MobileNetV2)
✅ Pre-trained on medical datasets
✅ Real-time predictions
✅ Confidence scores"
```

---

## **PART 6: HOSPITAL PORTAL LOGIN (2 min)**

### **Show Hospital Login URL:**
```
"Now let me show you how a hospital admin uses this system.

URL: http://localhost:5173/hospital/login

They enter their hospital access token from the admin dashboard.
Click 'Access Hospital Portal'
They're logged into their hospital dashboard."
```

### **Show Hospital Dashboard Features:**
```
"Once logged in, hospital admin can:

✅ Dashboard Tab
   - Hospital overview
   - Patient statistics
   - Models available
   - Recent activity

✅ AI Models Tab
   - View allocated models
   - Click model to open AI diagnostic chatbot
   - Upload image or paste image URL
   - Get AI prediction with confidence score
   - Save results

✅ Hospital Settings
   - Manage hospital info
   - View hospital token
   - Manage staff"
```

---

## **PART 7: AI MODEL DEMO (3 min)**

### **Show Model Diagnostic Chatbot:**
```
"Click on any AI model (e.g., Eye Disease Detection AI).

Modal opens with:
✅ Model name & description
✅ Input type (Image/Data)
✅ File upload button
✅ Image URL input field
✅ Image preview area

Steps to use:
1. Upload medical image or paste image URL
2. Click 'Analyze Image'
3. Model processes in real-time
4. Shows result in green box:
   ✅ DIAGNOSIS: [disease detected]
   📊 Confidence: [percentage]%
   📝 Summary: [detailed explanation]"
```

### **Show Prediction Result:**
```
"Result displayed in green gradient box:

Example Output:
✅ DIAGNOSIS: Diabetic Retinopathy
📊 Confidence: 94.5%
📝 Summary: High-risk diabetic retinopathy detected.
          Recommend immediate ophthalmology consultation.

Features:
- Color-coded (green = positive finding)
- Shows confidence percentage
- Provides clinical summary
- All models follow same format"
```

---

## **PART 8: ORGANIZATION PORTAL (2 min)**

### **Show Organization Login:**
```
"Organizations can also have their own portal.

URL: http://localhost:5173/vijay-care-org/login

Organization admin enters token and gets:
✅ Organization Dashboard
✅ Hospital Management
✅ Model Allocation
✅ Staff Management
✅ Reports & Analytics"
```

### **Show Organization Dashboard:**
```
"Organization admins can:

1. VIEW all their hospitals
2. ADD new hospitals
3. MANAGE hospital access
4. ALLOCATE models to each hospital
5. VIEW analytics across all hospitals
6. MANAGE staff
7. VIEW support tickets"
```

---

## **PART 9: KEY FEATURES SUMMARY (1 min)**

```
"Key features of Vijay Care Admin System:

🔐 SECURITY:
   - Token-based access
   - Role-based permissions
   - Multi-tenant architecture
   - Each hospital has unique access

🏥 MULTI-TENANT:
   - Multiple organizations
   - Multiple hospitals per org
   - Hospitals see only their models
   - Complete data isolation

🤖 18 AI MODELS:
   - All premium ($$$$$)
   - Real-time predictions
   - High accuracy (uses transfer learning)
   - Medical-grade output

📊 ANALYTICS:
   - Hospital dashboard with stats
   - Patient records
   - Model usage tracking
   - Performance reports

🌙 DARK THEME:
   - Easy on eyes for long use
   - Yellow accent colors
   - Professional appearance
   - Mobile responsive"
```

---

## **PART 10: CLOSING (30 sec)**

```
"That's the complete Vijay Care Admin System.

To summarize:
✅ Super admins manage entire system
✅ Organizations manage their hospitals
✅ Hospitals use AI models
✅ All powered by 18 premium AI models
✅ Secure token-based access
✅ Real-time predictions

Available 24/7 at:
http://localhost:5173/admin/dashboard

Thank you for watching!"
```

---

## **TIMING SUMMARY**
- Part 1: 2 min - Intro
- Part 2: 1 min - Navigation
- Part 3: 2 min - Organizations
- Part 4: 3 min - Hospitals
- Part 5: 2 min - AI Models
- Part 6: 2 min - Hospital Login
- Part 7: 3 min - AI Model Demo
- Part 8: 2 min - Organization Portal
- Part 9: 1 min - Key Features
- Part 10: 0.5 min - Closing

**TOTAL: ~18.5 minutes**

---

## **RECORDING TIPS**

✅ Record at 1920x1080 resolution
✅ Slow your mouse movements
✅ Click buttons clearly
✅ Pause for 1-2 seconds between major sections
✅ Use screen capture software (OBS, Camtasia, etc)
✅ Add captions/subtitles later
✅ Background music optional
✅ Speak clearly and at moderate pace

---

**Ready to record! 🎬**
