'use strict';

let request = require('request');
let _ = require('lodash');
let qs = require('querystring');

exports.getHttpResponseGET = function(url) {
	var object = this;
	return new Promise(function(resolve, reject) {
		request.get(url, function(error, res, body) {
				if (error || /error/.test(body))
					return reject(body);
			return resolve(body);
		})
	})
};