const express = require('express');
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

// becouse we use rounter, we don't need to write './routes/api/users/test'
router.get('/test',(req,res) => res.json({msg: "Users works"})); //res.json will automatically send code 200. res.json is same as res.send but send output json.

module.exports = router; // export router for server.js to pick it up

