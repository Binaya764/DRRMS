const { Router } = require("express");
const router = Router();
const { getDeployments, postDeployment, deleteDeployment } = require("../controllers/deploymentController");

router.get("/deployments", getDeployments);
router.post("/deployments", postDeployment);
router.delete("/deployments/:id", deleteDeployment);

module.exports = router;
