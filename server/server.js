require("dotenv").config();
const express = require("express");
const server = express();
const PORT = 3000;

const allocationRouter = require("./routes/allocationRouter");
const resourceRouter = require("./routes/resourceRouter");

const pool = require("./config/db");
pool.query('SELECT NOW()')
  .then(res => console.log(' Connected to Postgres at:', res.rows[0].now))
  .catch(err => console.error('Connection error:', err.message));

server.use("/api", allocationRouterRouter);
server.use("/api", resourceRouter);


server.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})