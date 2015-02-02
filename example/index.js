var pollingtoevent = require("..");


emitter = pollingtoevent(function(done) {
  setTimeout(function() {
    done(null, {
      sample: "sample data"
    });
  }, 2000);

});

emitter.on("interval", function(data) {
  console.log(data);
});

emitter.on("error", function(err, data) {
  console.log("Emitter errored: %s. with data %j", err, data);
});