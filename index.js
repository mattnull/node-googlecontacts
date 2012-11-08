/**
 * @author Matt Null -- http://github.com/mattnull
 * 11/08/12
 */
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var GoogleClientLogin = require('googleclientlogin').GoogleClientLogin;
var request = require('request')
var url = '/m8/feeds/contacts/',
    type = 'contacts',
    projectionThin = 'thin';

var GoogleContacts = function (params){
  var self = this;
  this.config = params || {};
  this.config.service = 'contacts';
  this.url = url + this.config.email + '/thin?alt=json';
  this.auth = new GoogleClientLogin(this.config);
  this.attachEvents();
};

util.inherits(GoogleContacts, EventEmitter);

GoogleContacts.prototype.attachEvents = function(){
  var self = this;

  this.auth.on(GoogleClientLogin.events.login, function(e){
    request({
      url : 'http://google.com' + self.url, 
      headers: {'Authorization': 'GoogleLogin auth=' + self.auth.getAuthId()}
    }, function(err, response, body){
      console.log(body)
      self.emit('contactsReceived', JSON.parse(body));
    });
  });

  this.auth.on(GoogleClientLogin.events.error, function(e) {
    switch(e.message) {
      case GoogleClientLogin.errors.loginFailed:
        if (this.isCaptchaRequired()) {
          requestCaptchaFromUser(this.getCaptchaUrl(), this.getCaptchaToken());
        } else {
          requestLoginDetailsAgain();
        }
        break;
      case GoogleClientLogin.errors.tokenMissing:
      case GoogleClientLogin.errors.captchaMissing:
        throw new Error('You must pass the both captcha token and the captcha')
        break;
    }
    throw new Error('Unknown error');
  });
};

GoogleContacts.prototype.getContacts = function(){
  this.auth.login();
};

module.exports = GoogleContacts;