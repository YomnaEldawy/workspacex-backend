const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/", async (req, res) => {
  var id = req.body.id;
  var query1 = "select * from checkIn where id ='" + id + "';";
  var res1 = await executeQuery(query1);
  if (res1.length != 0) {
    var query2 = "insert into checkOut(checkInId) values ('" + id + "');";
    var result = await executeQuery(query2);
    res.send({ success: true, result });
  } else {
    res.send({ success: false });
  }
});
module.exports = router;
