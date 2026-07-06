async function getInfo(req,res){
    try {
    const result = await pool.query('SELECT * FROM Shelters ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateInfo(req,res){
    const { id } = req.params;
  const { current_occupancy } = req.body;
  try {
    await pool.query(
      'UPDATE Shelters SET current_occupancy = $1 WHERE shelter_id = $2',
      [current_occupancy, id]
    );
    res.json({ message: 'Shelter occupancy updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

module.exports = {
    getInfo,
    updateInfo
}