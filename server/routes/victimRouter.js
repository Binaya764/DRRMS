const { Router } = require("express");
const router = Router();
const { getVictims, postVictim, deleteVictim } = require("../controllers/victimController");

router.get("/victims", getVictims);
router.post("/victims", postVictim);
router.delete("/victims/:id", deleteVictim);

module.exports = router;
