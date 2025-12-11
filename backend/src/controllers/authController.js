const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { companyName, email, password } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const companyRes = await client.query('INSERT INTO companies (name) VALUES ($1) RETURNING id', [companyName]);
        const newCompanyId = companyRes.rows[0].id;

        const userRes = await client.query(
            'INSERT INTO users (email, password, role, company_id) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
            [email, hashedPassword, 'admin', newCompanyId]
        );

        await client.query('COMMIT');
        res.status(201).json({ companyId: newCompanyId, user: userRes.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Erro no registro' });
    } finally {
        client.release();
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Usuário não encontrado' });

        const user = result.rows[0];
        if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ error: 'Senha inválida' });

        const token = jwt.sign({ id: user.id, companyId: user.company_id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
        
        user.password = undefined;
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
};