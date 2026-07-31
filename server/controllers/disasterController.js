const pool = require("../config/db");

async function getInfo(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM DISASTER_AREA WHERE status = 'Active' ORDER BY area_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postInfo(req, res) {
  const { disaster_name, disaster_type, location, severity, status } = req.body;
  if (!disaster_name) return res.status(400).json({ error: "Disaster name is required." });
  try {
    const result = await pool.query(
      "INSERT INTO DISASTER_AREA (disaster_name, disaster_type, location, severity, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [disaster_name, disaster_type || null, location || null, severity || "Medium", status || "Active"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDisaster(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM DISASTER_AREA WHERE area_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Disaster area not found." });
    res.json({ message: "Disaster area deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getInfo, postInfo, deleteDisaster };
