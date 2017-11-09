"use strict";

var MediaHubConnection = require('../../src/modules/media-hub-connection');
var config = require('./config/testing-config');
var badConfig = require('./config/bad-testing-config');
var assert = require('assert');

describe('MediaHubConnection', function() {

    describe('connection testing', function(){
        it ('the connection tries to connect and auth using the config provided', function(done) {
            var mediaHubConnection = new MediaHubConnection(config);

            mediaHubConnection.tryConnect(function() {

                assert(mediaHubConnection.hub.connected);

                done();
            });
        });

        it ('the connection is disconnected with bad config provided', function(done) {
            var mediaHubConnection = new MediaHubConnection(badConfig);

            mediaHubConnection.tryConnect(function() {

                assert(!mediaHubConnection.hub.connected);

                done();
            });
        });
    });

    describe('authProvider', function() {

        before(function(done) {
            this.mediaHubConnection = new MediaHubConnection(config);

            this.mediaHubConnection.tryConnect(function() {
                assert(this.mediaHubConnection.hub.connected);
                done();
            }.bind(this));
        });

        it('"attemptClientAuth", {password: <valid>}', function(done){

            const goodCreds = {"password": "kittens"};

            this.mediaHubConnection.attemptClientAuth(goodCreds, function(err, token) {
                assert(!err);
                assert(token);
                done();
            });
        });

        it('"attemptClientAuth", {password: <invalid valid>}', function(done) {

            this.timeout(5000);

            const badCreds = {"password": "fail"};

            this.mediaHubConnection.attemptClientAuth(badCreds, function(err, token, room, group) {
                assert(err === "Invalid Password");
                assert(token === null);
                done();
            });
        });
    });
});