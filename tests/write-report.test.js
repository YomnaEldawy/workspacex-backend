const request = require("supertest");
const executeQuery = require("../config/db");
const randomRequests = require("./random-entries/check-in-requests");

describe("Write report", () => {
  let server;
  beforeAll(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    await executeQuery(
      `insert into reportTypes (reportDescription) values ('No internet connection')`
    );
    await executeQuery(
      `insert into reportTypes (reportDescription) values ('No seats available')`
    );
    done();
  });

  it("should not send a report before checking in", async () => {
    const requests = await randomRequests(1, executeQuery);
    var { customer, workspace } = requests[0];
    const res = await request(server).post("/report/").send({
      workspaceId: workspace.id,
      customerId: customer.id,
      reportType: 1,
    });
    expect(res.body.success).toBe(false);
    expect(res.status).toBe(403);
  });

  it("should not send duplicate reports within 120 minutes", async () => {
    const requests = await randomRequests(1, executeQuery);
    var { customer, workspace, requestId } = requests[0];
    var query = `insert into checkIn(requestId, customerId, workspaceId) values (${requestId}, ${customer.id}, ${workspace.id})`;
    await executeQuery(query);
    let res = await request(server).post("/report/").send({
      workspaceId: workspace.id,
      customerId: customer.id,
      reportType: 1,
    });

    res = await request(server).post("/report/").send({
      workspaceId: workspace.id,
      customerId: customer.id,
      reportType: 1,
    });

    expect(res.body.message).toEqual("Report already submitted");
  });

  it("should send the report successfully", async () => {
    const requests = await randomRequests(1, executeQuery);
    var { customer, workspace, requestId } = requests[0];
    var query = `insert into checkIn(requestId, customerId, workspaceId) values (${requestId}, ${customer.id}, ${workspace.id})`;
    await executeQuery(query);
    let res = await request(server).post("/report/").send({
      workspaceId: workspace.id,
      customerId: customer.id,
      reportType: 1,
    });

    expect(res.body.success).toEqual(true);
    expect(res.body.message).toContain("Report submitted");
  });
});
