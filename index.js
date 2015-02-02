var extend = require("extend"),
  debug = require("debug")("polling-to-event"),
  util = require("util"),
  EventEmitter = require("events").EventEmitter,
  equal = require("deep-equal");

module.exports = pollingtoevent;

function pollingtoevent(func, options) {
  if (!(this instanceof pollingtoevent)) {
    return new pollingtoevent(func, options);
  }

  var lastParams = undefined;
  var _this = this,
    defaults = {
      interval: 1000,
      eventName: "interval",
      updateEventName: "update",
      longpolling: false,
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
    // Save the event name as first item in the parameters array
    // that will be used wit _this.emit.apply()
    var params = [options.eventName];
    for (var i = 1; i < arguments.length; i++) {
      params.push(arguments[i]);
    }
    // If long polling is set, compare
    // the last value polled with the last one
    // emit
    if (options.longpolling) {
      debug("Comparing last polled parameters");
      //debug("%j, %j", params, lastParams);
      if (!equal(params, lastParams)) {
        debug("Last polled data and previous poll data are not equal. Emitting '%s' event", options.updateEventName);
        var updateEventParams = params.slice(0);
        updateEventParams[0] = options.updateEventName;
        // Emit the update event after longpolling
        _this.emit.apply(_this, params.slice(1))
      } else {
        debug("Last polled data and previous poll data are equal.");

      }
      lastParams = params.slice(0);
    }
    // Emit the interval event after every polling
    return _this.emit.apply(_this, params);
  }

  setInterval(function() {
    func(done);
  }, options.interval);
}

// Inherit from EventEmitter
util.inherits(pollingtoevent, EventEmitter);