const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/new", async (req, res) => {
  try {
    var ws_name = req.body.ws_name;
    var city = req.body.city;
    var phone = req.body.phone;
    if (!ws_name || !phone) {
      res.send({ success: false });
    }
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
