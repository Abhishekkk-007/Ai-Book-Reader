const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, default: 'Unknown Author', trim: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number },
  totalPages: { type: Number, default: 0 },
  coverColor: { type: String, default: '#6366f1' },
  uploadedAt: { type: Date, default: Date.now },
  lastReadAt: { type: Date },
  tags: [{ type: String }],
});

module.exports = mongoose.model('Book', BookSchema);