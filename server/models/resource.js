const pool = require("../config/db");

// Create a new resource
const createResource = async (data) => {
    const {
        resource_id,
        resource_name,
        category,
        quantity,
    } = data;

    const query = `
        INSERT INTO RESOURCE
        (
            resource_id,
            resource_name,
            category,
            quantity
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [
        resource_id,
        resource_name,
        category,
        quantity,
    ];

    return await pool.query(query, values);
};

// Get all resources
const getAllResources = async () => {
    return await pool.query(
        "SELECT * FROM RESOURCE ORDER BY resource_id;"
    );
};

// Get resource by ID
const getResourceById = async (resource_id) => {
    return await pool.query(
        "SELECT * FROM RESOURCE WHERE resource_id = $1;",
        [resource_id]
    );
};

// Update resource
const updateResource = async (resource_id, data) => {
    const {
        resource_name,
        category,
        quantity,
    } = data;

    const query = `
        UPDATE RESOURCE
        SET
            resource_name = $2,
            category = $3,
            quantity = $4
        WHERE resource_id = $1
        RETURNING *;
    `;

    const values = [
        resource_id,
        resource_name,
        category,
        quantity,
    ];

    return await pool.query(query, values);
};

// Delete resource
const deleteResource = async (resource_id) => {
    return await pool.query(
        "DELETE FROM RESOURCE WHERE resource_id = $1 RETURNING *;",
        [resource_id]
    );
};

module.exports = {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource,
};