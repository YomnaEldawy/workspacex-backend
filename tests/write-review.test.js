const request = require("supertest");
const executeQuery = require("../config/db");
const randomRequests = require("./random-entries/check-in-requests");

describe("Write reviews", () => {
  let server;
  beforeAll(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });

  it("should not send a review before checking out", async () => {
    const requests = await randomRequests(1, executeQuery);
    var { customer, workspace, requestId } = requests[0];
    var query = `insert into checkIn(requestId, customerId, workspaceId) values (${requestId}, ${customer.id}, ${workspace.id})`;
    await executeQuery(query);
    const res = await request(server)
      .post("/review/" + workspace.id)
      .send({
        customerId: customer.id,
        starRating: 5,
        comment: "Good place",
      });
    expect(res.body.success).toBe(false);
    expect(res.status).toBe(403);
  });

  it("should not send duplicate reviews", async () => {
    const requests = await randomRequests(1, executeQuery);
    var { customer, workspace, requestId } = requests[0];
    var query = `insert into checkIn(requestId, customerId, workspaceId) values (${requestId}, ${customer.id}, ${workspace.id})`;
    const queryResult = await executeQuery(query);
    query = `insert into checkOut (checkInId) values (${queryResult.insertId})`;
    await executeQuery(query);
    let res = await request(server)
      .post("/review/" + workspace.id)
      .send({
        customerId: customer.id,
        starRating: 5,
        comment: "Good place",
      });

    res = await request(server)
      .post("/review/" + workspace.id)
      .send({
        customerId: customer.id,
        starRating: 5,
        comment: "Good place",
      });
    expect(res.body.success).toBe(false);
    expect(res.status).toBe(406);
  });

  it("should send the review successfully", async () => {
    const requests = await randomRequests(1, executeQuery);
    var { customer, workspace, requestId } = requests[0];
    var query = `insert into checkIn(requestId, customerId, workspaceId) values (${requestId}, ${customer.id}, ${workspace.id})`;
    const queryResult = await executeQuery(query);
    query = `insert into checkOut (checkInId) values (${queryResult.insertId})`;
    await executeQuery(query);
    let res = await request(server)
      .post("/review/" + workspace.id)
      .send({
        customerId: customer.id,
        starRating: 5,
        comment: "Good place",
      });
    expect(res.body.success).toBe(true);
    expect(res.status).toBe(200);
  });
});
