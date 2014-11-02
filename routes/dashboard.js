var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function (req, res) {
	console.log(globalEnv);
	var data = {
		environment: globalEnv
	};
	res.render('dashboard', data);
});

module.exports = router;					