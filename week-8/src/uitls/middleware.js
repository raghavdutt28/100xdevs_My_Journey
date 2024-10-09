const jwt = require('jsonwebtoken');


const { loginTypeCheck } = require('./types');
const { UserModel } = require('./db');


const userAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please login again.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
        req.userId = decoded.userId;
        req.name = decoded.name;
        next();


    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Please login again.' })
    }
}

const adminAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please login again.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.name = decoded.name;
        next();


    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Please login again.' })
    }
}

module.exports = {
    userAuthMiddleware,
    adminAuthMiddleware
};

