# ⚡ Render Deployment - Quick Start (5 Minutes)

## **STEP 1: Go to Render Dashboard**
```
https://render.com/dashboard
```

---

## **STEP 2: Deploy Backend**

### Click "+ New" → "Web Service"

**Fill in:**
```
Name: macvaarai-backend
Region: Singapore (or nearest)
Branch: main
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port 8000
Plan: Free
```

**Click:** "Create Web Service"

**Wait:** 2-3 minutes for deployment

**Copy Backend URL:** (It will show like: https://macvaarai-backend.onrender.com)

---

## **STEP 3: Deploy Frontend**

### Click "+ New" → "Static Site"

**Fill in:**
```
Name: macvaarai-frontend
Region: Same as backend
Branch: main
Build Command: cd macvaarai-frontend/macvaarai-frontend && npm install && npm run build
Publish Directory: macvaarai-frontend/macvaarai-frontend/dist
```

**Environment Variables:**
```
VITE_API_URL = [Your Backend URL from Step 2]
```

**Click:** "Create Static Site"

**Wait:** 2-3 minutes for deployment

**Get Frontend URL:** (It will show like: https://macvaarai-frontend.onrender.com)

---

## **STEP 4: Test Your Deployment**

### Open Frontend
```
https://macvaarai-frontend.onrender.com
```

### Go to Admin Dashboard
```
https://macvaarai-frontend.onrender.com/admin/dashboard
```

### If it loads → ✅ SUCCESS!

---

## **STEP 5: If API Doesn't Work**

### Problem: "Cannot reach API"

**Solution:**
```
1. Go to macvaarai-frontend service in Render
2. Click "Environment" 
3. Set: VITE_API_URL = [Your Backend URL]
4. Click "Deploy" button
5. Wait for rebuild
```

---

## **THAT'S IT! 🎉**

Your app is now live on Render!

```
Frontend: https://macvaarai-frontend.onrender.com
Backend API: https://macvaarai-backend.onrender.com
Admin Login: https://macvaarai-frontend.onrender.com/admin/dashboard
```

---

## **COMMON ISSUES & FIXES**

### **Issue: 502 Bad Gateway (Backend)**
```
Fix:
1. Go to backend service
2. Click "Logs" tab
3. Check error messages
4. Usually: missing dependency in requirements.txt
5. Add the package, push to GitHub, redeploy
```

### **Issue: Frontend Shows Blank/Loading**
```
Fix:
1. Check browser console (F12)
2. If API errors: Update VITE_API_URL
3. If blank: Check build logs in Render
```

### **Issue: "Module not found" Error**
```
Fix:
1. Make sure requirements.txt is in macvaarai-backend/ folder
2. Run: pip freeze > requirements.txt
3. Push to GitHub
4. Redeploy on Render
```

---

## **AFTER DEPLOYMENT**

✅ Your code is live!
✅ Anyone can access via the URLs
✅ Changes auto-deploy when you push to GitHub
✅ Free plan for testing
✅ Upgrade to paid for production

---

**You're done! Your Macvaarai app is now on Render! 🚀**
