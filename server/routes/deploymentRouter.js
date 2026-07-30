const { Router } = require("express");
const router = Router();
const { getDeployments, postDeployment } = require("../controllers/deploymentController");

router.get("/deployments", getDeployments);
router.post("/deployments", postDeployment);

module.exports = router;
