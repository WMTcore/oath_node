'use strict';

let express = require('express');
let router = express.Router();
let qqoath = require('../../lib');
let _ = require('lodash');

let redirect_uri = '';

router.get('/', function(req, res, next) {
	let url = qqoath.GetAuthorizatioCode({
		state: qqoath.state(),
		redirect_uri: redirect_uri
	});
	res.json(url);
});

router.get('/getaccesstoken', function(req, res, next) {
	qqoath.GetAccessToken({
		code: '',
		redirect_uri: redirect_uri
	}).then((result) => res.json(result), (error) => res.status(500).json(error))
})

router.get('/getopenid', function(req, res, next) {
	qqoath.GetOpenID({
		access_token: ''
	}).then((result) => res.json(result), (error) => res.status(500).json(error))
});

router.get('/qqoath', function(req, res, next) {
	let e = req.query,
		result = {};
	if (e.usercancel || e.state != qqoath.state() || !e.code)
		return res.status(400).json(0);
	qqoath.GetAccessToken({
		code: e.code,
		redirect_uri: redirect_uri
	}).then((tokens) => {
		result = tokens;
		return qqoath.GetOpenID({
			access_token: tokens.access_token
		})
	}, (error) => {
		throw error;
	}).then((openid) => {
		_.merge(result, openid);
		return res.json(result);
	}, (error) => {
		throw error;
	}).catch((error) => {
		return res.status(500).json(error)
	})
})


module.exports = router;