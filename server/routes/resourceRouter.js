const {Router} = require("express");
const resourceRouter = Router();
const resourceController = require("../controllers/resourceController");

resourceRouter.get("/resource",resourceController.getResource);

module.exports = resourceRouter;