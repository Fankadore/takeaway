const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('<p>ACCOUNT ROUTE!</p>');
});

router.post('/', (req, res) => {
	
});



module.exports = router;
