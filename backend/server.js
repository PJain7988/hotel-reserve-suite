const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://hotel-reserve-suite.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked by origin manager'), false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Premium SDE 3 Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const dbMode = global.useMemoryDB ? '💾 MEM-DB' : '🍃 MONGO-DB';
    const statusIcon = res.statusCode >= 400 ? '🔴' : '🟢';
    console.log(`[API LOG] ${statusIcon} ${req.method} ${req.originalUrl} -> HTTP ${res.statusCode} in ${duration}ms | Mode: ${dbMode}`);
  });
  next();
});

// Routes
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel Reservation API running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// DB Connection + Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    global.useMemoryDB = false;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed. Falling back to high-performance IN-MEMORY database.');
    global.useMemoryDB = true;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (In-Memory Fallback Mode)`));
  });

module.exports = app;
