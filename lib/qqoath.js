'use strict';

let _ = require('lodash');
let qs = require('querystring');
let lib = require('./lib');
let state = lib.GetState();

let default_config = {
	appid: '',
	appkey: '',
	authorization_url: 'https://graph.qq.com/oauth2.0/authorize?',
	token_url: 'https://graph.qq.com/oauth2.0/token?',
	openid_url: 'https://graph.qq.com/oauth2.0/me?'
}

function Qqoath(config) {
	this.config = default_config;
	_.merge(this.config, config);
}

Qqoath.prototype.state = () => state();

//获取Authorization Code
/*data{ 
  redirect_uri:''//回调地址
 scope:'' //可进行授权的列表
 ,display:'' //仅PC网站接入时使用 用于展示的样式。不传则默认展示为PC下的样式 如果传入“mobile”，则展示为mobile端下的样式
 ,g_ut:'' //仅WAP网站接入时使用 QQ登录页面版本（1：wml版本； 2：xhtml版本），默认值为1
 }*/
Qqoath.prototype.GetAuthorizatioCode = function(data) {
	let params = {
		response_type: 'code',
		client_id: this.config.appid,
		state: state()
	};
	_.merge(params, data);
	params.redirect_uri = encodeURI(params.redirect_uri);

	return this.config.authorization_url + qs.stringify(params);
};


//通过Authorization Code获取Access Token
/*data{
 redirect_uri:''//回调地址 与上步相同
 code:'' //上一步返回的authorization code 必填
 }*/
Qqoath.prototype.GetAccessToken = function(data) {
	let params = {
			grant_type: 'authorization_code',
			client_id: this.config.appid,
			client_secret: this.config.appkey
		},
		infoList = ['access_token', 'expires_in', 'refresh_token'];
	_.merge(params, data);
	return new Promise((resolve, reject) =>
		lib.GetHttpResponseGET(this.config.token_url + qs.stringify(params))
		.then((result) => resolve(_.pick(qs.parse(result), infoList)), (error) => reject(error))
	);
}

//自动续期，获取Access Token
/*data{
 refresh_token :'' //上一步返回的refresh_token  必填
 }*/
Qqoath.prototype.RefreshAccessToken = function(data) {
	let params = {
			grant_type: 'refresh_token',
			client_id: this.config.appid,
			client_secret: this.config.appkey,
			refresh_token: data.refresh_token
		},
		infoList = ['access_token', 'expires_in', 'refresh_token'];
	_.merge(params, data);
	return new Promise((resolve, reject) =>
		lib.GetHttpResponseGET(this.config.token_url + qs.stringify(params))
		.then((result) => resolve(_.pick(qs.parse(result), infoList)), (error) => reject(error))
	)
}

//获取用户OpenID_OAuth2.0
/*data{
 access_token :''  必填
 }*/
Qqoath.prototype.GetOpenID = function(data) {
	return new Promise((resolve, reject) =>
		lib.GetHttpResponseGET(this.config.openid_url + qs.stringify(data))
		.then((result) => resolve(_.pick(JSON.parse(/{.*}/.exec(result)), ['openid'])), (error) => reject(error))
	)
}

exports.Qqoath = Qqoath;