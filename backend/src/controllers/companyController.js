// backend/src/controllers/companyController.js
const pool = require("../config/db");

// Get current company details (Authenticated via Token)
exports.getMyCompany = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, slug, phone, address FROM companies WHERE id = $1",
      [req.companyId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
};

// Update company details
exports.updateCompany = async (req, res) => {
  const { name, slug, phone, address } = req.body;

  try {
    // Check if the requested slug is already taken by ANOTHER company
    const slugCheck = await pool.query(
      "SELECT id FROM companies WHERE slug = $1 AND id != $2",
      [slug, req.companyId],
    );

    if (slugCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "This link (slug) is already in use." });
    }

    await pool.query(
      "UPDATE companies SET name = $1, slug = $2, phone = $3, address = $4 WHERE id = $5",
      [name, slug, phone, address, req.companyId],
    );

    res.json({ message: "Company details updated successfully!" });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Error updating data" });
  }
};
