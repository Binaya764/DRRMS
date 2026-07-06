const {Router} = require("express");
const disasterRouter = Router();
const disasterController = require("../controllers/disasterController");

disasterRouter.get("/disaster",disasterController.getInfo);
disasterRouter.post("/disaster", disasterController.postInfo);

module.exports = disasterRouter;