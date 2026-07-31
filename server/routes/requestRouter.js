const { Router } = require("express");
const router = Router();
const { getRequests, postRequest, deleteRequest } = require("../controllers/requestController");

router.get("/requests", getRequests);
router.post("/requests", postRequest);
router.delete("/requests/:id", deleteRequest);

module.exports = router;
