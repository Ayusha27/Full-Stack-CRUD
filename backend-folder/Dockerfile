FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements FIRST (better caching)
COPY requirements.txt .

# Force install uvicorn explicitly just in case it's missing from requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir uvicorn fastapi psycopg2-binary langchain-groq python-dotenv

# Now install the rest of your requirements
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Use the full path to uvicorn
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]