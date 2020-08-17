const express = require("express");
const debate = require("../controller/debate.controller");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

let storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
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
  fileFilter: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (fs.existsSync(uploadDir + "/" + file.originalname)) {
      return cb(null, false, new Error(file.originalname + "already existes"));
    }
    cb(null, true);
  },
});

router.post("/createNewDebate", debate.createNewDebate);
router.put("/deleteDebate", debate.deleteDebate);
router.get("/viewDebates", debate.viewDebates);
router.put("/changeDebateStatus", debate.changeDebateStatus);
router.post("/searchDebeate", debate.searchDebeate);
router.post("/sendPrivateProposal", debate.sendPrivateProposal);
router.put("/upadateToJoinDebate", debate.upadateToJoinDebate);
router.post("/storeDebate", upload.single("file"), debate.storeDebate);
router.post("/makeFollow", debate.makeFollow);
router.get("/checkFollowingOrNot", debate.checkFollowingOrNot);
router.get("/viewFollowList", debate.viewFollowList);
router.put("/applyVoteAndComment", debate.applyVoteAndComment);
router.get("/viewPrivateRequests", debate.viewPrivateRequests);
router.put("/acceptRejectPrivateProposal", debate.acceptRejectPrivateProposal);
router.put("/editCreatedDebate", debate.editCreatedDebate);
router.delete("/deleteCreatedDebate", debate.deleteCreatedDebate);

module.exports = router;
