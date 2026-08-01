require('dotenv').config();
const { Pool } = require("pg");

module.exports = new Pool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port:     process.env.DB_PORT || 5432,
});
