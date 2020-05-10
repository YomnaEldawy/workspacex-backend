var express = require("express");
var app = express();
var cors = require("cors");
var randomString = require("../tests/random-entries/random-string");
const executeQuery = require("../config/db");

app.use(cors());

var base64Img = require("base64-img");

function base64ToImg(data, folderName, fileName) {
  return new Promise((resolve, reject) => {
    base64Img.img(data, folderName, fileName, function (err, filepath) {
      console.log(filepath);
      if (filepath) resolve(filepath);
      if (err) reject(err);
    });
  });
}

function imgToBase64(path) {
  return new Promise((resolve, reject) => {
    base64Img.base64(path, function (err, data) {
      if (err) reject(err);
      if (data) resolve(data);
    });
  });
}
app.get("/:workspaceId", async (req, res) => {
  var query = `select * from workspacePhotos where workspaceId = '${req.params.workspaceId}'`;
  var result = await executeQuery(query);
  var photos = [];
  for (var i = 0; i < result.length; i++) {
    photos.push({ img: await imgToBase64(result[i].photoUrl) });
  }
  res.send({ result, photos });
});

app.post("/upload", async (req, res) => {
  if (!req.body.description || !req.body.img || !req.body.workspaceId) {
    return res.status(400).send({ success: false, message: "Bad request" });
  }
  var { workspaceId, description } = req.body;
  var path = await base64ToImg(req.body.img, "uploads", randomString(6));
  var query = `insert into workspacePhotos(workspaceId, photoUrl, description) values ('${workspaceId}', '${path}', '${description}')`;
  try {
    var result = await executeQuery(query);
    res.send({ success: true, message: path });
  } catch (error) {
    res.send({ success: false });
  }
});

module.exports = app;
