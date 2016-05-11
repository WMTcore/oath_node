'use strict';

let express = require('express');
let router = express.Router();
let wboath = require('../../lib').wboath;
let _ = require('lodash');

let redirect_uri = '';

router.get('/', function(req, res, next) {
	let url = wboath.GetAuthorizatioCode({
		state: wboath.state(),
		redirect_uri: redirect_uri,
		// display:'mobile'
	});
	res.json(url);
});

router.get('/getaccesstoken', function(req, res, next) {
	wboath.GetAccessToken({
		code: '',
		redirect_uri: redirect_uri
	}).then((result) => res.json(result), (error) => res.status(500).json(error))
})

router.get('/getopenid', function(req, res, next) {
	wboath.GetOpenID({
		access_token: ''
	}).then((result) => res.json(result), (error) => res.status(500).json(error))
});

router.get('/wboath', function(req, res, next) {
	let e = req.query,
		result = {};
	if (e.state != wboath.state() || !e.code)
		return res.status(400).json(0);
	wboath.GetAccessToken({
		code: e.code,
		redirect_uri: redirect_uri
	}).then((tokens) => {
		return res.json(tokens);
	}, (error) => {
		throw error;
	}).catch((error) => {
		return res.status(500).json(error)
	})
})


module.exports = router;