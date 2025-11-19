const express = require('express');
const asyncHandler = require('express-async-handler');
const Notification = require('../models/notification');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications  - user's notifications
router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(notes);
}));

// PATCH /api/notifications/:id/read  - mark read
router.patch('/:id/read', requireAuth, asyncHandler(async (req, res) => {
    const note = await Notification.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (String(note.user) !== String(req.user._id) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    note.read = true;
    await note.save();
    res.json(note);
}));

// POST /api/notifications  - create (admin or system)
router.post('/', requireAuth, asyncHandler(async (req, res) => {
    // Restrict who can create notifications in production; here we allow admin users to create
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { userId, title, body, data } = req.body;
    if (!userId || !title) return res.status(400).json({ message: 'userId and title required' });

    const note = await Notification.create({ user: userId, title, body, data });
    res.status(201).json(note);
}));

module.exports = router;
