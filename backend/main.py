from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FLASHCARDS_FILE = BASE_DIR / "data" / "flashcards.json"

app = FastAPI(title="AuditStudyDesk Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running",
    }

@app.get("/flashcards")
def get_flashcards():
    """
    Read-only endpoint that returns all flashcards.
    """
    try:
        with open(FLASHCARDS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "flashcards.json not found"}
