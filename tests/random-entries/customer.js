const randomString = require("./random-string");
const bcrypt = require("bcrypt");

async function insertCustomer(executeQuery) {
  const firstName = randomString(Math.random() * 10 + 1);
  const lastName = randomString(Math.random() * 10 + 1);
  const email = `${randomString(Math.random() * 10 + 1)}@${randomString(
    Math.random(10) + 1
  )}.${randomString(Math.random(4) + 1)}`;
  const password = randomString(Math.random(10) + 1);
  const salt = await bcrypt.genSalt(10);
  var encrypted_pass = await bcrypt.hash(password, salt);
  const user = { firstName, lastName, email, encrypted_pass, password };
  const query = `insert into Customer (firstName, lastName, email, encrypted_password) values ('${firstName}', '${lastName}', '${email}', '${encrypted_pass}')`;
  await executeQuery(query);
  return user;
}

module.exports = async function(num, executeQuery) {
  var users = [];
  for (var i = 0; i < num; i++) {
    var curUser = await insertCustomer(executeQuery);
    users.push(curUser);
  }
  return users;
};
