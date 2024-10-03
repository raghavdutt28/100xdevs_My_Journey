const jwt = require('jsonwebtoken');

const JWTSECRET = "ILOVEMOMO";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please login again.' });
    }
    try {
        const decoded = jwt.verify(token, JWTSECRET);
        req.userId = decoded.userId;
        req.name = decoded.name;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Please login again.' })
    }
}

module.exports = {
    authMiddleware
};