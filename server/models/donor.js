const pool = require("../config/db");

// Create a new donor
const createDonor = async (data) => {
    const {
        donor_id,
        donor_name,
        donor_type,
        phone,
        email,
        address,
    } = data;

    const query = `
        INSERT INTO DONOR
        (donor_id, donor_name, donor_type, phone, email, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        donor_id,
        donor_name,
        donor_type,
        phone,
        email,
        address,
    ];

    return await pool.query(query, values);
};

// Get all donors
const getAllDonors = async () => {
    return await pool.query(
        "SELECT * FROM DONOR ORDER BY donor_id;"
    );
};

// Get donor by ID
const getDonorById = async (donor_id) => {
    return await pool.query(
        "SELECT * FROM DONOR WHERE donor_id = $1;",
        [donor_id]
    );
};

// Update donor
const updateDonor = async (donor_id, data) => {
    const {
        donor_name,
        donor_type,
        phone,
        email,
        address,
    } = data;

    const query = `
        UPDATE DONOR
        SET
            donor_name = $2,
            donor_type = $3,
            phone = $4,
            email = $5,
            address = $6
        WHERE donor_id = $1
        RETURNING *;
    `;

    const values = [
        donor_id,
        donor_name,
        donor_type,
        phone,
        email,
        address,
    ];

    return await pool.query(query, values);
};

// Delete donor
const deleteDonor = async (donor_id) => {
    return await pool.query(
        "DELETE FROM DONOR WHERE donor_id = $1 RETURNING *;",
        [donor_id]
    );
};

module.exports = {
    createDonor,
    getAllDonors,
    getDonorById,
    updateDonor,
    deleteDonor,
};