const pool = require("../config/db");

// Create a new user
const createUser = async (data) => {
    const {
        user_id,
        full_name,
        email,
        password_hash,
        role,
        phone_number,
    } = data;

    const query = `
        INSERT INTO USER
        (
            user_id,
            full_name,
            email,
            password_hash,
            role,
            phone_number
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        user_id,
        full_name,
        email,
        password_hash,
        role,
        phone_number,
    ];

    return await pool.query(query, values);
};

// Get all users
const getAllUsers = async () => {
    return await pool.query(
        "SELECT * FROM USER ORDER BY user_id;"
    );
};

// Get user by ID
const getUserById = async (user_id) => {
    return await pool.query(
        "SELECT * FROM USER WHERE user_id = $1;",
        [user_id]
    );
};

// Update user
const updateUser = async (user_id, data) => {
    const {
        full_name,
        email,
        password_hash,
        role,
        phone_number,
    } = data;

    const query = `
        UPDATE USER
        SET
            full_name = $2,
            email = $3,
            password_hash = $4,
            role = $5,
            phone_number = $6
        WHERE user_id = $1
        RETURNING *;
    `;

    const values = [
        user_id,
        full_name,
        email,
        password_hash,
        role,
        phone_number,
    ];

    return await pool.query(query, values);
};

// Delete user
const deleteUser = async (user_id) => {
    return await pool.query(
        "DELETE FROM USER WHERE user_id = $1 RETURNING *;",
        [user_id]
    );
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};