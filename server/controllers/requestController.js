const pool = require("../config/db");

async function getRequests(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Resource_Requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postRequest(req, res) {
  const { shelter, item, quantity, priority, notes } = req.body;
  if (!shelter || !item || !quantity) return res.status(400).json({ error: 'Shelter, item and quantity are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO Resource_Requests (shelter, item, quantity, priority, notes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [shelter, item, quantity, priority || 'Medium', notes || null, 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getRequests, postRequest };
