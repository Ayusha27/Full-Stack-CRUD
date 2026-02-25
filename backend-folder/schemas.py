from pydantic import BaseModel, EmailStr, ConfigDict, Field
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
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\d{10}$')
    category: str
    entry_type: str
    quota_type: str
    program_id: int
    gender: str
    dob: date
    address: str
    marks_10th: float = Field(..., ge=0, le=100)
    marks_12th: float = Field(..., ge=0, le=100)
    parent_name: str
    blood_group: str
    document_status: str
    fee_paid: bool

class ApplicantCreate(ApplicantBase):
    """Used for POST requests - inherits all fields from Base"""
    pass

class ApplicantResponse(ApplicantBase):
    """Used for GET responses - adds the ID and generated Admission Number"""
    id: int
    admission_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Define the data structure for the incoming request
class ChatMessage(BaseModel):
    message: str