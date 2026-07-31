const pool = require("../config/db");

async function getDistributions(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM DEPLOYMENT_INFORMATION ORDER BY deployment_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postDistribution(req, res) {
  const { victim_id, resource_id, camp_id, quantity_given, deployment_by } = req.body;
  if (!resource_id || !quantity_given)
    return res.status(400).json({ error: "Resource and quantity are required." });
  try {
    const result = await pool.query(
      "INSERT INTO DEPLOYMENT_INFORMATION (victim_id, resource_id, camp_id, quantity_given, deployment_by, deployment_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [victim_id || null, resource_id, camp_id || null, quantity_given, deployment_by || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDistribution(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM DEPLOYMENT_INFORMATION WHERE deployment_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Distribution record not found." });
    res.json({ message: "Distribution deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDistributions, postDistribution, deleteDistribution };
