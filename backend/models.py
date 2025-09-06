from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from .database import Base

class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, index=True)
    subject = Column(String)
    body = Column(Text)
    received_at = Column(DateTime, default=datetime.utcnow)

    # AI-enhanced fields
    sentiment = Column(String, default="neutral")   # positive / negative / neutral
    priority = Column(String, default="not urgent") # urgent / not urgent
    summary = Column(Text, nullable=True)
    classification = Column(String, nullable=True)  # Work / Personal / Spam / Other
    ai_reply = Column(Text, nullable=True)
