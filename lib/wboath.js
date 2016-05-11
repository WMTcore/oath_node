'use strict';

let _ = require('lodash');
let qs = require('querystring');
let lib = require('./lib');
let state = lib.GetState();

let default_config = {
	appsecret: '',
	appkey: '',
	authorization_url: 'https://api.weibo.com/oauth2/authorize?',
	token_url: 'https://api.weibo.com/oauth2/access_token',
	openid_url: 'https://api.weibo.com/oauth2/get_token_info'
}

function Wboath(config) {
	this.config = default_config;
	_.merge(this.config, config);
}

Wboath.prototype.state = () => state();

//获取Authorization Code
/*data{ 
  redirect_uri:''//回调地址
 scope:'' //可进行授权的列表
 ,display:'' //仅PC网站接入时使用 用于展示的样式。不传则默认展示为PC下的样式 如果传入“mobile”，则展示为mobile端下的样式。具体看http://open.weibo.com/wiki/Oauth2/authorize
 }*/
Wboath.prototype.GetAuthorizatioCode = function(data) {
	let params = {
		response_type: 'code',
		client_id: this.config.appkey,
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
Wboath.prototype.GetAccessToken = function(data) {
	let params = {
			grant_type: 'authorization_code',
			client_id: this.config.appkey,
			client_secret: this.config.appsecret
		},
		infoList = ['access_token', 'expires_in', 'uid'];
	_.merge(params, data);
	return new Promise((resolve, reject) =>
		lib.GetHttpResponsePOST(this.config.token_url, params)
		.then((result) => resolve(_.pick(JSON.parse(result), infoList)), (error) => reject(error))
	);
}

//获取用户OpenID_OAuth2.0
/*data{
 access_token :''  必填
 }*/
Wboath.prototype.GetOpenID = function(data) {
	return new Promise((resolve, reject) =>
		lib.GetHttpResponseGET(this.config.openid_url + qs.stringify(data))
		.then((result) => resolve(_.pick(JSON.parse(result), ['uid'])), (error) => reject(error))
	)
}

exports.Wboath = Wboath;