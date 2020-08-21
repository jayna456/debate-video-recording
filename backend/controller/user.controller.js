let user = require("../model/user.model");
const debate = require("../model/debate.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const moment = require("moment");
require("dotenv").config();
console.log("LOCAL_URL..", process.env.LOCAL_URL, process.env.NODE_ENV);

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "cce7cd0ca1f274",
    pass: "24f92ada6fa11c",
  },
});

generateHash = (text) => {
  return bcrypt.hashSync(text, bcrypt.genSaltSync(saltRounds), null);
};

verify = (password, DBPassword) => {
  return bcrypt.compareSync(password, DBPassword);
};

exports.register = async (req, res) => {
  console.log("register api req.body", req.body);

  const email = req.body.email;

  const findAlreadyEmail = await user.findOne({ email: email });

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
              ? "http://localhost:8000/" + imagePath.split("./uploads")[1]
              : "http://localhost:8000/" + imagePath.split("./uploads")[1];

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
              from: '"Debates" testmail@test.com',
              to: req.body.email,
              subject: "Verification code from Debates",
              text:
                "To verify to this site you have to enter given 6 digit code. Here is the code: " +
                uniqueCode,
            };
            transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
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
          { _id: userRegisterInfo._id },
          {
            $set: {
              verificationCode: uniqueCode,
            },
          },
          { new: true },
          (err) => {
            if (err) return;
          }
        );
        let mainOptions = {
          from: '"Debates" testmail@test.com',
          to: req.body.email,
          subject: "Verification code from Debates",
          html:
            "<p>To verify to this site you have to enter given 6 digit code. Here is the code: " +
            uniqueCode +
            ' Click <a href="http://localhost:3000/verifyUser?id=' +
            userRegisterInfo._id +
            '">on this link to verify:</a> to verify your account</p>',
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
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
      .findOne({ email: req.body.email, verified: true })
      .lean()
      .exec((err, foundUser) => {
        if (foundUser) {
          if (verify(req.body.password, foundUser.password)) {
            user.findByIdAndUpdate(
              { _id: foundUser._id },
              {
                $set: {
                  isActive: true,
                  saveUser: req.body.saveUser,
                },
              },
              { new: true },
              (e1) => {
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
    { _id: req.body.id },
    {
      $set: {
        isActive: false,
      },
    },
    { new: true },
    (e1) => {
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

  const foundUser = await user.findOne({ _id: req.user._id }).lean().exec();

  if (foundUser) {
    const newPassword = generateHash(req.body.password);

    user.findByIdAndUpdate(
      { _id: foundUser._id },
      {
        $set: {
          password: newPassword,
        },
      },
      { new: true },
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

  const foundUser = await user.findOne({ _id: req.user._id }).lean().exec();
  if (foundUser) {
    const userList = await user
      .find({ usertype: { $ne: "admin" } })
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

  const checkUser = await user.findOne({ _id: req.body.id }).exec();
  if (checkUser) {
    if (checkUser.verificationCode == req.body.code) {
      user.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            verified: true,
            updatedDate: moment(),
            verificationCode: null,
          },
        },
        { new: true },
        (e1) => {
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

  const findUserExiest = await user.findOne({ _id: userId });

  if (findUserExiest) {
    console.log("found");
    const updateUserProf = await user.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          userName: userName ? userName : findUserExiest.userName,
          contactNo: contactNo ? contactNo : findUserExiest.contactNo,
          birthDate: birthDate ? birthDate : findUserExiest.birthDate,
          updatedDate: moment(),
        },
      },
      { new: true }
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
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.editProfileImg = async (req, res) => {
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
    base64Data = req.body.profilePic.replace(/^data:image\/png;base64,/, "");
  } else if (data[0] == "data:image/jpeg") {
    imagePath = "./uploads/" + randomNumber + ".jpeg";
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
      const imageUrlPath =
        "http://localhost:8000/" + imagePath.split("./uploads")[1];

      user
        .findOne({ _id: req.body.userId })
        .lean()
        .exec((error, loginUser) => {
          if (loginUser) {
            if (loginUser.profilePic) {
              console.log(loginUser.profilePic);
              const getImgName = loginUser.profilePic.split("//");

              if (fs.existsSync("./uploads/" + getImgName[2])) {
                let filePath = "./uploads/" + getImgName[2];
                fs.unlinkSync(filePath);
              } else {
                if (loginUser) {
                  user.findByIdAndUpdate(
                    { _id: req.body.userId },
                    {
                      $set: {
                        profilePic: imageUrlPath,
                      },
                    },
                    { new: true },
                    (e1, newUser) => {
                      if (e1) {
                        return;
                      }

                      res.json({
                        code: 200,
                        status: "success",
                        data: newUser,
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
                { _id: req.body.userId },
                {
                  $set: {
                    profilePic: imageUrlPath,
                  },
                },
                { new: true },
                (e1, newUser) => {
                  if (e1) {
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

exports.getProfileInfo = async (req, res) => {
  // console.log("getProfileInfo req.query ", req.query);

  let userInfo = await user.findOne({ _id: req.query.id }).exec();

  if (userInfo) {
    let point = await debate.find({ "winner.userId": userInfo._id }).exec();
    userInfo["winningPoint"] = point.length;

    res.json({
      code: 200,
      status: "success",
      data: userInfo,
    });
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

  const loginUser = await user
    .findOne({ email: req.body.email, verified: true })
    .lean()
    .exec();

  if (loginUser) {
    let mainOptions = {
      from: '"Debates" testmail@test.com',
      to: loginUser.email,
      subject: "Forgot Password Link from Debates",
      html: `<p>To create/change password click on the given link: <a href='http://localhost:3000/setNewPassword?id=${loginUser._id}'>Click Here</a></p>`,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
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

  const loginUser = await user.findOne({ _id: req.body.id }).exec();

  if (loginUser) {
    let newPsw = await generateHash(req.body.newPassword);

    user.findByIdAndUpdate(
      { _id: loginUser._id },
      {
        $set: {
          password: newPsw,
        },
      },
      { new: true },
      (err) => {
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

  const loginUser = await user.findOne({ _id: req.query.id }).exec();

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
