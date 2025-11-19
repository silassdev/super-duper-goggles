const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    website: String,
    description: String,
    contactEmail: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employer', employerSchema);
