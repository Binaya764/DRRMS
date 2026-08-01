const pool = require("../config/db");

// Create a new disaster area
const createDisasterArea = async (data) => {
    const {
        area_id,
        disaster_name,
        disaster_type,
        location,
        severity,
        incident_id,
        status,
    } = data;

    const query = `
        INSERT INTO DISASTER_AREA
        (area_id, disaster_name, disaster_type, location, severity, incident_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        area_id,
        disaster_name,
        disaster_type,
        location,
        severity,
        incident_id,
        status,
    ];

    return await pool.query(query, values);
};

// Get all disaster areas
const getAllDisasterAreas = async () => {
    return await pool.query(
        "SELECT * FROM DISASTER_AREA ORDER BY area_id;"
    );
};

// Get disaster area by ID
const getDisasterAreaById = async (area_id) => {
    return await pool.query(
        "SELECT * FROM DISASTER_AREA WHERE area_id = $1;",
        [area_id]
    );
};

// Update disaster area
const updateDisasterArea = async (area_id, data) => {
    const {
        disaster_name,
        disaster_type,
        location,
        severity,
        incident_id,
        status,
    } = data;

    const query = `
        UPDATE DISASTER_AREA
        SET
            disaster_name = $2,
            disaster_type = $3,
            location = $4,
            severity = $5,
            incident_id = $6,
            status = $7
        WHERE area_id = $1
        RETURNING *;
    `;

    const values = [
        area_id,
        disaster_name,
        disaster_type,
        location,
        severity,
        incident_id,
        status,
    ];

    return await pool.query(query, values);
};

// Delete disaster area
const deleteDisasterArea = async (area_id) => {
    return await pool.query(
        "DELETE FROM DISASTER_AREA WHERE area_id = $1 RETURNING *;",
        [area_id]
    );
};

module.exports = {
    createDisasterArea,
    getAllDisasterAreas,
    getDisasterAreaById,
    updateDisasterArea,
    deleteDisasterArea,
};