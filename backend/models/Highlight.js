const mongoose = require('mongoose');

const HighlightSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  page: { type: Number, required: true },
  text: { type: String, required: true },
  color: { type: String, default: '#fbbf24' },
  note: { type: String, default: '' },
  position: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Highlight', HighlightSchema);