# 🏢 ADD 4 ORGANIZATIONS - EACH WITH DIFFERENT MODELS

## Complete Step-by-Step Guide

---

## ✅ **ORGANIZATION 1: Vijay Care**

### Step 1: Click "Add Organization" Button
- Green button in top right of Organizations tab

### Step 2: Fill Organization Information
```
Organization Name: Vijay Care
Email:            admin@vijaycare.com
Phone:            +91-98765-43210
Address:          123 Healthcare Lane
City:             Chennai
State:            Tamil Nadu
Zip Code:         600001
Number of Hospitals: 3
```

### Step 3: Select Models for Vijay Care
**Check 4 models:**

```
Scroll to "Select AI Models to Grant Access"

✅ Eye Disease Detection
✅ COVID-19 Detection
✅ Diabetes Prediction
✅ Pneumonia Detection

Leave UNCHECKED:
❌ ECG Analysis
❌ Skin Cancer Detection
❌ Tuberculosis Detection
❌ Throat Analysis
❌ Lung Analysis
❌ Colorectal Cancer
❌ Stroke Prediction
❌ Malaria Detection
❌ Dengue Detection
❌ Kidney Disease
❌ Ear Infection
❌ Nasal Polyp
❌ Oral Cancer
❌ Pharyngitis Detection
```

### Step 4: Click "Create Organization & Generate Token"
- Wait for success message
- **Copy the token**
- **Save it!**

**Token for Vijay Care:** `ORG_VIJAY_CARE_a1b2c3d4`

---

## ✅ **ORGANIZATION 2: COVID Response Team**

### Step 1: Click "Add Organization" Again

### Step 2: Fill Organization Information
```
Organization Name: COVID Response Team
Email:            admin@covidresponse.com
Phone:            +91-97654-32109
Address:          456 Medical Plaza
City:             Chennai
State:            Tamil Nadu
Zip Code:         600002
Number of Hospitals: 5
```

### Step 3: Select DIFFERENT Models for COVID Response
**Check 4 different models than Vijay Care:**

```
Scroll to "Select AI Models to Grant Access"

✅ COVID-19 Detection
✅ Pneumonia Detection
✅ Tuberculosis Detection
✅ Malaria Detection

Leave UNCHECKED:
❌ Eye Disease Detection (Vijay Care has this)
❌ Diabetes Prediction (Vijay Care has this)
❌ ECG Analysis
❌ Skin Cancer Detection
❌ Throat Analysis
❌ Lung Analysis
❌ Colorectal Cancer
❌ Stroke Prediction
❌ Dengue Detection
❌ Kidney Disease
❌ Ear Infection
❌ Nasal Polyp
❌ Oral Cancer
❌ Pharyngitis Detection
```

### Step 4: Click "Create Organization & Generate Token"
- Wait for success message
- **Copy the token**
- **Save it!**

**Token for COVID Response:** `ORG_COVID_RESPONSE_TEAM_xxxx`

---

## ✅ **ORGANIZATION 3: Diagnostic Excellence**

### Step 1: Click "Add Organization" Again

### Step 2: Fill Organization Information
```
Organization Name: Diagnostic Excellence
Email:            admin@diagnostic.com
Phone:            +91-96543-21098
Address:          789 Wellness Center
City:             Chennai
State:            Tamil Nadu
Zip Code:         600003
Number of Hospitals: 2
```

### Step 3: Select MORE Models for Diagnostic Excellence
**Check 7 models - Mix of others:**

```
Scroll to "Select AI Models to Grant Access"

✅ Eye Disease Detection
✅ COVID-19 Detection
✅ Pneumonia Detection
✅ Malaria Detection
✅ Diabetes Prediction
✅ Dengue Detection
✅ Skin Cancer Detection

Leave UNCHECKED:
❌ ECG Analysis
❌ Tuberculosis Detection (COVID Response has this)
❌ Throat Analysis
❌ Lung Analysis
❌ Colorectal Cancer
❌ Stroke Prediction
❌ Kidney Disease
❌ Ear Infection
❌ Nasal Polyp
❌ Oral Cancer
❌ Pharyngitis Detection
```

### Step 4: Click "Create Organization & Generate Token"
- Wait for success message
- **Copy the token**
- **Save it!**

**Token for Diagnostic Excellence:** `ORG_DIAGNOSTIC_EXCELLENCE_yyyy`

---

## ✅ **ORGANIZATION 4: Premier Healthcare Network**

### Step 1: Click "Add Organization" Again

### Step 2: Fill Organization Information
```
Organization Name: Premier Healthcare Network
Email:            admin@premierhealthcare.com
Phone:            +91-95432-10987
Address:          999 Medical Complex
City:             Chennai
State:            Tamil Nadu
Zip Code:         600004
Number of Hospitals: 8
```

### Step 3: Select ALL 18 Models for Premier Healthcare
**Check ALL models - Premium access:**

```
Scroll to "Select AI Models to Grant Access"

✅ Eye Disease Detection
✅ COVID-19 Detection
✅ ECG Analysis
✅ Skin Cancer Detection
✅ Tuberculosis Detection
✅ Throat Analysis
✅ Lung Analysis
✅ Colorectal Cancer
✅ Stroke Prediction
✅ Diabetes Prediction
✅ Pneumonia Detection
✅ Malaria Detection
✅ Dengue Detection
✅ Kidney Disease
✅ Ear Infection
✅ Nasal Polyp
✅ Oral Cancer
✅ Pharyngitis Detection

(Check ALL boxes)
```

### Step 4: Click "Create Organization & Generate Token"
- Wait for success message
- **Copy the token**
- **Save it!**

**Token for Premier Healthcare:** `ORG_PREMIER_HEALTHCARE_NETWORK_zzzz`

---

## 📋 **SUMMARY - 4 ORGANIZATIONS**

| Organization | Models | URL | Token |
|--------------|--------|-----|-------|
| **Vijay Care** | 4 models | `/vijay-care-org/login` | `ORG_VIJAY_CARE_a1b2c3d4` |
| **COVID Response** | 4 models | `/covid-response-org/login` | `ORG_COVID_RESPONSE_TEAM_xxxx` |
| **Diagnostic** | 7 models | `/diagnostic-excellence-org/login` | `ORG_DIAGNOSTIC_EXCELLENCE_yyyy` |
| **Premier** | 18 models | `/premier-healthcare-org/login` | `ORG_PREMIER_HEALTHCARE_NETWORK_zzzz` |

---

## 🧪 **TESTING EACH ORGANIZATION**

### **Test Vijay Care Organization**
```
1. Go to: http://localhost:5173/vijay-care-org/login
2. Paste token: ORG_VIJAY_CARE_a1b2c3d4
3. Should see 4 models:
   ✅ Eye Disease Detection
   ✅ COVID-19 Detection
   ✅ Diabetes Prediction
   ✅ Pneumonia Detection
   ❌ Tuberculosis, Malaria, etc. hidden
4. Click any model
5. Upload image
6. Get prediction ✅
```

### **Test COVID Response Organization**
```
1. Go to: http://localhost:5173/covid-response-org/login
2. Paste token: ORG_COVID_RESPONSE_TEAM_xxxx
3. Should see 4 DIFFERENT models:
   ✅ COVID-19 Detection
   ✅ Pneumonia Detection
   ✅ Tuberculosis Detection
   ✅ Malaria Detection
   ❌ Eye, Diabetes hidden (Vijay Care has these)
4. Click any model
5. Upload image
6. Get prediction ✅
```

### **Test Diagnostic Excellence Organization**
```
1. Go to: http://localhost:5173/diagnostic-excellence-org/login
2. Paste token: ORG_DIAGNOSTIC_EXCELLENCE_yyyy
3. Should see 7 models:
   ✅ Eye Disease Detection
   ✅ COVID-19 Detection
   ✅ Pneumonia Detection
   ✅ Malaria Detection
   ✅ Diabetes Prediction
   ✅ Dengue Detection
   ✅ Skin Cancer Detection
   ❌ ECG, TB, Kidney, etc. hidden
4. Click any model
5. Upload image
6. Get prediction ✅
```

### **Test Premier Healthcare Organization (Premium)**
```
1. Go to: http://localhost:5173/premier-healthcare-org/login
2. Paste token: ORG_PREMIER_HEALTHCARE_NETWORK_zzzz
3. Should see ALL 18 models:
   ✅ ALL diagnostic models visible
4. Test 5+ different models
5. Upload images
6. Get predictions ✅
```

---

## 🎯 **ORGANIZATION MODELS BREAKDOWN**

### **Vijay Care (4 Models)**
- Eye Disease Detection
- COVID-19 Detection
- Diabetes Prediction
- Pneumonia Detection

### **COVID Response Team (4 Different Models)**
- COVID-19 Detection
- Pneumonia Detection
- Tuberculosis Detection
- Malaria Detection

### **Diagnostic Excellence (7 Models - Mix)**
- Eye Disease Detection
- COVID-19 Detection
- Pneumonia Detection
- Malaria Detection
- Diabetes Prediction
- Dengue Detection
- Skin Cancer Detection

### **Premier Healthcare Network (18 Models - ALL)**
- Eye Disease Detection
- COVID-19 Detection
- ECG Analysis
- Skin Cancer Detection
- Tuberculosis Detection
- Throat Analysis
- Lung Analysis
- Colorectal Cancer
- Stroke Prediction
- Diabetes Prediction
- Pneumonia Detection
- Malaria Detection
- Dengue Detection
- Kidney Disease
- Ear Infection
- Nasal Polyp
- Oral Cancer
- Pharyngitis Detection

---

## ✅ **CHECKLIST**

### **Adding Organizations**
- [ ] Added Vijay Care with 4 models
- [ ] Added COVID Response with 4 different models
- [ ] Added Diagnostic Excellence with 7 models
- [ ] Added Premier Healthcare with all 18 models
- [ ] Each shows correct model count in list
- [ ] Copied all 4 tokens and saved

### **Testing Organizations**
- [ ] Vijay Care: Login works, see 4 models
- [ ] COVID Response: Login works, see 4 different models
- [ ] Diagnostic: Login works, see 7 models
- [ ] Premier: Login works, see all 18 models
- [ ] Each org can upload images and get predictions
- [ ] Model restrictions work correctly

---

## 📱 **URLS TO USE**

```
Admin Dashboard:
http://localhost:5173/admin/login

Organization Portals:
http://localhost:5173/vijay-care-org/login
http://localhost:5173/covid-response-org/login
http://localhost:5173/diagnostic-excellence-org/login
http://localhost:5173/premier-healthcare-org/login
```

---

## 💾 **SAVE THESE TOKENS**

```
Vijay Care:
Token: ORG_VIJAY_CARE_a1b2c3d4
Models: 4

COVID Response Team:
Token: ORG_COVID_RESPONSE_TEAM_xxxx
Models: 4

Diagnostic Excellence:
Token: ORG_DIAGNOSTIC_EXCELLENCE_yyyy
Models: 7

Premier Healthcare Network:
Token: ORG_PREMIER_HEALTHCARE_NETWORK_zzzz
Models: 18
```

---

**Follow this guide to add all 4 organizations with different model access levels!** ✅
