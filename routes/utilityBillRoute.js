const express = require("express");
const router = express.Router();

const bill = require("../controller/utilityBillController");


router.get("/", bill.getBills);

router.get("/:id", bill.getBillByID);

router.post("/", bill.createBill);


router.put("/:id", bill.updateBill);

router.delete("/:id", bill.deleteBill);

module.exports = router;