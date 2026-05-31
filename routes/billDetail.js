const express = require("express");
const router = express.Router();

const billDetail = require("../controller/BillDetail");

router.get("/", billDetail.getBillDetails);
router.get("/:id", billDetail.getBillDetailByID);
router.post("/", billDetail.createBillDetail);
router.put("/:id", billDetail.updateBillDetail);
router.delete("/:id", billDetail.deleteBillDetail);

module.exports = router;