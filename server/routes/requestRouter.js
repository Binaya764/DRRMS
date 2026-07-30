const { Router } = require("express");
const router = Router();
const { getRequests, postRequest } = require("../controllers/requestController");

router.get("/requests", getRequests);
router.post("/requests", postRequest);

module.exports = router;
