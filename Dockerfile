FROM python:3.11.8-slim

WORKDIR /app

# Copy requirements
COPY macvaarai-backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY macvaarai-backend/ .

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
