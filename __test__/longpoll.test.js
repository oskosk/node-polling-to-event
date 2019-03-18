var pollingtoemitter = require("..");
var testHelpers = require('./helpers');

var TEST_TIMEOUT_TIME = testHelpers.ONE_SECOND;

function setUpPoller(nums, callback) {
    var i = 0,
        poller = pollingtoemitter(callback || function(done) {
        done(null, nums[i]);
        i = (i === nums.length - 1) ? 0 : i + 1;
    }, {
        longpolling: true,
        interval: testHelpers.ONE_MILLISECOND
    });

    poller.on('error', function(error) {
        throw error;
    });

    return poller;
}

describe('longpolling test', function() {
    var poller,
        anObject = {
            aKey: 'aValue',
            aNestedObject: {
                aKey: 'avalue'
            }
        };

    afterEach(function() {
        testHelpers.attempt(poller.clear.bind(poller));
    });

    describe('when the data repeatedly alternates', function() {
        var nums = [1, 2, 1, 2, 1, 2, 1, 2];

        beforeEach(function() {
            poller = setUpPoller(nums);
        });

        it('should pass new data that is different from previously polled data', function(done) {
            var longpollResults = [];

            poller.on('longpoll', function(data) {
                longpollResults.push(data);

                if (longpollResults.length === nums.length) {
                    expect(longpollResults).toEqual(nums);
                    done();
                }
            });
        });
    });

    describe('when the data increments and repeats', function() {
        var nums = [1, 4, 4, 4, 5, 8];

        beforeEach(function() {
            poller = setUpPoller(nums);
        });

        it('should pass new data that is different from previously polled data', function(done) {
            var longpollResults = [];

            poller.on('longpoll', function(data) {
                longpollResults.push(data);

                if (longpollResults.indexOf(nums[nums.length - 1]) !== -1) {
                    expect(longpollResults).toEqual(testHelpers.unique(nums));
                    expect(longpollResults.filter(function(element) {
                        return element === nums[1];
                    })).toEqual([nums[1]]);
                    done();
                }
            });
        });
    });

    [{
        testCase: 'when the data is a Javascript object',
        anObject: anObject
    },
    {
        testCase: 'when the data is JSON',
        anObject: JSON.stringify(anObject)
    }].forEach(function(testArgs) {
        var testCase = testArgs.testCase,
            anObject = testArgs.anObject;

        describe(testCase, function() {
            beforeEach(function() {
                poller = setUpPoller(null, function(done) { done(null, anObject); });
            });

            it('should pass new data that is different from previously polled data', function(done) {
                var longpollResults = [];

                poller.on('longpoll', function(data) {
                    longpollResults.push(data);
                });

                setTimeout(function() {
                    expect(longpollResults.length).toEqual(1);
                    done();
                }, testHelpers.ONE_MILLISECOND * 10);
            });
        });
    });
}, TEST_TIMEOUT_TIME);