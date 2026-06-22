# 🗺️ QUICK ACCESS PATHS & URLS

## 🌐 BROWSER URLS

### **Organization Access**
```
Organization Login:
http://localhost:5173/org-admin/login

Organization Dashboard (after login):
http://localhost:5173/org-admin/dashboard
```

### **Other Logins**
```
Hospital Admin Login:
http://localhost:5173/hospital/login

Super Admin Login:
http://localhost:5173/superadmin/login

Patient/User App:
http://localhost:5173/
```

---

## 📂 PROJECT FILE PATHS

### **Backend Files**
```
Main Backend:
c:\bhai health\macvaarai-backend\main.py

Logo Serving Code (Lines 54-63):
└─ Look for: "logo_path = os.path.join..."

Organization Endpoints (Lines 1836+):
└─ Look for: "GET /organizations"
```

### **Frontend Files**
```
New Components:
├─ c:\bhai health\macvaarai-frontend\macvaarai-frontend\src\Components\OrganizationLogin.jsx
└─ c:\bhai health\macvaarai-frontend\macvaarai-frontend\src\Components\OrganizationAdminDashboard.jsx

App Configuration:
└─ c:\bhai health\macvaarai-frontend\macvaarai-frontend\src\App.jsx
   ├─ Lines 16-17: Import statements
   └─ Lines 238-254: Route configuration
```

### **Logo Files**
```
All Logos:
c:\bhai health\LOGO\
├─ Vijay.jpeg          → /LOGO/Vijay.jpeg
├─ BJP.jpeg            → /LOGO/BJP.jpeg
├─ Modi.jpeg           → /LOGO/Modi.jpeg
├─ CBN.jpg             → /LOGO/CBN.jpg
└─ Macvaar.jpg         → /LOGO/Macvaar.jpg
```

---

## 🔗 API ENDPOINTS

### **Backend Base URL**
```
http://localhost:8000
```

### **Available Endpoints**

**1. Get All Organizations**
```
GET http://localhost:8000/organizations

Response:
{
  "status": "success",
  "organizations": [...]
}
```

**2. Get Single Organization**
```
GET http://localhost:8000/organization/1

Response:
{
  "status": "success",
  "organization": {...}
}
```

**3. Organization Admin Login**
```
POST http://localhost:8000/org-admin/login

Request Body:
{
  "token": "ORG_TOKEN_2024_SECURE_ABC123"
}

Response:
{
  "status": "success",
  "org_id": 1,
  "org_name": "Vijay Care",
  "org_logo": "/LOGO/Vijay.jpeg",
  "total_hospitals": 15
}
```

**4. Get Organization Hospitals**
```
GET http://localhost:8000/org/1/hospitals

Response:
{
  "status": "success",
  "hospitals": [...],
  "total": 15
}
```

**5. Get Organization Dashboard Stats**
```
GET http://localhost:8000/org/1/dashboard-stats

Response:
{
  "status": "success",
  "org_name": "Vijay Care",
  "org_logo": "/LOGO/Vijay.jpeg",
  "total_hospitals": 15,
  "total_patients": 3450,
  "total_beds": 2500,
  "total_doctors": 280
}
```

---

## 🎨 LOGO DIRECT URLS

### **Static Logo Access**
```
Vijay Logo:
http://localhost:8000/LOGO/Vijay.jpeg

BJP Logo:
http://localhost:8000/LOGO/BJP.jpeg

Modi Logo:
http://localhost:8000/LOGO/Modi.jpeg

CBN Logo:
http://localhost:8000/LOGO/CBN.jpg

MacvaarAI Logo:
http://localhost:8000/LOGO/Macvaar.jpg
```

---

## 📋 ORGANIZATION SAMPLE DATA

### **Vijay Care (ID: 1)**
```
Name:              Vijay Care
Logo:              /LOGO/Vijay.jpeg
Email:             admin@vijaycare.com
Phone:             +91-9876543210
Hospitals:         15
Status:            Active
Sample Token:      ORG_TOKEN_2024_SECURE_ABC123
```

### **BJP Care (ID: 2)**
```
Name:              BJP Care
Logo:              /LOGO/BJP.jpeg
Email:             admin@bjpcare.com
Phone:             +91-9876543211
Hospitals:         25
Status:            Active
Sample Token:      ORG_TOKEN_2024_SECURE_DEF456
```

### **Modi Healthcare (ID: 3)**
```
Name:              Modi Healthcare
Logo:              /LOGO/Modi.jpeg
Email:             admin@modicare.gov.in
Phone:             +91-1234567890
Hospitals:         50
Status:            Active
Sample Token:      ORG_TOKEN_2024_SECURE_GHI789
```

### **CBN Care (ID: 4)**
```
Name:              CBN Care
Logo:              /LOGO/CBN.jpg
Email:             admin@cbncare.com
Phone:             +91-9876543212
Hospitals:         12
Status:            Active
Sample Token:      ORG_TOKEN_2024_SECURE_JKL012
```

---

## 💾 LOCALSTORAGE KEYS

**After Successful Login:**
```
orgAdminToken   → ORG_TOKEN_2024_SECURE_ABC123
orgId           → 1
orgName         → Vijay Care
orgLogo         → /LOGO/Vijay.jpeg
```

---

## 🖥️ TERMINAL COMMANDS

### **Start Backend**
```bash
cd "c:\bhai health\macvaarai-backend"
python -m uvicorn main:app --reload
```

**Expected Port:** `http://127.0.0.1:8000`

### **Start Frontend**
```bash
cd "c:\bhai health\macvaarai-frontend\macvaarai-frontend"
npm run dev
```

**Expected Port:** `http://localhost:5173`

---

## 📚 DOCUMENTATION FILES

```
Setup Guides:
├─ c:\bhai health\SETUP_COMPLETE_SUMMARY.md
├─ c:\bhai health\COMPLETE_SETUP_VERIFICATION.md
├─ c:\bhai health\LOGO_SETUP_GUIDE.md
└─ c:\bhai health\QUICK_ACCESS_PATHS.md (this file)

Organization Guides:
├─ c:\bhai health\ORGANIZATION_DASHBOARDS_VISUAL.md
└─ c:\bhai health\MULTI_LEVEL_ACCESS_SYSTEM.md

Feature Guides:
├─ c:\bhai health\FREE_ADDONS_PLAN.md
├─ c:\bhai health\GOVERNMENT_ANALYTICS_DATA_GUIDE.md
├─ c:\bhai health\HOSPITAL_ADMIN_GUIDE.md
└─ c:\bhai health\HOSPITAL_VISUAL_WALKTHROUGH.md
```

---

## 🔐 BROWSER DEVELOPER TOOLS

### **Test API Endpoints**

**In Browser Console:**
```javascript
// Get all organizations
fetch('http://localhost:8000/organizations')
  .then(r => r.json())
  .then(d => console.log(d))

// Test login
fetch('http://localhost:8000/org-admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'ORG_TOKEN_2024_SECURE_ABC123' })
})
.then(r => r.json())
.then(d => console.log(d))

// Get org stats
fetch('http://localhost:8000/org/1/dashboard-stats')
  .then(r => r.json())
  .then(d => console.log(d))
```

### **Check LocalStorage**
```javascript
// View all stored data
console.log(localStorage)

// View specific keys
console.log(localStorage.getItem('orgAdminToken'))
console.log(localStorage.getItem('orgId'))
console.log(localStorage.getItem('orgName'))
console.log(localStorage.getItem('orgLogo'))

// Clear all
localStorage.clear()
```

---

## ✅ VERIFICATION CHECKLIST

### **Backend Running**
```
[ ] Terminal shows "Uvicorn running on http://127.0.0.1:8000"
[ ] Can access http://localhost:8000/organizations
[ ] Can see logo files at http://localhost:8000/LOGO/Vijay.jpeg
```

### **Frontend Running**
```
[ ] Terminal shows "Local: http://localhost:5173"
[ ] Can access http://localhost:5173/org-admin/login
[ ] See 4 organization cards with logos
```

### **Components Working**
```
[ ] Organization cards display correctly
[ ] Logos load for each organization
[ ] Clicking card shows login form
[ ] Token input field works
[ ] Login button redirects to dashboard
[ ] Dashboard displays with org logo
[ ] Tabs are clickable and switch content
[ ] Logout button works
```

---

## 🎯 COMMON TASKS

### **To Test Organization Login**
```
1. Open: http://localhost:5173/org-admin/login
2. See: 4 organization cards
3. Click: Any organization
4. Enter: Any token (will fail with invalid token error for demo)
```

### **To View API Documentation**
```
URL: http://localhost:8000/docs
Or:  http://localhost:8000/redoc
```

### **To Check Logos Load**
```
Right-click on org card logo → Inspect
Check Network tab → See /LOGO/Vijay.jpeg status 200
```

### **To Debug Frontend**
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Go to Network tab
5. Check /organizations API call
6. Check /LOGO/* requests
```

---

## 🚀 QUICK START

1. **Terminal 1:**
   ```bash
   cd "c:\bhai health\macvaarai-backend"
   python -m uvicorn main:app --reload
   ```

2. **Terminal 2:**
   ```bash
   cd "c:\bhai health\macvaarai-frontend\macvaarai-frontend"
   npm run dev
   ```

3. **Browser:**
   ```
   http://localhost:5173/org-admin/login
   ```

4. **Test:** Click organization → See login form → See dashboard

---

**Everything is ready to use!** 🎉
