AdmitPro: University Admission Management System
AdmitPro is a robust full-stack admission management portal designed to streamline student applications, automate seat allocation across various quotas (KCET, COMEDK, Management), and provide real-time dashboard analytics.

--Tech Stack
Frontend: React.js, Tailwind CSS

Backend: FastAPI (Python 3.13)

Database: PostgreSQL

ORM: SQLAlchemy

AI Agent: Groq LPU (Integrated via LangChain)

--Key Features
Live Seat Matrix: Real-time tracking of available vs. filled seats for different entry quotas.

Automated Quota Validation: Backend logic ensures seats are not over-allocated beyond the program's intake limits.

AI Chat Assistant: A context-aware agent that answers student queries regarding courses and admission rules.

Student Search & Dashboard: Comprehensive tools for administrators to track fee payments and admission status.

--Local Setup & Installation
1. Prerequisites
Python 3.13+

Node.js (v18+) & npm

PostgreSQL server running locally

2. Database Configuration
Create a local PostgreSQL database named postgres.

The schema will be automatically generated upon starting the FastAPI server.

3. Backend Setup
Navigate to the backend directory:

Bash
cd backend-folder
Create and activate a virtual environment:

Bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
Install dependencies:

Bash
pip install -r requirements.txt
Seed the Database (Required to populate university data and seat matrix):

Bash
python seed_db.py
Start the FastAPI server:

Bash
uvicorn main:app --reload --port 8001
4. Frontend Setup
Navigate to the frontend directory:

Bash
cd frontend
Install packages:

Bash
npm install
Start the React application:

Bash
npm start
Access the portal at http://localhost:3000.

--Project Structure
backend-folder/: Contains FastAPI endpoints, SQLAlchemy models, and business logic.

frontend/: React-based UI components and state management.

db/: SQL initialization scripts and database utilities.

-- AI Disclosure
Tool Used: Gemini

Assistance Provided:

Assisted in architecting the FastAPI-PostgreSQL integration and generating the SQLAlchemy models.

Helped refine the logic for automated seat allocation and the data-seeding script.

Provided troubleshooting support for Python 3.13 library compatibility and backend-frontend CORS configuration.

-- Submission Details
Developer: Ayusha Nayak
