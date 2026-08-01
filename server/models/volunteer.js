const pool = require("../config/db");

// Create a new volunteer
const createVolunteer = async (data) => {
    const {
        volunteer_id,
        volunteer_name,
        duration_days,
        timestamp_date,
        area,
    } = data;

    const query = `
        INSERT INTO VOLUNTEER
        (
            volunteer_id,
            volunteer_name,
            duration_days,
            timestamp_date,
            area
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [
        volunteer_id,
        volunteer_name,
        duration_days,
        timestamp_date,
        area,
    ];

    return await pool.query(query, values);
};

// Get all volunteers
const getAllVolunteers = async () => {
    return await pool.query(
        "SELECT * FROM VOLUNTEER ORDER BY volunteer_id;"
    );
};

// Get volunteer by ID
const getVolunteerById = async (volunteer_id) => {
    return await pool.query(
        "SELECT * FROM VOLUNTEER WHERE volunteer_id = $1;",
        [volunteer_id]
    );
};

// Update volunteer
const updateVolunteer = async (volunteer_id, data) => {
    const {
        volunteer_name,
        duration_days,
        timestamp_date,
        area,
    } = data;

    const query = `
        UPDATE VOLUNTEER
        SET
            volunteer_name = $2,
            duration_days = $3,
            timestamp_date = $4,
            area = $5
        WHERE volunteer_id = $1
        RETURNING *;
    `;

    const values = [
        volunteer_id,
        volunteer_name,
        duration_days,
        timestamp_date,
        area,
    ];

    return await pool.query(query, values);
};

// Delete volunteer
const deleteVolunteer = async (volunteer_id) => {
    return await pool.query(
        "DELETE FROM VOLUNTEER WHERE volunteer_id = $1 RETURNING *;",
        [volunteer_id]
    );
};

module.exports = {
    createVolunteer,
    getAllVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer,
};