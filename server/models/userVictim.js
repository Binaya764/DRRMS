const pool = require("../config/db");

// Create a new user-victim relationship
const createUserVictim = async (data) => {
    const {
        user_id,
        victim_id,
    } = data;

    const query = `
        INSERT INTO USERS_VICTIM
        (
            user_id,
            victim_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        user_id,
        victim_id,
    ];

    return await pool.query(query, values);
};

// Get all user-victim relationships
const getAllUserVictims = async () => {
    return await pool.query(
        "SELECT * FROM USERS_VICTIM ORDER BY user_id, victim_id;"
    );
};

// Get user-victim relationship by IDs
const getUserVictimById = async (user_id, victim_id) => {
    return await pool.query(
        `SELECT * FROM USERS_VICTIM
         WHERE user_id = $1
         AND victim_id = $2;`,
        [user_id, victim_id]
    );
};

// Update user-victim relationship
const updateUserVictim = async (user_id, victim_id, data) => {
    const {
        new_user_id,
        new_victim_id,
    } = data;

    const query = `
        UPDATE USERS_VICTIM
        SET
            user_id = $3,
            victim_id = $4
        WHERE user_id = $1
        AND victim_id = $2
        RETURNING *;
    `;

    const values = [
        user_id,
        victim_id,
        new_user_id,
        new_victim_id,
    ];

    return await pool.query(query, values);
};

// Delete user-victim relationship
const deleteUserVictim = async (user_id, victim_id) => {
    return await pool.query(
        `DELETE FROM USERS_VICTIM
         WHERE user_id = $1
         AND victim_id = $2
         RETURNING *;`,
        [user_id, victim_id]
    );
};

module.exports = {
    createUserVictim,
    getAllUserVictims,
    getUserVictimById,
    updateUserVictim,
    deleteUserVictim,
};