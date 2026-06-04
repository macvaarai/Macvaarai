================================================================================
                    🏥 AI HEALTH PLATFORM - QUICK START
================================================================================

OVERVIEW:
Complete AI-powered medical diagnosis platform with:
  ✓ 8 AI Models (Eye, COVID, ECG, Skin, Diabetes, Pneumonia, Malaria, Dengue)
  ✓ Multi-tenant Admin System (Hero Admin + Hospital Admins)
  ✓ Persistent Conversation History
  ✓ PDF Report Generation
  ✓ SQLite Database (Works Offline, Portable)

================================================================================
                              REQUIREMENTS
================================================================================

  ✓ Python 3.9+ (python.org)
  ✓ Node.js 16+ (nodejs.org)
  ✓ 2GB Free Disk Space
  ✓ 4GB RAM Minimum

Check versions:
  python --version
  npm --version

================================================================================
                         FIRST-TIME SETUP (5 MINUTES)
================================================================================

1. BACKEND SETUP
   cd "path\to\bhai health\macvaarai-backend"
   python -m venv venv
   source venv/Scripts/activate    (Windows: venv\Scripts\activate)
   pip install -r requirements.txt
   python setup_db.py              ← Initializes database!

2. FRONTEND SETUP
   cd "path\to\bhai health\macvaarai-frontend\macvaarai-frontend"
   npm install
   Create .env.local with: VITE_API_URL=http://localhost:8000

3. VERIFY INSTALLATION
   Look for:
   ✓ health_platform.db file created (in backend folder)
   ✓ No errors in terminal
   ✓ npm install completed

================================================================================
                         RUNNING THE APPLICATION
================================================================================

Terminal 1 - BACKEND:
  cd "path\to\bhai health\macvaarai-backend"
  source venv/Scripts/activate
  python -m uvicorn main:app --reload

Terminal 2 - FRONTEND:
  cd "path\to\bhai health\macvaarai-frontend\macvaarai-frontend"
  npm run dev

WAIT FOR:
  Backend: "INFO:     Uvicorn running on http://127.0.0.1:8000"
  Frontend: "➜  Local:   http://localhost:5173/"

THEN OPEN:
  http://localhost:5173

================================================================================
                            DEMO ACCOUNTS
================================================================================

HERO ADMIN (Full System Control):
  Email: hero@macvaarai.com
  Password: admin123

HOSPITAL ADMIN (Apollo Hospital Only):
  Email Method:
    Email: raj@apollo.com
    Password: admin123

  Access Key Method:
    Access Key: ACCESS123

================================================================================
                          WHAT YOU CAN DO
================================================================================

AS REGULAR USER:
  ✓ Select medical model (Eye, COVID, ECG, etc.)
  ✓ Upload medical image OR type symptoms
  ✓ Get instant AI diagnosis
  ✓ Download PDF report
  ✓ View conversation history (auto-saved)
  ✓ Filter history by date
  ✓ Delete conversations

AS HOSPITAL ADMIN:
  ✓ View hospital staff, patients, appointments
  ✓ Access only your hospital's data
  ✓ Use only granted AI models
  ✓ View generated reports
  ✓ Contact support

AS HERO ADMIN:
  ✓ Create hospitals
  ✓ Grant hospital admins access
  ✓ Select models for each admin
  ✓ View all system data
  ✓ View audit logs
  ✓ User management

================================================================================
                        DATABASE (SQLite)
================================================================================

Location: c:\bhai health\macvaarai-backend\health_platform.db

Data Stored:
  ✓ Admin accounts
  ✓ Hospitals & staff
  ✓ Users & appointments
  ✓ Conversations & history
  ✓ Generated reports
  ✓ Audit logs

Backup: Database automatically backs up in setup_db.py
Transfer: Just copy the entire folder to another computer!

Reset Database:
  cd backend folder
  python setup_db.py  (will reinitialize with demo data)

================================================================================
                         TRANSFER TO ANOTHER SYSTEM
================================================================================

1. Copy entire "bhai health" folder to new location
2. On new system:
   cd "new location\macvaarai-backend"
   python -m venv venv
   source venv/Scripts/activate
   pip install -r requirements.txt
   python setup_db.py

3. Continue with frontend setup and running application
4. Everything works the same!

================================================================================
                          TROUBLESHOOTING
================================================================================

Backend won't start?
  → Check Python version: python --version
  → Activate venv: source venv/Scripts/activate
  → Reinstall: pip install -r requirements.txt --upgrade

Frontend won't start?
  → Check Node version: npm --version
  → Clear cache: npm cache clean --force
  → Reinstall: npm install

Port already in use?
  → Backend on 8001: python -m uvicorn main:app --reload --port 8001
  → Update .env.local: VITE_API_URL=http://localhost:8001

Database issues?
  → Delete health_platform.db
  → Run: python setup_db.py

Can't login?
  → Check demo account credentials above
  → Verify database created (health_platform.db exists)
  → Check browser console for errors (F12)

================================================================================
                        COMPLETE DOCUMENTATION
================================================================================

For detailed setup, troubleshooting, and features, see:
  → SETUP.md (Complete 10,000+ word guide)

All in one file! No need to read multiple documents.

================================================================================
                          API DOCUMENTATION
================================================================================

While backend is running, visit:
  http://localhost:8000/docs

Interactive API explorer with all endpoints.

================================================================================
                              STATUS
================================================================================

✅ Backend: Ready (FastAPI + SQLite)
✅ Frontend: Ready (React + Vite)
✅ Database: Ready (SQLite, Portable)
✅ Admin System: Ready (Complete)
✅ History: Ready (Persistent)
✅ All Models: Ready (8 AI Models)
✅ PDF Reports: Ready

🚀 EVERYTHING IS READY TO USE!

================================================================================
                          TECHNICAL STACK
================================================================================

Backend:
  • FastAPI (Python web framework)
  • SQLite (Database)
  • TensorFlow/PyTorch (ML models)
  • Reportlab (PDF generation)
  • CLIP (Image classification)

Frontend:
  • React 18 (UI Framework)
  • Vite (Build tool)
  • Tailwind CSS (Styling)
  • React Router (Navigation)

Database:
  • SQLite (Embedded, no setup needed)
  • Portable (works anywhere)
  • Automated backups

================================================================================
                          QUICK COMMANDS
================================================================================

# Backend setup
cd backend && python -m venv venv && venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python setup_db.py

# Start backend
python -m uvicorn main:app --reload

# Frontend setup
cd frontend && npm install

# Start frontend
npm run dev

# Clear npm cache
npm cache clean --force

# Reset database
python setup_db.py

================================================================================
                            SUPPORT
================================================================================

Documentation: SETUP.md (comprehensive guide)
API Docs: http://localhost:8000/docs
Database: health_platform.db (view with DB Browser for SQLite)

For errors:
  1. Check terminal output
  2. Check browser console (F12)
  3. Verify demo account credentials
  4. Check SETUP.md troubleshooting section

================================================================================
                        VERSION & STATUS
================================================================================

Version: 1.0.0
Status: Production Ready ✅
Last Updated: 2026-06-02

Ready to deploy on any Windows, Mac, or Linux system!

================================================================================
