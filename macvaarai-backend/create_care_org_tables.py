import sqlite3

conn = sqlite3.connect('health_platform.db')
cursor = conn.cursor()

# Create schools table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Create districts table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS districts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Create police_org table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS police_org (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Create women_org table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS women_org (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Create offices table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS offices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

conn.commit()

# Add sample data
sample_schools = [
    ('Greenwood School', 'school@greenwood.edu', 'school123', '9876543210'),
    ('Modern Academy', 'admin@modern.edu', 'modern123', '9876543211'),
]

sample_districts = [
    ('Chennai District', 'district@chennai.gov', 'district123', '9876543212'),
    ('Bangalore District', 'district@bangalore.gov', 'bangalore123', '9876543213'),
]

sample_police = [
    ('Chennai Police', 'police@tn.gov', 'police123', '9876543214'),
    ('Bangalore Police', 'police@karnataka.gov', 'bangalore_police123', '9876543215'),
]

sample_women = [
    ('Women Empowerment Centre', 'women@empowerment.org', 'women123', '9876543216'),
    ('Naari Sashaktikaran', 'contact@naari.org', 'naari123', '9876543217'),
]

sample_offices = [
    ('Vijay Care HQ', 'hq@vijaycare.org', 'vijay123', '9876543218'),
]

try:
    for name, email, password, phone in sample_schools:
        cursor.execute('INSERT OR IGNORE INTO schools (name, email, password, phone) VALUES (?, ?, ?, ?)',
                      (name, email, password, phone))
    print(f"[OK] Added {len(sample_schools)} schools")
except Exception as e:
    print(f"[ERROR] Schools: {e}")

try:
    for name, email, password, phone in sample_districts:
        cursor.execute('INSERT OR IGNORE INTO districts (name, email, password, phone) VALUES (?, ?, ?, ?)',
                      (name, email, password, phone))
    print(f"[OK] Added {len(sample_districts)} districts")
except Exception as e:
    print(f"[ERROR] Districts: {e}")

try:
    for name, email, password, phone in sample_police:
        cursor.execute('INSERT OR IGNORE INTO police_org (name, email, password, phone) VALUES (?, ?, ?, ?)',
                      (name, email, password, phone))
    print(f"[OK] Added {len(sample_police)} police orgs")
except Exception as e:
    print(f"[ERROR] Police: {e}")

try:
    for name, email, password, phone in sample_women:
        cursor.execute('INSERT OR IGNORE INTO women_org (name, email, password, phone) VALUES (?, ?, ?, ?)',
                      (name, email, password, phone))
    print(f"[OK] Added {len(sample_women)} women orgs")
except Exception as e:
    print(f"[ERROR] Women: {e}")

try:
    for name, email, password, phone in sample_offices:
        cursor.execute('INSERT OR IGNORE INTO offices (name, email, password, phone) VALUES (?, ?, ?, ?)',
                      (name, email, password, phone))
    print(f"[OK] Added {len(sample_offices)} offices")
except Exception as e:
    print(f"[ERROR] Offices: {e}")

conn.commit()
conn.close()

print("\nCare organization tables created and populated!")
print("\nTest Credentials:")
print("\nSchools:")
print("  - school@greenwood.edu / school123")
print("  - admin@modern.edu / modern123")
print("\nDistricts:")
print("  - district@chennai.gov / district123")
print("  - district@bangalore.gov / bangalore123")
print("\nPolice:")
print("  - police@tn.gov / police123")
print("  - police@karnataka.gov / bangalore_police123")
print("\nWomen Organizations:")
print("  - women@empowerment.org / women123")
print("  - contact@naari.org / naari123")
print("\nOffices:")
print("  - hq@vijaycare.org / vijay123")
