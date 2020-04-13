const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var query =
    "select encrypted_password from Customer where email='" + email + "';";
  var result = await executeQuery(query);
  if (result.length <= 0) {
    console.log("No account with this email");
    return res.send({ success: false });
  }
  var encry_password = result[0].encrypted_password;
  if (bcrypt.compareSync(password, encry_password)) {
    console.log("Passwords match");
  } else {
    console.log("Passwords do not match");
    return res.send({ success: false });
  }
  return res.send({ success: true });
});

router.post("/signup", async (req, res) => {
  try {
    var customer_firstName = req.body.fn;
    var customer_lastName = req.body.ln;
    var email = req.body.email;
    var password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    var encry_password = await bcrypt.hash(password, salt);
    var query =
      "insert into Customer (firstName,lastName,email,encrypted_password) values ('" +
      customer_firstName +
      "','" +
      customer_lastName +
      "','" +
      email +
      "','" +
      encry_password +
      "');";

    var result = await executeQuery(query);
    if (result.affectedRows) res.send({ success: true });
    else res.send({ success: false, result });
  } catch (err) {
    console.log(err);
    res.send({ success: false, err });
  }
});

module.exports = router;
