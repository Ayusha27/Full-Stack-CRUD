from database import SessionLocal, engine
import models

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

UNIVERSITY_DATA = [
    {
        "name": "B.Tech Computer Science",
        "code": "CS101",
        "course_type": "Undergraduate",
        "institution_name": "REVA University",
        "campus_name": "Main Campus",
        "total_intake": 120
    }
]

def seed():
    db = SessionLocal()
    try:
        print("🌱 Seeding Supabase with university data...")
        for item in UNIVERSITY_DATA:
            program = db.query(models.Program).filter_by(code=item["code"]).first()
            if not program:
                program = models.Program(**item)
                db.add(program)
                db.flush()

            quotas = [
                {"type": "KCET", "seats": int(item["total_intake"] * 0.4)},
                {"type": "COMEDK", "seats": int(item["total_intake"] * 0.3)},
                {"type": "Management", "seats": int(item["total_intake"] * 0.3)},
            ]

            for q in quotas:
                exists = db.query(models.SeatMatrix).filter_by(
                    program_id=program.id, quota_type=q["type"]
                ).first()
                if not exists:
                    db.add(models.SeatMatrix(
                        program_id=program.id,
                        quota_type=q["type"],
                        total_seats=q["seats"],
                        filled_seats=0
                    ))
        db.commit()
        print("Success! Check your Supabase Table Editor.")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()