const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const executeQuery = require("../config/db");

router.post('/', async (req, res) => {
        var id = req.body.id;
        var query1 = "select * from checkInRequest where requestId ='" + id + "';";
        var res1 = await executeQuery(query1);
  	if(res1.length != 0){
	   var customerId=res1[0].customerId;
	   var workspaceId=res1[0].workspaceId;
   	   var query2 = "insert into checkIn(requestId, customerId, workspaceId) values ('" +
                         id +
     			 "','" +
      			customerId +
      			"','" +
      			workspaceId +
      			"');";
   	      var result = await executeQuery(query2);
   	      return res.send({ success: true, result });
	   }else{
    	      return res.send({ success: false});
  	}
});
module.exports = router;
