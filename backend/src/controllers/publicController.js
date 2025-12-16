const pool = require("../config/db");

exports.listAllCompanies = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name, slug FROM companies ORDER BY name ASC"
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error("List Companies Error:", error);
    res.status(500).json({ error: "Erro ao listar barbearias" });
  }
};

exports.getCompanyPage = async (req, res) => {
  const { slug } = req.params;

  try {
    const client = await pool.connect();

    const companyRes = await client.query(
      "SELECT id, name, slug FROM companies WHERE slug = $1",
      [slug]
    );

    if (companyRes.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Barbearia não encontrada" });
    }

    const company = companyRes.rows[0];
    const servicesRes = await client.query(
      "SELECT * FROM services WHERE company_id = $1",
      [company.id]
    );

    client.release();

    res.json({
      company: company,
      services: servicesRes.rows,
    });
  } catch (error) {
    console.error("Public Page Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createPublicSchedule = async (req, res) => {
  const { companyId, serviceId, clientName, clientPhone, startTime } = req.body;

  try {
    const client = await pool.connect();

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO schedules (company_id, service_id, client_name, client_phone, start_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $5::timestamp + (SELECT duration * interval '1 minute' FROM services WHERE id = $2))`,
      [companyId, serviceId, clientName, clientPhone, startTime]
    );

    await client.query("COMMIT");
    client.release();

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Failed to book" });
  }
};
