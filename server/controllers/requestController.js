const pool = require("../config/db");

// GET /api/requests
// Returns every request with its items as a JSON array on each row
async function getRequests(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        r.request_id,
        r.timestamp,
        r.status,
        r.priority_level,
        COALESCE(
          json_agg(
            json_build_object(
              'resource_id',        ri.resource_id,
              'resource_name',      res.resource_name,
              'quantity_requested', ri.quantity_requested
            )
          ) FILTER (WHERE ri.serial IS NOT NULL),
          '[]'
        ) AS items
      FROM REQUEST r
      LEFT JOIN REQUEST_ITEM ri ON r.request_id = ri.request_item_id
      LEFT JOIN RESOURCE res    ON ri.resource_id = res.resource_id
      GROUP BY r.request_id
      ORDER BY r.request_id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/requests
// Body: { status, priority_level, items: [{ resource_id, quantity_requested }] }
async function postRequest(req, res) {
  const { status, priority_level, items = [] } = req.body;

  // Coerce to numbers and filter out incomplete rows
  const validItems = items
    .map((i) => ({
      resource_id:        Number(i.resource_id),
      quantity_requested: Number(i.quantity_requested),
    }))
    .filter((i) => i.resource_id > 0 && i.quantity_requested > 0);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Insert the request
    const reqResult = await client.query(
      `INSERT INTO REQUEST (timestamp, status, priority_level)
       VALUES (NOW(), $1, $2) RETURNING *`,
      [status || "Pending", priority_level || "Medium"]
    );
    const newRequest = reqResult.rows[0];

    // 2. Insert each item into REQUEST_ITEM
    for (const item of validItems) {
      await client.query(
        `INSERT INTO REQUEST_ITEM (request_item_id, resource_id, quantity_requested)
         VALUES ($1, $2, $3)`,
        [newRequest.request_id, item.resource_id, item.quantity_requested]
      );
    }

    await client.query("COMMIT");

    // 3. Return the full request with items (re-query to get resource names)
    const fullResult = await pool.query(
      `SELECT
         r.request_id, r.timestamp, r.status, r.priority_level,
         COALESCE(
           json_agg(
             json_build_object(
               'resource_id',        ri.resource_id,
               'resource_name',      res.resource_name,
               'quantity_requested', ri.quantity_requested
             )
           ) FILTER (WHERE ri.serial IS NOT NULL),
           '[]'
         ) AS items
       FROM REQUEST r
       LEFT JOIN REQUEST_ITEM ri ON r.request_id = ri.request_item_id
       LEFT JOIN RESOURCE res    ON ri.resource_id = res.resource_id
       WHERE r.request_id = $1
       GROUP BY r.request_id`,
      [newRequest.request_id]
    );

    res.status(201).json(fullResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("postRequest error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

// DELETE /api/requests/:id
async function deleteRequest(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM REQUEST_ITEM   WHERE request_item_id = $1", [id]);
    await pool.query("DELETE FROM VICTIM_REQUEST  WHERE request_id = $1",     [id]);
    await pool.query("DELETE FROM CAMP_REQUEST    WHERE request_id = $1",     [id]);

    const result = await pool.query(
      "DELETE FROM REQUEST WHERE request_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Request not found." });
    res.json({ message: "Request deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getRequests, postRequest, deleteRequest };
