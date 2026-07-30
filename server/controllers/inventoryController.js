const pool = require("../config/db");

async function getInventory(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Inventory ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postInventory(req, res) {
  const { item, category, quantity, unit, location, expires } = req.body;
  if (!item || !quantity) return res.status(400).json({ error: 'Item and quantity are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO Inventory (item, category, quantity, unit, storage_location, expiry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [item, category || null, quantity, unit || null, location || null, expires || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getInventory, postInventory };
