const express = require('express');
const router = express.Router();
const Highlight = require('../models/Highlight');

// GET highlights for a book
router.get('/:bookId', async (req, res) => {
  try {
    const highlights = await Highlight.find({ bookId: req.params.bookId }).sort({ page: 1 });
    res.json({ success: true, highlights });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create highlight
router.post('/', async (req, res) => {
  try {
    const highlight = new Highlight(req.body);
    await highlight.save();
    res.json({ success: true, highlight });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update highlight note
router.patch('/:id', async (req, res) => {
  try {
    const highlight = await Highlight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!highlight) return res.status(404).json({ success: false, error: 'Highlight not found' });
    res.json({ success: true, highlight });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE highlight
router.delete('/:id', async (req, res) => {
  try {
    await Highlight.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Highlight deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;