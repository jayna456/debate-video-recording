const express = require("express");
const user = require("../controller/user.controller");
const router = express.Router();

router.post("/register", user.register);
router.post("/login", user.login);
router.put("/logout", user.logout);
router.put("/api/changePassword", user.changePassword);
router.get("/viewUsers", user.viewUsers);
router.put("/verifyUser", user.verifyUser);
router.post("/editPersonalProfile", user.editPersonalProfile);
router.post("/editProfileImg", user.editProfileImg);
router.get("/getProfileInfo", user.getProfileInfo);
router.put("/forgotPassword", user.forgotPassword);
router.put("/setNewPassword", user.setNewPassword);

module.exports = router;
