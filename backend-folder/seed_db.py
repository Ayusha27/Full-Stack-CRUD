import models
from database import SessionLocal, engine  # Ensure engine is imported

# Ensure tables are created in Supabase before seeding
models.Base.metadata.create_all(bind=engine)

UNIVERSITY_DATA = [
    {
        "name": "B.Tech Computer Science",
        "code": "CS101",
        "course_type": "Undergraduate",
        "institution_name": "REVA University",
        "campus_name": "Main Campus",
        "total_intake": 120  # Updated to 120 for realistic quota math
    }
]


def seed():
    # Use the SessionLocal you defined in database.py
    db = SessionLocal()
    try:
        print("🌱 Seeding university data and seat matrix...")
        for item in UNIVERSITY_DATA:
            # 1. Check if Program exists
            program = db.query(models.Program).filter(
                models.Program.code == item["code"]
            ).first()

            if not program:
                program = models.Program(**item)
                db.add(program)
                db.flush()

                # 2. Define Quotas
            quotas = [
                {"type": "KCET", "seats": int(item["total_intake"] * 0.4)},
                {"type": "COMEDK", "seats": int(item["total_intake"] * 0.3)},
                {"type": "Management", "seats": int(item["total_intake"] * 0.3)},
            ]

            for q in quotas:
                # Use .filter().first() to check if already seeded
                exists = db.query(models.SeatMatrix).filter_by(
                    program_id=program.id,
                    quota_type=q["type"]
                ).first()

                if not exists:
                    db.add(models.SeatMatrix(
                        program_id=program.id,
                        quota_type=q["type"],
                        total_seats=q["seats"],
                        filled_seats=0
                    ))

        db.commit()
        print("Database and Seat Matrix successfully seeded to Supabase!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()