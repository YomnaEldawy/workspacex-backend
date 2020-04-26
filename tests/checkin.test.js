const request = require("supertest");
const executeQuery = require("../config/db");
const randomWorkspace = require("./random-entries/workspace");
const randomCustomer = require("./random-entries/customer");

var server;

var customers = [];
var workspaces = [];

describe("signup", () => {
  beforeEach(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });

  beforeAll(async () => {
    workspaces = await randomWorkspace(10, executeQuery);
    customers = await randomCustomer(10, executeQuery);
  });

  afterEach(async () => {
    await server.close();
  });

  it("should create check in request", async () => {
    const ws = workspaces[Math.floor(Math.random() * 10)];
    const usr = customers[Math.floor(Math.random() * 10)];
    const res = await request(server)
      .post("/checkin/" + ws.id)
      .send({ customerId: usr.id });
    expect(res.status).toBe(200);
  });

  it("should not send multiple requests", async () => {
    const ws = workspaces[Math.floor(Math.random() * 10)];
    const usr = customers[Math.floor(Math.random() * 10)];
    var res = await request(server)
      .post("/checkin/" + ws.id)
      .send({ customerId: usr.id });
    res = await request(server)
      .post("/checkin/" + ws.id)
      .send({ customerId: usr.id });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Request already sent");
  });
  it("should return 406 if customer does not exist", async () => {
    const res = await request(server)
      .post("/checkin/3")
      .send({ customerId: 0 });
    expect(res.status).toBe(406);
  });

  it("should return 406 if workspace does not exist", async () => {
    const res = await request(server)
      .post("/checkin/0")
      .send({ customerId: 3 });
    expect(res.status).toBe(406);
  });
});
