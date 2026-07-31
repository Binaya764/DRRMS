require('dotenv').config();
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const {Pool} = require("pg");
module.exports = new Pool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME ,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
console.log("--- DB CONFIG DEBUG ---");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_NAME);
console.log("Password Type:", typeof process.env.DB_PASSWORD); // Should say 'string'
console.log("-----------------------");