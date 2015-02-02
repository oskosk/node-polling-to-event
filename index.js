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

  function done(err, data) {
    if (err) {
      debug("Emitting `error`: %s with data %j", err, data);
      return _this.emit("error", data);
    }
    debug("Emitting '%s' with data %j", options.eventName, data);
    return _this.emit(options.eventName, data);
  }

  setInterval(function() {
    func(done);
  }, options.interval);
}

// Inherit from EventEmitter
util.inherits(pollingtoevent, EventEmitter);