const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    coverLetter: String,
    status: { type: String, enum: ['applied', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn'], default: 'applied', index: true },
    seen: { type: Boolean, default: false },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
