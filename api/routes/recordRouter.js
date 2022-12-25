const express = require("express");
const router = express.Router(); //We created sub application for records

const { audioUpload } = require("../controllers/recordController");

router.route("/").post(audioUpload);
// router.route("/deleteRecord").post(deleteRecord);
module.exports = router;
