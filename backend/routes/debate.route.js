const express = require('express');
const debate = require('../controller/debate.controller');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { route } = require('./user.route');
const { Router } = require('express');

let storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    console.log('file... ', req.body);
    const uploadDir = path.join(__dirname, '..', 'public', 'videos');
    if (fs.existsSync(uploadDir)) {
      cb(null, uploadDir);
    } else {
      fs.mkdirSync(uploadDir);
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${
        req.body.userId + '-' + Date.now() + '.' + file.mimetype.split('/')[1]
      }`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('file.mimetype ', file.mimetype);
    const fileType = /mp4/;
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1
    );
    const mimetype = fileType.test(file.mimetype);

    if (mimetype && extension) {
      return cb(null, true);
    } else {
      cb('Error:you can upload only Image or Mp4 Video file');
    }
  },
});

router.post('/createNewDebate', debate.createNewDebate);
router.put('/deleteDebate', debate.deleteDebate);
router.get('/viewDebates', debate.viewDebates);
router.put('/changeDebateStatus', debate.changeDebateStatus);
router.post('/searchDebeate', debate.searchDebeate);
router.post('/sendPrivateProposal', debate.sendPrivateProposal);
router.put('/upadateToJoinDebate', debate.upadateToJoinDebate);
router.post('/storeDebate', upload.single('file'), debate.storeDebate);
router.post('/makeFollow', debate.makeFollow);
router.get('/checkFollowingOrNot', debate.checkFollowingOrNot);
router.get('/viewFollowList', debate.viewFollowList);
router.put('/applyVoteAndComment', debate.applyVoteAndComment);
router.get('/viewPrivateRequests', debate.viewPrivateRequests);
router.put('/acceptRejectPrivateProposal', debate.acceptRejectPrivateProposal);
router.put('/editCreatedDebate', debate.editCreatedDebate);
router.delete('/deleteCreatedDebate', debate.deleteCreatedDebate);
router.get('/getFollowersList', debate.getFollowersList);
router.get('/getVoteAndComment', debate.getVoteAndComment);
router.get('/getDebateStreamList', debate.getDebateStreamList);
router.get('/getUserDebateList', debate.getUserDebateList);
router.put('/updateWatchCountInVideo', debate.updateWatchCountInVideo);
router.get('/getDebateInfo', debate.getDebateInfo);
router.patch('/onCloseRemoveDebate', debate.onCloseRemoveDebate);
router.patch('/publicToPrivate', debate.publicToPrivate);
router.patch('/unFollowUser', debate.unFollowUser);

module.exports = router;
