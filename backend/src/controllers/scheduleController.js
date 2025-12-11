const pool = require('../config/db');

exports.listSchedules = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT s.*, svc.name as service_name FROM schedules s JOIN services svc ON s.service_id = svc.id WHERE s.company_id = $1 ORDER BY s.start_time', 
            [req.companyId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
};

exports.createSchedule = async (req, res) => {
    const { clientName, clientPhone, serviceId, startTime } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Pegar duração
        const svcRes = await client.query('SELECT duration FROM services WHERE id = $1', [serviceId]);
        if (svcRes.rows.length === 0) throw new Error('Serviço não encontrado');
        
        const start = new Date(startTime);
        const end = new Date(start.getTime() + svcRes.rows[0].duration * 60000);

        // 2. Verificar Conflito
        const conflict = await client.query(
            'SELECT id FROM schedules WHERE company_id = $1 AND ((start_time < $3 AND end_time > $2))',
            [req.companyId, start, end]
        );

        if (conflict.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Horário indisponível' });
        }

        // 3. Inserir
        const insertRes = await client.query(
            'INSERT INTO schedules (company_id, service_id, client_name, client_phone, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.companyId, serviceId, clientName, clientPhone, start, end]
        );

        await client.query('COMMIT');
        res.status(201).json(insertRes.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Erro no agendamento' });
    } finally {
        client.release();
    }
};

exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM schedules WHERE id = $1 AND company_id = $2', [id, req.companyId]);
        res.json({ message: 'Agendamento cancelado' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar' });
    }
};