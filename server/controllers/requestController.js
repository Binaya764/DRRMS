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

async function deleteRequest(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM VICTIM_REQUEST WHERE request_id = $1", [id]);
    await pool.query("DELETE FROM CAMP_REQUEST WHERE request_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM REQUEST WHERE request_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Request not found." });
    res.json({ message: "Request deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getRequests, postRequest, deleteRequest };
