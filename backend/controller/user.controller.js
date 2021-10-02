let user = require("../model/user.model");
const debate = require("../model/debate.model");
let payment = require("../model/payment.model");
let debateStream = require("../model/debateStram.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const moment = require("moment");
require("dotenv").config();
const os = require("os");

let CronJob = require("cron").CronJob;

let job = new CronJob("00 00 * * *", async function () {
  console.log("cron job started...");
  const availableStreams = await debateStream.find().exec();

  if (availableStreams.length) {
    for (let foundStream of availableStreams) {
      const debateDate = moment(foundStream.createdDate).format("YYYY-MM-DD");
      const currentDate = moment().format("YYYY-MM-DD");
      const member1 = foundStream.debateMember[0].memberId;
      const member2 = foundStream.debateMember[1].memberId;
      let winnerId, votes;

      if (moment(currentDate).diff(debateDate, "weeks") >= 1) {
        let win1 = foundStream.votes.filter(({userId}) => userId === member1);
        let win2 = foundStream.votes.filter(({userId}) => userId === member2);

        if (win1.length > win2.length) {
          winnerId = member1;
          votes = win1.length;
        } else if (win2.length > win1.length) {
          winnerId = member2;
          votes = win2.length;
        } else {
          winnerId = "";
          votes = 0;
        }

        debate.findByIdAndUpdate(
          {_id: foundStream.debateId},
          {
            $set: {
              "winner.userId": winnerId,
              "winner.point": votes,
            },
          },
          {new: true},
          e1 => {
            if (e1) {
              return;
            } else {
              console.log("value updated successfully..");
            }
          }
        );
      }
    }
  }
});

job.start();
let transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  // host: os.hostname(),
  secure: true,
  // secureConnection: true,
  greetingTimeout: 10000,
  port: 465,
  tls: {
    secureProtocol: "TLSv1_method",
  },
  auth: {
    user: "official@pieramo.com",
    pass: "pieramo433000",
  },
});

generateHash = text => {
  return bcrypt.hashSync(text, bcrypt.genSaltSync(saltRounds), null);
};

verify = (password, DBPassword) => {
  return bcrypt.compareSync(password, DBPassword);
};

exports.register = async (req, res) => {
  console.log("register 1... ", req.body);

  const foundUser = await user.findOne({email: req.body.email}).lean().exec();

  console.log("found user... ", foundUser);
  if (foundUser) {
    res.json({
      code: 409,
      status: "already",
      message: "User already exist with this email id",
    });
  } else {
    let newUser = new user();
    newUser.userName = req.body.userName;
    newUser.email = req.body.email;
    newUser.password = generateHash(req.body.password);
    newUser.usertype = req.body.userType;
    newUser.verified = true;

    const userRegisterInfo = await newUser.save();
    if (userRegisterInfo) {
      const tokenData = {
        _id: userRegisterInfo._id,
        email: userRegisterInfo.email,
        password: userRegisterInfo.password,
      };

      const token = jwt.sign(tokenData, "debate", {});

      let uniqueCode = "";
      let useCharacters = "1234567890";
      for (let i = 0; i < 6; i++) {
        uniqueCode += useCharacters.charAt(
          Math.floor(Math.random() * useCharacters.length)
        );
      }

      user.findByIdAndUpdate(
        {_id: userRegisterInfo._id},
        {
          $set: {
            verificationCode: uniqueCode,
          },
        },
        {new: true},
        err => {
          if (err) return;
        }
      );
      let mainOptions = {
        from: '"Pieramo Debates" official@pieramo.com',
        to: req.body.email,
        subject: "Verification code from Debates",
        html:
          "<p>To verify to this site you have to enter given 6 digit code. Here is the code: " +
          uniqueCode +
          ' Click <a href="https://pieramo.com/verifyUser?id=' +
          userRegisterInfo._id +
          '">on this link to verify:</a> to verify your account</p>',
      };
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log("errro........ ", err);
          res.json({
            code: 500,
            status: "err",
            message: "Something went wrong",
          });
        } else {
          res.json({
            code: 200,
            status: "success",
            authToken: token,
          });
        }
      });
    } else {
      res.json({
        code: 500,
        status: "err",
        message: "Facing error while storing record",
      });
    }
  }
};

exports.register1 = async (req, res) => {
  console.log("register api req.body", req.body);

  const email = req.body.email;

  const findAlreadyEmail = await user.findOne({email: email});

  if (findAlreadyEmail) {
    res.json({
      code: 409,
      status: "already",
      message: "Alredy Register",
    });
  } else {
    let newUser = new user();
    if (req.body.profilePic && req.body.profilePic !== "") {
      let imagePath;
      let base64Data;
      function myFunction(length, chars) {
        var mask = "";
        if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
        if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (chars.indexOf("#") > -1) mask += "0123456789";
        var result = "";
        for (var i = length; i > 0; --i)
          result += mask[Math.floor(Math.random() * mask.length)];
        return result;
      }
      var randomNumber = myFunction(25, "#aA");
      var data = req.body.profilePic.split(";");
      if (data[0] == "data:image/1") {
        imagePath = "./uploads/" + randomNumber + ".png";
        base64Data = req.body.profilePic.replace(/^data:image\/1;base64,/, "");
      } else if (data[0] == "data:image/*") {
        var base64 = data[2].split(",");
        base64Data = base64[1];
        var data = base64[1].substring(0, 8);
        if (data == "/9j/4AAQ") {
          imagePath = "./uploads/" + randomNumber + ".jpeg";
        } else {
          imagePath = "./uploads/" + randomNumber + ".png";
        }
      } else if (data[0] == "data:image/png") {
        imagePath = "./uploads/" + randomNumber + ".png";
        base64Data = req.body.profilePic.replace(
          /^data:image\/png;base64,/,
          ""
        );
      } else if (data[0] == "data:image/jpeg") {
        imagePath = "./uploads/" + randomNumber + ".jpeg";
        base64Data = req.body.profilePic.replace(
          /^data:image\/jpeg;base64,/,
          ""
        );
      } else {
        console.log("image invalid");
      }
      fs.writeFile(imagePath, base64Data, "base64", async function (err) {
        if (err) {
          console.log("err: ", err);
          res.json({
            success: false,
            message: "Base64 Image is not converted",
            data: err,
          });
        } else {
          newUser.userName = req.body.userName;
          newUser.email = req.body.email;
          newUser.password = generateHash(req.body.password);
          newUser.usertype = req.body.userType;
          newUser.profilePic =
            process.env.NODE_ENV == "developement"
              ? "http://198.199.74.223/api/" + imagePath.split("./uploads")[1]
              : "http://198.199.74.223/api/" + imagePath.split("./uploads")[1];

          const userRegisterInfo = await newUser.save();
          if (userRegisterInfo) {
            const tokenData = {
              _id: userRegisterInfo._id,
              email: userRegisterInfo.email,
              password: userRegisterInfo.password,
            };

            const token = jwt.sign(tokenData, "debate", {});
            let uniqueCode = "";
            let useCharacters = "1234567890";
            for (let i = 0; i < 6; i++) {
              uniqueCode += useCharacters.charAt(
                Math.floor(Math.random() * useCharacters.length)
              );
            }

            let mainOptions = {
              from: '"Pieramo Debates" official@pieramo.com',
              to: req.body.email,
              subject: "Verification code from Debates",
              text:
                "To verify to this site you have to enter given 6 digit code. Here is the code: " +
                uniqueCode,
            };
            transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
                console.log("err.. err===", err);
                res.json({
                  code: 500,
                  status: "err",
                  message: "Something went wrong",
                });
              } else {
                res.json({
                  code: 200,
                  status: "success",
                  authToken: token,
                });
              }
            });
          } else {
            res.json({
              code: 403,
              status: "err",
            });
          }
        }
      });
    } else {
      newUser.userName = req.body.userName;
      newUser.email = req.body.email;
      newUser.password = generateHash(req.body.password);
      newUser.usertype = req.body.userType;
      newUser.verified = true;

      const userRegisterInfo = await newUser.save();
      if (userRegisterInfo) {
        const tokenData = {
          _id: userRegisterInfo._id,
          email: userRegisterInfo.email,
          password: userRegisterInfo.password,
        };

        const token = jwt.sign(tokenData, "debate", {});

        let uniqueCode = "";
        let useCharacters = "1234567890";
        for (let i = 0; i < 6; i++) {
          uniqueCode += useCharacters.charAt(
            Math.floor(Math.random() * useCharacters.length)
          );
        }

        user.findByIdAndUpdate(
          {_id: userRegisterInfo._id},
          {
            $set: {
              verificationCode: uniqueCode,
            },
          },
          {new: true},
          err => {
            if (err) return;
          }
        );
        let mainOptions = {
          from: '"Pieramo Debates" official@pieramo.com',
          to: req.body.email,
          subject: "Verification code from Debates",
          html:
            "<p>To verify to this site you have to enter given 6 digit code. Here is the code: " +
            uniqueCode +
            ' Click <a href="https://pieramo.com/verifyUser?id=' +
            userRegisterInfo._id +
            '">on this link to verify:</a> to verify your account</p>',
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log("errro........ ", err);
            res.json({
              code: 500,
              status: "err",
              message: "Something went wrong",
            });
          } else {
            res.json({
              code: 200,
              status: "success",
              authToken: token,
            });
          }
        });
      } else {
        res.json({
          code: 403,
          status: "err",
        });
      }
    }
  }
};

exports.login = (req, res) => {
  console.log("login req.body ", req.body);

  if (req.body.email && req.body.password) {
    user
      .findOne({email: req.body.email})
      .lean()
      .exec((err, foundUser) => {
        if (foundUser) {
          if (verify(req.body.password, foundUser.password)) {
            user.findByIdAndUpdate(
              {_id: foundUser._id},
              {
                $set: {
                  isActive: true,
                  saveUser: req.body.saveUser ? req.body.saveUser : false,
                },
              },
              {new: true},
              e1 => {
                if (e1) {
                  return;
                }
              }
            );

            const data = {
              _id: foundUser._id,
              email: foundUser.email,
              password: foundUser.password,
            };
            const token = jwt.sign(data, "debate", {});
            res.json({
              code: 200,
              status: "success",
              authToken: token,
              data: {
                id: foundUser._id,
                email: foundUser.email,
                saveUser: foundUser.saveUser,
              },
            });
          } else {
            res.json({
              code: 403,
              status: "err",
              message: "Password is wrong",
            });
          }
        } else {
          res.json({
            code: 403,
            status: "err",
            message: "No verified user found",
          });
        }
      });
  } else {
    res.json({
      code: 403,
      status: "err",
      message: "Please give data in proper fields",
    });
  }
};

exports.logout = (req, res) => {
  console.log("log out api req.body.. ", req.body);
  user.findByIdAndUpdate(
    {_id: req.body.id},
    {
      $set: {
        isActive: false,
      },
    },
    {new: true},
    e1 => {
      if (e1) {
        return;
      }

      console.log("log out api updated successfully.. ");
      res.json({
        code: 200,
        status: "success",
      });
    }
  );
};

exports.changePassword = async (req, res) => {
  console.log("change password api", req.user);

  const foundUser = await user.findOne({_id: req.user._id}).lean().exec();

  if (foundUser) {
    const newPassword = generateHash(req.body.password);

    user.findByIdAndUpdate(
      {_id: foundUser._id},
      {
        $set: {
          password: newPassword,
        },
      },
      {new: true},
      (err, newUser) => {
        if (err) {
          console.log("err", err);
          return;
        }

        res.json({
          code: 200,
          status: "success",
          data: newUser,
        });
      }
    );
  }
};

exports.viewUsers = async (req, res) => {
  console.log("view users api");

  const foundUser = await user.findOne({_id: req.user._id}).lean().exec();
  if (foundUser) {
    const userList = await user
      .find({usertype: {$ne: "admin"}})
      .lean()
      .exec();

    res.json({
      code: 200,
      status: "success",
      data: userList,
    });
  }
};

exports.verifyUser = async (req, res) => {
  console.log("verify user api req.body ", req.body);

  const checkUser = await user.findOne({_id: req.body.id}).exec();
  if (checkUser) {
    if (checkUser.verificationCode == req.body.code) {
      user.findByIdAndUpdate(
        {_id: req.body.id},
        {
          $set: {
            verified: true,
            updatedDate: moment(),
            verificationCode: null,
          },
        },
        {new: true},
        e1 => {
          if (e1) {
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
        message: "Verification code does not match",
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

exports.editPersonalProfile = async (req, res) => {
  console.log("edit profile req body", req.body);
  const userId = req.body.userId;
  const userName = req.body.userName;
  const contactNo = req.body.contactNo;
  const birthDate = req.body.birthDate;

  const findUserExiest = await user.findOne({_id: userId}).lean().exec();

  if (findUserExiest) {
    console.log("found");
    if (
      req.body.oldPassword &&
      req.body.oldPassword != "" &&
      req.body.newPassword &&
      req.body.newPassword != ""
    ) {
      if (verify(req.body.oldPassword, findUserExiest.password)) {
        const updateUserProf = await user.findByIdAndUpdate(
          {_id: userId},
          {
            $set: {
              userName: userName ? userName : findUserExiest.userName,
              contactNo: contactNo ? contactNo : findUserExiest.contactNo,
              birthDate: birthDate ? birthDate : findUserExiest.birthDate,
              updatedDate: moment(),
              password:
                req.body.newPassword && req.body.newPassword != ""
                  ? generateHash(req.body.newPassword)
                  : findUserExiest.password,
            },
          },
          {new: true}
        );

        if (updateUserProf) {
          res.json({
            code: 200,
            status: "success",
            data: updateUserProf,
            message: "Your profile updated successfully",
          });
        } else {
          res.json({
            code: 403,
            status: "err",
            message: "your profile not update!pelase try again",
          });
        }
      } else {
        res.json({
          code: 403,
          status: "err",
          message:
            "your old password does not match! Please enter correct password",
        });
      }
    } else {
      const updateUserProf = await user.findByIdAndUpdate(
        {_id: userId},
        {
          $set: {
            userName: userName ? userName : findUserExiest.userName,
            contactNo: contactNo ? contactNo : findUserExiest.contactNo,
            birthDate: birthDate ? birthDate : findUserExiest.birthDate,
            updatedDate: moment(),
            password:
              req.body.newPassword && req.body.newPassword != ""
                ? generateHash(req.body.newPassword)
                : findUserExiest.password,
          },
        },
        {new: true}
      );

      if (updateUserProf) {
        res.json({
          code: 200,
          status: "success",
          data: updateUserProf,
          message: "Your profile updated successfully",
        });
      } else {
        res.json({
          code: 403,
          status: "err",
          message: "your profile not update!pelase try again",
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

exports.editProfileImg1 = async (req, res) => {
  console.log("req.body.. ", req.body);
  let imagePath;
  let base64Data;

  function myFunction(length, chars) {
    var mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    var result = "";
    for (var i = length; i > 0; --i)
      result += mask[Math.floor(Math.random() * mask.length)];
    return result;
  }
  var randomNumber = myFunction(25, "#aA");
  var data = req.body.profilePic.split(";");
  if (data[0] == "data:image/1") {
    imagePath = "./public/images/" + randomNumber + ".png";
    base64Data = req.body.profilePic.replace(/^data:image\/1;base64,/, "");
  } else if (data[0] == "data:image/*") {
    var base64 = data[2].split(",");
    base64Data = base64[1];
    var data = base64[1].substring(0, 8);
    if (data == "/9j/4AAQ") {
      imagePath = "./public/images/" + randomNumber + ".jpeg";
    } else {
      imagePath = "./public/images/" + randomNumber + ".png";
    }
  } else if (data[0] == "data:image/png") {
    imagePath = "./public/images/" + randomNumber + ".png";
    base64Data = req.body.profilePic.replace(/^data:image\/png;base64,/, "");
  } else if (data[0] == "data:image/jpeg") {
    imagePath = "./public/images/" + randomNumber + ".jpeg";
    base64Data = req.body.profilePic.replace(/^data:image\/jpeg;base64,/, "");
  } else {
    console.log("image invalid");
  }
  fs.writeFile(imagePath, base64Data, "base64", async function (err) {
    if (err) {
      console.log("err: ", err);
      res.json({
        success: false,
        message: "Base64 Image is not converted",
        data: err,
      });
    } else {
      console.log(
        "image path... ",
        imagePath,
        imagePath.split("./public/images/")[1]
      );
      const imageUrlPath =
        "https://pieramo.com:8000/images/" +
        imagePath.split("./public/images/")[1];

      console.log("imageUrlPath ", imageUrlPath);
      user
        .findOne({_id: req.body.userId})
        .lean()
        .exec((error, loginUser) => {
          if (loginUser) {
            if (loginUser.profilePic) {
              const getImgName = loginUser.profilePic.split("//");
              console.log(
                "old pic ",
                loginUser.profilePic,
                getImgName,
                fs.existsSync("./public/images/" + getImgName[2])
              );

              if (fs.existsSync("./public/images/" + getImgName[2])) {
                let filePath = "./public/images/" + getImgName[2];
                fs.unlinkSync(filePath);
                console.log("getImgName ", getImgName);

                user.findByIdAndUpdate(
                  {_id: req.body.userId},
                  {
                    $set: {
                      profilePic: imageUrlPath,
                    },
                  },
                  {new: true},
                  (e1, newUser) => {
                    if (e1) {
                      console.log("e1... ", e1);
                      return;
                    }

                    console.log("newUser.profilePic ", newUser.profilePic);
                    res.json({
                      code: 200,
                      status: "success",
                      data: newUser.profilePic,
                    });
                  }
                );
              } else {
                if (loginUser) {
                  user.findByIdAndUpdate(
                    {_id: req.body.userId},
                    {
                      $set: {
                        profilePic: imageUrlPath,
                      },
                    },
                    {new: true},
                    (e1, newUser) => {
                      if (e1) {
                        console.log("e1... ", e1);
                        return;
                      }

                      console.log("newUser.profilePic11 ", newUser.profilePic);
                      res.json({
                        code: 200,
                        status: "success",
                        data: newUser.profilePic,
                      });
                    }
                  );
                } else {
                  res.json({
                    code: 400,
                    status: "err",
                    message: "No user found",
                  });
                }
              }
            } else {
              user.findByIdAndUpdate(
                {_id: req.body.userId},
                {
                  $set: {
                    profilePic: imageUrlPath,
                  },
                },
                {new: true},
                (e1, newUser) => {
                  if (e1) {
                    return;
                  }

                  res.json({
                    code: 200,
                    status: "success",
                    data: newUser.profilePic,
                  });
                }
              );
            }
          } else {
            res.json({
              code: 400,
              status: "err",
              message: "No user found",
            });
          }
        });
    }
  });
};

exports.editProfileImg = async (req, res) => {
  console.log("edit profile with multer... ", req.body, req.file);

  const decode = await jwt.verify(req.headers.token, "debate", {});
  const loginUser = await user.findOne({_id: decode._id}).exec();
  if (loginUser) {
    let imagePath = "https://pieramo.com:8000/images/" + req.file.filename;

    user.findByIdAndUpdate(
      {_id: loginUser._id},
      {
        $set: {
          profilePic: imagePath,
        },
      },
      {new: true},
      (e1, newData) => {
        if (e1) {
          return;
        } else {
          res.json({
            code: 200,
            status: "success",
            data: newData.profilePic,
          });
        }
      }
    );
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.getProfileInfo = async (req, res) => {
  console.log("getProfileInfo req.query ", req.query);

  let paymentDetail = await payment.findOne({userId: req.query.id}).exec();
  if (paymentDetail != null) {
    const currentDate = moment();
    var Sdate = new Date(paymentDetail.subscriptionStartDate);
    var Edate = new Date(paymentDetail.subscriptionEndDate);

    var start = [
      ("0" + Sdate.getDate()).slice(-2),
      ("0" + (Sdate.getMonth() + 1)).slice(-2),
      Sdate.getFullYear(),
    ].join("/");
    var end = [
      ("0" + Edate.getDate()).slice(-2),
      ("0" + (Edate.getMonth() + 1)).slice(-2),
      Edate.getFullYear(),
    ].join("/");

    var startDate = moment(start, "DD/MM/YYYY");
    var endDate = moment(end, "DD/MM/YYYY");

    if (currentDate.isBetween(startDate, endDate) == false) {
      await payment.deleteOne({userId: req.query.id});
    }

    premium = currentDate.isBetween(startDate, endDate);
    var response = await user.findByIdAndUpdate(
      {_id: req.query.id},
      {$set: {premium: premium}}
    );
  } else {
    var update = await user.findByIdAndUpdate(
      {_id: req.query.id},
      {$set: {premium: false}}
    );
  }

  let count = 0;
  let userInfo = await user.findOne({_id: req.query.id}).exec();
  let newObj = {};

  if (userInfo) {
    let point = await debate
      .find({"winner.userId": userInfo._id.toString()})
      .exec();
    if (point.length) {
      count = point.reduce((partialObj, currentObj) => {
        partialObj = partialObj + currentObj.winner.point;
        return partialObj;
      }, 0);
      newObj.verified = userInfo.verified;
      newObj.createdDate = userInfo.createdDate;
      newObj.status = userInfo.status;
      newObj._id = userInfo._id;
      newObj.userName = userInfo.userName;
      newObj.email = userInfo.email;
      newObj.password = userInfo.password;
      newObj.usertype = userInfo.usertype;
      newObj.isActive = userInfo.isActive;
      newObj.profilePic = userInfo.profilePic;
      newObj.winningPoint = count;
      newObj.saveUser = userInfo.saveUser;
      newObj.contactNo = userInfo.contactNo;
      newObj.birthDate = userInfo.birthDate;
      newObj.premium = userInfo.premium;

      res.json({
        code: 200,
        status: "success",
        data: newObj,
      });
    } else {
      res.json({
        code: 200,
        status: "success",
        data: userInfo,
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

exports.forgotPassword = async (req, res) => {
  console.log("for got psw... ", req.body);

  const loginUser = await user.findOne({email: req.body.email}).lean().exec();
  let transporterForForgot = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    // host: os.hostname(),
    secure: true,
    // secureConnection: true,
    greetingTimeout: 10000,
    port: 465,
    tls: {
      secureProtocol: "TLSv1_method",
    },
    auth: {
      user: "official@pieramo.com",
      pass: "pieramo433000",
    },
  });
  if (loginUser) {
    let mainOptions = {
      from: '"Pieramo Debates" official@pieramo.com',
      to: loginUser.email,
      subject: "Forgot Password Link from Debates",
      html: `<p>To create/change password click on the given link: <a href='https://pieramo.com/setNewPassword?id=${loginUser._id}'>Click Here</a></p>`,
    };
    transporterForForgot.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log("error in sending email  ", err);
        res.json({
          code: 500,
          status: "err",
          message: "Something went wrong",
        });
      } else {
        res.json({
          code: 200,
          status: "success",
          message: "link sent successfully",
        });
      }
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.setNewPassword = async (req, res) => {
  console.log("set new psw ", req.body);

  const loginUser = await user.findOne({_id: req.body.id}).exec();

  if (loginUser) {
    let newPsw = await generateHash(req.body.newPassword);

    user.findByIdAndUpdate(
      {_id: loginUser._id},
      {
        $set: {
          password: newPsw,
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
            message: "Password changed successfully",
          });
        }
      }
    );
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.checkSaveUser = async (req, res) => {
  console.log("checkSaveUser.. ");

  const loginUser = await user.findOne({_id: req.query.id}).exec();

  if (loginUser) {
    res.json({
      code: 200,
      status: "success",
      data: loginUser,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "Mo user found",
    });
  }
};

exports.makeStatusActive = async (req, res) => {
  console.log("makeStatusActive req.body ", req.body);

  user.findByIdAndUpdate(
    {_id: req.body.userId},
    {
      $set: {
        isActive: true,
      },
    },
    {new: true},
    er => {
      if (er) {
        res.json({
          code: 403,
          status: "err",
          message: er.toString(),
        });
      } else {
        res.json({
          code: 200,
          status: "success",
        });
      }
    }
  );
};

exports.calculateVotes = async (req, res) => {
  console.log("calculateVotes ", req.body);

  const foundStream = await debateStream.findOne({_id: req.body.id}).exec();

  if (foundStream) {
    const debateDate = moment(foundStream.createdDate).format("YYYY-MM-DD");
    const currentDate = moment().format("YYYY-MM-DD");
    const member1 = foundStream.debateMember[0];
    const member2 = foundStream.debateMember[1];
    let winnerId, votes;

    if (moment(currentDate).diff(debateDate, "weeks") >= 1) {
      let win1 = foundStream.votes.filter(({userId}) => userId === member1);
      let win2 = foundStream.votes.filter(({userId}) => userId === member2);

      if (win1.length > win2.length) {
        winnerId = member1;
        votes = win1.length;
      } else if (win2.length > win1.length) {
        winnerId = member2;
        votes = win2.length;
      } else {
        winnerId = "";
        votes = 0;
      }
    }

    debate.findByIdAndUpdate(
      {_id: foundStream.debateId},
      {
        $set: {
          "winner.userId": winnerId,
          "winner.point": votes,
        },
      },
      {new: true},
      e1 => {
        if (e1) {
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
};
