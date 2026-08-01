const pool = require("../config/db");

// Create a new request
const createRequest = async (data) => {
    const {
        request_id,
        request_id_alt,
        range_id,
        timestamp,
        status,
        priority_level,
    } = data;

    const query = `
        INSERT INTO REQUEST
        (
            request_id,
            request_id_alt,
            range_id,
            timestamp,
            status,
            priority_level
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        request_id,
        request_id_alt,
        range_id,
        timestamp,
        status,
        priority_level,
    ];

    return await pool.query(query, values);
};

// Get all requests
const getAllRequests = async () => {
    return await pool.query(
        "SELECT * FROM REQUEST ORDER BY request_id;"
    );
};

// Get request by ID
const getRequestById = async (request_id) => {
    return await pool.query(
        "SELECT * FROM REQUEST WHERE request_id = $1;",
        [request_id]
    );
};

// Update request
const updateRequest = async (request_id, data) => {
    const {
        request_id_alt,
        range_id,
        timestamp,
        status,
        priority_level,
    } = data;

    const query = `
        UPDATE REQUEST
        SET
            request_id_alt = $2,
            range_id = $3,
            timestamp = $4,
            status = $5,
            priority_level = $6
        WHERE request_id = $1
        RETURNING *;
    `;

    const values = [
        request_id,
        request_id_alt,
        range_id,
        timestamp,
        status,
        priority_level,
    ];

    return await pool.query(query, values);
};

// Delete request
const deleteRequest = async (request_id) => {
    return await pool.query(
        "DELETE FROM REQUEST WHERE request_id = $1 RETURNING *;",
        [request_id]
    );
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
};