const express = require('express');
const Color = require('../models/Color');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Seed initial paint colors if database is empty
const seedColors = async () => {
  const count = await Color.countDocuments();
  if (count === 0) {
    const sampleColors = [
      { name: 'Ocean Breeze Blue', hexCode: '#0077be', brand: 'Behr Paint', finish: 'matte', category: 'Living Room' },
      { name: 'Sunset Terracotta', hexCode: '#e07a5f', brand: 'Behr Paint', finish: 'satin', category: 'Accent' },
      { name: 'Sage Green', hexCode: '#81b29a', brand: 'Behr Paint', finish: 'eggshell', category: 'Bedroom' },
      { name: 'Warm Canvas White', hexCode: '#f4f1de', brand: 'Behr Paint', finish: 'matte', category: 'General' },
      { name: 'Charcoal Elegance', hexCode: '#3d405b', brand: 'Behr Paint', finish: 'glossy', category: 'Accent' },
      { name: 'Sunny Mustard', hexCode: '#f2cc8f', brand: 'Behr Paint', finish: 'matte', category: 'Kitchen' }
    ];
    await Color.insertMany(sampleColors);
    console.log('Sample Paint Colors Seeded Successfully!');
  }
};
seedColors();

// Get all paint colors
router.get('/', async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colors', error: error.message });
  }
});

// Admin: Add new paint color
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, hexCode, brand, finish, category } = req.body;
    const newColor = new Color({ name, hexCode, brand, finish, category });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: 'Error adding color', error: error.message });
  }
});

// Admin: Delete paint color
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    res.json({ message: 'Color removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting color', error: error.message });
  }
});

module.exports = router;