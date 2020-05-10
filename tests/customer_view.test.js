const request = require("supertest");
const executeQuery = require("../config/db");
const randomCustomer = require("./random-entries/customer");
const randomWorkspace = require("./random-entries/workspace");

describe("customer_view", () => {
  let server;
  beforeAll(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");
    done();
  });

  it("Check view report", async () => {
    var customer = await randomCustomer(1, executeQuery);
    var workspace = await randomWorkspace(1, executeQuery);

    await executeQuery(
      "insert into reportTypes (reportId,reportDescription) values ('10','wifi is slow');"
    );
    await executeQuery(
      `insert into liveReports (id,customerId, workspaceId, reportType) values ('100','${customer[0].id}','${workspace[0].id}','10');`
    );
    const res = await request(server)
      .get("/customer_view/reports/" + workspace[0].id)
      .send({});
    expect(res.body[0].reportDescription).toBe("wifi is slow");
    expect(res.body.length).toBe(1);
  });

  it("Check view review", async () => {
    var customer = await randomCustomer(1, executeQuery);
    var workspace = await randomWorkspace(1, executeQuery);

    await executeQuery(
      `insert into Reviews (customerId, workspaceId,starRating,comment) values ('${customer[0].id}','${workspace[0].id}','4.5', 'Not bad');`
    );
    const res = await request(server)
      .get("/customer_view/reviews/" + workspace[0].id)
      .send({});
    var success = false;
    if (res.body.length != 0) {
      success = true;
    } else {
      success = false;
    }
    expect(res.body[0].comment).toBe("Not bad");
    expect(res.body.length).toBe(1);
  });

  it("Check view event", async () => {
    var workspace = await randomWorkspace(1, executeQuery);

    await executeQuery(
      `insert into events (eventName, workspaceId, version, startsAt, endsAt, description, fees) values ('eventdemo','${workspace[0].id}','1', '2020-03-02 13:30:00', '2020-05-02 13:30:00', 'Good event', '155.4');`
    );
    const res = await request(server)
      .get("/customer_view/events/" + workspace[0].id)
      .send({});
    expect(res.body[0].fees).toBe(155.4);
    expect(res.body.length).toBe(1);
  });

  it("Check view amenities", async () => {
    var workspace = await randomWorkspace(1, executeQuery);
    await executeQuery(
      `insert into workspaceRoom (workspaceId, roomId, pricePerHour, pricePerDay, description, seatsNumber) values ('${workspace[0].id}','1','10', '100','Nice Room', '20');`
    );
    await executeQuery(
      `insert into workspaceRoom (workspaceId, roomId, pricePerHour, pricePerDay, description, seatsNumber) values ('${workspace[0].id}','2','10', '100','Nice Room', '20');`
    );
    await executeQuery(
      `insert into amenities(amenityId, amenityName) values ('1', 'kitchen')`
    );
    await executeQuery(
      `insert into amenities(amenityId, amenityName) values ('2', 'prayer room')`
    );
    await executeQuery(
      `insert into workspaceAmenities (workspaceId, roomId, amenityId, numberOfAmenities) values ('${workspace[0].id}','1','1','3');`
    );
    await executeQuery(
      `insert into workspaceAmenities (workspaceId, roomId, amenityId, numberOfAmenities) values ('${workspace[0].id}','2','2','2');`
    );
    const res = await request(server)
      .get("/customer_view/amenities/" + workspace[0].id)
      .send({});
    expect(res.body[1].roomId).toBe(2);
    expect(res.body.length).toBe(2);
  });

  it("Check view rooms", async () => {
    await executeQuery(
      "insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10104','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
    );
    await executeQuery(
      "insert into workspaceRoom (workspaceId, roomId, pricePerHour, pricePerDay, description, seatsNumber) values ('10104','1','10', '100','Nice Room', '20');"
    );
    const res = await request(server)
      .get("/customer_view/room/10104")
      .send({});
    expect(res.body[0].seatsNumber).toBe(20);
    expect(res.body.length).toBe(1);
  });

  it("Check view photos", async () => {
    await executeQuery(
      "insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10105','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
    );
    await executeQuery(
      "insert into workspacePhotos (workspaceId, photoUrl, photoId, description) values(10105,LOAD_FILE('/var/lib/mysql-files/images.png'),5,'Duck photo');"
    );
    const res = await request(server)
      .get("/customer_view/photos/10105")
      .send({});
    expect(res.body[0].description).toBe("Duck photo");
    expect(res.body.length).toBe(1);
  });
});
