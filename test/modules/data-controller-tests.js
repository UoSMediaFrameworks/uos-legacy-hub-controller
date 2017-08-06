
var DataController = require('../../src/modules/controllers/data-controller');

var assert = require('assert');

describe('data-controller', function(){

    beforeEach(function() {
    });

    it('listScenes uses the mediaHubConnection to request data from that socket', function(done) {

        var expectedGroupID = 101;

        var didUseMediaHubConnection = false;

        var mockMediaHubConnection = {
            emit: function(messageType, actualGroupID, callback) {
                assert(actualGroupID === expectedGroupID);
                didUseMediaHubConnection = true;
                callback(null, null)
            }
        };

        var dataController = new DataController(mockMediaHubConnection);

        dataController.listScenes(expectedGroupID, function(err, data) {
            assert(didUseMediaHubConnection);
            done();
        });
    });

    it('listSceneGraphs uses the mediaHubConnection to request data from that socket', function(done) {
        var didUseMediaHubConnection = false;

        var mockMediaHubConnection = {
            emit: function(messageType, callback) {
                didUseMediaHubConnection = true;
                callback(null, null)
            }
        };

        var dataController = new DataController(mockMediaHubConnection);

        dataController.listSceneGraphs(function(err, data) {
            assert(didUseMediaHubConnection);
            done();
        });
    });

});