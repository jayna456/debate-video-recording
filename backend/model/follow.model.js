const mongoose = require("mongoose");
const moment = require("moment");

let followSchema = mongoose.Schema(
  {
    id: { type: String }, // id of whom to follow
    name: { type: String }, // name of user/debate video
    followers: [
      {
        followerId: { type: String },
      },
    ],
    createdDate: { type: Date, default: moment() },
    updatedDate: { type: Date },
    status: { type: String, default: "pending" },
  },
  {
    collection: "following",
  }
);

module.exports = new mongoose.model("following", followSchema);
