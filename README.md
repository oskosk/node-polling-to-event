# node-polling-to-event
Receive events with EventEmitter from a polling function run on an interval


##Installation

    $ npm install polling-to-event

##Usage

    var pollingtoevent = require("polling-to-event");

    var emitter = pollingtoevent(function(done) {
      // your async stuff
      // ....
      done(null, arg1, arg2, ..., argN);
    });

    emitter.on("interval", function(data) {
      console.log(data);
    });

    emitter.on("err", function(err) {
      console.log(err);
    });    


##Example

    var pollingtoevent = require("polling-to-event"),
      request = require("request");

    var url = "https://raw.githubusercontent.com/mozilla/contribute.json/master/schema.json";

    emitter = pollingtoevent(function(done) {
      request.get(url, function(err, req, data) {
        done(err, data);
      });
    });

    emitter.on("interval", function(data) {
      console.log("Event emitted at %s, with data %j", Date.now(), data);
    });

    emitter.on("error", function(err, data) {
      console.log("Emitter errored: %s. with data %j", err, data);
    });

##API

### pollingtoevent(pollingfunction, options)

It returns a NodeJS [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)  that emits the polled data on an interval.

**Arguments**
* `pollingfunction(done)` - The function you want to be called at an interval. When called, this function will receive a `done` parameter as its last argument.
  * `done(error, arg1, arg2, ... argN) ` - You must call **done()**  inside your function when your function finish its work.
    * `error` - Call `done()` with `null` as its first argument if there was no error. Call it with a standard nodejs `Error()` instance as first argument if you wish the emitter to emit an `error` event..  
    * `arg1, arg2, ... argN` - The data fetched by your polling function. You pass it to `done()` in order to be emitted by the emitter. Any number of arguments will do.  
* `options` - `{Object}`
  * `interval` - Interval in milliseconds. **Default**: 1000.
  * `eventName` - The event name to emit on each successful call to `done()` as second argument. **Default**: `"interval"`.

### Events

#### interval

Emitted when an interval has completed and the `done()` function was called with no errors. *You can also customize this event's name using the option `eventName`*.

**Arguments**

By listening to this event, you get on the listener, the arguments passed by you to `done()` after the first argument.

#### error

Emitted when `done()` was called with an error. It emits the data polled by your polling function.

**Arguments**

* `error`: A NodeJS error object.

##TODO

* Add a default behaviour to poll URLs via a `GET` request if an URL string is passed as argument instead of a function.

#License 

The MIT License (MIT)

Copyright (c) 2015 osk &lt;oscar@shovelapps.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.