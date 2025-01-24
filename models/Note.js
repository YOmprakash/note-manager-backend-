const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Others'],
      default: 'Others',
    },
    
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
