const express = require("express");
const router = express.Router();

const meter = require("../controller/utilityMeterController");

router.get("/", meter.getAllMeterReadings);
router.get("/latest", meter.getLatestReading);
router.get("/room/:room_id", meter.getMeterReadingsByRoom);
router.get("/:id", meter.getMeterReadingByID);
router.post("/", meter.createMeterReading);
router.put("/:id", meter.updateMeterReading);
router.delete("/:id", meter.deleteMeterReading);

module.exports = router;