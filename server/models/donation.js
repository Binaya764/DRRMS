const pool = require("../config/db");

// Create a new donation
const createDonation = async (data) => {
    const {
        donation_id,
        serial,
        amount,
        electoral,
        cash_amount,
        currency,
        donation_date,
        remarks,
    } = data;

    const query = `
        INSERT INTO DONATION
        (
            donation_id,
            serial,
            amount,
            electoral,
            cash_amount,
            currency,
            donation_date,
            remarks
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const values = [
        donation_id,
        serial,
        amount,
        electoral,
        cash_amount,
        currency,
        donation_date,
        remarks,
    ];

    return await pool.query(query, values);
};

// Get all donations
const getAllDonations = async () => {
    return await pool.query(
        "SELECT * FROM DONATION ORDER BY donation_id;"
    );
};

// Get donation by ID
const getDonationById = async (donation_id) => {
    return await pool.query(
        "SELECT * FROM DONATION WHERE donation_id = $1;",
        [donation_id]
    );
};

// Update donation
const updateDonation = async (donation_id, data) => {
    const {
        serial,
        amount,
        electoral,
        cash_amount,
        currency,
        donation_date,
        remarks,
    } = data;

    const query = `
        UPDATE DONATION
        SET
            serial = $2,
            amount = $3,
            electoral = $4,
            cash_amount = $5,
            currency = $6,
            donation_date = $7,
            remarks = $8
        WHERE donation_id = $1
        RETURNING *;
    `;

    const values = [
        donation_id,
        serial,
        amount,
        electoral,
        cash_amount,
        currency,
        donation_date,
        remarks,
    ];

    return await pool.query(query, values);
};

// Delete donation
const deleteDonation = async (donation_id) => {
    return await pool.query(
        "DELETE FROM DONATION WHERE donation_id = $1 RETURNING *;",
        [donation_id]
    );
};

module.exports = {
    createDonation,
    getAllDonations,
    getDonationById,
    updateDonation,
    deleteDonation,
};