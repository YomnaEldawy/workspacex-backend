const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.post("/new/:id", async (req, res) => {
  try {
    console.log(req.body);
    var ws_id = req.params.id;
    var eventNAme = req.body.eventName;
    var version = req.body.version;
    var startsAt=req.body.startsAt;
    var endsAt=req.body.endsAt;
    var description=req.body.description;
    var fees=req.body.fees;
    var query =
      "insert into events(workspaceId,eventNAme,version,startsAt,endsAt,description,fees) values (" +
      ws_id +
      ",'" +
      eventNAme +
      "'," +
      version +
      ",'" +
      startsAt +
      "','" +
      endsAt +
      "','" +
      description +
      "'," +
      fees +
       ");";
    console.log(query);
    var result = await executeQuery(query);
    res.send(result);
  } catch (err) {
    res.send({ success: false });
    console.log(err);
  }
});

router.get("/:id",async(req,res)=>{
	try{
		var ws_id = req.params.id;
		var query="select * from events where workspaceId="+ws_id+";";
		console.log(query);
		var result=await executeQuery(query);
		res.send(result);
	} catch (err){
		res.send({success:false});
		console.log(err);
}

});

module.exports = router;
