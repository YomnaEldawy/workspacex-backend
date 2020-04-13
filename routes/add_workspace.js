const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/new", async (req, res) => {
  try {
    console.log(req.body);
    var ws_name = req.body.ws_name;
    var city = req.body.city;
    var phone = req.body.phone;
    var query =
      "insert into Workspace(name,city,phone, streetName, streetNumber) values ('" +
      ws_name +
      "','" +
      city +
      "','" +
      phone +
      "'" +
      `, '${req.body.streetName}', '${req.body.streetNumber}'` +
      ");";
    var result = await executeQuery(query);
    res.send(result);
  } catch (err) {
    res.send({ success: false });
  }
});

module.exports = router;
