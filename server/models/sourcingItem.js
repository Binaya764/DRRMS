const pool = require("../config/db");

// Create a new sourcing item
const createSourcingItem = async (data) => {
    const {
        serial,
        sourcing_areas_id,
        duration_id,
        quantity_donated,
    } = data;

    const query = `
        INSERT INTO SOURCING_ITEM
        (
            serial,
            sourcing_areas_id,
            duration_id,
            quantity_donated
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [
        serial,
        sourcing_areas_id,
        duration_id,
        quantity_donated,
    ];

    return await pool.query(query, values);
};

// Get all sourcing items
const getAllSourcingItems = async () => {
    return await pool.query(
        "SELECT * FROM SOURCING_ITEM ORDER BY serial;"
    );
};

// Get sourcing item by serial
const getSourcingItemById = async (serial) => {
    return await pool.query(
        "SELECT * FROM SOURCING_ITEM WHERE serial = $1;",
        [serial]
    );
};

// Update sourcing item
const updateSourcingItem = async (serial, data) => {
    const {
        sourcing_areas_id,
        duration_id,
        quantity_donated,
    } = data;

    const query = `
        UPDATE SOURCING_ITEM
        SET
            sourcing_areas_id = $2,
            duration_id = $3,
            quantity_donated = $4
        WHERE serial = $1
        RETURNING *;
    `;

    const values = [
        serial,
        sourcing_areas_id,
        duration_id,
        quantity_donated,
    ];

    return await pool.query(query, values);
};

// Delete sourcing item
const deleteSourcingItem = async (serial) => {
    return await pool.query(
        "DELETE FROM SOURCING_ITEM WHERE serial = $1 RETURNING *;",
        [serial]
    );
};

module.exports = {
    createSourcingItem,
    getAllSourcingItems,
    getSourcingItemById,
    updateSourcingItem,
    deleteSourcingItem,
};