const pool = require("../config/db");

async function getRequests(req, res) {
  try {
    const result = await pool.query("SELECT * FROM REQUEST ORDER BY request_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postRequest(req, res) {
  const { status, priority_level } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO REQUEST (timestamp, status, priority_level) VALUES (NOW(), $1, $2) RETURNING *",
      [status || "Pending", priority_level || "Medium"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getRequests, postRequest };
