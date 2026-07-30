const pool = require("../config/db");

// Create a new request item
const createRequestItem = async (data) => {
    const {
        serial,
        request_item_id,
        resource_id,
        quantity_requested,
    } = data;

    const query = `
        INSERT INTO REQUEST_ITEM
        (
            serial,
            request_item_id,
            resource_id,
            quantity_requested
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [
        serial,
        request_item_id,
        resource_id,
        quantity_requested,
    ];

    return await pool.query(query, values);
};

// Get all request items
const getAllRequestItems = async () => {
    return await pool.query(
        "SELECT * FROM REQUEST_ITEM ORDER BY serial;"
    );
};

// Get request item by serial
const getRequestItemById = async (serial) => {
    return await pool.query(
        "SELECT * FROM REQUEST_ITEM WHERE serial = $1;",
        [serial]
    );
};

// Update request item
const updateRequestItem = async (serial, data) => {
    const {
        request_item_id,
        resource_id,
        quantity_requested,
    } = data;

    const query = `
        UPDATE REQUEST_ITEM
        SET
            request_item_id = $2,
            resource_id = $3,
            quantity_requested = $4
        WHERE serial = $1
        RETURNING *;
    `;

    const values = [
        serial,
        request_item_id,
        resource_id,
        quantity_requested,
    ];

    return await pool.query(query, values);
};

// Delete request item
const deleteRequestItem = async (serial) => {
    return await pool.query(
        "DELETE FROM REQUEST_ITEM
        WHERE serial = $1
        RETURNING *;",
        [serial]
    );
};

module.exports = {
    createRequestItem,
    getAllRequestItems,
    getRequestItemById,
    updateRequestItem,
    deleteRequestItem,
};