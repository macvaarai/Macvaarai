# MacvaarAI Organization System - Complete Guide

## Overview
The organization registration and admin portal system allows MacvaarAI to manage multiple organizations (like Vijay Care, BJP Healthcare, Modi Medical, CBN Care) with their own dashboards, admins, hospitals, and AI model management.

## System Architecture

### 3-Tier Hierarchy
```
MacvaarAI Super Admin (Master Control)
    ↓
Organization Admin (Organization-level Management)
    ↓
Hospital Admin (Hospital Operations)
```

---

## 1. Organization Creation (Super Admin Portal)

### Location
- **URL**: `http://localhost:5173/admin/dashboard`
- **Login**: Email: `anbu@1001`, Password: `anbu@1001`
- **Tab**: Organizations → Add Organization

### Process
1. Click "Add Organization" button
2. Fill in organization details:
   - Organization Name (e.g., "Vijay Care")
   - Email Address
   - Phone Number
   - City
   - State
3. Click "Create Organization"
4. System automatically generates:
   - **Unique Token**: `ORG_VIJAY_CARE_[8-char-hex]`
   - **Portal URL**: `http://localhost:5173/vijay-org-admin`

### Generated Information
After creation, super admin sees:
- Organization name
- Generated token (copy button)
- Portal URL (copy button)
- Instructions for sharing with organization owner

---

## 2. Organization Owner Portal Access

### Initial Token Verification

**URL**: `http://localhost:5173/{org-name}-org-admin`
Example: `http://localhost:5173/vijay-org-admin`

**Step 1: Token Verification Page**
- Organization logo and name displayed
- User enters the token they received from super admin
- Token verification endpoint: `/org/verify-token`
- After successful verification, redirected to Sign In/Sign Up

**Step 2: Sign In / Sign Up**
- **Sign In**: Existing organization admins login with email/password
- **Sign Up**: New organization owners create their account
- Both options available in the same interface
- Endpoint: `/org-admin/login` and `/org-admin/signup`

**Step 3: Organization Portal Dashboard**
- Redirects to: `/org/portal`
- Displays organization name at top
- Shows organization token (read-only, with copy button)

---

## 3. Organization Admin Portal Dashboard

### Location
- **URL**: `/org/portal`
- **Protected**: Requires `orgAdminToken` in localStorage

### Tabs Available

#### Dashboard Tab
- **Organization Overview**
  - Total Admins count
  - Total Hospitals count
  - AI Models available (18)
  - Organization Status
  
- **Organization Information**
  - Name, Email, Phone
  - Location (City, State)
  - Generated Token (displayed, copyable)

#### Admins Tab
- **Create Admin Form**
  - Full Name *
  - Email *
  - Phone
  - Password *
  - Confirm Password *
  
- **Admin List**
  - Table showing all created admins
  - Columns: Name, Email, Phone, Role, Actions
  - Delete option for each admin
  - Real-time updates

#### Hospitals Tab
- **Hospital List**
  - Table of all hospitals in the organization
  - Columns: Hospital Name, Email, Location, Beds, Status
  - Read-only view for hospital management
  - Shows hospital information from admin creation

#### AI Models Tab
- **Model Overview**
  - Premium Models: ₹5,000/year
  - Free Models: No charge
  
- **All 18 AI Models Listed**
  - Premium: Eye Disease, COVID-19, ECG, Skin Cancer, Tuberculosis, Stroke, Colorectal, Lung, Throat
  - Free: Diabetes, Pneumonia, Malaria, Dengue, Kidney Disease, Ear, Nose, Oral, Pharyngitis

---

## 4. Backend API Endpoints

### Organization Management

#### Create Organization
```
POST /admin/organizations
Request:
{
  "name": "Vijay Care",
  "email": "admin@vijaycare.com",
  "phone": "1234567890",
  "city": "Chennai",
  "state": "Tamil Nadu"
}

Response:
{
  "status": "success",
  "organization_id": 1,
  "name": "Vijay Care",
  "token": "ORG_VIJAY_CARE_abc12345",
  "message": "Organization Vijay Care created successfully"
}
```

#### Get All Organizations
```
GET /admin/organizations

Response:
{
  "status": "success",
  "total": 4,
  "organizations": [...]
}
```

#### Get Organization Details
```
GET /org/{org_id}/details

Response:
{
  "status": "success",
  "organization": {
    "id": 1,
    "name": "Vijay Care",
    "email": "admin@vijaycare.com",
    "phone": "1234567890",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "token": "ORG_VIJAY_CARE_abc12345",
    "status": "Active"
  }
}
```

#### Verify Organization Token
```
POST /org/verify-token
Request:
{
  "token": "ORG_VIJAY_CARE_abc12345",
  "org_name": "Vijay Care"
}

Response:
{
  "status": "success",
  "organization_id": 1,
  "name": "Vijay Care",
  "email": "admin@vijaycare.com",
  "message": "Token verified successfully"
}
```

### Organization Admin Management

#### Create Admin
```
POST /org/admins
Request:
{
  "organization_id": 1,
  "name": "John Smith",
  "email": "john@vijaycare.com",
  "phone": "1234567890",
  "password": "secure_password"
}

Response:
{
  "status": "success",
  "admin_id": 10,
  "name": "John Smith",
  "email": "john@vijaycare.com",
  "message": "Admin John Smith created successfully"
}
```

#### Get Organization Admins
```
GET /org/{org_id}/admins

Response:
{
  "status": "success",
  "total": 2,
  "admins": [
    {
      "id": 10,
      "name": "John Smith",
      "email": "john@vijaycare.com",
      "phone": "1234567890",
      "role": "admin",
      "created_at": "2026-06-12T10:30:00"
    }
  ]
}
```

#### Delete Admin
```
DELETE /org/admins/{admin_id}

Response:
{
  "status": "success",
  "message": "Admin deleted successfully"
}
```

### Organization Admin Authentication

#### Login
```
POST /org-admin/login
Request:
{
  "email": "john@vijaycare.com",
  "password": "secure_password",
  "organization": "Vijay Care"
}

Response:
{
  "status": "success",
  "org_id": 1,
  "admin_id": 10,
  "name": "John Smith",
  "org_name": "Vijay Care",
  "token": "ORG_VIJAY_CARE_abc12345",
  "message": "Welcome John Smith"
}
```

#### Sign Up
```
POST /org-admin/signup
Request:
{
  "name": "Jane Doe",
  "email": "jane@vijaycare.com",
  "phone": "9876543210",
  "password": "secure_password",
  "organization": "Vijay Care"
}

Response:
{
  "status": "success",
  "admin_id": 11,
  "name": "Jane Doe",
  "email": "jane@vijaycare.com",
  "org_id": 1,
  "token": "ORG_VIJAY_CARE_abc12345",
  "message": "Account created successfully! Please log in."
}
```

---

## 5. Frontend Routes

### Super Admin Routes
- `/admin/login` - Super admin login
- `/admin/dashboard` - Organization management portal

### Organization Routes
- `/:orgSlug-org-admin` - Token verification page
- `/:orgSlug-org-admin/login` - Sign In/Sign Up page
- `/org/portal` - Organization admin dashboard
- `/org/dashboard` - Alternative org dashboard

---

## 6. Data Storage

### Database Tables Used
- `organizations` - Organization master data
- `organization_admins` - Organization-level admins
- `hospitals` - Hospitals under organizations
- `hospital_staff` - Hospital staff/doctors
- `ai_models` - Available AI models
- `organization_models` - Models assigned to organizations
- `patients` - Patient records
- `diagnoses` - AI diagnosis results
- `support_tickets` - Support requests
- `feedback` - User feedback
- `consultations` - Medical consultations

---

## 7. Key Features

### Organization Features
- ✅ Unique token generation per organization
- ✅ Organization-specific portal URL
- ✅ Token-based access verification
- ✅ Organization logo display (color-coded: yellow, orange, blue, light yellow)
- ✅ Multi-admin support per organization
- ✅ Hospital management interface
- ✅ AI model pricing display (Free/Premium)
- ✅ Dashboard statistics

### Security Features
- ✅ Token verification before portal access
- ✅ Email/password authentication for admins
- ✅ Role-based access control
- ✅ Session management via localStorage
- ✅ Organization data isolation
- ✅ Admin deletion for security

### Data Collection
- Doctors: Name, Email, Phone, Specialization
- Patients: Name, Age, Gender, Medical History
- Government requirements: Disease surveillance, vaccination records, health statistics

---

## 8. Example Workflow

### Complete Organization Onboarding

1. **Super Admin Creates Organization**
   - Visit: http://localhost:5173/admin/dashboard
   - Login: anbu@1001 / anbu@1001
   - Click: Add Organization
   - Fill: Vijay Care, admin@vijaycare.com, etc.
   - Get: Token `ORG_VIJAY_CARE_abc12345`
   - Get: URL `http://localhost:5173/vijay-org-admin`

2. **Share with Organization Owner**
   - Email token and URL to organization owner
   - Owner navigates to: http://localhost:5173/vijay-org-admin

3. **Organization Owner Verifies Token**
   - Paste token: `ORG_VIJAY_CARE_abc12345`
   - Click: Verify Token
   - Redirected to sign in/sign up page

4. **Organization Owner Signs Up**
   - Name: Vijay Kumar
   - Email: vijay@vijaycare.com
   - Phone: 9876543210
   - Password: secure123
   - Click: Create Account

5. **Organization Owner Logs In**
   - Email: vijay@vijaycare.com
   - Password: secure123
   - Click: Sign In
   - Redirected to: /org/portal

6. **Organization Owner Creates Admins**
   - Go to: Admins tab
   - Click: Create Admin
   - Add hospital managers, doctors, etc.
   - Manage hospitals and AI model access

---

## 9. Customization

### Organization Theming
Organizations can be customized with:
- Organization logo (from LOGO folder)
- Gradient color backgrounds
- Organization name display
- Custom portal URLs

Current organizations:
- **Vijay**: Yellow theme
- **BJP**: Orange theme
- **Modi**: Blue theme
- **CBN**: Light yellow theme

---

## 10. Testing Credentials

### Super Admin
- Email: `anbu@1001`
- Password: `anbu@1001`

### Organization Access (After Creation)
- Token: Generated automatically
- URL: `/{org-name}-org-admin`
- Admin credentials: Created by organization owner during sign up

---

## 11. Troubleshooting

### Token Not Verifying
- Check token is exactly copied from super admin dashboard
- Verify organization name matches
- Check database for organization record

### Cannot Login to Organization
- Ensure account was created via sign up first
- Check email and password are correct
- Verify organization exists in database

### Admin Not Showing in List
- Refresh the page (Ctrl+F5)
- Check if admin was successfully created
- Verify organization_id matches in database

### Portal Not Loading
- Check browser console for errors
- Verify orgAdminToken is in localStorage
- Check if user is authenticated

---

## 12. Next Steps

- Add hospital creation within organization portal
- Implement AI model selection for hospitals
- Add government data collection forms
- Implement payment/billing for premium models
- Add analytics and reporting features
- Implement notification system
- Add user activity logging

---

## Support

For issues or questions, contact MacvaarAI admin or check the server logs.

Last Updated: 2026-06-12
