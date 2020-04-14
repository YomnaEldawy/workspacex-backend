const randomString = require("./random-string");
async function insertWorkspace(executeQuery) {
  const name = randomString(1 + Math.floor(Math.random() * 10));
  const streetName = randomString(1 + Math.floor(Math.random() * 10));
  const streetNumber = Math.floor(Math.random() * 100);
  const city = randomString(1 + Math.floor(Math.random() * 10));
  const latitude = Math.random() * 40;
  const longitude = Math.random() * 40;
  const phone = randomString(14);
  const ws = {
    name,
    streetName,
    streetNumber,
    city,
    latitude,
    longitude,
    phone
  };
  await executeQuery(
    `insert into Workspace (name, streetName, streetNumber, city, latitude, longitude, phone) values ('${name}', '${streetName}', ${streetNumber}, '${city}', ${latitude}, ${longitude}, '${phone}')`
  );
  return ws;
}

module.exports = async function(num, executeQuery) {
  var workspaces = [];
  for (var i = 0; i < num; i++) {
    const ws = await insertWorkspace(executeQuery);
    workspaces.push(ws);
  }
  return workspaces;
};
