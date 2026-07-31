const pool = require("../config/db");

// Create a new camp-request relationship
const createCampRequest = async (data) => {
    const {
        camp_id,
        request_id,
    } = data;

    const query = `
        INSERT INTO CAMP_REQUEST
        (
            camp_id,
            request_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        camp_id,
        request_id,
    ];

    return await pool.query(query, values);
};

// Get all camp-request relationships
const getAllCampRequests = async () => {
    return await pool.query(
        "SELECT * FROM CAMP_REQUEST ORDER BY camp_id, request_id;"
    );
};

// Get camp-request relationship by IDs
const getCampRequestById = async (camp_id, request_id) => {
    return await pool.query(
        `SELECT * FROM CAMP_REQUEST
         WHERE camp_id = $1
         AND request_id = $2;`,
        [camp_id, request_id]
    );
};

// Update camp-request relationship
const updateCampRequest = async (camp_id, request_id, data) => {
    const {
        new_camp_id,
        new_request_id,
    } = data;

    const query = `
        UPDATE CAMP_REQUEST
        SET
            camp_id = $3,
            request_id = $4
        WHERE camp_id = $1
        AND request_id = $2
        RETURNING *;
    `;

    const values = [
        camp_id,
        request_id,
        new_camp_id,
        new_request_id,
    ];

    return await pool.query(query, values);
};

// Delete camp-request relationship
const deleteCampRequest = async (camp_id, request_id) => {
    return await pool.query(
        `DELETE FROM CAMP_REQUEST
         WHERE camp_id = $1
         AND request_id = $2
         RETURNING *;`,
        [camp_id, request_id]
    );
};

module.exports = {
    createCampRequest,
    getAllCampRequests,
    getCampRequestById,
    updateCampRequest,
    deleteCampRequest,
};