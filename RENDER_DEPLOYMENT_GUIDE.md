# 🚀 Deploy to Render - Complete Guide

## **PART 1: PREREQUISITES**

### **What You Need:**
1. ✅ GitHub account with your code pushed
2. ✅ Render account (https://render.com)
3. ✅ Your repository: https://github.com/macvaarai/Macvaarai

### **Create Render Account:**
```
1. Go to https://render.com
2. Click "Sign Up"
3. Use GitHub to sign up (recommended)
4. Authorize Render to access your GitHub
5. Verify email
```

---

## **PART 2: DEPLOY BACKEND (FastAPI)**

### **Step 1: Create New Web Service**
```
1. Log in to https://render.com/dashboard
2. Click "+ New" button
3. Select "Web Service"
4. Select your GitHub repository
5. Connect your GitHub account if needed
```

### **Step 2: Configure Backend Service**

**Service Name:**
```
macvaarai-backend
```

**Environment:**
```
Python 3 (should auto-detect)
```

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Region:**
```
Choose closest region (e.g., Singapore, US)
```

**Plan:**
```
Free (for testing)
or Starter ($7/month)
```

### **Step 3: Add Environment Variables**

Click "Advanced" → "Add Environment Variable"

```
DATABASE_URL=sqlite:///./health_platform.db
PYTHON_VERSION=3.11
```

### **Step 4: Deploy**
```
Click "Create Web Service"
Wait for deployment (2-5 minutes)
```

### **Step 5: Get Backend URL**

After deployment, you'll see:
```
Backend URL: https://macvaarai-backend.onrender.com
(or similar unique URL)
```

**Save this URL!** You need it for frontend.

---

## **PART 3: DEPLOY FRONTEND (React/Vite)**

### **Step 1: Create Vite Build Config**

Create `macvaarai-frontend/macvaarai-frontend/render.yaml`:
```yaml
services:
  - type: web
    name: macvaarai-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublicPath: /dist
    routes:
      - path: /*
        destination: /index.html
```

### **Step 2: Update Vite Config**

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://macvaarai-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### **Step 3: Create .env.production**

Create `macvaarai-frontend/macvaarai-frontend/.env.production`:
```
VITE_API_URL=https://macvaarai-backend.onrender.com
```

### **Step 4: Create New Web Service for Frontend**

```
1. Go to https://render.com/dashboard
2. Click "+ New"
3. Select "Static Site"
4. Select your GitHub repository
5. Configure as below
```

### **Step 5: Configure Frontend Service**

**Service Name:**
```
macvaarai-frontend
```

**Publish Directory:**
```
macvaarai-frontend/macvaarai-frontend/dist
```

**Build Command:**
```
cd macvaarai-frontend/macvaarai-frontend && npm install && npm run build
```

**Environment Variables:**
```
VITE_API_URL=https://macvaarai-backend.onrender.com
```

### **Step 6: Deploy Frontend**
```
Click "Create Static Site"
Wait for deployment (2-5 minutes)
```

### **Step 7: Get Frontend URL**

After deployment:
```
Frontend URL: https://macvaarai-frontend.onrender.com
(or similar unique URL)
```

---

## **PART 4: CONNECT FRONTEND TO BACKEND**

### **Update API URL in Frontend**

All API calls in frontend use: `import.meta.env.VITE_API_URL`

This is already set in `.env.production` to:
```
VITE_API_URL=https://macvaarai-backend.onrender.com
```

### **Verify Connections**

1. Open frontend URL
2. Go to Admin Dashboard
3. If it loads without errors → ✅ Connected!
4. If you see API errors → Check backend URL

---

## **PART 5: BACKEND DATABASE SETUP**

### **Important: Database on Render**

**Free Plan Issue:** SQLite database doesn't persist on free Render
- Each reboot deletes the database
- Use PostgreSQL for production

### **Option A: Use PostgreSQL (Recommended)**

**Setup PostgreSQL:**
```
1. In Render dashboard, create new PostgreSQL database
2. Get database URL: postgresql://...
3. Add to backend environment variables
```

**Update Backend Code:**

Edit `macvaarai-backend/main.py`:
```python
import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./health_platform.db"
)

if DATABASE_URL.startswith("postgresql"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
```

**Add to Requirements:**
```
psycopg2-binary
sqlalchemy
```

### **Option B: Keep SQLite (Development)**

SQLite works but data resets on free plan:
```
DATABASE_URL=sqlite:///./health_platform.db
```

---

## **PART 6: CORS SETUP**

### **Allow Frontend to Access Backend**

Edit `macvaarai-backend/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://macvaarai-frontend.onrender.com",  # Your frontend URL
        "*"  # Allow all (not recommended for production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## **PART 7: ENVIRONMENT VARIABLES CHECKLIST**

### **Backend (.env or Render Settings)**
```
DATABASE_URL=sqlite:///./health_platform.db
PYTHON_VERSION=3.11
CORS_ORIGINS=https://macvaarai-frontend.onrender.com
```

### **Frontend (.env.production)**
```
VITE_API_URL=https://macvaarai-backend.onrender.com
```

---

## **PART 8: TROUBLESHOOTING**

### **Frontend Shows "Cannot reach API"**

**Solution:**
```
1. Check backend URL in .env.production
2. Verify backend is running (visit https://macvaarai-backend.onrender.com)
3. Check CORS settings in backend
4. Rebuild frontend: npm run build
```

### **Backend 502 Bad Gateway Error**

**Solution:**
```
1. Check logs in Render dashboard
2. Verify requirements.txt has all dependencies
3. Check start command: uvicorn main:app --host 0.0.0.0 --port 8000
4. Restart service
```

### **Database Connection Error**

**Solution:**
```
1. If using SQLite: Data resets on restart (use PostgreSQL)
2. If using PostgreSQL: Verify DATABASE_URL format
3. Check database credentials in environment variables
```

### **"Module not found" Error**

**Solution:**
```
1. Verify requirements.txt is in root of backend folder
2. Add missing packages: pip install [package-name]
3. Update requirements.txt: pip freeze > requirements.txt
4. Push to GitHub and redeploy
```

---

## **PART 9: DEPLOYMENT CHECKLIST**

### **Before Deploying:**
- ✅ All code committed to GitHub
- ✅ `.env` files created (`.env.production` for frontend)
- ✅ `requirements.txt` up to date (backend)
- ✅ `package.json` dependencies correct (frontend)
- ✅ CORS settings configured
- ✅ Build commands tested locally

### **After Deploying:**
- ✅ Backend URL accessible
- ✅ Frontend URL accessible
- ✅ Frontend can reach backend API
- ✅ Admin dashboard loads
- ✅ Can login with tokens
- ✅ AI models work
- ✅ Database persists data

---

## **PART 10: LIVE URLS**

Once deployed, your app will be at:

```
Frontend: https://macvaarai-frontend.onrender.com
Backend API: https://macvaarai-backend.onrender.com
Admin Dashboard: https://macvaarai-frontend.onrender.com/admin/dashboard
```

---

## **QUICK SUMMARY**

```
1. Create Render account (sign up with GitHub)
2. Deploy backend:
   - Service type: Web Service
   - Build: pip install -r requirements.txt
   - Start: uvicorn main:app --host 0.0.0.0 --port 8000
3. Deploy frontend:
   - Service type: Static Site
   - Build: npm install && npm run build
   - Publish: dist folder
4. Connect:
   - Update frontend .env.production with backend URL
   - Configure CORS in backend
   - Redeploy frontend
5. Test:
   - Visit frontend URL
   - Check API calls work
   - Test admin dashboard
```

---

## **COST ESTIMATE**

```
Free Plan:
- Frontend: Free (Static Site)
- Backend: Free (sleeps after 15 min inactivity)

Starter Plan:
- Frontend: Free
- Backend: $7/month

Pro Plan (PostgreSQL):
- Frontend: Free
- Backend: $7+/month
- Database: $15+/month
```

---

**You're ready to deploy to Render! 🚀**
