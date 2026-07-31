const { Router } = require("express");
const router = Router();
const { getDistributions, postDistribution, deleteDistribution } = require("../controllers/distributionController");

router.get("/distributions", getDistributions);
router.post("/distributions", postDistribution);
router.delete("/distributions/:id", deleteDistribution);

module.exports = router;
