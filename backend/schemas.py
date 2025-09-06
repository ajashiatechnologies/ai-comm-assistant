from pydantic import BaseModel
from datetime import datetime

class EmailCreate(BaseModel):
    sender: str
    subject: str
    body: str

class EmailResponse(BaseModel):
    id: int
    sender: str
    subject: str
    body: str
    received_at: datetime
    sentiment: str
    priority: str
    summary: str | None = None
    classification: str | None = None
    ai_reply: str | None = None

    class Config:
        orm_mode = True
