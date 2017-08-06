"use strict";

var MediaHubConnection = require('../../src/modules/media-hub-connection');
var config = require('./config/testing-config');
var badConfig = require('./config/bad-testing-config');
var assert = require('assert');

describe('media hub connection integration test', function() {

    it ('the connection tries to connect and auth using the config provided', function(done) {
        var mediaHubConnection = new MediaHubConnection(config);

        mediaHubConnection.tryConnect(function() {

            assert(mediaHubConnection.hub.connected);

            done();
        });
    });

    it ('the connection is disconnectd with bad config provided', function(done) {
        var mediaHubConnection = new MediaHubConnection(badConfig);

        mediaHubConnection.tryConnect(function() {

            assert(!mediaHubConnection.hub.connected);

            done();
        });
    });
});