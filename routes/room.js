const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/new", async (req, res) => {
  if (
    !req.body.workspaceId ||
    !req.body.pricePerHour ||
    !req.body.pricePerDay ||
    !req.body.description ||
    !req.body.seatsNumber
  ) {
    return res.status(400).send("required field missing");
  }

  const {
    workspaceId,
    pricePerHour,
    pricePerDay,
    description,
    seatsNumber,
  } = req.body;

  var maximumId = `select max(roomId) as maxRoom from workspaceRoom where workspaceId='${workspaceId}'`;
  var roomId = 1;
  try {
    var maxResult = await executeQuery(maximumId);
    if (maxResult && maxResult.length) {
      roomId = maxResult[0].maxRoom + 1;
    }
  } catch (e) {}
  var query = `select * from Workspace where id = '${workspaceId}'`;
  var result = await executeQuery(query);
  if (!result || !result.length)
    return res
      .status(406)
      .send({ success: false, message: "Workspace does not exist" });
  query = `insert into workspaceRoom (roomId, workspaceId, pricePerHour, pricePerDay, description, seatsNumber) values ('${roomId}','${workspaceId}', '${pricePerHour}', '${pricePerDay}', '${description}', '${seatsNumber}')`;
  try {
    result = await executeQuery(query);
    res.send({ success: true, message: "Room added successfully" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Could not add workspace room" + err.message,
    });
  }
});

module.exports = router;
