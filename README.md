# 📖 Folio — Your Reading Sanctuary

🔗 **Live Demo:** https://ai-book-frontend-rchi.onrender.com

A production-ready full-stack PDF book reading application built with **React, Node.js, Express, and MongoDB**, featuring smooth PDF rendering, highlights, bookmarks, and cloud deployment.

---

## ✨ Features

* 📚 Upload and manage PDF books
* 📖 Smooth PDF reading (react-pdf)
* 🔍 Search text across PDFs
* 🏷 Highlights with notes (stored in MongoDB)
* 🔖 Bookmarks system
* 🔊 Text-to-Speech (browser-based)
* 🤖 AI Summary (mock, extendable to OpenAI/Claude)
* 💾 Auto-save reading progress
* 🌙 Dark / Light mode

---

## 🗂️ Project Structure

```bash
bookapp/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Live Deployment

| Service  | Platform             | URL                                        |
| -------- | -------------------- | ------------------------------------------ |
| Frontend | Render (Static Site) | https://ai-book-frontend-rchi.onrender.com |
| Backend  | Render (Web Service) | Connected via API                          |

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* react-pdf

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### Deployment

* Render (Frontend + Backend)
* GitHub (Version Control)

---

## ⚙️ Local Setup

### 1. Clone repo

```bash
git clone https://github.com/Abhishekkk-007/Ai-Book-Reader.git
cd Ai-Book-Reader
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file inside **backend/**:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
UPLOADS_DIR=uploads
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `.env` file inside **frontend/**:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

### 4. Open app

```
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint                | Description    |
| ------ | ----------------------- | -------------- |
| GET    | /api/books              | Get all books  |
| POST   | /api/books/upload       | Upload PDF     |
| GET    | /api/books/:id          | Get book       |
| DELETE | /api/books/:id          | Delete book    |
| PUT    | /api/progress/:bookId   | Save progress  |
| GET    | /api/highlights/:bookId | Get highlights |
| POST   | /api/bookmarks          | Add bookmark   |

---

## 🧠 Deployment Fixes (IMPORTANT)

During deployment, several issues were resolved:

* Fixed MongoDB Atlas connection
* Configured environment variables properly
* Resolved **Vite permission denied error on Render**
* Used workaround:

```bash
node node_modules/vite/bin/vite.js build
```

* Ensured correct Render build settings

---

## 🐛 Common Issues

### ❌ Cannot GET /

→ Backend route missing or incorrect API URL

### ❌ Upload not working

→ Check backend URL / CORS configuration

### ❌ PDF not loading

→ Ensure file exists in `backend/uploads/`

---

## 📌 Future Improvements

* 🔐 Authentication system
* ☁️ Cloud storage (AWS / Cloudinary)
* 📊 Reading analytics
* 📱 Better mobile UI
* 🤖 Real AI summary integration

---

## 💼 Resume Line

> Built and deployed a full-stack PDF reading application using React, Node.js, MongoDB, and Render, implementing file uploads, real-time rendering, and cloud deployment.

---

## 📜 License

MIT License
