require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Uploads directory ────────────────────────────────────────────────────────
// On Render (and most PaaS), the filesystem is ephemeral — files written to
// disk disappear on each deploy/restart.  We keep disk storage for now but
// log a clear warning so you know to migrate to S3/Cloudinary later.
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
// BUG FIX: was hardcoded to 'http://localhost:5173' which blocks ALL
// production requests. Now reads from env var with a safe fallback.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/books',      require('./routes/books'));
app.use('/api/progress',   require('./routes/progress'));
app.use('/api/highlights', require('./routes/highlights'));
app.use('/api/bookmarks',  require('./routes/bookmarks'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV })
);

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () =>
  console.log(`🚀 Server on port ${PORT} | NODE_ENV=${process.env.NODE_ENV} | CORS=${allowedOrigins.join(', ')}`)
);