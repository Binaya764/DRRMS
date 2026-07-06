const pool = require("../config/db");
async function getInfo(req,res){
    try {
    const result = await pool.query(
      "SELECT * FROM Disaster_Events WHERE status = 'Active' ORDER BY start_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postInfo(req,res){
    const { name, type, location, start_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Disaster_Events (name, type, location, start_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, location, start_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports ={
    getInfo,
    postInfo
}