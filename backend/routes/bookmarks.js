const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// GET bookmarks for a book
router.get('/:bookId', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ bookId: req.params.bookId }).sort({ page: 1 });
    res.json({ success: true, bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create bookmark
router.post('/', async (req, res) => {
  try {
    const bookmark = new Bookmark(req.body);
    await bookmark.save();
    res.json({ success: true, bookmark });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE bookmark
router.delete('/:id', async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;