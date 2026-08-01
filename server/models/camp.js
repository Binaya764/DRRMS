const pool = require("../config/db");

// Create a new camp
const createCamp = async (data) => {
    const {
        camp_id,
        camp_name,
        location,
        capacity,
        current_population,
        contact_number,
        status,
        resource_id,
    } = data;

    const query = `
        INSERT INTO CAMP
        (
            camp_id,
            camp_name,
            location,
            capacity,
            current_population,
            contact_number,
            status,
            payment_id,
            resource_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;

    const values = [
        camp_id,
        camp_name,
        location,
        capacity,
        current_population,
        contact_number,
        status,
        payment_id,
        resource_id,
    ];

    return await pool.query(query, values);
};

// Get all camps
const getAllCamps = async () => {
    return await pool.query(
        "SELECT * FROM CAMP ORDER BY camp_id;"
    );
};

// Get camp by ID
const getCampById = async (camp_id) => {
    return await pool.query(
        "SELECT * FROM CAMP WHERE camp_id = $1;",
        [camp_id]
    );
};

// Update camp
const updateCamp = async (camp_id, data) => {
    const {
        camp_name,
        location,
        capacity,
        current_population,
        contact_number,
        status,
        payment_id,
        resource_id,
    } = data;

    const query = `
        UPDATE CAMP
        SET
            camp_name = $2,
            location = $3,
            capacity = $4,
            current_population = $5,
            contact_number = $6,
            status = $7,
            payment_id = $8,
            resource_id = $9
        WHERE camp_id = $1
        RETURNING *;
    `;

    const values = [
        camp_id,
        camp_name,
        location,
        capacity,
        current_population,
        contact_number,
        status,
        payment_id,
        resource_id,
    ];

    return await pool.query(query, values);
};

// Delete camp
const deleteCamp = async (camp_id) => {
    return await pool.query(
        "DELETE FROM CAMP WHERE camp_id = $1 RETURNING *;",
        [camp_id]
    );
};

module.exports = {
    createCamp,
    getAllCamps,
    getCampById,
    updateCamp,
    deleteCamp,
};