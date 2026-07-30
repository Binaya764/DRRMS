const { Router } = require("express");
const router = Router();
const { getDonations, postDonation } = require("../controllers/donationController");

router.get("/donations", getDonations);
router.post("/donations", postDonation);

module.exports = router;
