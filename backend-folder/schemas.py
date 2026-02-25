from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import date


# --- PROGRAM SCHEMAS ---

class QuotaBase(BaseModel):
    quota_type: str
    total_seats: int


class ProgramCreate(BaseModel):
    name: str
    code: str
    course_type: str
    institution_name: str
    campus_name: str
    total_intake: int
    quotas: List[QuotaBase]


class ProgramResponse(ProgramCreate):
    id: int

    # Modern Pydantic v2 way to handle ORM/SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)


# --- APPLICANT SCHEMAS ---

class ApplicantBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    category: str
    entry_type: str
    quota_type: str
    program_id: int
    gender: str
    dob: date  # Pydantic will expect "YYYY-MM-DD"
    address: str
    marks_10th: float
    marks_12th: float
    parent_name: str
    blood_group: str
    document_status: str = "Pending"
    fee_paid: bool = False


class ApplicantCreate(ApplicantBase):
    """Schema for incoming POST requests"""
    pass


class ApplicantResponse(ApplicantBase):
    """Schema for outgoing API responses"""
    id: int
    admission_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)