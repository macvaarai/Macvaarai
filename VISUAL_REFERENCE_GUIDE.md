# MacvaarAI Organization Portal - Visual Reference Guide

## What You Will See on Each Page

---

## 1. Super Admin Login Page
**URL**: http://localhost:5174/admin/login

### Page Elements
```
┌─────────────────────────────────────────────────┐
│          MacvaarAI Admin Portal                 │
│       (Dark background with gradient)            │
│                                                 │
│            [ADMIN LOGIN FORM]                   │
│                                                 │
│  Email: [______________________]               │
│                                                 │
│  Password: [______________________]            │
│                                                 │
│  [Remember me checkbox]                         │
│                                                 │
│  [        LOGIN BUTTON       ]                  │
│                                                 │
│  Forgot password? Reset here                    │
│                                                 │
└─────────────────────────────────────────────────┘

Credentials:
Email: anbu@1001
Password: anbu@1001
```

---

## 2. Super Admin Dashboard - Organizations Tab
**URL**: http://localhost:5174/admin/dashboard

### Page Elements
```
┌──────────────────────────────────────────────────────┐
│  📋 MacvaarAI Admin Dashboard                [Logout]│
│                                                      │
│  [Dashboard] [Organizations] [Hospitals] [Models]   │
│              ↑ Active Tab                            │
│                                                      │
│  Manage Organizations                               │
│  [+ Add Organization Button]                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Organizations Table                            │ │
│  ├─────────────────────────────────────────────────┤│
│  │Name  │Email          │Token         │Status    ││
│  ├─────────────────────────────────────────────────┤│
│  │TestOrg│test@test.com │ORG_TESTORG_* │Active    ││
│  │Vijay │vijay@gov.com  │ORG_VIJAY_*   │Active    ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Add Organization Modal
```
┌────────────────────────────────────────────────────┐
│  Create New Organization                       [X] │
│                                                    │
│  Organization Name *                              │
│  [______________________________]                  │
│                                                    │
│  Email Address *                                  │
│  [______________________________]                  │
│                                                    │
│  Phone           │ City                           │
│  [_____________] │ [________________]             │
│                                                    │
│  State                                            │
│  [______________________________]                  │
│                                                    │
│  [Create Organization] [Cancel]                   │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Success Popup
```
✓ Organization Created Successfully!

Organization: TestOrg
Generated Token: ORG_TESTORG_38b9666d
Portal URL: http://localhost:5174/testorg-org-admin

Share this token with the organization owner.
[Copy Token] [Copy URL]
```

---

## 3. Organization Token Verification Page
**URL**: http://localhost:5174/testorg-org-admin

### Page Elements
```
┌─────────────────────────────────────────────────────┐
│          [ORGANIZATION LOGO]                        │
│               Organization Name                     │
│            Healthcare Administration Portal         │
│   Official Government-Approved Healthcare System    │
│                                                     │
│   [Information Box]                                │
│   Please enter your organization token              │
│                                                     │
│   Organization Token *                             │
│   [__________________________________] [Eye Icon]  │
│   Token is case-sensitive                          │
│                                                     │
│   [  Verify Token  ]                               │
│                                                     │
│   Don't have a token?                              │
│   Contact MacvaarAI admin to get your token        │
│                                                     │
│   [Go Back to Home]                                │
│                                                     │
└─────────────────────────────────────────────────────┘

Colors:
- Header: Blue gradient (from-yellow-500 to-yellow-700)
- Logo: White rounded box
- Form: White background
- Button: Blue
```

---

## 4. Organization Sign In / Sign Up Page
**URL**: http://localhost:5174/testorg-org-admin/login

### Sign In Tab (Default)
```
┌─────────────────────────────────────────────────────┐
│          [ORGANIZATION LOGO]                        │
│               Organization Name                     │
│            Organization Portal                      │
│                                                     │
│   Email Address                                    │
│   [_______________________________]                 │
│                                                    │
│   Password                                         │
│   [_______________________________] [Eye Icon]      │
│                                                    │
│   [Remember me]                                    │
│                                                    │
│   [       Sign In       ]                          │
│                                                    │
│   Don't have an account?                           │
│   [Create one now]                                 │
│                                                    │
│   Secure Organization Portal                       │
│                                                    │
└─────────────────────────────────────────────────────┘
```

### Sign Up Tab
```
┌─────────────────────────────────────────────────────┐
│          [ORGANIZATION LOGO]                        │
│               Organization Name                     │
│            Organization Portal                      │
│                                                     │
│   Full Name *                                      │
│   [_______________________________]                 │
│                                                    │
│   Email Address *                                  │
│   [_______________________________]                 │
│                                                    │
│   Phone Number *                                   │
│   [_______________________________]                 │
│                                                    │
│   Password *                                       │
│   [_______________________________]                 │
│                                                    │
│   Confirm Password *                               │
│   [_______________________________]                 │
│                                                    │
│   [     Create Account     ]                       │
│                                                    │
│   [Back to Sign In]                                │
│                                                    │
└─────────────────────────────────────────────────────┘
```

---

## 5. Organization Portal Dashboard
**URL**: http://localhost:5174/org/portal (after login)

### Header Section
```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]  Organization Name                           [Logout]│
│          Healthcare Administration Portal                    │
│          Official Government-Approved System                 │
└──────────────────────────────────────────────────────────────┘

Colors:
- Background: Blue gradient (from-blue-900 via-blue-800 to-blue-900)
- Text: White
- Logout Button: Red
```

### Navigation Tabs
```
┌──────────────────────────────────────────────────────────────┐
│ Dashboard │ Team Members │ Hospitals │ AI Diagnostic Tools  │
│ ═════════   (underline showing active tab in blue)           │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Dashboard Tab View
**Active Tab**: Dashboard

### Page Content
```
┌──────────────────────────────────────────────────────────────┐
│ Organization Overview                                        │
│ Monitor and manage your healthcare organization              │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ Team Members │ │   Facilities │ │Diagnostic... │          │
│ │      X       │ │       X      │ │      18      │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                              │
│ ┌──────────────┐                                             │
│ │System Status │                                             │
│ │ 🟢 Active    │                                             │
│ └──────────────┘                                             │
│                                                              │
│ Organization Information                                    │
│ ┌────────────────────────────────────────────────────────┐  │
│ │Organization Name: Test Organization                    │  │
│ │Email: test@org.com                                     │  │
│ │Phone: 1234567890                                       │  │
│ │Location: Chennai, Tamil Nadu                           │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Access Token (Blue Box)                                     │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ORG_TESTORG_38b9666d                                    │  │
│ │[Copy Token]                                            │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Stat Card Colors:
- Team Members: Blue border-left
- Facilities: Green border-left
- Diagnostic: Purple border-left
- Status: Green border-left with animated dot
```

---

## 7. Team Members Tab View
**Active Tab**: Team Members

### Page Content
```
┌──────────────────────────────────────────────────────────────┐
│ Team Members                                                 │
│ Manage organization administrators and team members          │
│                                            [+ Add Team Member]│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Add New Team Member (Form - Initially Hidden)            ││
│ │ Full Name *                                              ││
│ │ [_______________________________________]                ││
│ │                                                          ││
│ │ Email *          │ Phone                                ││
│ │ [__________]     │ [__________________]                 ││
│ │                                                          ││
│ │ Password *       │ Confirm Password *                   ││
│ │ [__________]     │ [__________________]                 ││
│ │                                                          ││
│ │ [Add Team Member] [Cancel]                              ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ Team Members Table                                           │
│ ┌──────────────────────────────────────────────────────────┐│
│ │Name    │Email          │Phone        │Role    │Actions  ││
│ ├──────────────────────────────────────────────────────────┤│
│ │John    │john@org.com    │9876543210   │admin   │[Delete] ││
│ │Jane    │jane@org.com    │9876543211   │admin   │[Delete] ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Hospitals Tab View
**Active Tab**: Hospitals

### Page Content
```
┌──────────────────────────────────────────────────────────────┐
│ Healthcare Facilities                                        │
│ View all hospitals registered under your organization        │
│                                                              │
│ Hospitals Table                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │Hospital Name │Email           │Location    │Beds│Status ││
│ ├──────────────────────────────────────────────────────────┤│
│ │Apollo        │apollo@apl.com  │Mumbai, MH  │500 │Oper.  ││
│ │Max           │max@maxh.com    │Delhi, DL   │300 │Oper.  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ (If empty) "No hospitals registered yet"                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. AI Diagnostic Tools Tab View
**Active Tab**: AI Diagnostic Tools

### Page Content
```
┌──────────────────────────────────────────────────────────────┐
│ Diagnostic AI Tools                                          │
│ Available medical diagnostic models for your organization    │
│                                                              │
│ ┌──────────────────────────────┐ ┌──────────────────────────┐│
│ │ Premium Diagnostic Tools     │ │ Free Diagnostic Tools    ││
│ │ ₹5,000/year                  │ │ Free                     ││
│ │ Professional-grade models    │ │ Open-source models       ││
│ │                              │ │                          ││
│ │ Eye Disease, COVID-19, ECG,  │ │ Diabetes, Pneumonia,    ││
│ │ Skin Cancer, Tuberculosis,   │ │ Malaria, Dengue, etc.   ││
│ │ Stroke, Colorectal, Lung,    │ │                          ││
│ │ Throat                       │ │                          ││
│ └──────────────────────────────┘ └──────────────────────────┘│
│                                                              │
│ Complete AI Model Catalog (18 Models)                       │
│                                                              │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│ │Eye Disease       │ │COVID-19 Detection│ │ECG Analysis  │ │
│ │Detection         │ │                  │ │              │ │
│ │[Premium]         │ │[Premium]         │ │[Premium]     │ │
│ └──────────────────┘ └──────────────────┘ └──────────────┘ │
│                                                              │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│ │Skin Cancer       │ │Tuberculosis      │ │Diabetes      │ │
│ │Detection         │ │Detection         │ │Prediction    │ │
│ │[Premium]         │ │[Premium]         │ │[Free]        │ │
│ └──────────────────┘ └──────────────────┘ └──────────────┘ │
│                                                              │
│ (... 12 more models displayed in similar grid)              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Model Card Colors:
- Premium: Orange background (orange-50) with orange border
- Free: Green background (green-50) with green border
```

---

## Color Scheme Guide

### Professional Government Colors
```
Primary: Blue
  - Header: #1e3a8a (Dark Blue)
  - Active Tabs: #2563eb (Blue)
  - Links: #2563eb

Secondary: Green
  - Success: #16a34a
  - Status: #22c55e

Neutral:
  - Background: #ffffff (White)
  - Text: #111827 (Dark Gray)
  - Borders: #e5e7eb (Light Gray)

Accent:
  - Logout: #dc2626 (Red)
  - Premium Models: #ea580c (Orange)
```

---

## Responsive Design Breakpoints

### Desktop (1920px+)
- Full width layouts
- 4 columns for stat cards
- 3 columns for model grid
- All tabs visible

### Laptop (1366px)
- Full width layouts
- 4 columns for stat cards
- 3 columns for model grid
- All features visible

### Tablet (768px)
- Responsive width
- 2 columns for stat cards
- 2 columns for model grid
- Stacked forms

### Mobile (375px)
- Full mobile width
- 1 column for stat cards
- 1 column for model grid
- Vertical forms
- Hamburger menu (if needed)

---

## User Interactions

### Button Hover Effects
```
Primary Buttons (Blue)
Before: bg-blue-600
Hover:  bg-blue-700 + shadow

Secondary Buttons (Gray)
Before: bg-gray-200
Hover:  bg-gray-300

Delete Buttons
Before: text-red-600
Hover:  bg-red-50
```

### Form Field Focus
```
Border Change: gray-300 → blue-500
Ring Color: blue-500 (1px ring)
Animation: Smooth transition
```

### Dropdown/Tab Selection
```
Inactive: gray-600 text
Active:   blue-600 text + blue-600 border-bottom (4px)
```

---

## Expected Behaviors

### Page Loads
1. ✅ Dashboard loads with organization data
2. ✅ Tables populate with data
3. ✅ Stats cards show correct numbers
4. ✅ All tabs responsive to clicks

### Form Submissions
1. ✅ Validation checks fire
2. ✅ Success messages appear
3. ✅ Data persists after refresh
4. ✅ Errors display clearly

### Navigation
1. ✅ Tabs switch content smoothly
2. ✅ Logo visible on all pages
3. ✅ Logout clears session
4. ✅ Browser back button works

### Data Display
1. ✅ Organization name displays
2. ✅ Token shows correctly
3. ✅ Team members list updates
4. ✅ Models display with pricing

---

## Logo Display Verification

### Logo Locations
1. **Token Verification Page**
   - Size: 16x16 (1.3rem)
   - Background: White rounded box
   - Visible: ✅

2. **Dashboard Header**
   - Size: 4x4 (1rem)
   - Background: White rounded box
   - Visible: ✅

3. **Sign In/Sign Up Page**
   - Size: 5x5 (1.3rem)
   - Background: White rounded box
   - Visible: ✅

### Logo Files
```
✅ Vijay.jpeg   - Yellow theme
✅ BJP.jpeg     - Orange theme
✅ Modi.jpeg    - Blue theme
✅ CBN.jpg      - Light yellow theme
✅ Macvaar.jpg  - Default fallback
```

---

## Performance Observations

### Expected Load Times
- ✅ Page load: < 2 seconds
- ✅ API call: < 500ms
- ✅ Form submission: < 1 second
- ✅ Tab switching: Instant

### Expected Behaviors
- ✅ No console errors
- ✅ Smooth animations
- ✅ Responsive interactions
- ✅ Data persists correctly

---

**This guide shows exactly what you'll see when testing the MacvaarAI Organization Portal!**

**Ready to test? Go to**: http://localhost:5174/admin/login
