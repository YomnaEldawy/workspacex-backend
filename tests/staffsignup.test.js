const request = require("supertest");
const executeQuery = require("../config/db");
var server;

async function clearTables() {
  await executeQuery("delete from StaffMember");
}

describe("signup", () => {
  beforeAll(async () => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
  });

  afterEach(async () => {
    await clearTables();
  });

  beforeEach(async () => {
    server = await require("../index");
  });

  afterEach(async () => {
    await server.close();
  });

  it("should register user", async () => {
    const res = await request(server)
      .post("/staff/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "jdoe@gmail.com",
        password: "123456"
      });
    expect(res.body.success).toBe(true);
  });

  it("should not register duplicate users", async () => {
    const res = await request(server)
      .post("/staff/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "123456"
      });
    const res2 = await request(server)
      .post("/staff/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "123456"
      });
    expect(res2.body.success).toBe(false);
  });
});
