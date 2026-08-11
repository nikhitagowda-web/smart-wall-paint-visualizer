const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express App
const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_wall_paint';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Database Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API Route Handlers
app.use('/api/colors', require('./routes/colors'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/auth', require('./routes/auth'));

// Global Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Smart Wall Paint Visualizer API is active.' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 End-to-End Backend Server running on http://localhost:${PORT}`);
});