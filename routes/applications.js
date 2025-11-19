const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const Job = require('../models/job');
const Candidate = require('../models/candidate');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// candidate applies (ensure candidate record exists first)
router.post('/', requireAuth, requireRole('employer') /* replace with candidate role if you use candidate users */, async (req, res) => {
    // Example: if candidates are not authenticated as users, accept candidate info in body and create candidate record
    const { jobId, candidateData, resumeId, coverLetter } = req.body;
    if (!jobId || !candidateData) return res.status(400).json({ message: 'Missing' });

    // create/find candidate
    let candidate = await Candidate.findOne({ email: candidateData.email });
    if (!candidate) candidate = await Candidate.create(candidateData);

    const appDoc = await Application.create({
        job: jobId,
        candidate: candidate._id,
        resume: resumeId,
        coverLetter,
    });

    // optionally: create notification for employer or job owner
    // ...

    res.status(201).json(appDoc);
});

// Employer: list applications for their job
router.get('/job/:jobId', requireAuth, requireRole('employer'), async (req, res) => {
    const { jobId } = req.params;
    const apps = await Application.find({ job: jobId }).populate('candidate resume').sort({ appliedAt: -1 }).lean();
    res.json(apps);
});

// Update status
router.patch('/:id/status', requireAuth, requireRole('employer'), async (req, res) => {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    // verify job belongs to employer
    const job = await Job.findById(app.job);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.employer) !== String(req.user.companyId) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    app.status = req.body.status;
    await app.save();
    res.json(app);
});

module.exports = router;
