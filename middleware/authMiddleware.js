const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    console.log('[AUTH] Checking token for', req.originalUrl);
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Token d\'autorisation manquant' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Token invalide' });
        }
        console.log('User:', user); // Vérifiez si l'utilisateur est extrait correctement
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };



