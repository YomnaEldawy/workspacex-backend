const express = require("express");
const router = express.Router();
const staffService = require("../services/staff");

router.post("/signup", async (req, res) => {
  const result = await staffService.register(req.body);
  res.send(result);
});
router.post("/login", async (req, res) => {
  const result = await staffService.login(req.body.email, req.body.password);
  res.send(result);
});

router.get("/", async (req, res) => {
  res.send("Hello Android ;)");
});
module.exports = router;
