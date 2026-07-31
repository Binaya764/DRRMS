const pool = require("../config/db");

// Create a new camp-disaster relationship
const createCampDisasterArea = async (data) => {
    const {
        camp_id,
        area_id,
    } = data;

    const query = `
        INSERT INTO CAMP_DISASTER_AREA
        (
            camp_id,
            area_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        camp_id,
        area_id,
    ];

    return await pool.query(query, values);
};

// Get all camp-disaster relationships
const getAllCampDisasterAreas = async () => {
    return await pool.query(
        "SELECT * FROM CAMP_DISASTER_AREA ORDER BY camp_id, area_id;"
    );
};

// Get camp-disaster relationship by IDs
const getCampDisasterAreaById = async (camp_id, area_id) => {
    return await pool.query(
        `SELECT * FROM CAMP_DISASTER_AREA
         WHERE camp_id = $1
         AND area_id = $2;`,
        [camp_id, area_id]
    );
};

// Update camp-disaster relationship
const updateCampDisasterArea = async (camp_id, area_id, data) => {
    const {
        new_camp_id,
        new_area_id,
    } = data;

    const query = `
        UPDATE CAMP_DISASTER_AREA
        SET
            camp_id = $3,
            area_id = $4
        WHERE camp_id = $1
        AND area_id = $2
        RETURNING *;
    `;

    const values = [
        camp_id,
        area_id,
        new_camp_id,
        new_area_id,
    ];

    return await pool.query(query, values);
};

// Delete camp-disaster relationship
const deleteCampDisasterArea = async (camp_id, area_id) => {
    return await pool.query(
        `DELETE FROM CAMP_DISASTER_AREA
         WHERE camp_id = $1
         AND area_id = $2
         RETURNING *;`,
        [camp_id, area_id]
    );
};

module.exports = {
    createCampDisasterArea,
    getAllCampDisasterAreas,
    getCampDisasterAreaById,
    updateCampDisasterArea,
    deleteCampDisasterArea,
};