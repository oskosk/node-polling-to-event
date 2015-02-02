var extend = require("extend"),
  debug = require("debug")("polling-to-event"),
  util = require("util"),
  EventEmitter = require("events").EventEmitter;

module.exports = pollingtoevent;

function pollingtoevent(func, options) {
  if (!(this instanceof pollingtoevent)) {
    return new pollingtoevent(func, options);
  }

  var _this = this,
    defaults = {
      interval: 1000,
      eventName: "interval"
    };

  // Inherit from EventEmitter
  EventEmitter.call(this);

  options = extend(defaults, options);

  function done(err) {
    if (err) {
      debug("Emitting `error`: %s.", err);
      return _this.emit("error", err);
    }
    debug("Emitting '%s'.", options.eventName);
    var params = [options.eventName];
    for (var i = 1; i < arguments.length; i++) {
      params.push(arguments[i]);
    }
    _this.emit.apply(_this, params);
    //return _this.emit(options.eventName, data);
  }

  setInterval(function() {
    func(done);
  }, options.interval);
}

// Inherit from EventEmitter
util.inherits(pollingtoevent, EventEmitter);