const pool = require("../config/db");

// Create a new volunteer-disaster area relationship
const createVolunteerDisasterArea = async (data) => {
    const {
        volunteer_id,
        area_id,
    } = data;

    const query = `
        INSERT INTO VOLUNTEER_DISASTER_AREA
        (
            volunteer_id,
            area_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        volunteer_id,
        area_id,
    ];

    return await pool.query(query, values);
};

// Get all volunteer-disaster area relationships
const getAllVolunteerDisasterAreas = async () => {
    return await pool.query(
        "SELECT * FROM VOLUNTEER_DISASTER_AREA ORDER BY volunteer_id, area_id;"
    );
};

// Get volunteer-disaster area relationship by IDs
const getVolunteerDisasterAreaById = async (volunteer_id, area_id) => {
    return await pool.query(
        `SELECT * FROM VOLUNTEER_DISASTER_AREA
         WHERE volunteer_id = $1
         AND area_id = $2;`,
        [volunteer_id, area_id]
    );
};

// Update volunteer-disaster area relationship
const updateVolunteerDisasterArea = async (volunteer_id, area_id, data) => {
    const {
        new_volunteer_id,
        new_area_id,
    } = data;

    const query = `
        UPDATE VOLUNTEER_DISASTER_AREA
        SET
            volunteer_id = $3,
            area_id = $4
        WHERE volunteer_id = $1
        AND area_id = $2
        RETURNING *;
    `;

    const values = [
        volunteer_id,
        area_id,
        new_volunteer_id,
        new_area_id,
    ];

    return await pool.query(query, values);
};

// Delete volunteer-disaster area relationship
const deleteVolunteerDisasterArea = async (volunteer_id, area_id) => {
    return await pool.query(
        `DELETE FROM VOLUNTEER_DISASTER_AREA
         WHERE volunteer_id = $1
         AND area_id = $2
         RETURNING *;`,
        [volunteer_id, area_id]
    );
};

module.exports = {
    createVolunteerDisasterArea,
    getAllVolunteerDisasterAreas,
    getVolunteerDisasterAreaById,
    updateVolunteerDisasterArea,
    deleteVolunteerDisasterArea,
};