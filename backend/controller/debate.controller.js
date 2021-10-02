let debate = require("../model/debate.model");
let user = require("../model/user.model");
const moment = require("moment");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
let proposal = require("../model/privateProposal.model");
let debateStream = require("../model/debateStram.model");
let followModel = require("../model/follow.model");
let gridfs = require("gridfs-stream");
const path = require("path");
const mongodb = require("mongodb");

gridfs.mongo = mongoose.mongo;
let bucket;

var connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function () {
  // gfs = gridfs(connection.db);
  bucket = new mongodb.GridFSBucket(connection.db);
});

generateHash = text => {
  return bcrypt.hashSync(text, bcrypt.genSaltSync(saltRounds), null);
};

verify = (password, DBPassword) => {
  return bcrypt.compareSync(password, DBPassword);
};

exports.changeDebateStatus = async (req, res) => {
  console.log("sdfsfgf", req.body);
  const updDate = moment();
  const updatePendingStatus = await debate.findOneAndUpdate(
    {_id: req.body.debateId},
    {
      $set: {
        status: req.body.status,
        updatedDate: updDate,
      },
    },
    {new: true}
  );

  if (updatePendingStatus) {
    res.json({
      code: 200,
      status: "success",
      message: "debate status updated Successfully",
      data: updatePendingStatus,
    });
  } else {
    res.json({
      code: 404,
      status: "error",
      message: "Somthing want worng! please try again",
    });
  }
};

exports.viewDebates1 = async (req, res) => {
  // console.log("dsaaaaaaaaa", req.body);

  const getAllDebates = await debate.find({
    status: "pending",
    proposalType: "Public Proposal",
  });

  res.json({
    code: 200,
    status: "success",
    data: getAllDebates,
  });

  //console.log(getAllDebates);
};

exports.viewDebates = async (req, res) => {
  // console.log("dsaaaaaaaaa", req.body);
  const getAllDebates = await debate.find({
    status: "pending",
    proposalType: "Public Proposal",
  });
  var premiumUser = [];
  var nonPremiumUser = [];
  for (i = 0; i < getAllDebates.length; i++) {
    var userData = await user.findById({_id: getAllDebates[i].userId});
    if (userData.premium == true) {
      premiumUser.push(getAllDebates[i]);
    } else {
      nonPremiumUser.push(getAllDebates[i]);
    }
  }
  var finalArray = premiumUser.concat(nonPremiumUser);
  res.json({
    code: 200,
    status: "success",
    data: finalArray,
  });
};

exports.deleteDebate = async (req, res) => {
  console.log("request body for delete debate", req.body);

  const removeDebate = await debate.findOneAndDelete({
    _id: req.body.debateId,
  });

  //   console.log(removeDebate);

  if (removeDebate) {
    res.json({
      code: 200,
      status: "success",
      message: "debate deleted Successfully",
    });
  } else {
    res.json({
      code: 403,
      status: "error",
      message: "something want wrong!",
    });
  }
};

exports.createNewDebate = async (req, res) => {
  console.log("request body of crearte new debate", req.body);

  const userId = req.body.userId;
  const topicName = req.body.topicName;
  const debateDate = req.body.debateDate;
  const debateTime = req.body.debateTime;
  const status = req.body.status;

  let currentDate = moment().format("YYYY-MM-DD");
  const currentTimeFormat = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(currentTimeFormat);

  const debateDateFormat = moment(debateDate).format("YYYY-MM-DD");

  const debateTimeFormat = moment(debateTime, "HH:mm:ss");

  console.log("db", debateTimeFormat);

  const chkIsBefore = moment(currentDate).isSameOrBefore(debateDateFormat);
  const chkIsSame = moment(currentDate).isSame(debateDateFormat);

  console.log(chkIsBefore);
  console.log(chkIsSame);

  if (chkIsBefore) {
    if (chkIsSame) {
      console.log("innnn");
      const chkIsBeforeTime = moment(currentTimeFormat).isSameOrBefore(
        moment(debateTimeFormat),
        "minutes"
      );

      if (chkIsBeforeTime) {
      } else {
      }

      console.log(chkIsBeforeTime);
    } else {
      console.log("else");
    }
  } else {
  }

  const userExists = await user.findOne({_id: userId});

  if (userExists) {
    const findMatchedTopic = await debate.find({
      $and: [
        {debateTime: debateTime},
        {topicName: topicName},
        {language: req.body.language},
        {opnion: {$ne: req.body.opnion}},
        {status: {$ne: "joined"}},
      ],
    });

    if (findMatchedTopic.length > 0) {
      res.json({
        code: 409,
        status: "error",
        // message: "Already found with same name topic!",
        message: "You may join the other debate!",
      });
    } else {
      let newDebateCreate = new debate();
      newDebateCreate.userId = userId;
      newDebateCreate.topicName = topicName;
      newDebateCreate.debateDate = debateDate;
      newDebateCreate.debateTime = debateTime;
      newDebateCreate.status = status;
      newDebateCreate.debateStatus = req.body.debateStatus; // either open or per tunes
      newDebateCreate.language = req.body.language;
      newDebateCreate.opnion = req.body.opnion;
      newDebateCreate.proposalType = req.body.proposal;
      newDebateCreate.createdDate = moment();
      const newDebateCreated = await newDebateCreate.save();

      if (newDebateCreated) {
        // console.log('condition ',req.body.proposal, req.body.proposal != 'private proposal' || req.body.proposal != 'Private Proposal')
        // if(req.body.proposal != 'private proposal' || req.body.proposal != 'Private Proposal') {
        //   console.log('inside if')
        //   let newProposal = new proposal();
        //   newProposal.userId = userId;
        //   newProposal.debateId = newDebateCreated._id;
        //   newProposal.proposalStatus = "pending";
        //   const newData = await newProposal.save();
        //   console.log("dsdas", newData);

        //   if (newData) {
        //     res.json({
        //       code: 200,
        //       status: "success",
        //       message: "debate created Successfully!",
        //       data: newDebateCreated,
        //     });
        //   }
        // }
        // else {
        // }
        res.json({
          code: 200,
          status: "success",
          message: "debate created Successfully!",
          data: newDebateCreated,
        });
      } else {
        res.json({
          code: 403,
          status: "error",
          message: "somthing went wrong! please try again",
        });
      }
    }
  } else {
    res.json({
      code: 404,
      status: "error",
      message: "user not found",
    });
  }

  //console.log(debateDateFormate);
};

exports.searchDebeate = async (req, res) => {
  console.log("search debeates... ", req.body);
  let maindData = [];

  if (req.body.type == "debate") {
    const debateList = await debate.find({
      topicName: {
        $regex: new RegExp(".*" + req.body.name.toLowerCase() + ".*", "i"),
      },
    });

    console.log("debeate lisat... ", debateList.length);

    if (debateList.length) {
      debateList.forEach(debateInfo => {
        maindData.push({
          topicName: debateInfo.topicName,
          debateTime: debateInfo.debateTime,
          debateStatus: debateInfo.debateStatus,
          language: debateInfo.language,
          opnion: debateInfo.opnion,
          debateId: debateInfo._id,
        });
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: maindData,
    });
  } else if (req.body.type == "user") {
    const userList = await user
      .find({
        verified: true,
        _id: {
          $ne: req.body.id,
        },
        isActive: true,
      })
      .exec();

    console.log("debeate lisat... ", userList.length);

    if (userList.length) {
      userList.forEach(userItem => {
        maindData.push({
          topicName: userItem.userName,
          profilePic: userItem.profilePic,
          userId: userItem._id,
          userType: userItem.userType,
        });
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: maindData,
    });
  } else {
    const debateList = await debate.find({
      topicName: {
        $regex: new RegExp(".*" + req.body.name.toLowerCase() + ".*", "i"),
      },
    });

    const userList = await user
      .find({
        status: "active",
        verified: true,
        userName: {
          $regex: new RegExp(".*" + req.body.name.toLowerCase() + ".*", "i"),
        },
      })
      .exec();

    console.log("debeate lisat... ", debateList.length, userList.length);

    if (debateList.length || userList.length) {
      debateList.forEach(debateInfo => {
        maindData.push({
          topicName: debateInfo.topicName,
          debateTime: debateInfo.debateTime,
          debateStatus: debateInfo.debateStatus,
          language: debateInfo.language,
          opnion: debateInfo.opnion,
          debateId: debateInfo._id,
        });
      });

      userList.forEach(userItem => {
        maindData.push({
          topicName: userItem.userName,
          profilePic: userItem.profilePic,
          userId: userItem._id,
          userType: userItem.userType,
        });
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: maindData,
    });
  }
};

exports.sendPrivateProposal = async (req, res) => {
  console.log("sendPrivateProposal req.body ", req.body);
  let newPrivateProposal = new proposal();
  newPrivateProposal.userId = req.body.userId;
  newPrivateProposal.debateId = req.body.debateId;
  newPrivateProposal.proposalStatus = "pending";
  newPrivateProposal.receiverId = req.body.receiverId;
  let storeProposal = await newPrivateProposal.save();

  console.log("storeProposal ", storeProposal);
  if (storeProposal) {
    res.json({
      code: 200,
      status: "success",
    });
  }
};

/****onStartRecording call below API******/
exports.upadateToJoinDebate = async (req, res) => {
  console.log("upadateToJoinDebate......", req.body);

  const existDebate = await debate.findOne({_id: req.body.debateId}).exec();

  if (existDebate) {
    debate.findByIdAndUpdate(
      {_id: existDebate._id},
      {
        $set: {
          status: "joined",
        },
      },
      {new: true},
      er => {
        if (er) {
          return;
        }

        res.json({
          code: 200,
          status: "success",
        });
      }
    );
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No debate found",
    });
  }
};

/********** storing debate **********/
exports.storeDebate = async (req, res) => {
  /****** recordRTC.js for recording video *******/
  console.log("store debate req.body.. ", req.body, req.file);
  let newStream = new debateStream();
  newStream.userId = req.body.userId;
  req.body.members.forEach(user => {
    newStream.debateMember.push({
      memberId: user,
    });
  });
  newStream.debateId = req.body.debateId;
  newStream.createdDate = req.body.createdDate;

  newStream.videoPath =
    process.env.NODE_ENV === "developement"
      ? "http://localhost:8000/videos/" + req.file.filename
      : "https://pieramo.com:8000/videos/" + req.file.filename;
  let newStoredStream = await newStream.save();

  if (newStoredStream) {
    console.log("uploaded successfully..");
    res.json({
      code: 200,
      status: "success",
      data: newStoredStream,
    });
  } else {
    res.json({
      code: 403,
      status: "err",
      message: "Something went wrong!",
    });
  }
};

exports.makeFollow1 = async (req, res) => {
  console.log("make follow req.body ", req.body);

  const foundUser = await followModel
    .findOne({userId: req.body.userId})
    .lean()
    .exec();
  if (foundUser) {
    let followed;
    if (foundUser.followingList.length) {
      followed = foundUser.followingList.find(
        ({followUserId}) => followUserId == req.body.id
      );
    }

    if (followed) {
      res.json({
        code: 404,
        status: "err",
        message: "Already following",
      });
    } else {
      foundUser.followingList.push({
        followUserId: req.body.id,
      });
      followModel.findByIdAndUpdate(
        {_id: foundUser._id},
        {
          followingList: foundUser.followingList,
        },
        {new: true},
        async e1 => {
          if (e1) {
            return;
          } else {
            console.log("in first else ");
            res.json({
              code: 200,
              status: "success",
            });
          }
        }
      );
    }
  } else {
    let newFollow = new followModel();
    newFollow.userId = req.body.userId;
    newFollow.followingList.push({
      followUserId: req.body.id,
    });
    const storedData = await newFollow.save();
    if (storedData) {
      const userFound1 = await followModel
        .findOne({userId: req.body.id})
        .exec();
      if (userFound1) {
        if (userFound1.followers && userFound1.followers.length) {
          let foundFollow1 = userFound1.followers.find(
            ({followerId}) => followerId == req.body.userId
          );

          if (foundFollow1) {
            res.json({
              code: 404,
              status: "err",
              message: "Already followed",
            });
          } else {
            userFound1.followers.push({followerId: req.body.userId});
            followModel.findByIdAndUpdate(
              {_id: userFound1._id},
              {
                $set: {
                  followers: userFound1.followers,
                },
              },
              {new: true},
              err => {
                if (err) {
                  return;
                }

                res.json({
                  code: 200,
                  status: "success",
                });
              }
            );
          }
        } else {
          userFound1.followers.push({followerId: req.body.userId});
          followModel.findByIdAndUpdate(
            {_id: userFound1._id},
            {
              $set: {
                followers: userFound1.followers,
              },
            },
            {new: true},
            err => {
              if (err) {
                return;
              }

              res.json({
                code: 200,
                status: "success",
              });
            }
          );
        }
      } else {
        let followNew = new followModel();
        followNew.userId = req.body.id;
        followNew.followers.push({followerId: req.body.userId});
        let saveData = await followNew.save();
        if (saveData) {
          res.json({
            code: 200,
            status: "success",
          });
        } else {
          res.json({
            code: 404,
            status: "err",
            message: "something wrong",
          });
        }
      }
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "something wrong",
      });
    }
  }
};

exports.makeFollow = async (req, res) => {
  console.log("make follow req.body ", req.body);
  const foundUser = await followModel
    .findOne({userId: req.body.userId})
    .lean()
    .exec();
  if (foundUser) {
    let followed;
    if (foundUser.followingList.length) {
      followed = foundUser.followingList.find(
        ({followUserId}) => followUserId == req.body.id
      );
    }
    console.log("followed ", followed);
    if (followed) {
      res.json({
        code: 404,
        status: "err",
        message: "Already following",
      });
    } else {
      console.log("in else of not following");
      foundUser.followingList.push({
        followUserId: req.body.id,
      });
      var update = await followModel.findByIdAndUpdate(
        {_id: foundUser._id},
        {
          followingList: foundUser.followingList,
        }
      );
      console.log("update-=-=-=-=", update);
      // { new: true },
      // async e1 => {
      //   if (e1) {
      //     return;
      //   } else {
      //     console.log("in first else ");
      //     // res.json({
      //     //   code: 200,
      //     //   status: "success",
      //     // });
      //    }
    }
  } else {
    let newFollow = new followModel();
    newFollow.userId = req.body.userId;
    newFollow.followingList.push({
      followUserId: req.body.id,
    });
    const storedData = await newFollow.save();
    if (!storedData) {
      res.json({
        code: 404,
        status: "err",
        message: "something wrong",
      });
    }
  }
  // if (storedData) {
  const userFound1 = await followModel.findOne({userId: req.body.id}).exec();
  if (userFound1) {
    if (userFound1.followers && userFound1.followers.length) {
      let foundFollow1 = userFound1.followers.find(
        ({followerId}) => followerId == req.body.userId
      );
      if (foundFollow1) {
        res.json({
          code: 404,
          status: "err",
          message: "Already followed",
        });
      } else {
        userFound1.followers.push({followerId: req.body.userId});
        followModel.findByIdAndUpdate(
          {_id: userFound1._id},
          {
            $set: {
              followers: userFound1.followers,
            },
          },
          {new: true},
          err => {
            if (err) {
              return;
            }
            res.json({
              code: 200,
              status: "success",
            });
          }
        );
      }
    } else {
      userFound1.followers.push({followerId: req.body.userId});
      followModel.findByIdAndUpdate(
        {_id: userFound1._id},
        {
          $set: {
            followers: userFound1.followers,
          },
        },
        {new: true},
        err => {
          if (err) {
            return;
          }
          res.json({
            code: 200,
            status: "success",
          });
        }
      );
    }
  } else {
    let followNew = new followModel();
    followNew.userId = req.body.id;
    followNew.followers.push({followerId: req.body.userId});
    let saveData = await followNew.save();
    if (saveData) {
      res.json({
        code: 200,
        status: "success",
      });
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "something wrong",
      });
    }
  }
  // } else {
  //   res.json({
  //     code: 404,
  //     status: "err",
  //     message: "something wrong",
  //   });
  // }
  // }
};

exports.checkFollowingOrNot = async (req, res) => {
  console.log("checkfollowingOrNot req.query ", req.query);

  const matchedList = await followModel
    .findOne({
      userId: req.query.userId,
      "followingList.followUserId": req.query.id,
    })
    .exec();

  if (matchedList) {
    res.json({
      code: 200,
      status: "success",
      data: matchedList,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "Not following anyone",
    });
  }
};

exports.viewFollowList = async (req, res) => {
  console.log("viewFollowList req.query ", req.query);
  let mainData = [];

  const followList = await followModel
    .findOne({userId: req.query.userId})
    .exec();

  if (
    followList &&
    followList.followingList &&
    followList.followingList.length
  ) {
    let ids = followList.followingList.map(({followUserId}) =>
      followUserId.toString()
    );

    const followUsers = await user.find({_id: {$in: ids}}).exec();
    if (followUsers.length) {
      for (let singleUser of followUsers) {
        let singleFollowList = await followModel
          .findOne({userId: singleUser._id})
          .exec();
        mainData.push({
          userId: singleUser._id,
          userName: singleUser.userName,
          profilePic: singleUser.profilePic,
          followList: singleFollowList ? singleFollowList.followers.length : 0,
        });
      }
    }
  }

  console.log("main data.. ", mainData.length);
  if (followList) {
    res.json({
      code: 200,
      status: "success",
      data: mainData,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "Not following anyone",
    });
  }
};

exports.applyVoteAndComment = async (req, res) => {
  console.log("apply vote.. ", req.body);

  const loginUser = await user.findOne({_id: req.body.loginId}).lean().exec();

  if (loginUser) {
    const foundDebate = await debateStream.findOne({_id: req.body.id}).exec();

    if (foundDebate) {
      if (req.body.vote) {
        foundDebate.votes.push({
          userId: req.body.userId,
          voterId: req.body.loginId,
        });
      }
      if (req.body.comment) {
        foundDebate.comments.push({
          userId: req.body.userId,
          message: req.body.comment,
        });
      }

      debateStream.findByIdAndUpdate(
        {_id: foundDebate._id},
        {
          $set: {
            votes: foundDebate.votes,
            comments: foundDebate.comments,
          },
        },
        {new: true},
        (err, updatedValue) => {
          if (err) {
            return;
          }

          res.json({
            code: 200,
            status: "success",
            data: updatedValue,
          });
        }
      );
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "No debate found",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No User found",
    });
  }
};

exports.viewPrivateRequests = async (req, res) => {
  console.log("viewPrivateRequests req.query ", req.query);
  let mainData = [];

  const loginUser = await user.findOne({_id: req.query.id}).lean().exec();

  if (loginUser) {
    let privateRequests = await proposal
      .find({receiverId: loginUser._id})
      .exec();

    if (privateRequests.length) {
      for (let request of privateRequests) {
        // console.log("request  ", request);
        const debateName = await debate
          .findOne({_id: request.debateId.toString(), status: {$ne: "joined"}})
          .exec();

        // console.log("debate nasme ", debateName);
        let user1 = await user.findOne({_id: request.userId}).exec();

        mainData.push({
          debateId: request.debateId,
          userId: request.userId,
          userName: user1.userName,
          debateName: debateName !== null ? debateName.topicName : "",
          createdDate: request.createdDate,
          _id: request._id,
          message:
            request.proposalStatus == "reject"
              ? ""
              : user1.userName +
                  " has send you private proposal for debate named " +
                  debateName !==
                null
              ? debateName.topicName
              : "",
          proposalStatus: request.proposalStatus,
        });
      }

      res.json({
        code: 200,
        status: "success",
        data: mainData,
      });
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "No private proposal found",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.acceptRejectPrivateProposal = async (req, res) => {
  console.log("acceptRejectPrivateProposal req.body ", req.body);

  const loginUser = await user.findOne({_id: req.body.userId}).lean().exec();

  if (loginUser) {
    const proposalFound = await proposal
      .findOne({_id: req.body.id})
      .lean()
      .exec();
    if (proposalFound) {
      const debateFound = await debate
        .findOne({_id: proposalFound.debateId})
        .lean()
        .exec();

      if (debateFound) {
        if (
          (req.body.status == "reject" || req.body.status == "Reject") &&
          debateFound.proposalStatus == "Private Proposal"
        ) {
          proposal.findOneAndRemove({_id: req.body.id}, e1 => {
            console.log("error in removing proposal.. ", e1);
            if (e1) {
              res.json({
                code: 400,
                status: "err",
                message: e1.toString(),
              });
            } else {
              console.log("proposal removed successfully");
              debate.findByIdAndRemove({_id: debateFound._id}, er => {
                if (er) {
                  return;
                } else {
                  res.json({
                    code: 200,
                    status: "success",
                  });
                }
              });
            }
          });
        } else {
          debate.findByIdAndUpdate(
            {_id: debateFound._id},
            {
              $set: {
                status: "joined",
              },
            },
            {new: true},
            e1 => {
              if (e1) {
                return;
              } else {
                proposal.findOneAndRemove({_id: req.body.id}, err => {
                  if (err) {
                    return;
                  } else {
                    console.log("proposal got removed...");
                    res.json({
                      code: 200,
                      status: "success",
                    });
                  }
                });
              }
            }
          );
        }
      } else {
        res.json({
          code: 404,
          status: "err",
          message: "No debate found",
        });
      }
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.deleteCreatedDebate = async (req, res) => {
  console.log("delete created debate ", req.query);

  debate.findByIdAndRemove({_id: req.query.id}, e1 => {
    if (e1) {
      res.json({
        code: 400,
        status: "err",
        message: e1.toString(),
      });
    } else {
      res.json({
        code: 200,
        status: "success",
      });
    }
  });
};

exports.editCreatedDebate = async (req, res) => {
  console.log("edit created debate req.body... ", req.body);

  const loginUser = await user.findOne({_id: req.body.userId}).lean().exec();

  if (loginUser) {
    const foundDebate = await debate.findOne({_id: req.body.id}).lean().exec();

    if (foundDebate) {
      debate.findByIdAndUpdate(
        {_id: foundDebate._id},
        {
          $set: {
            topicName: req.body.topicName
              ? req.body.topicName
              : foundDebate.topicName,
            debateTime: req.body.debateTime
              ? req.body.debateTime
              : foundDebate.debateTime,
            debateStatus: req.body.debateStatus
              ? req.body.debateStatus
              : foundDebate.debateStatus,
            proposalType: req.body.proposal
              ? req.body.proposal
              : foundDebate.proposal,
            language: req.body.language
              ? req.body.language
              : foundDebate.language,
            opnion: req.body.opnion ? req.body.opnion : foundDebate.opnion,
            updatedDate: moment(),
          },
        },
        {new: true},
        async (err, updatedDebate) => {
          if (err) {
            res.json({
              code: 403,
              status: "err",
              message: err.toString(),
            });
          }

          if (req.body.proposal == "Private Proposal") {
            let found = await proposal
              .findOne({userId: req.body.userId})
              .exec();
            if (found) {
              found.receiverId = req.body.receiverId;

              proposal.findByIdAndUpdate(
                {_id: found._id},
                {
                  $set: {
                    receiverId: found.receiverId,
                  },
                },
                {new: true},
                (e1, updatedDebate) => {
                  if (e1) {
                    res.send(400).json();
                  } else {
                    res.json({
                      code: 200,
                      status: "success",
                      data: updatedDebate,
                    });
                  }
                }
              );
            } else {
              let newPrivateProposal = new proposal();
              newPrivateProposal.userId = req.body.userId;
              newPrivateProposal.debateId = req.body.id;
              newPrivateProposal.proposalStatus = "pending";
              newPrivateProposal.receiverId = req.body.receiverId;
              let storeProposal = await newPrivateProposal.save();

              if (storeProposal) {
                res.json({
                  code: 200,
                  status: "success",
                  data: updatedDebate,
                });
              } else {
                res.send(400).json();
              }
            }
          } else {
            res.json({
              code: 200,
              status: "success",
              data: updatedDebate,
            });
          }
        }
      );
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "No Debate was found",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.getFollowersList = async (req, res) => {
  console.log("get followers list...", req.query);

  const userFollow = await followModel.findOne({userId: req.query.id});
  if (userFollow) {
    res.json({
      code: 200,
      status: "success",
      data: userFollow.followers.length,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No follower user found",
    });
  }
};

exports.getVoteAndComment = async (req, res) => {
  console.log("get vote and comment api.. ", req.query);

  const streamList = await debateStream.find().exec();
  if (streamList.length) {
    res.json({
      code: 200,
      status: "success",
      data: streamList,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No stream available",
    });
  }
};

exports.getDebateStreamList = async (req, res) => {
  console.log("getDebateStreamList req.body ", req.body, req.query);

  let mainDebateList = [];
  const currentDate = moment().format("YYYY-MM-DD");
  const debateStreamList = await debateStream
    .find()
    .sort({_id: -1})
    .lean()
    .exec();
  console.log("debateStreamList.length... ", debateStreamList.length);
  if (debateStreamList.length) {
    let usersProfile = [];
    for (let video of debateStreamList) {
      const storedDate = moment(video.createdDate).format("YYYY-MM-DD");
      let ids = video.debateMember.map(({memberId}) => memberId.toString());

      const profiles = await user
        .find({_id: {$in: ids}}, {profilePic: 1, userName: 1})
        .exec();

      mainDebateList.push({
        _id: video._id,
        videoPath: video.videoPath,
        comments: video.comments,
        votes: video.votes,
        debateMember: profiles,
        userId: video.userId,
        watched: video.watched,
        createdDate: video.createdDate,
        daysLeft: moment(currentDate).diff(storedDate, "days"),
      });
    }
    res.json({
      code: 200,
      status: "success",
      data: mainDebateList,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No stream available",
    });
  }
};

exports.getUserDebateList = async (req, res) => {
  console.log("getUserDebateList req.body ", req.query);
  let mainData = [];
  const currentDate = moment().format("YYYY-MM-DD");
  let memberId;

  const uploadedVideos = await debateStream
    .find({$or: [{userId: req.query.id}, {debateId: req.query.id}]})
    .sort({_id: -1})
    .exec();

  if (uploadedVideos.length) {
    let usersProfile = [];
    for (let video of uploadedVideos) {
      const storedDate = moment(video.createdDate).format("YYYY-MM-DD");
      let ids = video.debateMember.map(({memberId}) => memberId.toString());

      const profiles = await user.find({_id: {$in: ids}}).exec();

      let newArray = ids.filter(index => index != video.userId);
      const userMember = await user.findOne({_id: newArray[0]}).exec();

      if (profiles.length) {
        for (let info of profiles) {
          usersProfile.push({
            userId: info._id,
            profilePic: info.profilePic,
            userName: info.userName,
            memberName: info._id !== video.userId ? info.userName : "",
            videoId: video._id,
          });
        }
      }
      mainData.push({
        _id: video._id,
        videoPath: video.videoPath,
        comments: video.comments,
        votes: video.votes,
        debateMember: video.debateMember,
        uploadedUserprofilePic: usersProfile.find(
          ({userId}) => userId == video.userId
        ).profilePic,
        userId: video.userId,
        userName: userMember.userName,
        usersProfile: usersProfile,
        watched: video.watched,
        createdDate: video.createdDate,
        daysLeft: moment(currentDate).diff(storedDate, "days"),
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: mainData,
    });
  } else {
    res.json({
      code: 400,
      status: "err",
      message: "No Video uploaded by this user",
    });
  }
};

exports.updateWatchCountInVideo = async (req, res) => {
  console.log("updateWatchCountInVideo req.body ", req.body);

  const loginUser = await user.findOne({_id: req.body.userId}).lean().exec();

  if (loginUser) {
    const foundStream = await debateStream
      .findOne({_id: req.body.streamId})
      .lean()
      .exec();

    if (foundStream) {
      if (foundStream.watched && foundStream.watched.length) {
        let foundUserId = foundStream.watched.find(
          ({userId}) => userId == req.body.userId
        );

        if (foundUserId) {
          res.json({
            code: 200,
            status: "success",
          });
        } else {
          foundStream.watched.push({userId: req.body.userId});

          debateStream.findByIdAndUpdate(
            {_id: foundStream._id},
            {
              $set: {
                watched: foundStream.watched,
              },
            },
            {new: true},
            err => {
              if (err) {
                return;
              } else {
                res.json({
                  code: 200,
                  status: "success",
                });
              }
            }
          );
        }
      } else {
        foundStream.watched.push({userId: req.body.userId});

        debateStream.findByIdAndUpdate(
          {_id: foundStream._id},
          {
            $set: {
              watched: foundStream.watched,
            },
          },
          {new: true},
          err => {
            if (err) {
              return;
            } else {
              res.json({
                code: 200,
                status: "success",
              });
            }
          }
        );
      }
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "No stream found",
      });
    }
  } else {
    const foundStream = await debateStream
      .findOne({_id: req.body.streamId})
      .lean()
      .exec();

    if (foundStream) {
      foundStream.watched.push({userId: null});

      debateStream.findByIdAndUpdate(
        {_id: foundStream._id},
        {
          $set: {
            watched: foundStream.watched,
          },
        },
        {new: true},
        err => {
          if (err) {
            return;
          } else {
            res.json({
              code: 200,
              status: "success",
            });
          }
        }
      );
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "No stream found",
      });
    }
  }
};

exports.getDebateInfo = async (req, res) => {
  console.log("getDebateInfo req.query ", req.query);

  const foundDebate = await debate.findOne({_id: req.query.id}).lean().exec();

  if (foundDebate) {
    res.json({
      code: 200,
      status: "success",
      data: foundDebate,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No debate found",
    });
  }
};

exports.onCloseRemoveDebate = async (req, res) => {
  console.log("onCloseRemoveDebate api called ", req.body);

  const debateCreatedByUser = await debate
    .findOne({_id: req.body.debateId})
    .lean()
    .exec();

  if (debateCreatedByUser) {
    debate.findOneAndRemove({_id: debateCreatedByUser._id}, err => {
      if (err) {
        console.log("error in updating debate info", err);
        res.json({
          code: 500,
          status: "err",
          message: "Error while removing debate",
        });
      } else {
        console.log("updated successfully");
        res.json({
          code: 200,
          status: "success",
        });
      }
    });
  } else {
    res.json({
      code: 400,
      status: "err",
      message: "No debate found",
    });
  }
};

exports.publicToPrivate = async (req, res) => {
  console.log("publicToPrivate req.body ", req.body);

  const loginUser = await user.findOne({_id: req.body.userId}).lean().exec();

  if (loginUser) {
    const createdDebate = await debate
      .findOne({_id: req.body.debateId, userId: loginUser._id})
      .lean()
      .exec();

    if (createdDebate) {
      debate.findByIdAndUpdate(
        {_id: createdDebate._id},
        {
          $set: {
            proposalType: "Private Proposal",
          },
        },
        {new: true},
        async err => {
          if (err) {
            res.json({
              code: 500,
              status: "err",
              message: "something went wrong while updating debate",
            });
          } else {
            let newProposal = new proposal();
            newProposal.userId = loginUser._id;
            newProposal.receiverId = req.body.receiverId;
            newProposal.debateId = createdDebate._id;
            let storedData = await newProposal.save();
            if (storedData) {
              res.json({
                code: 200,
                status: "success",
                data: storedData,
              });
            } else {
              res.json({
                code: 500,
                status: "err",
                message: "something went wrong",
              });
            }
          }
        }
      );
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "No debate found with this user id",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.unFollowUser = async (req, res) => {
  console.log("unfolloew req.body ", req.body);

  const loginUser = await user.findOne({_id: req.body.userId}).lean().exec();

  if (loginUser) {
    const foundFollowingUser = await followModel
      .findOne({
        "followingList.followUserId": req.body.idToUnfollow,
        userId: loginUser._id,
      })
      .exec();

    console.log("foundFollowingUser", foundFollowingUser);
    if (foundFollowingUser) {
      if (
        foundFollowingUser.followingList &&
        foundFollowingUser.followingList.length
      ) {
        const filtered = foundFollowingUser.followingList.filter(
          value =>
            value.followUserId.toString() !== req.body.idToUnfollow.toString()
        );
        console.log("foundFollowingUser.followingList ", filtered);
        followModel.findByIdAndUpdate(
          {_id: foundFollowingUser._id},
          {
            $set: {
              followingList: filtered,
            },
          },
          {new: true},
          async (e1, updatedRecord) => {
            if (e1) {
              console.log("error while removing... ", e1);
              return res.json({
                code: 404,
                status: "err",
                message: "Not following to the User",
              });
            } else {
              const user = await followModel
                .findOne({userId: req.body.idToUnfollow})
                .exec();
              if (user) {
                console.log("user.followers.length", user.followers.length);
                if (user.followers.length) {
                  const followersFiltered = foundFollowingUser.followers.filter(
                    value =>
                      value.followerId.toString() !== req.body.userId.toString()
                  );

                  console.log("followersFiltered", followersFiltered);
                  followModel.findByIdAndUpdate(
                    {_id: user._id},
                    {
                      $set: {
                        followers: followersFiltered,
                      },
                    },
                    {new: true},
                    err => {
                      if (err) {
                        console.log("error ", err);
                      } else {
                        res.json({
                          code: 200,
                          status: true,
                        });
                      }
                    }
                  );
                } else {
                  res.json({
                    code: 200,
                    status: true,
                  });
                }
              }
            }
          }
        );
      }
    } else {
      res.json({
        code: 404,
        status: "err",
        message: "Not folloWing to the User",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No User found",
    });
  }
};
