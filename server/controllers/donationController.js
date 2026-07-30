const pool = require("../config/db");

async function getDonations(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Donations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postDonation(req, res) {
  const { donor, item, quantity, unit, date, status } = req.body;
  if (!donor || !item || !quantity) return res.status(400).json({ error: 'Donor, item and quantity are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO Donations (donor, item, quantity, unit, date_received, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [donor, item, quantity, unit || null, date || null, status || 'Received']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDonations, postDonation };
