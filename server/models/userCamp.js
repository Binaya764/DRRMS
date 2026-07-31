const pool = require("../config/db");

// Create a new user-camp relationship
const createUserCamp = async (data) => {
    const {
        user_id,
        camp_id,
    } = data;

    const query = `
        INSERT INTO USER_CAMP
        (
            user_id,
            camp_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        user_id,
        camp_id,
    ];

    return await pool.query(query, values);
};

// Get all user-camp relationships
const getAllUserCamps = async () => {
    return await pool.query(
        "SELECT * FROM USER_CAMP ORDER BY user_id, camp_id;"
    );
};

// Get user-camp relationship by IDs
const getUserCampById = async (user_id, camp_id) => {
    return await pool.query(
        `SELECT * FROM USER_CAMP
         WHERE user_id = $1
         AND camp_id = $2;`,
        [user_id, camp_id]
    );
};

// Update user-camp relationship
const updateUserCamp = async (user_id, camp_id, data) => {
    const {
        new_user_id,
        new_camp_id,
    } = data;

    const query = `
        UPDATE USER_CAMP
        SET
            user_id = $3,
            camp_id = $4
        WHERE user_id = $1
        AND camp_id = $2
        RETURNING *;
    `;

    const values = [
        user_id,
        camp_id,
        new_user_id,
        new_camp_id,
    ];

    return await pool.query(query, values);
};

// Delete user-camp relationship
const deleteUserCamp = async (user_id, camp_id) => {
    return await pool.query(
        `DELETE FROM USER_CAMP
         WHERE user_id = $1
         AND camp_id = $2
         RETURNING *;`,
        [user_id, camp_id]
    );
};

module.exports = {
    createUserCamp,
    getAllUserCamps,
    getUserCampById,
    updateUserCamp,
    deleteUserCamp,
};