from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get your Mac username automatically, or replace 'postgres' with your Mac login name
# If you didn't set a password, leave the ':password' part out.
# SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/admission_db")
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:ayusha.nayak@db.urcaqrxanwygqitmumze.supabase.co:5432/postgres"
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL"
)
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:ayusha.nayak@db.urcaqrxanwygqitmumze.supabase.co:6543/postgres?sslmode=require"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300,
    # The dictionary below is the standard way to pass SSL to psycopg2
    connect_args={
        "connect_timeout": 10,
        "sslmode": "require"
    }
)

# engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

