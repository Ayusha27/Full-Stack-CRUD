from typing import List

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models, schemas, crud

# This creates the tables in your Postgres DB automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Admission Management System")


@app.post("/programs/", response_model=schemas.ProgramResponse)  # Link the schema here
def create_program(program: schemas.ProgramCreate, db: Session = Depends(get_db)):
    db_program = models.Program(
        name=program.name,
        code=program.code,
        course_type=program.course_type,
        institution_name=program.institution_name,
        campus_name=program.campus_name,
        total_intake=program.total_intake
    )
    db.add(db_program)
    db.commit()
    db.refresh(db_program)

    for q in program.quotas:
        db_quota = models.SeatMatrix(
            program_id=db_program.id,
            quota_type=q.quota_type,
            total_seats=q.total_seats,
            filled_seats=0
        )
        db.add(db_quota)

    db.commit()
    # Refresh again so the 'quotas' relationship is loaded into the object
    db.refresh(db_program)
    return db_program

@app.get("/dashboard/seats")
def get_seat_status(db: Session = Depends(get_db)):
    return db.query(models.SeatMatrix).all()

@app.post("/allocate/", response_model=schemas.ApplicantResponse)
def allocate_seat(applicant: schemas.ApplicantCreate, db: Session = Depends(get_db)):
    new_student = crud.create_admission(db=db, applicant_data=applicant)
    if not new_student:
        raise HTTPException(status_code=400, detail="Seat not available for this quota/program")
    return new_student

@app.get("/applicants/search", response_model=List[schemas.ApplicantResponse])
def search_students(name: str = None, adm_no: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Applicant)
    if name:
        query = query.filter(models.Applicant.name.ilike(f"%{name}%"))
    if adm_no:
        query = query.filter(models.Applicant.admission_number == adm_no)
    return query.all()
