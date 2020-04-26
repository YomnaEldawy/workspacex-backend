const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const executeQuery = require("../config/db");
var jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  var customer_firstName = req.body.fn;
  var customer_lastName = req.body.ln;
  var email = req.body.email;
  var password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  var encry_password = await bcrypt.hash(password, salt);
  var query = `insert into Customer (firstName, lastName, email, encrypted_password) values ('${customer_firstName}','${customer_lastName}', '${email}', '${encry_password}');`;
  var result = "";
  try {
    result = await executeQuery(query);
  } catch (error) {
    return res.send("SQL error\n" + error);
  }

  if (result.affectedRows) return res.send({ success: true });
  else return res.send({ success: false, result });
});

router.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var query = "select * from Customer where email='" + email + "';";
  var result = await executeQuery(query);
  if (result.length <= 0) {
    console.log("No account with this email");
    return res
      .status(401)
      .send({ success: false, reason: "E-mail does not exist" });
  }
  var encry_password = result[0].encrypted_password;
  if (bcrypt.compareSync(password, encry_password)) {
    console.log("Passwords match");
  } else {
    console.log("Passwords do not match");
    return res
      .status(401)
      .send({ success: false, reason: "Incorrect email or password" });
  }
  var token = jwt.sign(
    { id: result[0].id, email: result[0].email, type: "customer" },
    process.env.jwtKey
  );
  const userDetails = {
    firstName: result[0].firstName,
    lastName: result[0].lastName,
    email: result[0].email,
    id: result[0].id,
  };
  return res.send({ success: true, token, userDetails });
});

router.get("/:id", async (req, res) => {
  const query = `select firstName, lastName, email from Customer where id = ${req.params.id}`;
  const result = await executeQuery(query);
  res.send(result);
});

module.exports = router;
