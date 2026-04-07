const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// GET progress for a book
router.get('/:bookId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ bookId: req.params.bookId });
    res.json({ success: true, progress: progress || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT upsert progress
router.put('/:bookId', async (req, res) => {
  try {
    const { currentPage, totalPages, percentage, scrollPosition, zoom } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { bookId: req.params.bookId },
      { currentPage, totalPages, percentage, scrollPosition, zoom, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;