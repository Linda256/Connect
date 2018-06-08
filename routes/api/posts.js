const express = require('express');
const router = express.Router();

// becouse we use rounter, we don't need to write './routes/api/users/test'
router.get('/test',(req,res) => res.json({msg: "Posts works"}));

module.exports = router;