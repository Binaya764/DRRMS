const { Router } = require("express");
const router = Router();
const { getVictims, postVictim } = require("../controllers/victimController");

router.get("/victims", getVictims);
router.post("/victims", postVictim);

module.exports = router;
