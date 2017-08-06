/**
 * Created by aaa48574 on 06/08/2017.
 */

var HubController = require('../src/hub-controller');

var SocketIOClient = require('socket.io-client');

var assert = require('assert');

describe('hub-controller tests', function() {

    beforeEach(function() {
        this.config = { port: 3000 };
        this.controller = new HubController(this.config);
    });

    it('creates a web socket server a client can connect to', function(done) {

        var controllerClient = SocketIOClient("http://localhost:" + this.config.port);

        controllerClient.on('connect', function() {
            done();
        });
    });

});