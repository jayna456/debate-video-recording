const mongoose = require("mongoose");

let newPaymentSchema = new mongoose.Schema({
  userId: { type: String },
  productId: { type: String },
  planId: { type: String },
  planPrice: { type: Number },
  planType: { type: String, default: "Monthly" },
  subscriptionId: { type: String },
  subscriptionStartDate: { type: String },
  subscriptionEndDate: { type: String },
});

module.exports = mongoose.model("payment", newPaymentSchema);
