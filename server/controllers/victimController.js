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

  const campId = camp_id ? Number(camp_id) : null;
  if (campId) {
    try {
      const check = await pool.query("SELECT camp_id FROM CAMP WHERE camp_id = $1", [campId]);
      if (check.rows.length === 0)
        return res.status(400).json({ error: `Camp ID ${campId} does not exist. Please select a valid camp.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const result = await pool.query(
      "INSERT INTO VICTIM (victim_name, full_name, age, gender, phone_number, camp_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [victim_name, full_name || null, age || null, gender || null, phone_number || null, campId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteVictim(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM USER_VICTIM WHERE victim_id = $1", [id]);
    await pool.query("DELETE FROM VICTIM_REQUEST WHERE victim_id = $1", [id]);
    await pool.query("UPDATE DEPLOYMENT_INFORMATION SET victim_id = NULL WHERE victim_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM VICTIM WHERE victim_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Victim not found." });
    res.json({ message: "Victim deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getVictims, postVictim, deleteVictim };
