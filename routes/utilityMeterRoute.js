const express = require("express");
const router = express.Router();
const utilityMeterController = require("../controller/utilityMeterController");

router.get("/", utilityMeterController.getAllUtilityMeters);
router.get("/:room_id", utilityMeterController.getUtilityMeterByRoomId);
router.post("/", utilityMeterController.createUtilityMeter);
router.put("/:room_id", utilityMeterController.updateUtilityMeter);
router.delete("/:room_id", utilityMeterController.deleteUtilityMeter);

module.exports = router;
