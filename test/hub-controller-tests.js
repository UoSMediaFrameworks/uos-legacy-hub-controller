/**
 * Created by aaa48574 on 06/08/2017.
 */

var HubController = require('../src/hub-controller');

var SocketIOClient = require('socket.io-client');

var assert = require('assert');
var moment = require('moment');

const VALID_ADMIN_TEST_PASSWORD = "validpasswordkey";

describe('hub-controller tests', function() {

    describe('base tests', function() {
        beforeEach(function() {
            // APEP following the Config class definition in app.js we are matching that
            // APEP secret is to be otherwise known as the admin pass key
            this.config = { port: 3000, secret: VALID_ADMIN_TEST_PASSWORD };
            this.controller = new HubController(this.config);
        });

        it('creates a web socket server a client can connect to', function(done) {

            var controllerClient = SocketIOClient("http://localhost:" + this.config.port);

            controllerClient.on('connect', function() {
                controllerClient.disconnect();
                done();
            });
        });

        it('if a client connects and doesn\'t send an auth message within 10 seconds, we close the socket', function(done) {

            var socketConnectedTime = 0;
            var socketDisconnectedTime = 0;

            var controllerClient = SocketIOClient("http://localhost:" + this.config.port);

            var didConnect = false;

            controllerClient.on('connect', function() {
                didConnect = true;
                socketConnectedTime = moment().unix();
            });

            var didDisconnect = false;

            controllerClient.on('disconnect', function() {
                didDisconnect = true;
                socketDisconnectedTime = moment().unix();
            });

            setTimeout(function() {
                assert(didConnect);
                assert(didDisconnect);
                assert(socketConnectedTime !== 0 && socketDisconnectedTime !== 0);
                assert(socketDisconnectedTime - socketConnectedTime === 10);
                controllerClient.disconnect();
                done();
            }, 10050);
        }).timeout(11000);

        afterEach(function(done) {
            //APEP: ensure we cleanly shutdown the server - this ensures the port is released for any other tests
            this.controller.shutdown(done);
        });
    });

    describe('auth tests', function() {
        it('if a client uses creds type password and fails, the socket is disconnected and callback with failure', function(done) {

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                hub: {
                    emit: function(messageType, creds, callback) {
                        assert(messageType === "authProvider");
                        didUseMediaHubConnection = true;
                        callback(true);
                    }
                },
                attemptClientAuth: function(creds, callback) {
                    didUseMediaHubConnection = true;
                    callback(true);
                }
            };

            // APEP following the Config class definition in app.js we are matching that
            // APEP secret is to be otherwise known as the admin pass key
            var config = { port: 3000, secret: VALID_ADMIN_TEST_PASSWORD };
            var controller = new HubController(config, mockMediaHubConnection);

            var controllerClient = SocketIOClient("http://localhost:" + config.port);
            var invalidCreds = { "password": "failure" };

            var didGetAuthCallback = false;

            controllerClient.on('connect', function() {
                controllerClient.emit('auth', invalidCreds, function(err, token, roomId, groupId) {
                    assert(didUseMediaHubConnection);
                    assert(err);
                    didGetAuthCallback = true;
                });
            });

            controllerClient.on('disconnect', function() {
                //APEP: ensure we cleanly shutdown the server - this ensures the port is released for any other tests
                assert(didGetAuthCallback);
                controller.shutdown(done);
            });

        });

        it('if a client uses creds type password and succeeds as admin, the socket is not disconnected and callback.', function(done) {

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                hub: {
                    emit: function(messageType, creds, callback) {
                        assert(messageType === "authProvider");
                        didUseMediaHubConnection = true;
                        callback(null, "token", "roomId", "_groupID");
                    }
                },
                attemptClientAuth: function(creds, callback) {
                    didUseMediaHubConnection = true;
                    callback(null, "token", "roomId", "_groupID");
                }
            };

            // APEP following the Config class definition in app.js we are matching that
            // APEP secret is to be otherwise known as the admin pass key
            var config = { port: 3000, secret: VALID_ADMIN_TEST_PASSWORD };
            var controller = new HubController(config, mockMediaHubConnection);

            var controllerClient = SocketIOClient("http://localhost:" + config.port);
            var adminCreds = { "password": VALID_ADMIN_TEST_PASSWORD };

            controllerClient.on('connect', function() {
                controllerClient.emit('auth', adminCreds, function(err, token, roomId, groupId) {
                    assert(didUseMediaHubConnection);
                    assert(!err);
                    assert(token);
                    assert(roomId);
                    assert(groupId);

                    controllerClient.disconnect();

                    //APEP: ensure we cleanly shutdown the server - this ensures the port is released for any other tests
                    controller.shutdown(done);
                });
            });
        });

        it('if a client successfully authenticates the socket should not be closed by the disconnection timer', function(done){

            var mockMediaHubConnection = {
                hub: {
                    emit: function(messageType, creds, callback) {
                        assert(messageType === "authProvider");
                        callback(null, "token", "roomId", "_groupID");
                    }
                },
                attemptClientAuth: function(creds, callback) {
                    callback(null, "token", "roomId", "_groupID");
                }
            };

            // APEP following the Config class definition in app.js we are matching that
            // APEP secret is to be otherwise known as the admin pass key
            var config = { port: 3000, secret: VALID_ADMIN_TEST_PASSWORD };
            var controller = new HubController(config, mockMediaHubConnection);
            var didDisconnect = false;

            var controllerClient = SocketIOClient("http://localhost:" + config.port);

            controllerClient.on('disconnect', function() {
                didDisconnect = true;
            });

            var successfulAuth = false;

            controllerClient.on('connect', function() {
                var adminCreds = { "password": VALID_ADMIN_TEST_PASSWORD };
                controllerClient.emit('auth', adminCreds, function(err, token, roomId, groupId) {
                    assert(!err);
                    assert(token);
                    assert(roomId);
                    assert(groupId);
                    successfulAuth = true;
                });
            });

            setTimeout(function() {
                assert(!didDisconnect);
                assert(successfulAuth);
                controllerClient.disconnect();
                controller.shutdown(done);
            }, 10050);

        }).timeout(12000);
    });

});