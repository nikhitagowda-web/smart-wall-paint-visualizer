const express = require('express');
const router = express.Router();
const Color = require('../models/Color');

// GET /api/colors - Retrieve all available paint swatches
router.get('/', async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: POST /api/colors - Add a new paint shade/color
router.post('/', async (req, res) => {
  try {
    const { name, hex, brand } = req.body;
    const newColor = new Color({ name, hex, brand });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: PUT /api/colors/:id - Update shade details
router.put('/:id', async (req, res) => {
  try {
    const { name, hex, brand } = req.body;
    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      { name, hex, brand },
      { new: true }
    );
    res.json(updatedColor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: DELETE /api/colors/:id - Remove shade from catalog
router.delete('/:id', async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    res.json({ message: 'Color swatch removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;