# 🛡️ Insurance Document Analyzer

An AI-powered full-stack web application that analyzes insurance documents and enables conversational Q&A about their content.

Built as a portfolio project demonstrating MERN stack development with LLM integration.

---

## 🚀 Live Demo

> [Link after deploy]

---

## ✨ Features

- **PDF & TXT Upload** — drag & drop or browse file upload
- **AI-Powered Analysis** — structured extraction of summary, product type, key clauses, and complexity score
- **Conversational Q&A** — ask follow-up questions about the document with full context
- **Persistent History** — conversation history saved in MongoDB per document session
- **Error Handling** — graceful handling of API rate limits and service unavailability

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini 2.5 Flash |
| PDF Parsing | pdf2json |
| Deploy | Render |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────┐
│                  React Frontend              │
│  FileUpload → AnalysisResult → ChatBox      │
└─────────────────┬───────────────────────────┘
                  │ HTTP (Axios)
┌─────────────────▼───────────────────────────┐
│              Express Backend                 │
│  /api/documents/upload  — PDF extraction    │
│  /api/documents/analyze — Gemini AI         │
│  /api/chat              — Q&A + history     │
└─────────────────┬───────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
┌──────▼──────┐     ┌────────▼────────┐
│  MongoDB     │     │  Gemini 2.5     │
│  Atlas       │     │  Flash API      │
│  (history)   │     │  (analysis+chat)│
└─────────────┘     └────────────────┘
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Google AI Studio API key (free)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/insurance-doc-analyzer.git
cd insurance-doc-analyzer
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 📁 Project Structure

```
insurance-doc-analyzer/
├── backend/
│   └── src/
│       ├── config/        # DB + Gemini setup
│       ├── controllers/   # document, analysis, chat logic
│       ├── middleware/     # multer file upload
│       ├── models/        # Mongoose Conversation schema
│       ├── routes/        # Express routes
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/    # FileUpload, AnalysisResult, ChatBox
        ├── services/      # Axios API calls
        └── App.jsx
```

---

## 🔑 Key Engineering Decisions

- **pdf2json** over pdf-parse/pdfjs-dist — better compatibility with Node.js v24
- **MongoDB direct connection** over SRV — more reliable across network configurations
- **Gemini 2.5 Flash** — generous free tier, strong structured output capabilities
- **Prompt engineering** — document content + analysis context injected into every chat turn for coherent multi-turn Q&A