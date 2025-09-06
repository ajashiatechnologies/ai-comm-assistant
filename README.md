README.md: |
  # 📧 AI Communication Assistant  

  AI-powered email assistant built with **FastAPI (backend)** and **React (frontend)**.  
  It can:  
  - ✅ Fetch emails from DB (or Gmail)  
  - ✅ Summarize emails using AI  
  - ✅ Classify emails (priority, sentiment, etc.)  
  - ✅ Draft smart replies automatically  

  ---

  ## 🚀 Features  
  - Beautiful modern UI with React + Tailwind  
  - AI-powered actions (Summarize, Classify, Draft Reply)  
  - FastAPI backend with Swagger API docs  
  - Gmail API integration (optional)  
  - Responsive design  

  ---

  ## 📂 Project Structure  
ai-comm-assistant/
├── backend/ # FastAPI backend
├── frontend/ # React frontend
├── screenshots/ # Project screenshots
├── README.md


---

## 📸 Screenshots  

### 📨 Email List  
![Email List](screenshots/email-list.png)  

### 🔍 Email Summary  
![Email Summary](screenshots/email-summary.png)  

### 🏷️ Email Classification  
![Classification](screenshots/classify.png)  

### ✍️ Draft Reply  
![Draft Reply](screenshots/draft-reply.png)  

---

## ⚡ Installation  

### Backend (FastAPI)  
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


cd frontend
npm install
npm run dev


📖 API Endpoints

GET /emails → List emails

POST /emails/{email_id}/summarize → Summarize email

POST /emails/{email_id}/classify → Classify email

POST /emails/{email_id}/draft-reply → Generate draft reply

POST /email/fetch-gmail → Fetch Gmail and store


🛠️ Tech Stack

Frontend: React, Vite, TailwindCSS, Lucide Icons

Backend: FastAPI, Python, Gmail API, OpenAI/Gemini (AI models)

Database: SQLite / PostgreSQL (configurable)



