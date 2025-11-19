const express = require('express');
const asyncHandler = require('express-async-handler');
const Job = require('../models/job');
const Employer = require('../models/employer');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

// GET /api/jobs  - public list with paging and basic filters
router.get('/', asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '20'));
    const filter = { isActive: true };
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.location) filter.location = req.query.location;
    if (req.query.q) filter.$text = { $search: req.query.q }; // add text index on job if desired

    const [jobs, total] = await Promise.all([
        Job.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).lean(),
        Job.countDocuments(filter)
    ]);

    res.json({ page, limit, total, jobs });
}));

// POST /api/jobs  - employer creates job
router.post('/', requireAuth, requireRole('employer'), asyncHandler(async (req, res) => {
    const payload = req.body;
    // require employer association
    let employerId = req.user.companyId;
    if (!employerId) return res.status(403).json({ message: 'Employer profile required for job creation' });

    payload.employer = employerId;
    const job = await Job.create(payload);
    res.status(201).json(job);
}));

// GET /api/jobs/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('employer').lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
}));

// PATCH /api/jobs/:id  - employer owner or admin
router.patch('/:id', requireAuth, requireRole('employer'), asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    // owner check
    if (String(job.employer) !== String(req.user.companyId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
}));

// DELETE /api/jobs/:id  - employer owner or admin
router.delete('/:id', requireAuth, requireRole('employer'), asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.employer) !== String(req.user.companyId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    await job.remove();
    res.json({ message: 'Deleted' });
}));

module.exports = router;
