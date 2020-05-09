const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.get("/customer-status/:workspaceId/:customerId", async (req, res) => {
  if (!req.params.customerId || !req.params.workspaceId)
    return res.status(400).send({
      success: false,
      message: "Customer id and workspace id are required",
    });
  const { workspaceId, customerId } = req.params;
  var query = `select * from Reviews where workspaceId = '${workspaceId}' and customerId = '${customerId}'`;
  var result = await executeQuery(query);
  if (result && result.length)
    return res.send({
      success: true,
      count: 1,
      comment: result[0].comment,
      starRating: result[0].starRating,
    });

  query = `select workspaceId from checkOut, checkIn where checkInId = checkIn.id and customerId = '${customerId}' and workspaceId='${workspaceId}'`;
  result = await executeQuery(query);

  if (!result || !result.length) {
    return res.send({
      success: false,
      message: `Customer with id ${customerId} never checked out of this workspace before`,
    });
  }

  return res.send({ success: true, count: 0 });
});
router.post("/:workspaceId", async (req, res) => {
  if (!req.body.customerId || !req.body.starRating || !req.body.comment)
    return res.status(400).send({
      success: false,
      message: `customer Id, star rating and comment are required`,
    });

  var customerId = req.body.customerId;
  var workspaceId = req.params.workspaceId;
  var starRating = req.body.starRating;
  var comment = req.body.comment;

  var query = `select workspaceId from checkOut, checkIn where checkInId = checkIn.id and customerId = '${req.body.customerId}' and workspaceId='${req.params.workspaceId}'`;
  var result = await executeQuery(query);

  if (!result || !result.length) {
    return res.status(403).send({
      success: false,
      message: `Customer with id ${req.body.customerId} never checked out of this workspace before`,
    });
  }

  query = `select customerId, workspaceId from Reviews where customerId='${req.body.customerId}' and workspaceId='${req.params.workspaceId}'`;
  result = await executeQuery(query);
  if (result && result.length) {
    return res.status(406).send({
      success: false,
      message: `A review by this customer already exists`,
    });
  }
  query = `insert into Reviews(customerId, workspaceId, starRating, comment) values ('${customerId}', '${workspaceId}', '${starRating}', '${comment}')`;
  try {
    result = await executeQuery(query);
    res.send({ success: true, message: "review successfully submitted" });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
});

router.put("/", async (req, res) => {
  if (
    !req.body.customerId ||
    !req.body.starRating ||
    !req.body.comment ||
    !req.body.workspaceId
  )
    return res.status(400).send({
      success: false,
      message: `customer id, workspace id, star rating and comment are required`,
    });
  var customerId = req.body.customerId;
  var workspaceId = req.body.workspaceId;
  var starRating = req.body.starRating;
  var comment = req.body.comment;

  query = `select customerId, workspaceId from Reviews where customerId='${customerId}' and workspaceId='${workspaceId}'`;
  result = await executeQuery(query);
  if (!result || !result.length) {
    return res.status(404).send({
      success: false,
      message: `This user never submitted a review before`,
    });
  }
  query = `update Reviews set starRating='${starRating}', comment='${comment}' where customerId='${customerId}' and workspaceId='${workspaceId}'`;
  try {
    result = await executeQuery(query);
    res.send({ success: true, message: "review successfully updated" });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
});
module.exports = router;
