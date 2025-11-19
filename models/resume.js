const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
    filename: String, // store file path or S3 key
    content: String, // optional parsed content
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
