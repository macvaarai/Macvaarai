import sqlite3

conn = sqlite3.connect('health_platform.db')
cursor = conn.cursor()

# Delete all organizations except Vijay Care
cursor.execute("DELETE FROM organizations WHERE name != 'Vijay Care'")
deleted_count = cursor.rowcount

conn.commit()
print(f"[OK] Deleted {deleted_count} organizations")
print("[OK] Keeping only: Vijay Care")

# Display remaining organizations
cursor.execute("SELECT id, name, email FROM organizations")
orgs = cursor.fetchall()
print(f"\nRemaining Organizations ({len(orgs)}):")
for org in orgs:
    print(f"  - {org[1]} ({org[2]})")

conn.close()
