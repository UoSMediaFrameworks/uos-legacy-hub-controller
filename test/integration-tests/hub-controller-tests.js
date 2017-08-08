var config = require('./config/testing-config');
var badConfig = require('./config/bad-testing-config');
var assert = require('assert');
var HubController = require('../../src/hub-controller');

describe('hub controller integration test', function() {

    it('creates a media hub connection', function(done) {
        var hubController = new HubController(config);

        hubController.init(function(){
            assert(hubController.mediaHubConnection.hub.connected);

            hubController.shutdown(function() {
                done();
            });
        });
    });

});