const pool = require("../config/db");

// Create a new donation-resource relationship
const createDonationResource = async (data) => {
    const {
        donation_id,
        resource_id,
    } = data;

    const query = `
        INSERT INTO DONATION_RESOURCE
        (
            donation_id,
            resource_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        donation_id,
        resource_id,
    ];

    return await pool.query(query, values);
};

// Get all donation-resource relationships
const getAllDonationResources = async () => {
    return await pool.query(
        "SELECT * FROM DONATION_RESOURCE ORDER BY donation_id, resource_id;"
    );
};

// Get donation-resource relationship by IDs
const getDonationResourceById = async (donation_id, resource_id) => {
    return await pool.query(
        `SELECT * FROM DONATION_RESOURCE
         WHERE donation_id = $1
         AND resource_id = $2;`,
        [donation_id, resource_id]
    );
};

// Update donation-resource relationship
const updateDonationResource = async (donation_id, resource_id, data) => {
    const {
        new_donation_id,
        new_resource_id,
    } = data;

    const query = `
        UPDATE DONATION_RESOURCE
        SET
            donation_id = $3,
            resource_id = $4
        WHERE donation_id = $1
        AND resource_id = $2
        RETURNING *;
    `;

    const values = [
        donation_id,
        resource_id,
        new_donation_id,
        new_resource_id,
    ];

    return await pool.query(query, values);
};

// Delete donation-resource relationship
const deleteDonationResource = async (donation_id, resource_id) => {
    return await pool.query(
        `DELETE FROM DONATION_RESOURCE
         WHERE donation_id = $1
         AND resource_id = $2
         RETURNING *;`,
        [donation_id, resource_id]
    );
};

module.exports = {
    createDonationResource,
    getAllDonationResources,
    getDonationResourceById,
    updateDonationResource,
    deleteDonationResource,
};