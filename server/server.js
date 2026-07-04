const express = require("express");
const server = express();
const PORT = 3000;

//server.use("/", userRouter);
server.get("/home",(req,res)=>{
    res.send("hello world");
})
server.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})