const request = require("supertest");
const executeQuery = require("../config/db");

async function clearTables() {
  await executeQuery("delete from liveReports");
  await executeQuery("delete from reportTypes");
  await executeQuery("delete from workspaceRoom");
  await executeQuery("delete from amenities");
  await executeQuery("delete from workspaceAmenities");
  await executeQuery("delete from Reviews");
  await executeQuery("delete from events");
  await executeQuery("delete from Customer");
  await executeQuery("delete from Workspace");
}

describe("customer_view", () => {
  let server;
  beforeEach(async (done) => {
    process.env.PORT = Math.floor(Math.random() * 50000 + 3000);
    server = await require("../index");   
    done();
  });
  afterEach(async () => {
    await clearTables();
  });
  it("Check view report", async () => {
        await executeQuery("insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10100','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
        );
       await executeQuery("insert into Customer (id,firstName,lastName,email,encrypted_password) values ('1000','firstdemo','lastdemo','email@demo.com','131543');"
	);
       await executeQuery("insert into reportTypes (reportId,reportDescription) values ('10','wifi is slow');"
	);
	await executeQuery("insert into liveReports (id,customerId, workspaceId, reportType) values ('100','1000','10100','10');"
	);
    const res = await request(server).get("/customer_view/reports/10100").send({});
     expect(res.body[0].reportDescription).toBe('wifi is slow');
     expect(res.body.length).toBe(1);
  });
  
  it("Check view review", async () => {
        await executeQuery("insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10100','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
        );
       await executeQuery("insert into Customer (id,firstName,lastName,email,encrypted_password) values ('1000','firstdemo','lastdemo','email@demo.com','131543');"
	);
       await executeQuery("insert into Reviews (customerId, workspaceId,starRating,comment) values ('1000','10100','4.5', 'Not bad');"
	);
    const res = await request(server).get("/customer_view/reviews/10100").send({});
    var success = false;
    if(res.body.length != 0){
    	success = true;
    }else{
       success = false;
     }
     expect(res.body[0].comment).toBe('Not bad');
     expect(res.body.length).toBe(1);
  });

  it("Check view event", async () => {
        await executeQuery("insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10100','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
        );
       await executeQuery("insert into Customer (id,firstName,lastName,email,encrypted_password) values ('1000','firstdemo','lastdemo','email@demo.com','131543');"
	);
       await executeQuery("insert into events (eventName, workspaceId, version, startsAt, endsAt, description, fees) values ('eventdemo','10100','1', '2020-03-02 13:30:00', '2020-05-02 13:30:00', 'Good event', '155.4');"
	);
    const res = await request(server).get("/customer_view/events/10100").send({});
     expect(res.body[0].fees).toBe(155.4);
     expect(res.body.length).toBe(1);
  });

  it("Check view amenities", async () => {
        await executeQuery("insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10100','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
        );
       await executeQuery("insert into amenities (amenityId, amenityName) values ('1','wifi');"
	);
       await executeQuery("insert into workspaceAmenities (workspaceId, roomId, amenityId, numberOfAmenities) values ('10100','1','1','3');"
	);
       await executeQuery("insert into workspaceAmenities (workspaceId, roomId, amenityId, numberOfAmenities) values ('10100','2','1','2');"
	);
    const res = await request(server).get("/customer_view/amenities/10100").send({});
    expect(res.body[1].roomId).toBe(2);
    expect(res.body.length).toBe(2);
  });

  it("Check view rooms", async () => {
        await executeQuery("insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10100','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
        );
       await executeQuery("insert into workspaceRoom (workspaceId, roomId, pricePerHour, pricePerDay, description, seatsNumber) values ('10100','1','10', '100','Nice Room', '20');"
	);
    const res = await request(server).get("/customer_view/room/10100/1").send({});
     expect(res.body[0].seatsNumber).toBe(20);
     expect(res.body.length).toBe(1);
  });

  it("Check view photos", async () => {
        await executeQuery("insert into Workspace(id,name,city,phone, streetName, streetNumber) values ('10100','demoworkspace','democity','13515','demostreetName','demostreetNumber');"
        );
       await executeQuery("insert into workspacePhotos (workspaceId, photoUrl, photoId, description) values(10100,LOAD_FILE('/var/lib/mysql-files/images.png'),5,'Duck photo');"
	);
    const res = await request(server).get("/customer_view/photos/10100").send({});
     expect(res.body[0].description).toBe('Duck photo');
     expect(res.body.length).toBe(1);
  });
});
