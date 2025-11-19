const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true, index: true },
    title: { type: String, required: true, index: true },
    slug: { type: String, index: true },
    description: String,
    location: String,
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'remote'], default: 'full-time' },
    salaryRange: String,
    tags: [String],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    closedAt: Date
});

module.exports = mongoose.model('Job', jobSchema);
