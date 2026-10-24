const mongoose = require('mongoose');
const Note = require('../models/Note');

// Helper to check if a MongoDB ObjectId is valid
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Please provide both title and content');
    }

    const note = await Note.create({
      title,
      content,
      user: req.user._id, // comes from the auth middleware
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notes for the logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error('Invalid note ID');
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    // Make sure the note belongs to the logged-in user
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to access this note');
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error('Invalid note ID');
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    // Make sure the note belongs to the logged-in user
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to update this note');
    }

    const { title, content } = req.body;

    // Update only the fields that were provided
    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error('Invalid note ID');
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    // Make sure the note belongs to the logged-in user
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to delete this note');
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };
