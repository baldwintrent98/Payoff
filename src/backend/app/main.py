
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Student Loan Planner API")

# Allow your local React frontend to communicate with Python.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Student Loan Planner API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }

