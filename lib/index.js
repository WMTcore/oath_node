'use strict';

// let env = process.env.NODE_ENV || 'development';
// let config = require(__dirname + '/../../config/config.json')[env].oath.qq;
let Qqoath = require('./qqoath').Qqoath,
    Wboath=require('./wboath').Wboath,
	config = {},
	oath = {};

oath.qqoath = new Qqoath({
	appid: '',
	appkey: ''
});

oath.wboath = new Wboath({
	appkey: '',
	appsecret: ''
});

module.exports = oath;