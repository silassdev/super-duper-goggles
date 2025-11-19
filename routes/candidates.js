const express = require('express');
const asyncHandler = require('express-async-handler');
const Candidate = require('../models/candidate');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

// POST /api/candidates  - create or update candidate profile (public)
router.post('/', asyncHandler(async (req, res) => {
    const { email, name, phone, location, profile } = req.body;
    if (!email || !name) return res.status(400).json({ message: 'Name and email required' });

    let candidate = await Candidate.findOne({ email });
    if (candidate) {
        candidate.name = name;
        candidate.phone = phone || candidate.phone;
        candidate.location = location || candidate.location;
        candidate.profile = profile || candidate.profile;
        await candidate.save();
        return res.json(candidate);
    }

    candidate = await Candidate.create({ email, name, phone, location, profile });
    res.status(201).json(candidate);
}));

// GET /api/candidates/:id  - protected (employer/admin)
router.get('/:id', requireAuth, requireRole('employer'), asyncHandler(async (req, res) => {
    const candidate = await Candidate.findById(req.params.id).lean();
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
}));

// GET /api/candidates  - list with query (protected)
router.get('/', requireAuth, requireRole('employer'), asyncHandler(async (req, res) => {
    const q = req.query.q;
    const filter = {};
    if (q) filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { profile: { $regex: q, $options: 'i' } }
    ];
    const candidates = await Candidate.find(filter).limit(100).sort({ createdAt: -1 }).lean();
    res.json(candidates);
}));

module.exports = router;
