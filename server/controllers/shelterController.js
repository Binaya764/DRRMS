const pool = require("../config/db");

async function getInfo(req, res) {
  try {
    const result = await pool.query("SELECT * FROM CAMP ORDER BY camp_name ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateInfo(req, res) {
  const { id } = req.params;
  const { current_population } = req.body;
  try {
    await pool.query(
      "UPDATE CAMP SET current_population = $1 WHERE camp_id = $2",
      [current_population, id]
    );
    res.json({ message: "Camp population updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addCamp(req, res) {
  const { camp_name, location, capacity, contact_number, status } = req.body;
  if (!camp_name) return res.status(400).json({ error: "Camp name is required." });
  try {
    const result = await pool.query(
      "INSERT INTO CAMP (camp_name, location, capacity, current_population, contact_number, status) VALUES ($1, $2, $3, 0, $4, $5) RETURNING *",
      [camp_name, location || null, capacity || null, contact_number || null, status || "Active"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getInfo, updateInfo, addCamp };
