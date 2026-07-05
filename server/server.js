require("dotenv").config();
const express = require("express");
const server = express();
const PORT = 3000;

const pool = require("./config/db");
pool.query('SELECT NOW()')
  .then(res => console.log('✅ Connected to Postgres at:', res.rows[0].now))
  .catch(err => console.error('❌ Connection error:', err.message));

//server.use("/", userRouter);
server.get("/home",(req,res)=>{
    res.send("hello world");
})

server.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})