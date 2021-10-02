const mongoose = require("mongoose");
const moment = require("moment");

let newModel = new mongoose.Schema(
  {
    userId: {type: String},
    videoPath: {type: String},
    debateId: {type: String},
    comments: [
      {
        userId: {type: String},
        message: {type: String},
        date: {type: String, default: moment()},
      },
    ],
    votes: [
      {
        userId: {type: String},
        voterId: {type: String},
        date: {type: String, default: moment()},
      },
    ],
    watched: [
      {
        userId: {type: String},
        date: {type: String, default: moment()},
      },
    ],
    debateMember: [
      {
        memberId: {type: String},
        date: {type: String, default: moment()},
      },
    ],
    createdDate: {type: Date, default: moment().utc()},
    updatedDate: {type: String},
    status: {type: String, default: "active"},
  },
  {
    collection: "debateStream",
  }
);

newModel.index("userId");

module.exports = new mongoose.model("debateStream", newModel);
