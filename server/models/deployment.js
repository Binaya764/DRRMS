const pool = require("../config/db");

// Create a new deployment
const createDeployment = async (data) => {
    const {
        deployment_id,
        victim_id,
        resource_id,
        camp_id,
        quantity_given,
        deployment_by,
        deployment_at,
    } = data;

    const query = `
        INSERT INTO DEPLOYMENT_INFORMATION
        (
            deployment_id,
            victim_id,
            resource_id,
            camp_id,
            quantity_given,
            deployment_by,
            deployment_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        deployment_id,
        victim_id,
        resource_id,
        camp_id,
        quantity_given,
        deployment_by,
        deployment_at,
    ];

    return await pool.query(query, values);
};

// Get all deployments
const getAllDeployments = async () => {
    return await pool.query(
        "SELECT * FROM DEPLOYMENT_INFORMATION ORDER BY deployment_id;"
    );
};

// Get deployment by ID
const getDeploymentById = async (deployment_id) => {
    return await pool.query(
        "SELECT * FROM DEPLOYMENT_INFORMATION WHERE deployment_id = $1;",
        [deployment_id]
    );
};

// Update deployment
const updateDeployment = async (deployment_id, data) => {
    const {
        victim_id,
        resource_id,
        camp_id,
        quantity_given,
        deployment_by,
        deployment_at,
    } = data;

    const query = `
        UPDATE DEPLOYMENT_INFORMATION
        SET
            victim_id = $2,
            resource_id = $3,
            camp_id = $4,
            quantity_given = $5,
            deployment_by = $6,
            deployment_at = $7
        WHERE deployment_id = $1
        RETURNING *;
    `;

    const values = [
        deployment_id,
        victim_id,
        resource_id,
        camp_id,
        quantity_given,
        deployment_by,
        deployment_at,
    ];

    return await pool.query(query, values);
};

// Delete deployment
const deleteDeployment = async (deployment_id) => {
    return await pool.query(
        "DELETE FROM DEPLOYMENT_INFORMATION WHERE deployment_id = $1 RETURNING *;",
        [deployment_id]
    );
};

module.exports = {
    createDeployment,
    getAllDeployments,
    getDeploymentById,
    updateDeployment,
    deleteDeployment,
};