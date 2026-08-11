const express = require('express');
const router = express.Router();

// Pre-populated realistic initial dataset (5 saved designs)
const initialSeedProjects = [
  {
    _id: 'proj-101',
    userId: 'default-user',
    roomName: 'Living Room - Modern Accent',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop',
    colorName: 'Ocean Blue',
    color: '#2563eb',
    finish: 'matte',
    opacity: 0.70,
    rating: 5,
    createdAt: new Date('2026-07-15T10:30:00Z')
  },
  {
    _id: 'proj-102',
    userId: 'default-user',
    roomName: 'Master Bedroom - Emerald Wall',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop',
    colorName: 'Emerald Green',
    color: '#059669',
    finish: 'eggshell',
    opacity: 0.65,
    rating: 5,
    createdAt: new Date('2026-07-20T14:15:00Z')
  },
  {
    _id: 'proj-103',
    userId: 'default-user',
    roomName: 'Dining Room - Sunset Feature',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop',
    colorName: 'Sunset Orange',
    color: '#ea580c',
    finish: 'satin',
    opacity: 0.80,
    rating: 4,
    createdAt: new Date('2026-07-28T09:45:00Z')
  },
  {
    _id: 'proj-104',
    userId: 'default-user',
    roomName: 'Home Office - Minimalist Gray',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop',
    colorName: 'Modern Gray',
    color: '#6b7280',
    finish: 'matte',
    opacity: 0.60,
    rating: 5,
    createdAt: new Date('2026-08-02T16:20:00Z')
  },
  {
    _id: 'proj-105',
    userId: 'default-user',
    roomName: 'Guest Bedroom - Soft Lavender',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop',
    colorName: 'Royal Purple',
    color: '#7c3aed',
    finish: 'glossy',
    opacity: 0.75,
    rating: 5,
    createdAt: new Date('2026-08-08T11:10:00Z')
  }
];

// Memory store initialized with seed dataset
let projectsDatabase = [...initialSeedProjects];

// GET: Fetch all saved designs for a user
router.get('/my-projects/:userId', (req, res) => {
  res.status(200).json(projectsDatabase);
});

// GET: Fetch coordinated analytics data for the Admin Panel
router.get('/analytics/stats', (req, res) => {
  const totalCount = projectsDatabase.length;
  const totalRatingSum = projectsDatabase.reduce((acc, curr) => acc + (curr.rating || 5), 0);
  const avgRating = totalCount > 0 ? (totalRatingSum / totalCount).toFixed(1) : '5.0';

  res.status(200).json({
    totalRoomImagesUploaded: totalCount,
    totalSavedDesigns: totalCount,
    avgSessionDuration: '4m 12s',
    userSatisfactionRating: `${avgRating} / 5.0`,
    lastUpdated: new Date().toLocaleTimeString()
  });
});

// POST: Save new design project
router.post('/save', (req, res) => {
  const newProject = {
    _id: 'proj-' + Date.now(),
    userId: req.body.userId || 'default-user',
    roomName: req.body.roomName || 'Custom Room Preview',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop',
    colorName: req.body.colorName || 'Custom Paint',
    color: req.body.color || '#2563eb',
    finish: req.body.finish || 'matte',
    opacity: req.body.opacity || 0.65,
    rating: 5,
    createdAt: new Date()
  };

  projectsDatabase.unshift(newProject);
  res.status(201).json({ message: 'Design saved successfully', project: newProject });
});

module.exports = router;