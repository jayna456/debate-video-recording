const mongoose = require("mongoose");
const moment = require("moment");

let privateProposalSchema = mongoose.Schema(
  {
    userId: { type: String },
    debateId: { type: String },
    proposalStatus: { type: String },
    connection: [
      {
        userId: { type: String },
      },
    ],
    createdDate: { type: Date, default: moment() },
    updatedDate: { type: Date },
    status: { type: String, default: "active" },
  },
  {
    collection: "privateProposal",
  }
);

module.exports = new mongoose.model("privateProposal", privateProposalSchema);
