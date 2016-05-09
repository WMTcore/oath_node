'use strict';

let express = require('express');
let router = express.Router();
let qqoath = require('../../lib');

router.get('/', function(req, res, next) {
	// console.error(qqoath)
	let url = qqoath.GetAuthorizatioCode({
		state: 'test'
	});
	res.json(url);
});

router.get('/getaccesstoken', function(req, res, next) {
	qqoath.GetAccessToken({
		code: ''
	}).then((result) => res.json(result), (error) => res.status(500).json(error))
})

router.get('/getopenid', function(req, res, next) {
	qqoath.GetOpenID({
		access_token: ''
	}).then((result) => res.json(result), (error) => res.status(500).json(error))
})

module.exports = router;