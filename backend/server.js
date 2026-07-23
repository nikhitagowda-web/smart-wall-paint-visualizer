const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const colorRoutes = require('./routes/color');
const projectRoutes = require('./routes/project');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_paint_visualizer';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/projects', projectRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Wall Paint Visualizer API is active' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});