const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.get("/types", async (req, res) => {
  var query = `select * from reportTypes`;
  var result = await executeQuery(query);
  res.send(result);
});

router.post("/status", async (req, res) => {
  if (!req.body.customerId || !req.body.workspaceId) {
    console.log(req.body);
    return res.status(400).send({
      success: false,
      message: "customerId, workspaceId and reportType are required",
    });
  }
  const { customerId, workspaceId } = req.body;

  var query = `select * from checkIn where customerId = '${customerId}' and workspaceId='${workspaceId}' and requestId not in (select checkInId from checkOut);`;
  var result = await executeQuery(query);
  if (!result || !result.length)
    return res.send({
      success: false,
      message: "This customer is not currently checked in",
    });
  return res.send({
    success: true,
    message: "Customer is currently checked in",
  });
});

router.post("/", async (req, res) => {
  if (!req.body.customerId || !req.body.workspaceId || !req.body.reportType)
    return res.status(400).send({
      success: false,
      message: "customerId, workspaceId and reportType are required",
    });
  const { customerId, workspaceId, reportType } = req.body;

  // check if user is currently checked in
  var query = `select * from checkIn where customerId = '${customerId}' and requestId not in (select checkInId from checkOut);`;
  var result = await executeQuery(query);
  if (!result || !result.length)
    return res.status(403).send({
      success: false,
      message: "This customer is not currently checked in",
    });

  // check if the report was already sent
  query = `select * from liveReports where workspaceId='${workspaceId}' and customerId = '${customerId}' and reportType='${reportType}'and {fn TIMESTAMPDIFF(SQL_TSI_MINUTE,issuedAt, current_timestamp)} < 120;`;
  result = await executeQuery(query);
  if (result && result.length) {
    return res.send({
      success: true,
      message: "Report already submitted",
      result,
    });
  }

  // submit the report
  query = `insert into liveReports (customerId, workspaceId, reportType) values ('${customerId}', '${workspaceId}', '${reportType}')`;
  try {
    result = await executeQuery(query);
    return res.send({ success: true, message: "Report submitted", result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Error submitting report" });
  }
});
module.exports = router;
