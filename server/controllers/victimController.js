const pool = require("../config/db");

async function getVictims(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Victims ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postVictim(req, res) {
  const { name, age, gender, location, status, contact } = req.body;
  if (!name || !location) return res.status(400).json({ error: 'Name and location are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO Victims (name, age, gender, location, status, contact) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, age || null, gender || null, location, status || 'Displaced', contact || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getVictims, postVictim };
