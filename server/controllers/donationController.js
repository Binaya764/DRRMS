const pool = require("../config/db");

async function getDonations(req, res) {
  try {
    const result = await pool.query("SELECT * FROM DONATION ORDER BY donation_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postDonation(req, res) {
  const { amount, cash_amount, currency, donation_date, remarks } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO DONATION (amount, cash_amount, currency, donation_date, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [amount || null, cash_amount || null, currency || "NPR", donation_date || null, remarks || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDonations, postDonation };
