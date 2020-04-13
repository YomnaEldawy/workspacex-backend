const executeQuery = require("../config/db");

async function isValidWorkspacdId(id) {
  const query = `select * from Workspace where id = ${id}`;
  const res = await executeQuery(query);
  if (res.length > 0) return true;
  return false;
}

async function isValidUserId(id) {
  const query = `select * from Customer where id = ${id}`;
  const res = await executeQuery(query);
  console.log("service layer:", res);
  if (res.length > 0) return true;
  return false;
}

module.exports.isValidWorkspacdId = isValidWorkspacdId;
module.exports.isValidUserId = isValidUserId;
