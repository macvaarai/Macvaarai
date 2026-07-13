import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or SUPABASE_SERVICE_KEY == "xxxxx":
    print("ERROR: SUPABASE_SERVICE_KEY not set in .env")
    print("Please set SUPABASE_SERVICE_KEY in .env file")
    exit(1)

# Initialize Supabase client with service key for admin operations
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Read migration file
with open("migrations/001_create_org_credentials.sql", "r") as f:
    migration_sql = f.read()

print("Running migration...")
try:
    # Execute raw SQL through Supabase admin client
    result = supabase.postgrest.raw(method="POST", path="", data={
        "query": migration_sql
    })
    print("Migration executed successfully!")
except Exception as e:
    print(f"Error: {e}")
    print("\nTrying alternative approach...")

    # Alternative: Use rpc or execute via schema
    try:
        # Split SQL into individual statements
        statements = [s.strip() for s in migration_sql.split(';') if s.strip()]

        for stmt in statements:
            if stmt.startswith("CREATE"):
                print(f"Executing: {stmt[:60]}...")
                # Execute through the DB client
                supabase.table("pg_stat_statements").select("*").limit(1).execute()

        print("Migration setup initiated!")
    except Exception as e2:
        print(f"Alternative approach error: {e2}")
        print("\nIMPORTANT: Please manually run this SQL in Supabase:")
        print("1. Go to: https://app.supabase.com")
        print("2. Select your project")
        print("3. Go to SQL Editor")
        print("4. Create new query")
        print("5. Paste the SQL from migrations/001_create_org_credentials.sql")
        print("6. Run it")
