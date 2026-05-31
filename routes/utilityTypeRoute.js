const express = require("express");
const router = express.Router();

const utilityType = require("../controller/Utility_Type");

router.get("/", utilityType.getUtilityTypes);
router.get("/:id", utilityType.getUtilityTypeByID);
router.post("/", utilityType.createUtilityType);
router.put("/:id", utilityType.updateUtilityType);
router.delete("/:id", utilityType.deleteUtilityType);

module.exports = router;