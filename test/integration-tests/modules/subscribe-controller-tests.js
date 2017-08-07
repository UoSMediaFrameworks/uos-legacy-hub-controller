
var assert = require('assert');
var SubscribeController = require('../../../src/modules/controllers/subscribe-controller');
var MediaHubConnection = require('../../../src/modules/media-hub-connection');
var HubController = require('../../../src/hub-controller');
var SocketIOClient = require('socket.io-client');

var config = require('../config/testing-config');

describe('subScene', function() {

    before(function(done){
        this.subscribeController = new SubscribeController();
        this.controller = new HubController(config);
        var self = this;
        this.controller.init(function() {

            assert(self.controller.mediaHubConnection.hub.connected);

            done();
        });
    });

    it('if scene is valid we do connect to a room', function(done) {

        var sceneIdForRoom = "57fcda12d331646c0590fe66";

        var controllerClient = SocketIOClient("http://localhost:3000");

        var self = this;

        var didJoin = false;

        var mockSocket = {
            join: function(rId) {
                assert(rId === sceneIdForRoom);
                didJoin = true;
            }
        };

        controllerClient.on('connect', function() {

            self.subscribeController.subScene(self.controller.mediaHubConnection.hub, mockSocket, sceneIdForRoom, function(err, scene) {

                assert(didJoin);
                done();
            });

        });

    }).timeout(5000);

    it('if scene is valid we do leave to a room', function(done) {

        var sceneIdForRoom = "57fcda12d331646c0590fe66";

        var controllerClient = SocketIOClient("http://localhost:3000");

        var self = this;

        var didLeave = false;

        var mockSocket = {
            leave: function(rId) {
                assert(rId === sceneIdForRoom);
                didLeave = true;
            }
        };

        controllerClient.on('connect', function() {

            self.subscribeController.unsubScene(self.controller.mediaHubConnection.hub, mockSocket, sceneIdForRoom, function(err, scene) {
                assert(didLeave);
                done();
            });

        });

    }).timeout(5000);
});