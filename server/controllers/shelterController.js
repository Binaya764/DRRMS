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

module.exports = { getInfo, updateInfo };
