'use strict';

// let env = process.env.NODE_ENV || 'development';
// let config = require(__dirname + '/../../config/config.json')[env].oath.qq;
let Qqoath = require('./qqoath').Qqoath,
	config = {};

let qqoath = new Qqoath(config);

module.exports = qqoath;