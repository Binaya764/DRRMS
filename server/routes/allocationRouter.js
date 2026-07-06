const {Router} = require("express");
const allocationRouter = Router();
const allocationController = require("../controllers/allocationController");

allocationRouter.post("/allocation", allocationController.postAllocation);
