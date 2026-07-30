const pool = require("../config/db");

async function getDeployments(req, res) {
  try {
    const result = await pool.query(
      `SELECT v.volunteer_id, v.volunteer_name, v.duration_days, v.timestamp_date,
              c.camp_name, c.location
       FROM VOLUNTEER v
       LEFT JOIN VOLUNTEER_CAMP vc ON v.volunteer_id = vc.volunteer_id
       LEFT JOIN CAMP c ON vc.camp_id = c.camp_id
       ORDER BY v.volunteer_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postDeployment(req, res) {
  const { volunteer_name, duration_days, timestamp_date, area } = req.body;
  if (!volunteer_name) return res.status(400).json({ error: "Volunteer name is required." });
  try {
    const result = await pool.query(
      "INSERT INTO VOLUNTEER (volunteer_name, duration_days, timestamp_date, area) VALUES ($1, $2, $3, $4) RETURNING *",
      [volunteer_name, duration_days || null, timestamp_date || null, area || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDeployments, postDeployment };
