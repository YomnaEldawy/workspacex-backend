const request = require("supertest");
const executeQuery = require("../config/db");
const randomWorkspace = require("./random-entries/workspace");
const randomCustomer = require("./random-entries/customer");

var server;

async function clearTables() {
  await executeQuery("delete from checkIn");
  await executeQuery("delete from Customer");
  await executeQuery("delete from Workspace");
  await executeQuery(`alter table checkIn auto_increment=1`);
  await executeQuery(`alter table Workspace auto_increment=1`);
  await executeQuery(`alter table Customer auto_increment=1`);
}

describe("signup", () => {
  beforeAll(async () => {
    await clearTables();
    await randomWorkspace(10, executeQuery);
    await randomCustomer(10, executeQuery);
  });

  beforeEach(async () => {
    server = await require("../index");
  });

  afterEach(async () => {
    await server.close();
  });

  afterAll(async () => {
    await clearTables();
  });

  it("should create check in request", async () => {
    const res = await request(server)
      .post("/checkin/3")
      .send({ customerId: 6 });
    expect(res.status).toBe(200);
  });

  it("should return 406 if customer does not exist", async () => {
    const res = await request(server)
      .post("/checkin/3")
      .send({ customerId: 15 });
    expect(res.status).toBe(406);
  });

  it("should return 406 if workspace does not exist", async () => {
    const res = await request(server)
      .post("/checkin/14")
      .send({ customerId: 3 });
    expect(res.status).toBe(406);
  });
});
