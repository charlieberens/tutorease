const express = require('express');
const router = express.Router();

// Get
router.get('/', (req, res) => {
	res.send('You are on questions')
});

module.exports = router;