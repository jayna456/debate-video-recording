const express = require("express");
const paymentController = require("../controller/payment.controller");
const router = express.Router();

router.post(
  "/createProductWithPricingPlan",
  paymentController.createProductWithPricingPlan
);
router.get("/listProducts", paymentController.listProducts);
router.post("/buyPremiumPayment", paymentController.buyPremiumPayment);
router.get("/listPrice", paymentController.listPrice);

module.exports = router;
