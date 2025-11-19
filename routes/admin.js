const express = require('express');
const asyncHandler = require('express-async-handler');
const Application = require('../models/application');
const Job = require('../models/job');
const Candidate = require('../models/candidate');
const Employer = require('../models/employer');

const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

// GET /api/admin/counts
router.get('/counts', asyncHandler(async (req, res) => {
    const [jobs, apps, candidates, employers] = await Promise.all([
        Job.countDocuments({}),
        Application.countDocuments({}),
        Candidate.countDocuments({}),
        Employer.countDocuments({})
    ]);

    res.json({ jobs, apps, candidates, employers });
}));

// GET /api/admin/applications/status
router.get('/applications/status', asyncHandler(async (req, res) => {
    const stats = await Application.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);
    res.json(stats);
}));

// GET /api/admin/applications/per-job
router.get('/applications/per-job', asyncHandler(async (req, res) => {
    const stats = await Application.aggregate([
        { $group: { _id: "$job", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "job" } },
        { $unwind: "$job" },
        { $project: { jobId: "$job._id", title: "$job.title", count: 1 } }
    ]);
    res.json(stats);
}));

// GET /api/admin/applications/monthly
router.get('/applications/monthly', asyncHandler(async (req, res) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const stats = await Application.aggregate([
        { $match: { appliedAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: "$appliedAt" }, month: { $month: "$appliedAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json(stats);
}));

module.exports = router;
