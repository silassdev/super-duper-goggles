const express = require('express');
const asyncHandler = require('express-async-handler');
const Employer = require('../models/employer');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

// GET /api/employers  - list (public)
router.get('/', asyncHandler(async (req, res) => {
    const employers = await Employer.find().sort({ createdAt: -1 }).lean();
    res.json(employers);
}));

// POST /api/employers  - create (admin only)
router.post('/', requireAuth, requireRole('admin'), asyncHandler(async (req, res) => {
    const { name, website, description, contactEmail } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const employer = await Employer.create({ name, website, description, contactEmail });
    res.status(201).json(employer);
}));

// GET /api/employers/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const emp = await Employer.findById(req.params.id).lean();
    if (!emp) return res.status(404).json({ message: 'Employer not found' });
    res.json(emp);
}));

// PATCH /api/employers/:id  - admin only
router.patch('/:id', requireAuth, requireRole('admin'), asyncHandler(async (req, res) => {
    const emp = await Employer.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employer not found' });
    Object.assign(emp, req.body);
    await emp.save();
    res.json(emp);
}));

// DELETE /api/employers/:id  - admin only
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(async (req, res) => {
    const emp = await Employer.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employer not found' });
    await emp.remove();
    res.json({ message: 'Deleted' });
}));

module.exports = router;
