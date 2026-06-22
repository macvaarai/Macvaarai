# 🏥 HOSPITAL PORTAL - AI MODELS TESTING GUIDE

## Complete Testing Workflow for Hospital Models

---

## ✅ **SYSTEM COMPONENTS VERIFIED**

### **Backend**
- ✅ `/ai-health-assistant` endpoint - accepts image + model_type
- ✅ 18 AI models loaded with weights (.h5 files)
- ✅ Transfer learning models (MobileNetV2)
- ✅ Hospital access control via hospital_id
- ✅ Model subscription validation

### **Frontend**
- ✅ HospitalAdminPortal - main hospital dashboard
- ✅ ModelDiagnosisPage - image upload & prediction UI
- ✅ Model selection and filtering
- ✅ Image preview and drag-drop support
- ✅ Result display with confidence scores

### **Database**
- ✅ Hospitals table with subscribed_models
- ✅ Hospital access tokens
- ✅ Model restrictions per hospital

---

## 🧪 **COMPLETE TESTING WORKFLOW**

### **Step 1: Import Hospitals with Models**

1. **Login as Super Admin**
   ```
   URL: http://localhost:5173/admin/login
   Email: anbu@1001
   Password: anbu@1001
   ```

2. **Go to Hospitals Tab**

3. **Click "Import Chennai Colleges"**
   - ✅ Stanley Hospital (4 models)
   - ✅ Kilpauk Hospital (4 models)
   - ✅ Omandurar Hospital (4 models)
   - ✅ MMC Hospital (18 models)

4. **Verify Import**
   - See 4 hospitals in the list
   - Each shows assigned model count
   - Copy tokens for testing

---

### **Step 2: Test Stanley Hospital (4 Models)**

#### **2.1: Login to Stanley Hospital**
```
URL: http://localhost:5173/stanley-hospital/login
Token: HSP-XXXXX_TOKEN_xxxxxxx (from admin panel)
```

#### **2.2: See Hospital Dashboard**
- Hospital name: Stanley Medical College
- Stats: Doctors, Beds, Total Patients
- Available AI Models: 4 ONLY
  - ✅ Eye Disease Detection
  - ✅ COVID-19 Detection
  - ✅ Pneumonia Detection
  - ✅ Diabetes Prediction
  - ❌ Other 14 models: HIDDEN

#### **2.3: Test Eye Disease Model**
1. Click on **"Eye Disease Detection"** model
2. Should show:
   - Model title: "Eye Disease Detection"
   - Description: "Upload a retinal image..."
   - Accepted formats: JPG, PNG, GIF
3. **Upload test image:**
   - Click upload area or drag-drop
   - Select any medical image from your computer
4. **System processes:**
   - Shows image preview ✅
   - Sends to `/ai-health-assistant` endpoint
   - Model type: "eye"
   - Hospital ID: Stanley's hospital_id
5. **Should receive prediction:**
   - Label: Disease classification (e.g., "Mild Diabetic Retinopathy")
   - Confidence: Percentage (e.g., 87%)
   - Recommendations: Next steps
   - Option to save to patient records

#### **2.4: Test COVID Model**
1. Click **"COVID-19 Detection"**
2. Upload **chest X-ray image** (JPG/PNG)
3. Should show:
   - Prediction: COVID-19 status
   - Confidence percentage
   - Analysis result

#### **2.5: Test Other Models**
- Pneumonia: Upload chest X-ray
- Diabetes: Upload blood test image

#### **2.6: Verify Model Restrictions**
- Try to find "Skin Cancer Detection" - Should NOT appear
- Try to find "TB Detection" - Should NOT appear
- Only 4 models visible, others hidden ✅

---

### **Step 3: Test Kilpauk Hospital (4 Different Models)**

#### **3.1: Login**
```
URL: http://localhost:5173/kilpauk-hospital/login
Token: HSP-XXXXX_TOKEN_yyyyyyy
```

#### **3.2: See Different Models**
- ✅ COVID-19 Detection
- ✅ Pneumonia Detection
- ✅ Malaria Detection
- ✅ Dengue Detection
- ❌ Eye, Diabetes, TB: HIDDEN (different from Stanley)

#### **3.3: Test Each Model**
- COVID-19: Upload chest X-ray
- Pneumonia: Upload chest X-ray
- Malaria: Upload blood smear
- Dengue: Upload blood sample

---

### **Step 4: Test MMC Hospital (All 18 Models)**

#### **4.1: Login**
```
URL: http://localhost:5173/mmc-hospital/login
Token: HSP-XXXXX_TOKEN_zzzzzz
```

#### **4.2: See ALL 18 Models**
- ✅ Eye Disease Detection
- ✅ COVID-19 Detection
- ✅ ECG Analysis
- ✅ Skin Cancer Detection
- ✅ Tuberculosis Detection
- ✅ Throat Analysis
- ✅ Lung Analysis
- ✅ Colorectal Cancer
- ✅ Stroke Prediction
- ✅ Diabetes Prediction
- ✅ Pneumonia Detection
- ✅ Malaria Detection
- ✅ Dengue Detection
- ✅ Kidney Disease
- ✅ Ear Infection
- ✅ Nasal Polyp
- ✅ Oral Cancer
- ✅ Pharyngitis

#### **4.3: Test Multiple Models**
- Test at least 5 different models
- Verify each processes images
- Check confidence scores

---

## 📊 **MODEL TESTING DATA**

### **Test Images to Use**

```
For Eye Tests:
- Retinal fundus images
- Eye scan images
- Optical coherence tomography (OCT) images

For COVID/Pneumonia Tests:
- Chest X-ray images
- CT scan images
- Radiograph images

For Skin Tests:
- Skin lesion photos
- Dermoscopy images
- Skin condition photos

For Other Tests:
- Blood sample images
- Lab test results
- Medical imaging files
```

---

## ✨ **EXPECTED RESULTS**

### **Prediction Response Format**

Each model should return:
```json
{
  "status": "success",
  "model_result": {
    "label": "Disease Name",
    "confidence": 0.85,
    "probability_normal": 0.15,
    "probability_disease": 0.85,
    "summary": "Detailed diagnosis with confidence"
  },
  "timestamp": "2026-06-17 19:00:00"
}
```

### **Frontend Display**

Hospital should show:
- ✅ Disease classification
- ✅ Confidence percentage
- ✅ Detailed recommendations
- ✅ Option to save to patient records
- ✅ Timestamp of analysis

---

## 🔍 **VERIFICATION CHECKLIST**

### **Access Control Verification**

- [ ] Stanley Hospital sees 4 models ✓
- [ ] Stanley Hospital doesn't see Skin, TB, Malaria, Dengue ✓
- [ ] Kilpauk Hospital sees different 4 models ✓
- [ ] Kilpauk Hospital doesn't see Eye, Diabetes, etc. ✓
- [ ] MMC Hospital sees all 18 models ✓
- [ ] Each hospital gets unique token ✓

### **Model Functionality**

- [ ] Eye Disease Detection works ✓
- [ ] COVID-19 Detection works ✓
- [ ] Pneumonia Detection works ✓
- [ ] Diabetes Detection works ✓
- [ ] Malaria Detection works ✓
- [ ] Dengue Detection works ✓
- [ ] Tuberculosis Detection works ✓
- [ ] And remaining 11 models... ✓

### **Image Upload**

- [ ] Can upload JPG ✓
- [ ] Can upload PNG ✓
- [ ] Can upload GIF ✓
- [ ] Can drag-drop images ✓
- [ ] Image preview displays ✓
- [ ] File size handled properly ✓

### **Prediction Process**

- [ ] Image sent to backend ✓
- [ ] Model loaded successfully ✓
- [ ] Prediction generated ✓
- [ ] Confidence score returned ✓
- [ ] Response displayed to hospital ✓
- [ ] No errors in console ✓

### **Result Handling**

- [ ] Prediction label shows ✓
- [ ] Confidence percentage shows ✓
- [ ] Recommendations display ✓
- [ ] Can save to patient records ✓
- [ ] History maintained ✓

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Models Not Showing**

**Solution:**
1. Check hospital token in localStorage
2. Verify hospital subscribed_models in database
3. Check browser console for errors
4. Refresh page and try again

### **Issue: Upload Fails**

**Solution:**
1. Check image format (JPG, PNG, GIF)
2. Check image file size (< 10MB)
3. Verify backend is running (port 8000)
4. Check browser console for error messages

### **Issue: No Prediction Result**

**Solution:**
1. Check backend logs for errors
2. Verify model files exist (.h5 files)
3. Check hospital_id is being passed
4. Verify model_type parameter is correct

### **Issue: Wrong Confidence Score**

**Solution:**
1. Model is trained - confidence varies
2. Check if prediction makes sense
3. Try with different image
4. Verify model is loaded correctly

---

## 📋 **MODEL DETAILS**

### **Binary Classification Models (2 Classes)**
```
COVID: COVID vs Normal
Pneumonia: Pneumonia vs Normal
Malaria: Infected vs Uninfected
Dengue: Positive vs Negative
Diabetes: Diabetic vs Non-diabetic
Kidney: Disease vs Normal
TB: TB vs Normal
Throat: Abnormal vs Normal
Ear: Infected vs Normal
Nose: Polyp vs Normal
Oral: Cancer vs Normal
Pharyngitis: Pharyngitis vs Normal
Stroke: Risk vs No Risk
Colorectal: Polyp vs Normal
```

### **Multi-Class Classification Models (3+ Classes)**
```
Eye: 5 classes (No DR, Mild, Moderate, Severe, Proliferative)
Skin: 3 classes (Melanoma, Non-melanoma, Normal)
Lung: 3 classes (Nodule, Cancer, Normal)
ECG: 5 classes (various heart conditions)
```

---

## 🚀 **COMPLETE TEST SEQUENCE**

1. **Import hospitals** (Step 1)
2. **Login Stanley Hospital** (Step 2.1)
3. **View models** - verify 4 models only (Step 2.2)
4. **Test Eye model** - upload image, get prediction (Step 2.3)
5. **Test COVID model** - upload X-ray, verify result (Step 2.4)
6. **Verify restrictions** - try to find hidden models (Step 2.6)
7. **Login Kilpauk Hospital** (Step 3.1)
8. **Verify different models** - see 4 different ones (Step 3.2)
9. **Test Malaria model** - upload blood smear (Step 3.3)
10. **Login MMC Hospital** (Step 4.1)
11. **Verify all 18 models** (Step 4.2)
12. **Test 5+ different models** (Step 4.3)

---

## ✅ **SUCCESS CRITERIA**

- ✅ All hospitals load successfully
- ✅ Models display per hospital assignment
- ✅ Image uploads work
- ✅ Predictions are generated
- ✅ Confidence scores show
- ✅ Results display correctly
- ✅ Access control enforced
- ✅ No console errors
- ✅ Fast response times (< 3 seconds per prediction)
- ✅ Data saved to records

---

## 📱 **QUICK TEST URLS**

```
Stanley:    http://localhost:5173/stanley-hospital/login
Kilpauk:    http://localhost:5173/kilpauk-hospital/login
Omandurar:  http://localhost:5173/omandurar-hospital/login
MMC:        http://localhost:5173/mmc-hospital/login
```

---

**Everything is ready to test!** 🎉

Start with Stanley Hospital and work through the complete sequence to verify all models are working properly.
