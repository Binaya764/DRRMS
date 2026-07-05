require('dotenv').config();
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const {Pool} = require("pg");
module.exports = new Pool({

    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE ,
    password: process.env.PASSWORD,
    port: process.env.PORT
});
console.log("--- DB CONFIG DEBUG ---");
console.log("Host:", process.env.HOST);
console.log("User:", process.env.USER);
console.log("Database:", process.env.DATABASE);
console.log("Password Type:", typeof process.env.PASSWORD); // Should say 'string'
console.log("-----------------------");