from pydantic import BaseModel
from typing import Dict


class Question(BaseModel):
    id: int
    domain: int
    topic: str
    question: str
    choices: Dict[str, str]
    correct_answer: str
    explanation: str
    difficulty: str
