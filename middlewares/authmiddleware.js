import jwt from 'jsonwebtoken';

import { blacklistedTokens } from '../controllers/user_auth.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Unauthorized');

    // Check if token is blacklisted
    if (blacklistedTokens.includes(token)) {
        return res.status(403).send('Token is no longer valid (logged out)');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    });
};
