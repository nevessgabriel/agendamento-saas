const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).json({ error: 'Erro no Token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatado' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        req.userId = decoded.id;
        req.companyId = decoded.companyId;
        return next();
    });
};