const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).lean();
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
};

module.exports = requireAuth;
