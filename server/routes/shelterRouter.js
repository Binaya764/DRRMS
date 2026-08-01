const { Router } = require("express");
const shelterRouter = Router();
const { getInfo, updateInfo, addCamp, deleteCamp } = require("../controllers/shelterController");

shelterRouter.get("/shelter", getInfo);
shelterRouter.post("/shelter", addCamp);
shelterRouter.put("/shelter/:id", updateInfo);
shelterRouter.delete("/shelter/:id", deleteCamp);

module.exports = shelterRouter;
