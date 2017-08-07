
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
                assert(messageType === "listScenes");
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
                assert(messageType === "listSceneGraphs");
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

    it('loadScene', function(done) {

        var sceneId = "idtest";
        var didUseMediaHubConnection = false;

        var mockMediaHubConnection = {
            emit: function(messageType, sceneId, callback) {
                assert(messageType === "loadScene");
                didUseMediaHubConnection = true;
                callback(null, null)
            }
        };

        var dataController = new DataController(mockMediaHubConnection);

        dataController.loadScene(sceneId, function(err, data) {
            assert(didUseMediaHubConnection);
            done();
        });
    });

    it('loadSceneGraph', function(done) {

        var sceneGraphId = "idtest";
        var didUseMediaHubConnection = false;

        var mockMediaHubConnection = {
            emit: function(messageType, sceneGraphId, callback) {
                assert(messageType === "loadSceneGraph");
                didUseMediaHubConnection = true;
                callback(null, null)
            }
        };

        var dataController = new DataController(mockMediaHubConnection);

        dataController.loadSceneGraph(sceneGraphId, function(err, data) {
            assert(didUseMediaHubConnection);
            done();
        });
    });

    it('loadSceneByName', function(done) {

        var sceneName = "test scene";
        var didUseMediaHubConnection = false;

        var mockMediaHubConnection = {
            emit: function(messageType, sceneName, callback) {
                assert(messageType === "loadSceneByName");
                didUseMediaHubConnection = true;
                callback(null, null)
            }
        };

        var dataController = new DataController(mockMediaHubConnection);

        dataController.loadSceneByName(sceneName, function(err, data) {
            assert(didUseMediaHubConnection);
            done();
        });
    });

});