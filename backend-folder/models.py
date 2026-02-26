from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean, Float, Date
from sqlalchemy.orm import relationship

from database import Base

class Program(Base):
    __tablename__ = "programs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String)
    course_type = Column(String)

    # ADD THESE TWO LINES FOR MASTER DATA
    institution_name = Column(String)  # e.g., "REVA University"
    campus_name = Column(String)  # e.g., "Main Campus"

    total_intake = Column(Integer)

    quotas = relationship("SeatMatrix", back_populates="program")


class SeatMatrix(Base):
    __tablename__ = "seat_matrix"
    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"))
    quota_type = Column(String)  # KCET, COMEDK, Management
    total_seats = Column(Integer)
    filled_seats = Column(Integer, default=0)

    program = relationship("Program", back_populates="quotas")


class Applicant(Base):
    __tablename__ = "applicants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)  # Required for contact
    category = Column(String)  # GM, SC, ST
    quota_type = Column(String)  # KCET, COMEDK, Management
    entry_type = Column(String)  # Regular, Lateral

    # New Fields to match React interface
    gender = Column(String)
    dob = Column(String)  # Or Date, but String is safer for simple ISO strings
    address = Column(String)
    marks_10th = Column(Float)
    marks_12th = Column(Float)
    parent_name = Column(String)
    blood_group = Column(String)

    # Logic Fields
    fee_paid = Column(Boolean, default=False)
    document_status = Column(String, default="Pending")
    admission_number = Column(String, unique=True, nullable=True)

    # Relationships
    program_id = Column(Integer, ForeignKey("programs.id"))
    program = relationship("Program")

