# node-polling-to-event
Receive events with EventEmitter from a polling function run on an interval


##Installation

    $ npm install polling-to-event

##Usage

    var pollingtoevent = require("polling-to-event");

    var emitter = pollingtoevent(function() {
      done();
    });

    emitter.on("interval", function(data) {
      console.log(data);
    });

    emitter.on("err", function(err) {
      console.log(err);
    });    

##API

### pollingtoevent(pollingfunction, options)

It returns a NodeJS [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)  that emits the polled data on an interval.

**Arguments**
* `pollingfunction(done)` - The function to be called at an interval. The function will receive a `done` parameter as its last argument.
  * `done(error, data) ` - A function to be called when the polling function finish its work. You should call `done()` when your function ends. Call it with `null` as a parameter if there was no error, or call it with an error as parameter if you wish the emitter to emit an error event.
    * `error` - A standard nodejs `Error()` instance.  
    * `data` - The data fetched by your polling function. You pass it to `done()` in order to be emitted by the emitter.   
* `options` - `{Object}`
  * `interval` - Interval in milliseconds. **Default**: 1000.
  * `eventName` - The event name to emit on each successful call to `done()`. **Default**: `interval`.

### Events

#### interval

Emitted when an interval has completed and the `done()` function was called with no errors. It emits no data.

***You can also customize this event's name using the option `eventName`***.

#### error

Emitted when `done()` was called with an error. It emits the data polled by your polling function.