const { Router } = require("express");
const shelterRouter = Router();
const { getInfo, updateInfo, addCamp } = require("../controllers/shelterController");

shelterRouter.get("/shelter", getInfo);
shelterRouter.post("/shelter", addCamp);
shelterRouter.post("/shelter/:id", updateInfo);

module.exports = shelterRouter;
