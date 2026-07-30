require("dotenv").config();
const express = require("express");
const server = express();
const PORT = 3000;

server.use(express.json());

const allocationRouter = require("./routes/allocationRouter");
const resourceRouter   = require("./routes/resourceRouter");
const disasterRouter   = require("./routes/disasterRouter");
const shelterRouter    = require("./routes/shelterRouter");
const victimRouter     = require("./routes/victimRouter");
const donationRouter   = require("./routes/donationRouter");
const requestRouter    = require("./routes/requestRouter");
const distributionRouter = require("./routes/distributionRouter");
const deploymentRouter = require("./routes/deploymentRouter");
const inventoryRouter  = require("./routes/inventoryRouter");

const pool = require("./config/db");
pool.query('SELECT NOW()')
  .then(res => console.log('Connected to Postgres at:', res.rows[0].now))
  .catch(err => console.error('Connection error:', err.message));

server.use("/api", allocationRouter);
server.use("/api", resourceRouter);
server.use("/api", disasterRouter);
server.use("/api", shelterRouter);
server.use("/api", victimRouter);
server.use("/api", donationRouter);
server.use("/api", requestRouter);
server.use("/api", distributionRouter);
server.use("/api", deploymentRouter);
server.use("/api", inventoryRouter);

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});