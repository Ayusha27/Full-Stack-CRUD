from database import SessionLocal
import models

UNIVERSITY_DATA = [
    {
        "name": "B.Tech Computer Science",
        "code": "CS101",
        "course_type": "Undergraduate",
        "institution_name": "REVA University",
        "campus_name": "Main Campus",
        "total_intake": 120
    },
    {
        "name": "M.Tech Data Science",
        "code": "DS202",
        "course_type": "Postgraduate",
        "institution_name": "REVA University",
        "campus_name": "North Campus",
        "total_intake": 30
    }
]

def seed():
    db = SessionLocal()
    try:
        print("🌱 Seeding university data...")
        for item in UNIVERSITY_DATA:
            # We filter by 'code' because it's unique
            exists = db.query(models.Program).filter(
                models.Program.code == item["code"]
            ).first()
            
            if not exists:
                new_program = models.Program(**item)
                db.add(new_program)
        
        db.commit()
        print("Database successfully seeded!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()