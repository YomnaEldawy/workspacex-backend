const express = require("express");
const router = express.Router();
const checkInService = require("../services/check_in");
const executeQuery = require("../config/db");

router.get("/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var validWorkspace = await checkInService.isValidWorkspacdId(wsId);
  if (!validWorkspace) return res.status(404).send("Workspace does not exist");
  const query = `select customerId, workspaceId, time, checkIn.id as checkInId, firstName, lastName, email from checkIn, Customer where workspaceId = ${wsId} and checkIn.customerId=Customer.id and not exists (select checkInId from checkOut where checkInId = checkIn.id);`;
  const result = await executeQuery(query);
  res.send({ success: true, message: result });
});

module.exports = router;
