# 📖 Folio — Your Reading Sanctuary

A production-ready, full-stack PDF book reading application built with React, Node.js, Express, and MongoDB.

---

## ✨ Features

- **Library** — Upload PDFs, view in a grid with reading-progress rings
- **PDF Reader** — Smooth rendering via react-pdf with text layer
- **Highlights** — Select text → choose colour → optionally add note → saved in MongoDB
- **Bookmarks** — Bookmark any page, jump back instantly
- **Search** — Search text across all indexed PDF pages with live results
- **Text-to-Speech** — Read the current page aloud; narrator voice for prose, different voice for dialogue (text in quotes)
- **AI Summary** — Chapter-detection + key-sentence extraction (mock; swap for OpenAI/Claude)
- **Auto-save** — Reading progress (page + zoom) saved automatically, resumed on next visit
- **Dark / Light mode** — Persistent preference, warm parchment aesthetic

---

## 🗂️ Project Structure

```
bookapp/
├── backend/
│   ├── models/
│   │   ├── Book.js
│   │   ├── Progress.js
│   │   ├── Highlight.js
│   │   └── Bookmark.js
│   ├── routes/
│   │   ├── books.js
│   │   ├── progress.js
│   │   ├── highlights.js
│   │   └── bookmarks.js
│   ├── uploads/           ← PDFs stored here
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AI/SummaryPanel.jsx
    │   │   ├── Controls/TopBar.jsx
    │   │   ├── Library/
    │   │   │   ├── BookCard.jsx
    │   │   │   ├── LibraryGrid.jsx
    │   │   │   └── UploadModal.jsx
    │   │   ├── Reader/
    │   │   │   ├── PDFReader.jsx
    │   │   │   ├── SearchOverlay.jsx
    │   │   │   └── HighlightToolbar.jsx
    │   │   ├── Sidebar/
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── BookmarksList.jsx
    │   │   │   └── HighlightsList.jsx
    │   │   ├── TTS/TTSPanel.jsx
    │   │   └── Notification.jsx
    │   ├── context/
    │   │   ├── AppContext.jsx
    │   │   └── ReaderContext.jsx
    │   ├── hooks/
    │   │   ├── useBooks.js
    │   │   ├── useProgress.js
    │   │   ├── useHighlights.js
    │   │   ├── useBookmarks.js
    │   │   └── useTTS.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   ├── textUtils.js
    │   │   └── summaryUtils.js
    │   ├── App.jsx
    │   ├── ReaderView.jsx
    │   ├── main.jsx
    │   └── styles/index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** running locally on port 27017

### 1. Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or run manually
mongod --dbpath /data/db
```

### 2. Backend
```bash
cd bookapp/backend
npm install
npm run dev
# ✅ API server running at http://localhost:5000
```

### 3. Frontend
```bash
cd bookapp/frontend
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 📦 All Dependencies

### Backend
| Package     | Version  | Purpose                    |
|-------------|----------|----------------------------|
| express     | ^4.18.2  | REST API framework         |
| mongoose    | ^8.0.3   | MongoDB ODM                |
| multer      | ^1.4.5   | File upload handling       |
| cors        | ^2.8.5   | Cross-origin requests      |
| dotenv      | ^16.3.1  | Environment variables      |
| uuid        | ^9.0.0   | Unique filenames           |
| nodemon     | ^3.0.2   | Dev auto-restart           |

### Frontend
| Package              | Version  | Purpose                         |
|----------------------|----------|---------------------------------|
| react                | ^18.2.0  | UI library                      |
| react-dom            | ^18.2.0  | DOM renderer                    |
| react-pdf            | ^7.7.0   | PDF rendering component         |
| pdfjs-dist           | ^4.0.379 | PDF.js engine (worker)          |
| axios                | ^1.6.2   | HTTP client                     |
| vite                 | ^5.0.8   | Build tool / dev server         |
| @vitejs/plugin-react | ^4.2.1   | React fast-refresh              |
| tailwindcss          | ^3.4.0   | Utility-first CSS               |
| postcss              | ^8.4.32  | CSS processing                  |
| autoprefixer         | ^10.4.16 | CSS vendor prefixes             |

---

## 🔌 REST API Reference

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/books                 | List all books           |
| POST   | /api/books/upload          | Upload PDF (multipart)   |
| GET    | /api/books/:id             | Get single book          |
| PATCH  | /api/books/:id             | Update book metadata     |
| DELETE | /api/books/:id             | Delete book + file       |
| GET    | /api/progress/:bookId      | Get reading progress     |
| PUT    | /api/progress/:bookId      | Save reading progress    |
| GET    | /api/highlights/:bookId    | Get all highlights       |
| POST   | /api/highlights            | Create highlight         |
| PATCH  | /api/highlights/:id        | Update highlight note    |
| DELETE | /api/highlights/:id        | Delete highlight         |
| GET    | /api/bookmarks/:bookId     | Get all bookmarks        |
| POST   | /api/bookmarks             | Create bookmark          |
| DELETE | /api/bookmarks/:id         | Delete bookmark          |

---

## 🎨 UI Design System

| Token           | Dark mode         | Light mode        |
|-----------------|-------------------|-------------------|
| `--bg-primary`  | `#0f0d0b`         | `#f7f6f3`         |
| `--bg-secondary`| `#1a1713`         | `#ede9e0`         |
| `--bg-card`     | `#231e19`         | `#ffffff`         |
| `--text-primary`| `#f0ece3`         | `#1a1713`         |
| `--accent`      | `#fb923c`         | `#f97316`         |
| `--border`      | `#3a3228`         | `#d6cfc0`         |

**Fonts:** Playfair Display (headings) · DM Sans (UI) · JetBrains Mono (page numbers)

---

## 🔧 Configuration

Edit `backend/.env` to change:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookapp
```

To use a cloud MongoDB (Atlas):
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bookapp
```

---

## 🧩 Upgrading AI Summary to Real AI

In `frontend/src/utils/summaryUtils.js`, replace `generateSummary()` with:

```js
// Using Claude API (requires backend proxy to protect API key)
export async function generateSummary(pageTexts) {
  const response = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: pageTexts.join('\n\n') }),
  });
  const data = await response.json();
  return data.summary;
}
```

Then add a `/api/ai/summarize` route in the backend that calls the Anthropic/OpenAI API.

---

## 🐛 Troubleshooting

**PDF not loading?**
- Check that the backend is running on port 5000
- Verify the file exists in `backend/uploads/`
- Check browser console for CORS errors

**MongoDB connection failed?**
- Make sure `mongod` is running
- Check the `MONGODB_URI` in `.env`

**TTS not speaking?**
- TTS uses the browser's Web Speech API — Chrome/Edge work best
- Firefox has limited voice support
- Check browser permissions for speech synthesis

**react-pdf worker error?**
- The worker is configured in `main.jsx` using `pdfjs-dist`
- Make sure `pdfjs-dist` version matches `react-pdf`'s peer dependency
