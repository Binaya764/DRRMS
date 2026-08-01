const pool = require("../config/db");

// Create a new donor-camp relationship
const createDonorCamp = async (data) => {
    const {
        donor_id,
        camp_id,
    } = data;

    const query = `
        INSERT INTO DONOR_CAMP
        (
            donor_id,
            camp_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        donor_id,
        camp_id,
    ];

    return await pool.query(query, values);
};

// Get all donor-camp relationships
const getAllDonorCamps = async () => {
    return await pool.query(
        "SELECT * FROM DONOR_CAMP ORDER BY donor_id, camp_id;"
    );
};

// Get donor-camp relationship by IDs
const getDonorCampById = async (donor_id, camp_id) => {
    return await pool.query(
        `SELECT * FROM DONOR_CAMP
         WHERE donor_id = $1 AND camp_id = $2;`,
        [donor_id, camp_id]
    );
};

// Update donor-camp relationship
const updateDonorCamp = async (donor_id, camp_id, data) => {
    const {
        new_donor_id,
        new_camp_id,
    } = data;

    const query = `
        UPDATE DONOR_CAMP
        SET
            donor_id = $3,
            camp_id = $4
        WHERE donor_id = $1
          AND camp_id = $2
        RETURNING *;
    `;

    const values = [
        donor_id,
        camp_id,
        new_donor_id,
        new_camp_id,
    ];

    return await pool.query(query, values);
};

// Delete donor-camp relationship
const deleteDonorCamp = async (donor_id, camp_id) => {
    return await pool.query(
        `DELETE FROM DONOR_CAMP
         WHERE donor_id = $1
           AND camp_id = $2
         RETURNING *;`,
        [donor_id, camp_id]
    );
};

module.exports = {
    createDonorCamp,
    getAllDonorCamps,
    getDonorCampById,
    updateDonorCamp,
    deleteDonorCamp,
};