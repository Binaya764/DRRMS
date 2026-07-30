const { Router } = require("express");
const router = Router();
const { getInventory, postInventory } = require("../controllers/inventoryController");

router.get("/inventory", getInventory);
router.post("/inventory", postInventory);

module.exports = router;
