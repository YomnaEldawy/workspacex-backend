const request = require("supertest");
const executeQuery = require("../config/db");

describe("Reject", () => {
  let server;
  beforeAll(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });
  it("Reject a requestId", async () => {
    await executeQuery(
      "insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('12345','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
    );
    await executeQuery(
      "insert into Customer (id,firstName,lastName,email,encrypted_password) values ('12345','firstdemo','lastdemo','email2@demo.com','131543');"
    );
    await executeQuery(
      "insert into checkInRequest (requestId,customerId, workspaceId) values ('12345','12345','12345');"
    );
    const res = await request(server).post("/Reject").send({
      id: "1",
    });
    expect(res.body.success).toBe(true);
  });
});
