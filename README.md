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
<img width="1919" height="936" alt="email-list png" src="https://github.com/user-attachments/assets/af79a91d-9e15-44e1-8352-05e70022bfeb" />


### 🔍 Email Summary  
<img width="1919" height="1079" alt="email-summary png" src="https://github.com/user-attachments/assets/7e5be700-12d4-4e3b-82b5-0a5fe9739fa6" />


### 🏷️ Email Classification  
<img width="1918" height="1035" alt="Screenshot 2025-09-06 020743" src="https://github.com/user-attachments/assets/196a8ee6-eb93-4a54-af5e-fc0b6369e429" />


### ✍️ Draft Reply  
<img width="1919" height="1079" alt="draft-reply png" src="https://github.com/user-attachments/assets/d6da5d4f-642c-4b5e-8f3a-77eba6172d32" />


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



