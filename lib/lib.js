'use strict';

let request = require('request');
let _ = require('lodash');
let qs = require('querystring');

exports.GetHttpResponseGET = (url) => {
	return new Promise((resolve, reject) => {
		request.get(url, (error, res, body) => {
			if (error || /error/.test(body))
				return reject(body);
			return resolve(body);
		})
	})
};

exports.GetHttpResponsePOST = (url, postData) => {
	return new Promise((resolve, reject) => {
		request.post({
			url: url,
			form: postData
		}, (error, res, body) => {
			if (error || /error/.test(body))
				return reject(body);
			return resolve(body);
		})
	})
};

exports.GetState = () => {
	var a = Math.random();
	return () => a;
};