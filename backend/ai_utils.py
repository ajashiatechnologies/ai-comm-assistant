import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Function: Summarize Email
def summarize_email(text: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"Summarize this email:\n\n{text}")
    return response.text

# Function: Classify Email
def classify_email(text: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        f"Classify this email into category (Work, Personal, Spam, Other) "
        f"and detect sentiment (Positive, Neutral, Negative):\n\n{text}"
    )
    return response.text

# Function: Draft Reply
def draft_reply(text: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        f"Write a polite professional reply to this email:\n\n{text}"
    )
    return response.text
