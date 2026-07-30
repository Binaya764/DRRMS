const { Router } = require("express");
const router = Router();
const { getDistributions, postDistribution } = require("../controllers/distributionController");

router.get("/distributions", getDistributions);
router.post("/distributions", postDistribution);

module.exports = router;
