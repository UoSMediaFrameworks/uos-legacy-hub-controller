
var SubscribeController = require('../../src/modules/controllers/subscribe-controller');
var assert = require('assert');
describe('subscribe-controller', function(){
    describe('register', function() {

        beforeEach(function(){
            this.subscribeController = new SubscribeController();
        });

        it('socket joins based off room id', function(done) {

            var roomId = "testing-room";
            var mockSocket = {
                join: function(roomId) {
                    assert(roomId);
                    done();
                }
            };
            this.subscribeController.register(mockSocket, roomId);
        });

        it('if room id includes a /#, then this is stripped before join', function(done){

            var roomId = "/#testing-room";
            var mockSocket = {
                join: function(rId) {
                    assert(rId.indexOf('/#') === -1);
                    assert(rId);
                    done();
                }
            };
            this.subscribeController.register(mockSocket, roomId);

        });

        // APEP TODO consider adding test for handling missing room id
    });

    describe('subScene', function() {

        beforeEach(function(){
            this.subscribeController = new SubscribeController();
        });

        // APEP TODO should actually not join if unable to load scene, current media hub has bad code
        it('loads the scene to see if sceneId is valid, then connects to the scene id room', function(done) {
            var sceneIdForRoom = "sceneId";

            var didJoin = false;

            var mockSocket = {
                join: function(rId) {
                    didJoin = true;
                }
            };

            var didLoadScene = false;

            var mockMediaHubConnection = {
                emit: function(messageType, sceneId, callback) {
                    assert(messageType === "loadScene");

                    didLoadScene = true;

                    callback(null, { "_id": sceneId });
                }
            };

            this.subscribeController.subScene(mockMediaHubConnection, mockSocket, sceneIdForRoom, function(err, scene) {
                assert(didJoin);
                assert(didLoadScene);
                done();
            });
        });

        // APEP TODO should actually not join if unable to load scene, current media hub has bad code
        it('loads the scene to see if sceneId is valid, then leaves to the scene id room', function(done) {

            var sceneIdForRoom = "sceneId";

            var didLeave = false;

            var mockSocket = {
                leave: function(rId) {
                    didLeave = true;
                }
            };

            var didLoadScene = false;

            var mockMediaHubConnection = {
                emit: function(messageType, sceneId, callback) {
                    assert(messageType === "loadScene");

                    didLoadScene = true;

                    callback(null, { "_id": sceneId });
                }
            };

            this.subscribeController.unsubScene(mockMediaHubConnection, mockSocket, sceneIdForRoom, function(err, scene) {
                assert(didLeave);
                assert(didLoadScene);
                done();
            });
        });
    });

});