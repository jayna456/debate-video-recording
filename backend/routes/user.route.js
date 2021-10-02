const express = require("express");
const user = require("../controller/user.controller");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

let storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "public", "images");
    if (fs.existsSync(uploadDir)) {
      cb(null, uploadDir);
    } else {
      fs.mkdirSync(uploadDir);
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileType = /jpeg|jpg|png/;
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );
    const mimetype = fileType.test(file.mimetype);

    if (mimetype && extension) {
      return cb(null, true);
    } else {
      cb("Error:you can upload only Image file");
    }
  },
});

router.post("/register", user.register);
router.post("/login", user.login);
router.put("/logout", user.logout);
router.put("/api/changePassword", user.changePassword);
router.get("/viewUsers", user.viewUsers);
router.put("/verifyUser", user.verifyUser);
router.post("/editPersonalProfile", user.editPersonalProfile);
router.post("/editProfileImg1", user.editProfileImg1);
router.post(
  "/editProfileImg",
  upload.single("profilePic"),
  user.editProfileImg
);
router.get("/getProfileInfo", user.getProfileInfo);
router.put("/forgotPassword", user.forgotPassword);
router.put("/setNewPassword", user.setNewPassword);
router.get("/checkSaveUser", user.checkSaveUser);
router.patch('/makeStatusActive', user.makeStatusActive);

module.exports = router;
