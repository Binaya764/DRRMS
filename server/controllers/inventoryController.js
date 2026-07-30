const pool = require("../config/db");

async function getInventory(req, res) {
  try {
    const result = await pool.query("SELECT * FROM RESOURCE ORDER BY category");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postInventory(req, res) {
  const { resource_name, category, quantity } = req.body;
  if (!resource_name || !quantity) return res.status(400).json({ error: "Resource name and quantity are required." });
  try {
    const result = await pool.query(
      "INSERT INTO RESOURCE (resource_name, category, quantity) VALUES ($1, $2, $3) RETURNING *",
      [resource_name, category || null, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getInventory, postInventory };
