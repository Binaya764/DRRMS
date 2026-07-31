const pool = require("../config/db");

// Create a new volunteer-camp relationship
const createVolunteerCamp = async (data) => {
    const {
        volunteer_id,
        camp_id,
    } = data;

    const query = `
        INSERT INTO VOLUNTEER_CAMP
        (
            volunteer_id,
            camp_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [
        volunteer_id,
        camp_id,
    ];

    return await pool.query(query, values);
};

// Get all volunteer-camp relationships
const getAllVolunteerCamps = async () => {
    return await pool.query(
        "SELECT * FROM VOLUNTEER_CAMP ORDER BY volunteer_id, camp_id;"
    );
};

// Get volunteer-camp relationship by IDs
const getVolunteerCampById = async (volunteer_id, camp_id) => {
    return await pool.query(
        `SELECT * FROM VOLUNTEER_CAMP
         WHERE volunteer_id = $1
         AND camp_id = $2;`,
        [volunteer_id, camp_id]
    );
};

// Update volunteer-camp relationship
const updateVolunteerCamp = async (volunteer_id, camp_id, data) => {
    const {
        new_volunteer_id,
        new_camp_id,
    } = data;

    const query = `
        UPDATE VOLUNTEER_CAMP
        SET
            volunteer_id = $3,
            camp_id = $4
        WHERE volunteer_id = $1
        AND camp_id = $2
        RETURNING *;
    `;

    const values = [
        volunteer_id,
        camp_id,
        new_volunteer_id,
        new_camp_id,
    ];

    return await pool.query(query, values);
};

// Delete volunteer-camp relationship
const deleteVolunteerCamp = async (volunteer_id, camp_id) => {
    return await pool.query(
        `DELETE FROM VOLUNTEER_CAMP
         WHERE volunteer_id = $1
         AND camp_id = $2
         RETURNING *;`,
        [volunteer_id, camp_id]
    );
};

module.exports = {
    createVolunteerCamp,
    getAllVolunteerCamps,
    getVolunteerCampById,
    updateVolunteerCamp,
    deleteVolunteerCamp,
};