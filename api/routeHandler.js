const express = require("express");
const router = express.Router(); //We created sub application for carts

const { hello, sayFuckYou } = require("./controller");

router.route("/hello/").get(hello);
router.route("/fku").get(sayFuckYou);

module.exports = router;
