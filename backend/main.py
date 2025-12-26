from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
from pathlib import Path

from models import Question

DATA_PATH = Path(__file__).parent / "data" / "questions.json"
BASE_DIR = Path(__file__).resolve().parent
FLASHCARDS_FILE = BASE_DIR / "data" / "flashcards.json"

def load_questions() -> List[Question]:
    """
    Load questions from the JSON file and
    convert them into Question objects.
    """
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
        return [Question(**q) for q in raw_data]

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

@app.get("/questions", response_model=List[Question])
def get_questions():
    """
    Return all questions.

    Later:
    - Filter by domain
    - Randomize
    - Limit count
    """
    return load_questions()

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running"
    }

@app.get("/flashcards")
def get_flashcards():
    """
    Read-only endpoint that returns all flashcards.
    """
    try:
        with open(FLASHCARDS_FILE, "r", encoding="utf-8") as f:
            flashcards = json.load(f)
        return flashcards
    except FileNotFoundError:
        return {"error": "flashcards.json not found."}