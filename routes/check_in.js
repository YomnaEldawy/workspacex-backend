const express = require("express");
const router = express.Router();
const checkInService = require("../services/check_in");
const executeQuery = require("../config/db");

router.post("/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  const customerId = req.body.customerId;
  const query = `insert into checkInRequest (customerId, workspaceId) values ('${customerId}', '${wsId}')`;
  var validCustomer = await checkInService.isValidUserId(customerId);
  var validWorkspace = await checkInService.isValidWorkspacdId(wsId);
  if (!validCustomer) return res.status(406).send("Customer does not exist");
  if (!validWorkspace) return res.status(406).send("Workspace does not exist");
  await executeQuery(query);
  res.send({ success: true, message: "Request sent" });
});

module.exports = router;
