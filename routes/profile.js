const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.get("/:id", async (req, res) => {
  const result = await executeQuery(
    `select * from Workspace where id = ${req.params.id}`
  );
  res.send(result);
});

router.post("/edit/:id", async (req, res) => {
  try {
    console.log(req.body);
    var id = req.params.id;
    var ws_name = req.body.Name;
    var city = req.body.City;
    var phone = req.body.Phone;
    var streetName = req.body.StreetName;
    var streetNumber = req.body.StreetNumber;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var opensAt = req.body.OpensAt;
    var closesAt = req.body.ClosesAt;
    var Day_to_open = req.body.DayToOpen;
    var Day_to_close = req.body.DayToClose;
    var query =
      "update Workspace set name='" +
      ws_name +
      "',city='" +
      city +
      "',phone='" +
      phone +
      "',streetName='" +
      streetName +
      "',streetNumber='" +
      streetNumber +
      "',latitude=" +
      latitude +
      ",longitude=" +
      longitude +
      ",opensAt='" +
      opensAt +
      "',closesAt='" +
      closesAt +
      "',Day_to_open='" +
      Day_to_open +
      "',Day_to_close='" +
      Day_to_close +
      "' where id = " +
      id +
      ";";
    console.log(query);
    var result = await executeQuery(query);
    res.send(result);
  } catch (err) {
    res.send({ success: false });
    console.log(err);
  }
});

module.exports = router;
