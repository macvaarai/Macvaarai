# MacvaarAI Health Platform

Multi-tenant healthcare platform with 12 AI medical diagnosis models.

---

## 🚀 HOW TO RUN

### **1. Start Backend**

```powershell
cd "c:\bhai health\macvaarai-backend"
python -m uvicorn main:app --reload
```

✅ Wait for: `Uvicorn running on http://127.0.0.1:8000`

---

### **2. Start Frontend** (New Terminal)

```powershell
cd "c:\bhai health\macvaarai-frontend\macvaarai-frontend"
npm run dev
```

✅ Wait for: `Local: http://localhost:5173/`

---

### **3. Open Application**

http://localhost:5173

---

## 🔐 LOGIN CREDENTIALS

### **Super Admin Portal**
```
URL:  http://localhost:5173/superadmin/login
Key:  hero_admin_001
```

### **Hospital Admin Portal**
```
URL:   http://localhost:5173/hospital/login
Token: APL_TOKEN_2024_SECURE_ABC123XYZ
```

### **Patient Portal**
```
URL:      http://localhost:5173
Email:    aara@example.com
Password: patient123
```

---

## 📋 What You Get

✅ **12 AI Medical Models**
- Eye Disease Detection
- COVID-19 Detection  
- ECG Analysis
- Skin Cancer Detection
- Breast Cancer Detection
- Tuberculosis Detection
- Diabetes Detection
- Pneumonia Detection
- Malaria Detection
- Dengue Detection
- Stroke Prediction
- Kidney Disease Detection

✅ **Features**
- Multi-tenant hospital system with unique tokens
- Patient management (add, search, delete)
- AI diagnosis with medical images
- Patient medical history tracking
- Appointments management
- Feedback & consultation system

---

## 🛠️ Troubleshooting

### Backend won't start
```powershell
# Kill python process
taskkill /F /IM python.exe

# Reset database
cd macvaarai-backend
python setup_db.py

# Restart
python -m uvicorn main:app --reload
```

### Frontend won't start
```powershell
# Install dependencies
cd macvaarai-frontend/macvaarai-frontend
npm install

# Start
npm run dev
```

### Can't login
- Super Admin: Key must be `hero_admin_001` (exact)
- Hospital: Paste token without spaces
- Check backend is running: http://localhost:8000/docs

---

## 📚 API Documentation

Backend API Docs: http://localhost:8000/docs

---

**Ready to go! 🎉**
