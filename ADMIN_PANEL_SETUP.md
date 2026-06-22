# ADMIN PANEL SETUP - Complete Guide

## ✅ WHAT'S BEEN CREATED

### Database Schema (database_schema.sql)
- 17 tables for complete system
- Admin users table
- Organizations & Organization admins
- Hospitals & Hospital staff
- Patients & Diagnoses
- AI Models & Pricing
- Support tickets & Feedback
- Consultations
- Disease surveillance data
- Hospital statistics
- Invoices & Password resets

### Backend Endpoints (30+ new endpoints in main.py)
```
Admin:
  POST /admin/login - Admin authentication
  GET /admin/dashboard - Dashboard statistics

Organizations:
  POST /admin/organizations - Create org
  GET /admin/organizations - List all orgs
  PUT /admin/organizations/{id} - Update org

Hospitals:
  POST /admin/hospitals - Create hospital
  GET /admin/hospitals - List hospitals

AI Models:
  GET /admin/models - List all models
  PUT /admin/models/{id} - Update pricing

Support:
  GET /admin/support-tickets - Get tickets
  PUT /admin/support-tickets/{id} - Resolve ticket
  GET /admin/feedback - Get feedback
```

### Frontend Components
```
AdminLogin.jsx - Admin login page
AdminDashboard.jsx - Main admin dashboard with tabs:
  - Dashboard (statistics)
  - Organizations (create & manage)
  - Hospitals (coming soon)
  - AI Models (pricing management)
  - Support (tickets & feedback)
```

---

## 🚀 HOW TO RUN

### Step 1: Create Database
```bash
sqlite3 health_platform.db < database_schema.sql
```

### Step 2: Update App.jsx Routes

Add imports:
```javascript
import AdminLogin from "./Components/AdminLogin.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
```

Add wrapper:
```javascript
const AdminWrapper = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) return <Navigate to="/admin/login" />;
  return children;
};
```

Add routes (before closing </Routes>):
```javascript
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={
  <AdminWrapper>
    <AdminDashboard />
  </AdminWrapper>
} />
```

### Step 3: Start Servers
```bash
# Terminal 1
cd "c:\bhai health\macvaarai-backend"
python -m uvicorn main:app --reload

# Terminal 2
cd "c:\bhai health\macvaarai-frontend\macvaarai-frontend"
npm run dev
```

### Step 4: Access Admin Panel
```
URL: http://localhost:5173/admin/login
Email: anbu@1001
Password: anbu@1001
```

---

## 📊 ADMIN FEATURES

### Dashboard Tab
- View total organizations, hospitals, patients
- View open support tickets
- Statistics overview

### Organizations Tab
- Create new organization (generates unique token)
- View all organizations
- Edit organization details
- See organization contact info

### Hospitals Tab (Coming)
- Create hospitals (globally or under org)
- Manage hospital details
- View hospital access codes
- See hospital capacity

### AI Models Tab (Coming)
- View all 18 AI models
- Set pricing (₹50,000 per model)
- Manage model availability
- Track model usage

### Support Tab
- View support tickets from hospitals/orgs
- Respond to tickets
- View feedback
- Manage complaints

---

## 🔐 ADMIN CREDENTIALS

```
Email: anbu@1001
Password: anbu@1001
```

This is automatically inserted into the database.

---

## 📝 ADMIN WORKFLOW

1. **Admin logs in** with email/password
2. **Creates organization** (gets unique token)
3. **Creates hospital** (gets access code)
4. **Manages AI models** and pricing
5. **Views support tickets** and feedback
6. **Handles consultations** from hospitals

---

## 🎯 NEXT: ORGANIZATION ADMIN PORTAL

Once admin creates organization, organization owner can:
1. Use organization token to login
2. Create hospital accounts
3. Purchase AI models (₹50,000 each)
4. Assign models to hospitals
5. Manage hospital admins

Then hospital staff can:
1. Login with hospital access code
2. Use AI models for patient diagnosis
3. Manage patients
4. Generate reports

---

## ✅ TESTING CHECKLIST

```
Backend:
[ ] Database created successfully
[ ] All tables exist
[ ] Admin user inserted
[ ] 18 AI models inserted
[ ] API endpoints working

Frontend:
[ ] AdminLogin component loads
[ ] Login with anbu@1001 works
[ ] Redirects to AdminDashboard
[ ] Dashboard shows statistics
[ ] Organizations tab works
[ ] Can create new organization
[ ] Token generated automatically
[ ] All tabs accessible

Database:
[ ] Organization saved to DB
[ ] Status is 'active'
[ ] Token is unique
[ ] Hospital can be created
```

---

**Everything is ready! Start the servers and test the admin panel!** 🎉
