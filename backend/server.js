require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Uploads dir ──────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173'];

const corsOptions = {
  origin: (origin, callback) => {
    // No origin = curl / Postman / server-to-server — always allow
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error(`CORS: origin '${origin}' not in ALLOWED_ORIGINS`));
  },
  // ─── FIX 3 ───────────────────────────────────────────────────────────────
  // credentials must be false when the frontend sends withCredentials: false.
  // Having a mismatch (one side true, other false) causes all preflight
  // OPTIONS requests to fail with a CORS error → request never reaches multer
  // → Express falls through to no matching route → 404.
  // ─────────────────────────────────────────────────────────────────────────
  credentials: false,

  // Explicitly list allowed methods and headers so OPTIONS preflights always
  // get a clean 204 back — no ambiguity about what's permitted.
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle preflight OPTIONS for every route first, before any other middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── Static file serving ──────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/books',      require('./routes/books'));
app.use('/api/progress',   require('./routes/progress'));
app.use('/api/highlights', require('./routes/highlights'));
app.use('/api/bookmarks',  require('./routes/bookmarks'));

// ─── Health / debug endpoint ──────────────────────────────────────────────────
// Hit this first in production to confirm the server is alive and env is set:
//   curl https://your-backend.onrender.com/api/health
app.get('/api/health', (req, res) => {
  res.json({
    status:         'ok',
    timestamp:      new Date(),
    env:            process.env.NODE_ENV,
    allowedOrigins,
    mongoState:     mongoose.connection.readyState, // 1 = connected
    uploadsDir:     uploadsDir,
    uploadsDirExists: fs.existsSync(uploadsDir),
  });
});

// ─── 404 catch-all — logs the missed route to help with debugging ─────────────
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server on :${PORT}`);
  console.log(`   NODE_ENV      = ${process.env.NODE_ENV}`);
  console.log(`   ALLOWED_ORIGINS = ${allowedOrigins.join(', ')}`);
  console.log(`   MONGODB_URI   = ${process.env.MONGODB_URI ? '(set)' : '(MISSING!)'}`);
});