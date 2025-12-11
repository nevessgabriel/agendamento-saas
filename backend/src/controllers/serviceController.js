const pool = require('../config/db');

exports.listServices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services WHERE company_id = $1', [req.companyId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
};

exports.createService = async (req, res) => {
    const { name, price, duration } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO services (name, price, duration, company_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, price, duration, req.companyId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar serviço' });
    }
};

exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM services WHERE id = $1 AND company_id = $2', [id, req.companyId]);
        res.json({ message: 'Serviço deletado' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar' });
    }
};