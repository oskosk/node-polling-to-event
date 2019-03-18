var pollingtoemitter = require("..");
var testHelpers = require('./helpers');

describe('simple longpolling test', function() {
    var nums = [1, 4, 4, 4, 5, 8],
        i = 0,
        poller;

    describe('when the data is JSON', function() {

    });

    describe('when the data is a Javascript object', function() {

    });

    describe('when the data does not repeatedly alternate', function() {

    });

    beforeEach(() => {
        poller = pollingtoemitter(function(done) {
            done(null, nums[i]);
            i = (i == nums.length - 1) ? 0 : i + 1;
        }, {
            longpolling: true,
            interval: testHelpers.ONE_MILLISECOND
        });

        poller.on('error', function(error) {
            throw error;
        });
    });

    afterEach(function() {
        testHelpers.attempt(poller.clear.bind(poller));
    });

    it('should pass new data that is different from previously polled data', function(done) {
        var longpollResults = [];

        poller.on('longpoll', (data) => {
            longpollResults.push(data);

            if (longpollResults.indexOf(nums[nums.length - 1]) != -1) {
                expect(longpollResults).toEqual(testHelpers.unique(nums));
                expect(longpollResults.filter(function(element) {
                    return element === nums[1];
                })).toEqual([nums[1]])
                done();
            }
        });
    });


});