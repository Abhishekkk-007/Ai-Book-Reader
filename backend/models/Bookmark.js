const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  page: { type: Number, required: true },
  label: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);