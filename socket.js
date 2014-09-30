var util = require('util');
var WeMo = require('wemo-js');
var Device = require('zetta-device');

var ignoreProperties = ['binaryState',
                        'serviceList',
                        'presentationURL',
                        'deviceType',
                        'modelURL',
                        'iconVersion',
                        'iconList',
                        'friendlyName'
                       ];

function extend(a, b) {
  for (var k in b) {
    if (ignoreProperties.indexOf(k) !== -1) {
      continue;
    }

    if (a[k] !== undefined) {
      continue;
    }

    a[k] = b[k];
  }
}

var Socket = module.exports = function(device) {
  extend(this, device);
  this.name = device.friendlyName;
  this.state = (device.binaryState == '0') ? 'off' : 'on';
  this._client = new WeMo(device.ip, device.port);
  Device.call(this);
};
util.inherits(Socket, Device);

Socket.prototype.init = function(config) {
  config
    .type('wemo-socket')
    .state(this.state)
    .name(this.name)
    .when('on', { allow: ['turn-off'] })
    .when('off', { allow: ['turn-on'] })
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff);


  setInterval(this.syncState.bind(this), 500);
};

Socket.prototype.syncState = function(cb) {
  if (!cb) {
    cb = function(){};
  }


  var self = this;
  this._client.getBinaryState(function(err, result) {
    if (err) {
      cb(err);
      return;
    }
    var newState = (result == 0 ) ? 'off' : 'on';
    if (self.state !== newState) {
      self.state = newState;
    }
    cb();
  });
};

Socket.prototype.turnOn = function(cb) {
  var self = this;
  this._client.setBinaryState(1, function(){
    self.syncState(function(){
      cb();
    });
  });
};
Socket.prototype.turnOff = function(cb) {
  var self = this;
  this._client.setBinaryState(0, function(){
    self.syncState(function(){
      cb();
    });
  });
};

