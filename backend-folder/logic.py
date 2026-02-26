from sqlalchemy.orm import Session
import models
import datetime


def generate_admission_number(db: Session, applicant: models.Applicant):
    """Requirement 2.5: Format INST/2026/UG/CSE/KCET/0001"""
    year = datetime.datetime.now().year
    program = applicant.program

    # Count existing confirmed admissions for this program/quota to get the serial
    count = db.query(models.Applicant).filter(
        models.Applicant.program_id == applicant.program_id,
        models.Applicant.admission_number.isnot(None)
    ).count()

    serial = str(count + 1).zfill(4)
    # Simple logic to determine UG/PG from program course_type
    level = "UG" if "Undergraduate" in program.course_type else "PG"

    return f"INST/{year}/{level}/{program.code}/{applicant.quota_type}/{serial}"


def check_quota_availability(db: Session, program_id: int, quota_type: str):
    """Requirement 6.2: No seat allocation if quota full"""
    matrix = db.query(models.SeatMatrix).filter(
        models.SeatMatrix.program_id == program_id,
        models.SeatMatrix.quota_type == quota_type
    ).first()

    if not matrix or matrix.filled_seats >= matrix.total_seats:
        return False
    return True