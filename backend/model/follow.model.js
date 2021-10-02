const mongoose = require('mongoose');
const moment = require('moment');

let followSchema = mongoose.Schema(
  {
    userId: { type: String }, // login user
    followers: [
      // id who are followers of userId
      {
        followerId: { type: String },
      },
    ],
    followingList: [{ followUserId: { type: String } }], //id whom userId is following
    createdDate: { type: Date, default: moment() },
    updatedDate: { type: Date },
    status: { type: String, default: 'pending' },
  },
  {
    collection: 'following',
  }
);

followSchema.index('userId');
followSchema.index('followers.followerId');
module.exports = new mongoose.model('following', followSchema);
