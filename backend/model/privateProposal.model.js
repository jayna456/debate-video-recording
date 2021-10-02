const mongoose = require("mongoose");
const moment = require("moment");

let privateProposalSchema = mongoose.Schema(
  {
    userId: { type: String },
    debateId: { type: String },
    proposalStatus: { type: String },
    receiverId: { type: String },
    createdDate: { type: Date, default: moment() },
    updatedDate: { type: Date },
    status: { type: String, default: "active" },
  },
  {
    collection: "proposal",
  }
);

privateProposalSchema.index('userId');

privateProposalSchema.index('receiverId');

module.exports = new mongoose.model("proposal", privateProposalSchema);
