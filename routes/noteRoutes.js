const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

// All routes below are protected — user must send a valid JWT token

// POST /api/notes       → Create a note
// GET  /api/notes       → Get all notes for logged-in user
router.route('/').post(protect, createNote).get(protect, getNotes);

// GET    /api/notes/:id  → Get a single note
// PUT    /api/notes/:id  → Update a note
// DELETE /api/notes/:id  → Delete a note
router.route('/:id').get(protect, getNoteById).put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;
