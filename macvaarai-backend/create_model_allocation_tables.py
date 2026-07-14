import sqlite3

conn = sqlite3.connect('health_platform.db')
cursor = conn.cursor()

# Create table to track which models each hospital has access to
cursor.execute('''
    CREATE TABLE IF NOT EXISTS hospital_model_allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hospital_id INTEGER NOT NULL,
        model_id TEXT NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
        UNIQUE(hospital_id, model_id)
    )
''')

# Create similar tables for other care types
cursor.execute('''
    CREATE TABLE IF NOT EXISTS school_model_allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        model_id TEXT NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(school_id, model_id)
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS district_model_allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district_id INTEGER NOT NULL,
        model_id TEXT NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(district_id, model_id)
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS police_model_allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        police_id INTEGER NOT NULL,
        model_id TEXT NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(police_id, model_id)
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS women_model_allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        women_org_id INTEGER NOT NULL,
        model_id TEXT NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(women_org_id, model_id)
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS office_model_allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        office_id INTEGER NOT NULL,
        model_id TEXT NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(office_id, model_id)
    )
''')

conn.commit()

# Add sample allocations
# Apollo Hospital gets 4 models
cursor.execute('''
    INSERT OR IGNORE INTO hospital_model_allocations (hospital_id, model_id)
    VALUES
    (6, 'eye'),
    (6, 'covid'),
    (6, 'pneumonia'),
    (6, 'diabetes')
''')

# Greenwood School gets 3 models
cursor.execute('''
    INSERT OR IGNORE INTO school_model_allocations (school_id, model_id)
    VALUES
    (1, 'eye'),
    (1, 'covid'),
    (1, 'pneumonia')
''')

# Chennai District gets 5 models
cursor.execute('''
    INSERT OR IGNORE INTO district_model_allocations (district_id, model_id)
    VALUES
    (1, 'eye'),
    (1, 'covid'),
    (1, 'pneumonia'),
    (1, 'diabetes'),
    (1, 'skin')
''')

# Chennai Police gets 2 models
cursor.execute('''
    INSERT OR IGNORE INTO police_model_allocations (police_id, model_id)
    VALUES
    (1, 'eye'),
    (1, 'covid')
''')

# Women Empowerment Centre gets 3 models
cursor.execute('''
    INSERT OR IGNORE INTO women_model_allocations (women_org_id, model_id)
    VALUES
    (1, 'eye'),
    (1, 'diabetes'),
    (1, 'throat')
''')

# Vijay Care HQ gets all models
cursor.execute('''
    INSERT OR IGNORE INTO office_model_allocations (office_id, model_id)
    VALUES
    (1, 'eye'),
    (1, 'covid'),
    (1, 'pneumonia'),
    (1, 'skin'),
    (1, 'malaria'),
    (1, 'dengue'),
    (1, 'diabetes'),
    (1, 'ear'),
    (1, 'nose'),
    (1, 'throat'),
    (1, 'oral'),
    (1, 'pharyngitis'),
    (1, 'colorectal'),
    (1, 'lung'),
    (1, 'onelead'),
    (1, 'twelvelead'),
    (1, 'vitamind')
''')

conn.commit()
conn.close()

print("[OK] Model allocation tables created successfully!")
print("\nAllocations added:")
print("- Apollo Hospital: 4 models (eye, covid, pneumonia, diabetes)")
print("- Greenwood School: 3 models (eye, covid, pneumonia)")
print("- Chennai District: 5 models (eye, covid, pneumonia, diabetes, skin)")
print("- Chennai Police: 2 models (eye, covid)")
print("- Women Empowerment Centre: 3 models (eye, diabetes, throat)")
print("- Vijay Care HQ: 17 models (all)")
