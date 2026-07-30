const pool = require("../config/db");

async function getDistributions(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Distributions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postDistribution(req, res) {
  const { shelter, item, quantity, unit, date, distributed_by } = req.body;
  if (!shelter || !item || !quantity) return res.status(400).json({ error: 'Shelter, item and quantity are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO Distributions (shelter, item, quantity, unit, date_distributed, distributed_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [shelter, item, quantity, unit || null, date || null, distributed_by || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDistributions, postDistribution };
