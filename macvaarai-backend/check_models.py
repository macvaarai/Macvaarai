import sqlite3
import json

db = sqlite3.connect('health_platform.db')
cursor = db.cursor()

print("=" * 70)
print("CHECKING SUBSCRIBED MODELS IN DATABASE")
print("=" * 70)

# Get hospitals with their subscribed models
cursor.execute('SELECT hospital_id, name, subscribed_models FROM hospitals')
hospitals = cursor.fetchall()

for hospital_id, name, models_data in hospitals:
    print(f"\nHospital: {name} (ID: {hospital_id})")
    print(f"Raw subscribed_models: {models_data}")

    if models_data:
        try:
            if isinstance(models_data, str):
                parsed = json.loads(models_data)
                print(f"Parsed models (count={len(parsed)}): {parsed}")
            else:
                print(f"Type: {type(models_data)}")
        except Exception as e:
            print(f"ERROR parsing JSON: {e}")
    else:
        print("Models data is NULL or empty!")

print("\n" + "=" * 70)
db.close()
