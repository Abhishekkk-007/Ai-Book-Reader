const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  scrollPosition: { type: Number, default: 0 },
  zoom: { type: Number, default: 1.0 },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

ProgressSchema.index({ bookId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);