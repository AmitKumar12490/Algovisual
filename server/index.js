require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const morgan   = require('morgan');

const runRoutes        = require('./routes/run');
const compareRoutes    = require('./routes/compare');
const historyRoutes    = require('./routes/history');
const algorithmsRoutes = require('./routes/algorithms');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────
app.use('/api/run',        runRoutes);
app.use('/api/compare',    compareRoutes);
app.use('/api/history',    historyRoutes);
app.use('/api/algorithms', algorithmsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'AlgoConv API (MERN)',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    db:        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Serve React build in production ──────────────────
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  );
}

// ── Error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Connect DB & Start ────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algoconv';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected:', MONGO_URI.split('@').pop());
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Starting server without DB (history won\'t persist)');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  });
