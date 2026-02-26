from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
import models, schemas, crud
from agent import get_chat_response
from logic import check_quota_availability, generate_admission_number

# This creates the tables in your Postgres DB automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Admission Management System")

# for CORS ERROR
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://admitproai-react-app-nine.vercel.app/"], # For local use, use localhost:3000
    allow_credentials=True,
    allow_methods=["*"], # This allows OPTIONS, POST, GET, etc.
    allow_headers=["*"], # This allows Content-Type, Authorization, etc.
)
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

@app.get("/programs", response_model=List[schemas.ProgramResponse])
def get_programs(db: Session = Depends(get_db)):
    programs = db.query(models.Program).all()
    return programs

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

# Create the endpoint
@app.post("/chat")
async def chat_endpoint(chat_msg: schemas.ChatMessage):
    # Call the function from your agent.py file
    bot_response = get_chat_response(chat_msg.message)
    return {"response": bot_response}


@app.post("/applicants/{applicant_id}/confirm")
def confirm_admission(applicant_id: int, db: Session = Depends(get_db)):
    applicant = db.query(models.Applicant).filter(models.Applicant.id == applicant_id).first()

    # Rule 4: Confirm only if fee paid
    if not applicant.fee_paid:
        raise HTTPException(status_code=400, detail="Fee must be paid first")

    # Rule 2: Check availability again before final lock
    if not check_quota_availability(db, applicant.program_id, applicant.quota_type):
        raise HTTPException(status_code=400, detail="Quota seats filled")

    # Generate Unique Immutable Number
    if not applicant.admission_number:
        applicant.admission_number = generate_admission_number(db, applicant)

        # Update Seat Matrix counter (Rule 5)
        matrix = db.query(models.SeatMatrix).filter(
            models.SeatMatrix.program_id == applicant.program_id,
            models.SeatMatrix.quota_type == applicant.quota_type
        ).first()
        matrix.filled_seats += 1

        db.commit()

    return {"admission_number": applicant.admission_number}


@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Total Intake vs Admitted
    total_intake = db.query(func.sum(models.Program.total_intake)).scalar() or 0
    total_admitted = db.query(models.Applicant).filter(models.Applicant.admission_number.isnot(None)).count()

    # Fee Pending
    fee_pending = db.query(models.Applicant).filter(models.Applicant.fee_paid == False).all()

    return {
        "intake_vs_admitted": {"total": total_intake, "admitted": total_admitted},
        "remaining_seats": total_intake - total_admitted,
        "fee_pending_count": len(fee_pending)
    }
