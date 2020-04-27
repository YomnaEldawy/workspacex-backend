const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/new", async (req, res) => {
  try {
    console.log(req.body);
    var ws_name = req.body.ws_name;
    var city = req.body.city;
    var phone = req.body.phone;
    var streetName = req.body.streetName;
    var streetNumber = req.body.streetNumber;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var opensAt = req.body.opensAt;
    var closesAt = req.body.closesAt;
    var Day_to_open = req.body.Day_to_open;
    var Day_to_close = req.body.Day_to_close;
    var query =
      "insert into Workspace(name,city,phone,streetName, streetNumber,latitude,longitude,opensAt,closesAt,Day_to_open,Day_to_close) values ('" +
      ws_name +
      "','" +
      city +
      "','" +
      phone +
      "','" +
      streetName +
      "','" +
      streetNumber +
      "','" +
      latitude +
      "','" +
      longitude +
      "','" +
      opensAt +
      "','" +
      closesAt +
      "','" +
      Day_to_open +
      "','" +
      Day_to_close +
      "');";
    console.log(query);
    var result = await executeQuery(query);
    var query2 = `update StaffMember set workspaceId=${result.insertId} where email='${req.body.loginDetails.userDetails.email}'`;
    var result2 = await executeQuery(query2);
    res.send(result);
  } catch (err) {
    res.send({ success: false });
  }
});

router.get("/:id", async (req, res) => {
  const result = await executeQuery(
    `select * from Workspace where id = ${req.params.id}`
  );
  res.send(result);
});

router.get("/", async (req, res) => {
  const result = await executeQuery(`select * from Workspace`);
  res.send(result);
});

module.exports = router;
