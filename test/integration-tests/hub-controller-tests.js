"use strict";

var config = require('./config/testing-config');
var badConfig = require('./config/bad-testing-config');
var assert = require('assert');
var HubController = require('../../src/hub-controller');

var SocketIOClient = require('socket.io-client');

const ADMIN_CREDS = { "password": "kittens" };

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

    class TestHubController extends HubController {

        constructor(config, optMediaHubConnection, clientSocketSuccessfulAuthCb) {
            super(config, optMediaHubConnection);
            this.clientSocketSuccessfulAuthCb = clientSocketSuccessfulAuthCb;
        }

        clientSocketSuccessfulAuth(socket) {
            console.log("LegacyHubController - clientSocketSuccessfulAuth");
            this.clientSocketSuccessfulAuthCb(socket);
        }
    }

    it('caches socket token server side', function(done) {

        this.timeout(6000);

        var hubController = new TestHubController(config, null, function(socket) {
            assert(socket.token);
            assert(socket.groupId === '0');

            hubController.shutdown(done)
        });

        hubController.init(function() {
            var controllerClient = SocketIOClient("http://localhost:3000");

            controllerClient.on('connect', function() {
                controllerClient.emit('auth', ADMIN_CREDS, function(err, token, roomId, groupId) {

                });
            });
        });
    });
});