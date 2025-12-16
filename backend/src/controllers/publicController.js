// backend/src/controllers/publicController.js
const pool = require("../config/db");
const mailService = require("../services/mailService"); // <--- Import Mail Service

// ... (Keep listAllCompanies and getCompanyPage exactly as they were) ...

exports.listAllCompanies = async (req, res) => {
  /* ... Keep existing code ... */
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name, slug FROM companies ORDER BY name ASC"
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error listing companies" });
  }
};

exports.getCompanyPage = async (req, res) => {
  /* ... Keep existing code ... */
  const { slug } = req.params;
  try {
    const client = await pool.connect();
    const companyRes = await client.query(
      "SELECT id, name, slug FROM companies WHERE slug = $1",
      [slug]
    );
    if (companyRes.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Company not found" });
    }
    const company = companyRes.rows[0];
    const servicesRes = await client.query(
      "SELECT * FROM services WHERE company_id = $1",
      [company.id]
    );
    client.release();
    res.json({ company, services: servicesRes.rows });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Create Public Schedule (UPDATED WITH EMAIL LOGIC)
exports.createPublicSchedule = async (req, res) => {
  const { companyId, serviceId, clientName, clientPhone, startTime } = req.body;

  try {
    const client = await pool.connect();

    // Start Transaction
    await client.query("BEGIN");

    // 1. Insert the schedule into the database
    await client.query(
      `INSERT INTO schedules (company_id, service_id, client_name, client_phone, start_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $5::timestamp + (SELECT duration * interval '1 minute' FROM services WHERE id = $2))`,
      [companyId, serviceId, clientName, clientPhone, startTime]
    );

    // 2. Fetch additional details for the email (Service Name, Company Name, Owner Email)
    // We join tables to find the owner associated with this company
    const detailsRes = await client.query(
      `
            SELECT 
                s.name as service_name, 
                c.name as company_name,
                u.email as owner_email
            FROM services s
            JOIN companies c ON s.company_id = c.id
            JOIN users u ON u.company_id = c.id
            WHERE s.id = $1
            LIMIT 1
        `,
      [serviceId]
    );

    // Commit Transaction (Save data first, then send email)
    await client.query("COMMIT");
    client.release();

    // 3. Trigger Email Notification (Non-blocking)
    if (detailsRes.rows.length > 0) {
      const info = detailsRes.rows[0];
      const dateObj = new Date(startTime);

      // Format date/time for Brazilian locale
      const dateStr = dateObj.toLocaleDateString("pt-BR");
      const timeStr = dateObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Call the mail service
      mailService.sendBookingConfirmation(
        info.owner_email, // Send to the Business Owner
        clientName,
        info.service_name,
        dateStr,
        timeStr,
        info.company_name
      );
    }

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    // Rollback in case of database error
    // Note: If email fails, the booking is still saved because it's outside the transaction scope
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Failed to book" });
  }
};
