#!/usr/bin/env python3
"""Add logo_url column to hospitals table if it doesn't exist"""

import sqlite3

DATABASE_FILE = "health_platform.db"

def add_logo_column():
    """Add logo_url column to hospitals table"""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(hospitals)")
        columns = [column[1] for column in cursor.fetchall()]

        if 'logo_url' in columns:
            print("[OK] logo_url column already exists")
        else:
            print("[INFO] Adding logo_url column to hospitals table...")
            cursor.execute("ALTER TABLE hospitals ADD COLUMN logo_url TEXT")
            conn.commit()
            print("[SUCCESS] logo_url column added successfully")

    except Exception as e:
        print(f"[ERROR] {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_logo_column()
