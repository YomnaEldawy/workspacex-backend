const request = require("supertest");
const executeQuery = require("../config/db");

describe("CheckOut", () => {
  beforeAll(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });

  it("RequestId doesn't exist", async () => {
    const res = await request(server).post("/CheckOut").send({
      id: "18000000",
    });
    expect(res.body.success).toBe(false);
  });

  it("RequestId exists", async () => {
    await executeQuery(
      "insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('120120','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
    );
    await executeQuery(
      "insert into Customer (id,firstName,lastName,email,encrypted_password) values ('120120','firstdemo','lastdemo','email3@demo.com','131543');"
    );
    await executeQuery(
      "insert into checkInRequest (requestId,customerId, workspaceId) values ('120120','120120','120120');"
    );
    await executeQuery(
      "insert into checkIn (id,requestId,customerId, workspaceId) values ('120120','120120','120120','120120');"
    );
    const res = await request(server).post("/CheckOut").send({
      id: "120120",
    });
    expect(res.body.success).toBe(true);
  });
});
