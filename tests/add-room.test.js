const request = require("supertest");
const executeQuery = require("../config/db");
const randomWorkspaces = require("./random-entries/workspace");

describe("Add a room", () => {
  let server;
  beforeAll(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });

  it("should add room successfully", async () => {
    const workspace = await randomWorkspaces(1, executeQuery);
    expect(workspace.length).toBeTruthy();
    var { id } = workspace[0];
    const res = await request(server).post("/room/new").send({
      workspaceId: id,
      pricePerHour: 40,
      pricePerDay: 200,
      description: "A large room for meetings",
      seatsNumber: 35,
      roomId: 1,
    });
    expect(res.body.success).toBe(true);
  });

  it("should not add a room for a non-existing workspace", async () => {
    const res = await request(server).post("/room/new").send({
      workspaceId: 90,
      pricePerHour: 40,
      pricePerDay: 200,
      description: "A large room for meetings",
      seatsNumber: 35,
      roomId: 1,
    });
    expect(res.status).toBe(406);
  });
});
