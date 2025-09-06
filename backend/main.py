from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import gmail_utils

from . import ai_utils
from backend import models, database, schemas

app = FastAPI()

# Allow React frontend running on Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=database.engine)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "AI Communication Assistant Backend with SQLite DB!"}


# ----------------- Email CRUD with Auto AI -----------------
@app.post("/emails/", response_model=schemas.EmailResponse)
def create_email(email: schemas.EmailCreate, db: Session = Depends(get_db)):
    db_email = models.Email(
        sender=email.sender,
        subject=email.subject,
        body=email.body,
    )
    db.add(db_email)
    db.commit()
    db.refresh(db_email)

    # Auto-enrich with Gemini AI
    try:
        db_email.summary = ai_utils.summarize_email(db_email.body)

        classification_result = ai_utils.classify_email(db_email.body)
        # Expecting format like: "Category: Work, Sentiment: Positive"
        if "Category:" in classification_result:
            parts = classification_result.split(",")
            for part in parts:
                if "Category" in part:
                    db_email.classification = part.split(":")[1].strip()
                elif "Sentiment" in part:
                    db_email.sentiment = part.split(":")[1].strip()

        # Rule-based priority detection
        if "urgent" in db_email.body.lower():
            db_email.priority = "urgent"

        db_email.ai_reply = ai_utils.draft_reply(db_email.body)

        db.commit()
        db.refresh(db_email)
    except Exception as e:
        print("AI enrichment failed:", str(e))

    return db_email


@app.get("/emails/", response_model=List[schemas.EmailResponse])
def list_emails(db: Session = Depends(get_db)):
    return db.query(models.Email).all()


@app.get("/emails/{email_id}", response_model=schemas.EmailResponse)
def get_email(email_id: int, db: Session = Depends(get_db)):
    email = db.query(models.Email).filter(models.Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email


# ----------------- Optional Manual AI Endpoints -----------------
@app.post("/emails/{email_id}/summarize", response_model=schemas.EmailResponse)
def summarize_email(email_id: int, db: Session = Depends(get_db)):
    email = db.query(models.Email).filter(models.Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    email.summary = ai_utils.summarize_email(email.body)
    db.commit()
    db.refresh(email)
    return email


@app.post("/emails/{email_id}/classify", response_model=schemas.EmailResponse)
def classify_email(email_id: int, db: Session = Depends(get_db)):
    email = db.query(models.Email).filter(models.Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    classification_result = ai_utils.classify_email(email.body)
    if "Category:" in classification_result:
        parts = classification_result.split(",")
        for part in parts:
            if "Category" in part:
                email.classification = part.split(":")[1].strip()
            elif "Sentiment" in part:
                email.sentiment = part.split(":")[1].strip()

    db.commit()
    db.refresh(email)
    return email


@app.post("/emails/{email_id}/draft-reply", response_model=schemas.EmailResponse)
def draft_reply(email_id: int, db: Session = Depends(get_db)):
    email = db.query(models.Email).filter(models.Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    email.ai_reply = ai_utils.draft_reply(email.body)
    db.commit()
    db.refresh(email)
    return email

# ----------------- Fetch Gmail and Save to DB -----------------
@app.post("/emails/fetch-gmail")
def fetch_gmail_and_store(db: Session = Depends(get_db)):
    try:
        emails = gmail_utils.fetch_recent_emails(max_results=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail fetch failed: {str(e)}")

    stored = []
    for mail in emails:
        db_email = models.Email(
            sender=mail["sender"],
            subject=mail["subject"],
            body=mail["body"]
        )
        db.add(db_email)
        db.commit()
        db.refresh(db_email)

        # Auto AI enrich
        try:
            db_email.summary = ai_utils.summarize_email(db_email.body)
            classification_result = ai_utils.classify_email(db_email.body)
            if "Category:" in classification_result:
                parts = classification_result.split(",")
                for part in parts:
                    if "Category" in part:
                        db_email.classification = part.split(":")[1].strip()
                    elif "Sentiment" in part:
                        db_email.sentiment = part.split(":")[1].strip()

            if "urgent" in db_email.body.lower():
                db_email.priority = "urgent"

            db_email.ai_reply = ai_utils.draft_reply(db_email.body)
            db.commit()
            db.refresh(db_email)
        except Exception as e:
            print("AI enrichment failed for email:", e)

        stored.append(db_email)

    return stored