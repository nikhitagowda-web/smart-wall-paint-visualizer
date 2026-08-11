const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure randomized unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'room-' + uniqueSuffix + ext);
  }
});

// File Filter for Validation (Strictly JPG, JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error('Security Error: Only image files (JPG, JPEG, PNG, WEBP) are allowed!'));
};

// Multer Upload Instance with 5MB Size Limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Secure Upload Endpoint
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Validation Error: No image file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: 'Image uploaded successfully and securely.',
      imageUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during secure file handling.', error: error.message });
  }
});

module.exports = router;