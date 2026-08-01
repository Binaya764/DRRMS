const pool = require("../config/db");

// Create a new donor-disaster area relationship
const createDonorDisasterArea = async (data) => {
    const {
        donor_id,
        area_id,
    } = data;

    const query = `
        INSERT INTO DONOR_DISASTER_AREA
        (
            donor_id,
            area_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        donor_id,
        area_id,
    ];

    return await pool.query(query, values);
};

// Get all donor-disaster area relationships
const getAllDonorDisasterAreas = async () => {
    return await pool.query(
        "SELECT * FROM DONOR_DISASTER_AREA ORDER BY donor_id, area_id;"
    );
};

// Get donor-disaster area relationship by IDs
const getDonorDisasterAreaById = async (donor_id, area_id) => {
    return await pool.query(
        `SELECT * FROM DONOR_DISASTER_AREA
         WHERE donor_id = $1
         AND area_id = $2;`,
        [donor_id, area_id]
    );
};

// Update donor-disaster area relationship
const updateDonorDisasterArea = async (donor_id, area_id, data) => {
    const {
        new_donor_id,
        new_area_id,
    } = data;

    const query = `
        UPDATE DONOR_DISASTER_AREA
        SET
            donor_id = $3,
            area_id = $4
        WHERE donor_id = $1
        AND area_id = $2
        RETURNING *;
    `;

    const values = [
        donor_id,
        area_id,
        new_donor_id,
        new_area_id,
    ];

    return await pool.query(query, values);
};

// Delete donor-disaster area relationship
const deleteDonorDisasterArea = async (donor_id, area_id) => {
    return await pool.query(
        `DELETE FROM DONOR_DISASTER_AREA
         WHERE donor_id = $1
         AND area_id = $2
         RETURNING *;`,
        [donor_id, area_id]
    );
};

module.exports = {
    createDonorDisasterArea,
    getAllDonorDisasterAreas,
    getDonorDisasterAreaById,
    updateDonorDisasterArea,
    deleteDonorDisasterArea,
};