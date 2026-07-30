const pool = require("../config/db");

async function getDeployments(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Deployments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postDeployment(req, res) {
  const { team, location, task, deployed_on, status } = req.body;
  if (!team || !location || !task) return res.status(400).json({ error: 'Team, location and task are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO Deployments (team, location, task, deployed_on, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [team, location, task, deployed_on || null, status || 'Active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDeployments, postDeployment };
