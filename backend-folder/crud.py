from sqlalchemy.orm import Session
import models, schemas


def create_admission(db: Session, applicant_data: schemas.ApplicantCreate):
    # 1. Row-level lock to prevent over-filling seats (Requirement 6.2)
    seat_record = db.query(models.SeatMatrix).filter(
        models.SeatMatrix.program_id == applicant_data.program_id,
        models.SeatMatrix.quota_type == applicant_data.quota_type
    ).with_for_update().first()

    if not seat_record or seat_record.filled_seats >= seat_record.total_seats:
        return None

        # 2. Get Program details to build the Admission Number (Requirement 2.5)
    program = db.query(models.Program).filter(models.Program.id == applicant_data.program_id).first()

    # Logic: {INST}/{YEAR}/{COURSE}/{PROG}/{QUOTA}/{SEQ}
    inst_prefix = program.institution_name[:3].upper()
    year = "2026"
    course = program.course_type  # UG or PG
    p_code = program.code
    quota = applicant_data.quota_type
    sequence = str(seat_record.filled_seats + 1).zfill(4)  # e.g., 0001

    generated_adm_no = f"{inst_prefix}/{year}/{course}/{p_code}/{quota}/{sequence}"

    # 3. Create Applicant with the generated ID
    # Use model_dump() for Pydantic v2
    new_applicant = models.Applicant(
        **applicant_data.model_dump(),
        admission_number=generated_adm_no
    )

    # 4. Increment and Save
    seat_record.filled_seats += 1
    db.add(new_applicant)
    db.commit()
    db.refresh(new_applicant)
    return new_applicant

