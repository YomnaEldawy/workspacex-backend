const express = require('express');
const router = express.Router();
const staffService = require('../services/staff');

router.post('/signup', async (req,res) => {
    const result = await staffService.register(req.body);
    res.send(result);
})

module.exports = router;