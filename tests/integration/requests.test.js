const request = require("supertest");
const executeQuery = require("../../config/db");
const randomWorkspace = require("../random-entries/workspace");
const randomCustomer = require("../random-entries/customer");

var server;
var customers = [];
var workspaces = [];

describe("Send and view requests integration", () => {
  beforeAll(async () => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    workspaces = await randomWorkspace(10, executeQuery);
    customers = await randomCustomer(40, executeQuery);
    server = require("../../index");
  });

  afterAll(() => {
    server.close();
  });

  it("should return same number of requests sent", async () => {
    var wsId = workspaces[Math.floor(Math.random() * workspaces.length)].id;
    // send requests
    var totalRequests = 10;
    for (var i = 0; i < totalRequests; i++) {
      const res = await request(server)
        .post("/checkin/" + wsId)
        .send({ customerId: customers[i].id });
    }
    // get pending requests
    const res = await request(server).get("/dashboard/requests/" + wsId);
    expect(res.body.length).toBe(totalRequests);
  });
});
