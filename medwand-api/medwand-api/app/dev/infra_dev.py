import boto3
import json
import secrets
import string
import time
import psycopg2

REGION = "us-east-2"
SECRET_NAME = "bhai/dev/credentials"

def get_existing_secret():
    client = boto3.client("secretsmanager", region_name=REGION)
    try:
        response = client.get_secret_value(SecretId=SECRET_NAME)
        print("Fetched existing secret from Secrets Manager.")
        return json.loads(response["SecretString"])
    except client.exceptions.ResourceNotFoundException:
        print("Secret not found. A new one will be created.")
        return None

# RDS setup

DB_INSTANCE_ID = "dev-bhai-instance"
existing_secret = get_existing_secret()

if existing_secret:
    DB_NAME = existing_secret["dbname"]
    DB_USERNAME = existing_secret["username"]
    DB_PASSWORD = existing_secret["password"]
else:
    DB_NAME = "bhai_dev"
    DB_USERNAME = "bhai_admin"
    DB_PASSWORD = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))




# S3 bucket name
S3_BUCKET = "dev-medwand-reports-bucket"

VPC_SECURITY_GROUP_ID = "sg-0d90db33aa95ecfae" 
DB_SUBNET_GROUP_NAME = "default-vpc-0d6871abb7916e515" 

def create_rds_instance():
    rds = boto3.client("rds", region_name=REGION)
    try:
        rds.create_db_instance(
            DBInstanceIdentifier=DB_INSTANCE_ID,
            AllocatedStorage=20,
            DBName=DB_NAME,
            Engine='postgres',
            MasterUsername=DB_USERNAME,
            MasterUserPassword=DB_PASSWORD,
            DBInstanceClass='db.t3.micro',
            VpcSecurityGroupIds=[VPC_SECURITY_GROUP_ID],
            DBSubnetGroupName=DB_SUBNET_GROUP_NAME,
            PubliclyAccessible=True,
            BackupRetentionPeriod=1,
            MultiAZ=False
        )
        print("RDS instance creation started.")
    except rds.exceptions.DBInstanceAlreadyExistsFault:
        print("RDS instance already exists.")



def wait_for_rds_and_get_endpoint():
    rds = boto3.client("rds", region_name=REGION)
    while True:
        response = rds.describe_db_instances(DBInstanceIdentifier=DB_INSTANCE_ID)
        status = response["DBInstances"][0]["DBInstanceStatus"]
        print(f"RDS status: {status}")
        if status == "available":
            endpoint = response["DBInstances"][0]["Endpoint"]["Address"]
            print(f"RDS is ready at: {endpoint}")
            return endpoint
        time.sleep(20)

def get_or_create_secret(endpoint):
    client = boto3.client("secretsmanager", region_name=REGION)
    try:
     
        response = client.get_secret_value(SecretId=SECRET_NAME)
        secret_data = json.loads(response["SecretString"])
        print("Existing secret found. Using stored credentials.")
        return secret_data  # Use existing credentials
    except client.exceptions.ResourceNotFoundException:
        # Secret doesn't exist, create a new one
        secret_data = {
            "host": endpoint,
            "port": "5432",
            "dbname": DB_NAME,
            "username": DB_USERNAME,
            "password": DB_PASSWORD  
        }
        client.create_secret(
            Name=SECRET_NAME,
            SecretString=json.dumps(secret_data)
        )
        print("Secret created in Secrets Manager.")
        return secret_data

'''''
def store_secret(endpoint):
    client = boto3.client("secretsmanager", region_name=REGION)
    secret_data = {
        "host": endpoint,
        "port": "5432",
        "dbname": DB_NAME,
        "username": DB_USERNAME,
        "password": DB_PASSWORD
    }
    try:
        client.create_secret(
            Name=SECRET_NAME,
            SecretString=json.dumps(secret_data)
        )
        print("Secret created in Secrets Manager.")
    except client.exceptions.ResourceExistsException:
        print("Secret already exists. Skipping secret creation.")
'''
def create_table(endpoint):
    conn = psycopg2.connect(
        host=endpoint, port=5432, database=DB_NAME, user=DB_USERNAME, password=DB_PASSWORD
    )
    cursor = conn.cursor()
    #create medwan_reports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medwand_reports (
            appointment_id TEXT PRIMARY KEY,
            doctor_name TEXT,
            patient_name TEXT,
            exam_type TEXT,
            report_json JSONB,
            s3_url TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)
    #create user profiles table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        aadhar VARCHAR(20),
        appointment_id VARCHAR(50),
        password VARCHAR(100),
        gender VARCHAR(10),
        age INTEGER,
        contact VARCHAR(100)
        );
    """)
    conn.commit()
    conn.close()
    print("PostgreSQL table created.")

def create_s3_bucket():
    s3 = boto3.client("s3", region_name=REGION)
    try:
        s3.create_bucket(
            Bucket=S3_BUCKET,
            CreateBucketConfiguration={'LocationConstraint': REGION}
        )
        print(f"S3 bucket '{S3_BUCKET}' created.")
    except s3.exceptions.BucketAlreadyOwnedByYou:
        print(f"S3 bucket '{S3_BUCKET}' already exists.")
    except s3.exceptions.BucketAlreadyExists:
        print(f"Bucket name '{S3_BUCKET}' is taken globally.")

if __name__ == "__main__":
    create_rds_instance()
    endpoint = wait_for_rds_and_get_endpoint()
    secret_data = get_or_create_secret(endpoint)
    DB_USERNAME = secret_data["username"]
    DB_PASSWORD = secret_data["password"]
    create_table(endpoint)
    create_s3_bucket()