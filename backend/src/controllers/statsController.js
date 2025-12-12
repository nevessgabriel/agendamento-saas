const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    const companyId = req.companyId;

    try {
        const client = await pool.connect();

        // 1. Overview Metrics (Total Appointments & Revenue)
        // We JOIN schedules with services to sum the prices
        const overviewQuery = `
            SELECT 
                COUNT(s.id) as total_appointments,
                COALESCE(SUM(svc.price), 0) as total_revenue
            FROM schedules s
            JOIN services svc ON s.service_id = svc.id
            WHERE s.company_id = $1
        `;
        const overviewRes = await client.query(overviewQuery, [companyId]);

        // 2. Chart Data: Appointments by Service (Group By)
        const servicesQuery = `
            SELECT svc.name, COUNT(s.id) as count
            FROM schedules s
            JOIN services svc ON s.service_id = svc.id
            WHERE s.company_id = $1
            GROUP BY svc.name
        `;
        const servicesRes = await client.query(servicesQuery, [companyId]);

        client.release();

        res.json({
            overview: overviewRes.rows[0],
            servicesDistribution: servicesRes.rows
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};