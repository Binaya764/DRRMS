const {Router} = require("express");
const shelterRouter = Router();
const shelterController = require("../controllers/shelterController");

shelterRouter.get("/shelter", shelterController.getInfo);
shelterRouter.post("/shelter/:id",shelterController.updateInfo);