const pool = require("../config/db");

// Create a new victim-request relationship
const createVictimRequest = async (data) => {
    const {
        victim_id,
        request_id,
    } = data;

    const query = `
        INSERT INTO VICTIM_REQUEST
        (
            victim_id,
            request_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        victim_id,
        request_id,
    ];

    return await pool.query(query, values);
};

// Get all victim-request relationships
const getAllVictimRequests = async () => {
    return await pool.query(
        "SELECT * FROM VICTIM_REQUEST ORDER BY victim_id, request_id;"
    );
};

// Get victim-request relationship by IDs
const getVictimRequestById = async (victim_id, request_id) => {
    return await pool.query(
        `SELECT * FROM VICTIM_REQUEST
         WHERE victim_id = $1
         AND request_id = $2;`,
        [victim_id, request_id]
    );
};

// Update victim-request relationship
const updateVictimRequest = async (victim_id, request_id, data) => {
    const {
        new_victim_id,
        new_request_id,
    } = data;

    const query = `
        UPDATE VICTIM_REQUEST
        SET
            victim_id = $3,
            request_id = $4
        WHERE victim_id = $1
        AND request_id = $2
        RETURNING *;
    `;

    const values = [
        victim_id,
        request_id,
        new_victim_id,
        new_request_id,
    ];

    return await pool.query(query, values);
};

// Delete victim-request relationship
const deleteVictimRequest = async (victim_id, request_id) => {
    return await pool.query(
        `DELETE FROM VICTIM_REQUEST
         WHERE victim_id = $1
         AND request_id = $2
         RETURNING *;`,
        [victim_id, request_id]
    );
};

module.exports = {
    createVictimRequest,
    getAllVictimRequests,
    getVictimRequestById,
    updateVictimRequest,
    deleteVictimRequest,
};