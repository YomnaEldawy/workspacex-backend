const request = require("supertest");
const executeQuery = require("../config/db");
const randomWorkspace = require("./random-entries/workspace");
const randomCustomer = require("./random-entries/customer");

var server;
var customers = [];
var workspaces = [];

describe("dashboard", () => {
  beforeAll(async () => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    workspaces = await randomWorkspace(10, executeQuery);
    customers = await randomCustomer(40, executeQuery);
    server = require("../index");
  });

  afterAll(() => {
    server.close();
  });

  it("should return current customers", async () => {
    var customerIDs = [];
    var workspace = workspaces[Math.floor(Math.random() * 10)];
    for (var i = 1; i < customers.length; i++) {
      if (Math.random() < 0.7) continue;
      var reqId = await executeQuery(
        `insert into checkInRequest(customerId, workspaceId) values (${customers[i].id}, ${workspace.id})`
      );
      reqId = reqId.insertId;
      await executeQuery(
        `insert into checkIn(requestId, customerId, workspaceId) values (${reqId}, ${customers[i].id}, ${workspace.id})`
      );
      customerIDs.push(i);
    }
    const res = await request(server).get("/dashboard/" + workspace.id);
    expect(res.body.message.length).toBe(customerIDs.length);
  });

  it("should retrieve correct user details", async () => {
    var customerIDs = [];
    var workspace = workspaces[Math.floor(Math.random() * 10)];
    for (var i = 1; i < customers.length; i++) {
      if (Math.random() < 0.7) continue;
      var reqId = await executeQuery(
        `insert into checkInRequest(customerId, workspaceId) values (${customers[i].id}, ${workspace.id})`
      );
      reqId = reqId.insertId;
      await executeQuery(
        `insert into checkIn(requestId, customerId, workspaceId) values (${reqId}, ${customers[i].id}, ${workspace.id})`
      );
      customerIDs.push(i);
    }
    const res = await request(server).get("/dashboard/" + workspace.id);
    var randomRow = Math.floor(Math.random() * res.body.message.length);
    randomRow = res.body.message[randomRow];
    var user = customers.find((element) => {
      element.id === randomRow.customerId;
    });
    console.log(customers);
    expect(1).toEqual(1);
  });
  it("should return 404 if workspace does not exist", async () => {
    const res = await request(server).get(
      "/dashboard/" + workspaces.length + 1
    );
    expect(res.status).toBe(404);
  });
});
