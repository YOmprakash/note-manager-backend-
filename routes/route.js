const express = require('express');
const Note = require('../models/Note');

const router = express.Router();
const Joi = require('joi');

// Validation Schema
const noteValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid('Work', 'Personal', 'Others'),
  createdAt: Joi.date().iso(), 
  updatedAt: Joi.date().iso(),
  
});

// Routes
router.get('/notes', async (req, res) => {
  try {
    console.log('get notes called');
    const { category, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.title = new RegExp(search, 'i');

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error });
  }
});

router.post('/notes', async (req, res) => {
  
  try {
    console.log('post notes called');
    const { error } = noteValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newNote = new Note(req.body);
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error });
  }
});

router.put('/notes/:id', async (req, res) => {
  try {
    console.log('put notes called', req.params.id);
    const { error } = noteValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error });
  }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    console.log('delete notes called');
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error });
  }
});


module.exports = router;
