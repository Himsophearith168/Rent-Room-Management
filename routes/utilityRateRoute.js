const express = require("express");
const router = express.Router();

const utilityRate = require("../controller/utilityRateController");

router.get("/", utilityRate.getUtilityRates);
router.get("/active", utilityRate.getActiveRates);
router.post("/", utilityRate.createUtilityRate);
router.put("/:id", utilityRate.updateUtilityRate);
router.delete("/:id", utilityRate.deleteUtilityRate);

module.exports = router;