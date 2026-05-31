const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const payment = require("../controller/paymentController");

router.get("/", payment.getPayments);
router.get("/bill/:bill_id", payment.getPaymentsByBill);
router.get("/:id", payment.getPaymentByID);
router.post("/", upload.single("proof_image"), payment.createPayment);
router.put("/:id", upload.single("proof_image"), payment.updatePayment);
router.delete("/:id", payment.deletePayment);

module.exports = router;