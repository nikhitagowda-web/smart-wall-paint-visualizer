const express = require('express');
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Configure Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed!'));
    }
  },
});

// Upload Room Image
router.post('/upload', verifyToken, upload.single('roomImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// Save a Room Design Project
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { title, originalImageUrl, wallCoordinates, selectedColor, opacity, finish, savedImageUrl } = req.body;

    const newProject = new Project({
      title,
      user: req.user.id,
      originalImageUrl,
      wallCoordinates,
      selectedColor,
      opacity,
      finish,
      savedImageUrl,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save project', error: error.message });
  }
});

// Get User's Saved Projects
router.get('/my-projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).populate('selectedColor');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

module.exports = router;