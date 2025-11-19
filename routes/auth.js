const express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

// POST /api/auth/register
// Creates a user (admin can create employers). Open registration allowed here — adapt to restrict.
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, role = 'employer', name, companyId } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        passwordHash: hash,
        role,
        name,
        companyId: companyId || undefined
    });

    res.status(201).json({ id: user._id, email: user.email, role: user.role });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role, name: user.name, companyId: user.companyId }
    });
}));

module.exports = router;
