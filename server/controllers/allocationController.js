const pool = require("../config/db");

async function postAllocation(req, res) {
  const { victim_id, resource_id, camp_id, quantity_given, deployment_by } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const stockCheck = await client.query(
      "SELECT quantity FROM RESOURCE WHERE resource_id = $1",
      [resource_id]
    );

    if (stockCheck.rows.length === 0 || stockCheck.rows[0].quantity < quantity_given) {
      throw new Error("Insufficient resource inventory available");
    }

    await client.query(
      "INSERT INTO DEPLOYMENT_INFORMATION (victim_id, resource_id, camp_id, quantity_given, deployment_by, deployment_at) VALUES ($1, $2, $3, $4, $5, NOW())",
      [victim_id || null, resource_id, camp_id, quantity_given, deployment_by || null]
    );

    await client.query(
      "UPDATE RESOURCE SET quantity = quantity - $1 WHERE resource_id = $2",
      [quantity_given, resource_id]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Resources successfully allocated!" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
}

module.exports = { postAllocation };
