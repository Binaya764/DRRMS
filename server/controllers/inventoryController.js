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
  if (!resource_name || !quantity)
    return res.status(400).json({ error: "Resource name and quantity are required." });
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

async function deleteInventory(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM DONATION_RESOURCE WHERE resource_id = $1", [id]);
    await pool.query("UPDATE DEPLOYMENT_INFORMATION SET resource_id = NULL WHERE resource_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM RESOURCE WHERE resource_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Resource not found." });
    res.json({ message: "Resource deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getInventory, postInventory, deleteInventory };
