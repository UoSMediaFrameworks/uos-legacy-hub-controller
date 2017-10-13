
var SocketIOClient = require('socket.io-client');
var assert = require('assert');

describe('Azure Deployed Instance', function() {

    const ADMIN_CREDS = { "password": "kittens" };
    const DEV_LEGACY_HUB = "http://dev-uos-legacy-hub-controller.azurewebsites.net";

    it('can connect and auth', function(done){

        var controllerClient = SocketIOClient(DEV_LEGACY_HUB);

        controllerClient.on('connect', function() {

            assert(true);

            controllerClient.emit('auth', ADMIN_CREDS, function(err, token, roomId, groupId) {

                controllerClient.disconnect();

                done();
            });

        });
    });
});