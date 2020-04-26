const request = require("supertest");
const executeQuery = require("../config/db");

describe("Approve", () => {
  let server;
  beforeEach(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });

  it("RequestId doesn't exist", async () => {
    const res = await request(server).post("/Approve").send({
      id: "0",
    });
    expect(res.body.success).toBe(false);
  });

  it("RequestId exists", async () => {
    await executeQuery(
      "insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('1010','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
    );
    await executeQuery(
      "insert into Customer (id,firstName,lastName,email,encrypted_password) values ('1010','firstdemo','lastdemo','email@demo.com','131543');"
    );
    await executeQuery(
      "insert into checkInRequest (requestId,customerId, workspaceId) values ('1010','1010','1010');"
    );
    const res = await request(server).post("/Approve").send({
      id: "1010",
    });
    expect(res.body.success).toBe(true);
  });
});
