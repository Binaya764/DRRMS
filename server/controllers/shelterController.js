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

async function deleteCamp(req, res) {
  const { id } = req.params;
  try {
    // Remove FK references first
    await pool.query("UPDATE VICTIM SET camp_id = NULL WHERE camp_id = $1", [id]);
    await pool.query("DELETE FROM DONOR_CAMP WHERE camp_id = $1", [id]);
    await pool.query("DELETE FROM CAMP_DISASTER_AREA WHERE camp_id = $1", [id]);
    await pool.query("DELETE FROM VOLUNTEER_CAMP WHERE camp_id = $1", [id]);
    await pool.query("DELETE FROM USER_CAMP WHERE camp_id = $1", [id]);
    await pool.query("DELETE FROM CAMP_REQUEST WHERE camp_id = $1", [id]);
    await pool.query("UPDATE DEPLOYMENT_INFORMATION SET camp_id = NULL WHERE camp_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM CAMP WHERE camp_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Camp not found." });
    res.json({ message: "Camp deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getInfo, updateInfo, addCamp, deleteCamp };
