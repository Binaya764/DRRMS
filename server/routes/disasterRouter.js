const { Router } = require("express");
const disasterRouter = Router();
const { getInfo, postInfo, deleteDisaster } = require("../controllers/disasterController");

disasterRouter.get("/disaster", getInfo);
disasterRouter.post("/disaster", postInfo);
disasterRouter.delete("/disaster/:id", deleteDisaster);

module.exports = disasterRouter;
