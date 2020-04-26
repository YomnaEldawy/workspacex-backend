const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    var id = req.body.id;
    var query = "delete from checkInRequest where requestId ='" + id + "';";
    var result = await executeQuery(query);
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    res.send({ success: false, err });
  }
});
module.exports = router;
