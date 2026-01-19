const pool = require("../config/db");

exports.getSummary = async (req, res) => {
  try {
    const companyId = req.companyId;

    const revenueRes = await pool.query(
      `SELECT SUM(svc.price) as total 
             FROM schedules s 
             JOIN services svc ON s.service_id = svc.id 
             WHERE s.company_id = $1`,
      [companyId],
    );

    const bookingsRes = await pool.query(
      "SELECT COUNT(*) as total FROM schedules WHERE company_id = $1",
      [companyId],
    );

    res.json({
      revenue: revenueRes.rows[0].total || 0,
      bookings: bookingsRes.rows[0].total || 0,
    });
  } catch (error) {
    console.error("Erro no Resumo:", error);
    res.status(500).json({ error: "Erro ao buscar resumo" });
  }
};

exports.getChartData = async (req, res) => {
  const companyId = req.companyId;
  const { type, range, startDate, endDate } = req.query;

  try {
    if (type === "monthly_revenue") {
      let filterClause = "";
      let params = [companyId];
      let paramCounter = 1;

      if (startDate && endDate) {
        paramCounter++;
        filterClause = `AND s.start_time >= $${paramCounter}`;
        params.push(startDate);

        paramCounter++;
        filterClause += ` AND s.start_time <= $${paramCounter}`;
        params.push(`${endDate} 23:59:59`);
      } else {
        const limit = parseInt(range) || 6;

        paramCounter++;
        filterClause = `AND s.start_time >= CURRENT_DATE - ($${paramCounter} || ' months')::INTERVAL`;
        params.push(limit);
      }

      const query = `
                SELECT 
                    TO_CHAR(s.start_time, 'YYYY-MM') as label, 
                    SUM(svc.price) as value
                FROM schedules s
                JOIN services svc ON s.service_id = svc.id
                WHERE s.company_id = $1 
                ${filterClause}
                GROUP BY label
                ORDER BY label ASC
            `;

      const result = await pool.query(query, params);
      return res.json(result.rows);
    } else if (type === "popular_services") {
      const query = `
                SELECT svc.name as label, COUNT(s.id) as value
                FROM schedules s
                JOIN services svc ON s.service_id = svc.id
                WHERE s.company_id = $1
                GROUP BY svc.name
                ORDER BY value DESC
            `;
      const result = await pool.query(query, [companyId]);
      return res.json(result.rows);
    }

    return res.status(400).json({ error: "Tipo inválido" });
  } catch (error) {
    console.error("Erro nos Gráficos:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
};
