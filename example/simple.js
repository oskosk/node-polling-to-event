var pollingtoemitter = require("..");

var nums = [1, 4, 4, 4, 5, 8],
  i = 0;

poller = pollingtoemitter(function(done) {
  done(null, nums[i]);
  i = (i == nums.length - 1) ? 0 : i + 1;
});

poller.on("poll", function(data) {
  console.log("Chicho :%s", nums[i]);
  console.log(data);
});