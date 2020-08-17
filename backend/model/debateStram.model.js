const mongoose = require("mongoose");
const moment = require("moment");

let newModel = new mongoose.Schema(
  {
    userId: { type: String },
    videoPath: { type: String },
    comments: [
      {
        userId: { type: String },
        message: { type: String },
        date: { type: String, default: moment() },
      },
    ],
    votes: [
      {
        userId: { type: String },
        date: { type: String, default: moment() },
      },
    ],
    debateMember: [
      {
        memberId: { type: String },
        date: { type: String, default: moment() },
      },
    ],
    createdDate: { type: String, default: moment() },
    updatedDate: { type: String },
    status: { type: String, default: "active" },
  },
  {
    collection: "debateStream",
  }
);

module.exports = new mongoose.model("debateStream", newModel);
