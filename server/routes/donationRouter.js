const { Router } = require("express");
const router = Router();
const { getDonations, postDonation, deleteDonation } = require("../controllers/donationController");

router.get("/donations", getDonations);
router.post("/donations", postDonation);
router.delete("/donations/:id", deleteDonation);

module.exports = router;
