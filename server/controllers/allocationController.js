const pool = require("../config/db");

async function postAllocation(req, res) {
  const { event_id, resource_id, shelter_id, quantity } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const stockCheck = await client.query(
      'SELECT quantity_available FROM Resources WHERE resource_id = $1',
      [resource_id]
    );

    if (stockCheck.rows.length === 0 || stockCheck.rows[0].quantity_available < quantity) {
      throw new Error('Insufficient resource inventory available');
    }

    await client.query(
      'INSERT INTO Allocations (event_id, resource_id, shelter_id, quantity_allocated) VALUES ($1, $2, $3, $4)',
      [event_id, resource_id, shelter_id, quantity]
    );

    await client.query(
      'UPDATE Resources SET quantity_available = quantity_available - $1 WHERE resource_id = $2',
      [quantity, resource_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Resources successfully allocated!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
}

module.exports = { postAllocation };
