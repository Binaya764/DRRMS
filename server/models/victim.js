const pool = require("../config/db");

// Create a new victim
const createVictim = async (data) => {
    const {
        victim_id,
        victim_name,
        full_name,
        age,
        gender,
        phone_number,
        camp_id,
    } = data;

    const query = `
        INSERT INTO VICTIM
        (
            victim_id,
            victim_name,
            full_name,
            age,
            gender,
            phone_number,
            camp_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        victim_id,
        victim_name,
        full_name,
        age,
        gender,
        phone_number,
        camp_id,
    ];

    return await pool.query(query, values);
};

// Get all victims
const getAllVictims = async () => {
    return await pool.query(
        "SELECT * FROM VICTIM ORDER BY victim_id;"
    );
};

// Get victim by ID
const getVictimById = async (victim_id) => {
    return await pool.query(
        "SELECT * FROM VICTIM WHERE victim_id = $1;",
        [victim_id]
    );
};

// Update victim
const updateVictim = async (victim_id, data) => {
    const {
        victim_name,
        full_name,
        age,
        gender,
        phone_number,
        camp_id,
    } = data;

    const query = `
        UPDATE VICTIM
        SET
            victim_name = $2,
            full_name = $3,
            age = $4,
            gender = $5,
            phone_number = $6,
            camp_id = $7
        WHERE victim_id = $1
        RETURNING *;
    `;

    const values = [
        victim_id,
        victim_name,
        full_name,
        age,
        gender,
        phone_number,
        camp_id,
    ];

    return await pool.query(query, values);
};

// Delete victim
const deleteVictim = async (victim_id) => {
    return await pool.query(
        "DELETE FROM VICTIM WHERE victim_id = $1 RETURNING *;",
        [victim_id]
    );
};

module.exports = {
    createVictim,
    getAllVictims,
    getVictimById,
    updateVictim,
    deleteVictim,
};