const pool = require("../config/db");

async function getResource(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM RESOURCE WHERE quantity > 0 ORDER BY category"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getResource };
