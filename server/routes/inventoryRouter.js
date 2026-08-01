const { Router } = require("express");
const router = Router();
const { getInventory, postInventory, deleteInventory } = require("../controllers/inventoryController");

router.get("/inventory", getInventory);
router.post("/inventory", postInventory);
router.delete("/inventory/:id", deleteInventory);

module.exports = router;
