var util = require('util');
var Scout = require('zetta-scout');
var WeMo = require('wemo-js');
var Socket = require('./socket');

var WemoScout = module.exports = function() {
  Scout.call(this);
};
util.inherits(WemoScout, Scout);

WemoScout.prototype.init = function(next) {
  this.search();
  setInterval(this.search.bind(this), 5000);
  next();
};

WemoScout.prototype.search = function() {
  this.client = WeMo.Search();
  this.client.on('found', this.foundDevice.bind(this));
};

WemoScout.prototype.foundDevice = function(device) {
  if (device.modelName === 'Socket') {
    this.initDevice('wemo-socket', Socket, device);
  }
};

WemoScout.prototype.initDevice = function(type, Class, device) {
  var self = this;
  var query = this.server.where({ type: type, UDN: device.UDN });
  this.server.find(query, function(err, results){
    var huehub = null;
    if (results.length > 0) {
      self.provision(results[0], Class, device);
    } else {
      self.discover(Class, device);
    }
  });
};
