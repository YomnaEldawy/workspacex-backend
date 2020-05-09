const randomCustomer = require("./customer");
const randomWorkspace = require("./workspace");

module.exports = async function (num, executeQuery) {
  var workspacesCount = 1 + Math.floor(Math.random() * 10);
  var customersCount = num;
  var workspaces = await randomWorkspace(workspacesCount, executeQuery);
  var customers = await randomCustomer(customersCount, executeQuery);
  var requests = [];
  for (var i = 0; i < customersCount; i++) {
    var ws = workspaces[Math.floor(Math.random() * workspacesCount)];
    var query = `insert into checkInRequest(customerId, workspaceId) values ('${customers[i].id}', '${ws.id}')`;
    try {
      var result = await executeQuery(query);
      var requestId = result.insertId;
      requests.push({ customer: customers[i], workspace: ws, requestId });
    } catch (err) {}
  }
  return requests;
};
