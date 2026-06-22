# MacvaarAI Organization Portal - Quick Start URLs & Credentials

## 🚀 Server URLs

### Frontend
- **URL**: http://localhost:5174
- **Status**: ✅ Running
- **Port**: 5174

### Backend API
- **URL**: http://localhost:8000
- **Status**: ✅ Running
- **Port**: 8000

---

## 🔐 Login Credentials

### Super Admin Account (MacvaarAI Admin)
| Field | Value |
|-------|-------|
| **Email** | `anbu@1001` |
| **Password** | `anbu@1001` |
| **Role** | Super Admin |
| **Access** | Full system control |

---

## 📍 Key URLs

### 1. Super Admin Dashboard
```
URL: http://localhost:5174/admin/login
Login: anbu@1001 / anbu@1001
Access: Create organizations, manage system
```

### 2. Organization Token Verification (Example)
```
URL: http://localhost:5174/testorg-org-admin
Purpose: Organization owner enters token here
Note: Slug changes based on organization name
```

### 3. Organization Sign In/Sign Up
```
URL: http://localhost:5174/testorg-org-admin/login
Purpose: After token verification, create account or sign in
```

### 4. Organization Admin Portal Dashboard
```
URL: http://localhost:5174/org/portal
Purpose: Main organization admin dashboard
Note: Only accessible after login
```

---

## 🔑 Test Organization Credentials

### Created Organizations
```
Organization 1:
- Name: TestOrg
- Email: test@testorg.com
- Token: ORG_TESTORG_38b9666d
- Portal URL: http://localhost:5174/testorg-org-admin

Organization Admin (Created during signup):
- Name: Test Admin
- Email: admin@testorg.com
- Password: test123
- Phone: 9876543210
```

---

## 📋 Step-by-Step Quick Start

### Step 1: Create New Organization
```
1. Go to: http://localhost:5174/admin/login
2. Login with: anbu@1001 / anbu@1001
3. Click: Organizations tab
4. Click: Add Organization
5. Fill:
   - Name: YourOrgName
   - Email: admin@yourorg.com
   - Phone: 1234567890
   - City: Chennai
   - State: Tamil Nadu
6. Click: Create Organization
7. Copy Token and URL from success popup
```

### Step 2: Access Organization Portal
```
1. Go to the generated URL
   Example: http://localhost:5174/yourorgname-org-admin
2. You'll see: Token Verification Page
3. Paste: The token you copied
4. Click: Verify Token
5. Redirected to: Sign In/Sign Up page
```

### Step 3: Create Admin Account
```
1. Click: "Create one now"
2. Fill:
   - Full Name: Your Name
   - Email: admin@yourorg.com
   - Phone: 9876543210
   - Password: Choose strong password
   - Confirm Password: Same password
3. Click: Create Account
4. Redirected to: Sign In page
```

### Step 4: Login to Dashboard
```
1. Fill:
   - Email: admin@yourorg.com
   - Password: Your password
2. Click: Sign In
3. Redirected to: Organization Portal Dashboard (/org/portal)
```

### Step 5: Use Dashboard
```
Available Tabs:
1. Dashboard - View organization stats
2. Team Members - Add/manage admins
3. Hospitals - View hospitals (if any)
4. AI Diagnostic Tools - View 18 AI models
```

---

## 🧪 API Testing Quick Commands

### Create Organization
```bash
curl -X POST http://localhost:8000/admin/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QuickTest",
    "email": "test@quicktest.com",
    "phone": "1234567890",
    "city": "Chennai",
    "state": "Tamil Nadu"
  }'
```

### Verify Token
```bash
curl -X POST http://localhost:8000/org/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "org_name": "QuickTest"
  }'
```

### Sign Up Admin
```bash
curl -X POST http://localhost:8000/org-admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@quicktest.com",
    "phone": "9876543210",
    "password": "password123",
    "organization": "QuickTest"
  }'
```

### Login Admin
```bash
curl -X POST http://localhost:8000/org-admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@quicktest.com",
    "password": "password123",
    "organization": "QuickTest"
  }'
```

### Get Organization Admins
```bash
curl -s http://localhost:8000/org/2/admins | python -m json.tool
```

---

## 🎨 Organization Color Themes

### Pre-configured Organizations
```
Organization: Vijay
- Theme: Yellow
- Portal URL: http://localhost:5174/vijay-org-admin
- Logo: Vijay.jpeg

Organization: BJP
- Theme: Orange
- Portal URL: http://localhost:5174/bjp-org-admin
- Logo: BJP.jpeg

Organization: Modi
- Theme: Blue
- Portal URL: http://localhost:5174/modi-org-admin
- Logo: Modi.jpeg

Organization: CBN
- Theme: Light Yellow
- Portal URL: http://localhost:5174/cbn-org-admin
- Logo: CBN.jpg
```

---

## 📊 Dashboard Features

### Team Members Tab
- Create new administrators
- View all team members
- Delete team members
- Professional form with validation

### Hospitals Tab
- View all registered hospitals
- Hospital name, email, location, beds
- Operational status display

### AI Diagnostic Tools Tab
- All 18 AI models displayed
- Premium models: ₹5,000/year
- Free models: No charge
- Models organized in grid
- Color-coded (Orange: Premium, Green: Free)

---

## 🛠️ Database Details

### Database File
```
Location: c:\bhai health\macvaarai-backend\health_platform.db
Type: SQLite3
Size: Contains all organizational data
Tables: 17 normalized tables
```

### Key Tables
- `organizations` - Organization master data
- `organization_admins` - Admin accounts
- `hospitals` - Hospital information
- `patients` - Patient records
- `diagnoses` - AI diagnosis results
- `ai_models` - AI model catalog
- `support_tickets` - Support requests

---

## 🔍 Verification Checklist

- [ ] Frontend accessible at http://localhost:5174
- [ ] Backend API accessible at http://localhost:8000
- [ ] Super admin can login
- [ ] Organizations can be created
- [ ] Tokens are generated
- [ ] Token verification works
- [ ] Admin sign up works
- [ ] Admin login works
- [ ] Dashboard displays correctly
- [ ] Team members can be added
- [ ] All tabs are functional
- [ ] Logos display correctly
- [ ] Organization names show properly
- [ ] Professional styling visible
- [ ] No errors in console

---

## 📞 Testing Support

If you encounter issues:

1. **Check Server Status**
   ```bash
   curl http://localhost:8000/admin/dashboard
   curl http://localhost:5174
   ```

2. **Check Logs**
   - Backend: `c:\bhai health\macvaarai-backend\backend.log`
   - Frontend: `c:\bhai health\macvaarai-frontend\macvaarai-frontend\frontend.log`

3. **Clear Browser Cache**
   - Open Developer Tools (F12)
   - Right-click refresh and select "Empty cache and hard refresh"

4. **Reset localStorage**
   - Open Console in Developer Tools
   - Run: `localStorage.clear()`

---

## 📱 Responsive Design

The portal is fully responsive and works on:
- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

---

## 🎯 User Journey

```
Super Admin
  ↓
Login (anbu@1001 / anbu@1001)
  ↓
Create Organization + Get Token
  ↓
Share Token with Organization Owner
  ↓
Organization Owner
  ↓
Visit Token Verification URL
  ↓
Enter Token
  ↓
Sign Up / Sign In
  ↓
Organization Admin Portal
  ↓
Manage Team, Hospitals, AI Models
```

---

## ✅ System Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Running | http://localhost:5174 |
| Backend | ✅ Running | http://localhost:8000 |
| Database | ✅ Active | health_platform.db |
| Logos | ✅ Available | /LOGO folder |
| APIs | ✅ All Working | See API Endpoints |

---

**Ready to test? Start at**: http://localhost:5174/admin/login
