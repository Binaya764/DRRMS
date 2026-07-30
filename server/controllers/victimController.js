const pool = require("../config/db");

async function getVictims(req, res) {
  try {
    const result = await pool.query("SELECT * FROM VICTIM ORDER BY victim_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postVictim(req, res) {
  const { victim_name, full_name, age, gender, phone_number, camp_id } = req.body;
  if (!victim_name) return res.status(400).json({ error: "Victim name is required." });
  try {
    const result = await pool.query(
      "INSERT INTO VICTIM (victim_name, full_name, age, gender, phone_number, camp_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [victim_name, full_name || null, age || null, gender || null, phone_number || null, camp_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getVictims, postVictim };
