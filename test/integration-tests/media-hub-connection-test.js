"use strict";

var MediaHubConnection = require('../../src/modules/media-hub-connection');
var config = require('./config/testing-config');
var badConfig = require('./config/bad-testing-config');
var assert = require('assert');

describe('MediaHubConnection', function() {

    describe('connection testing', function(){
        it ('the connection tries to connect and auth using the config provided', function(done) {
            var mediaHubConnection = new MediaHubConnection(config);

            this.timeout(7000)
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

        it('"attemptClientAuth", {password: <valid password>}', function(done){

            const goodCreds = {"password": "kittens"};

            this.mediaHubConnection.attemptClientAuth(goodCreds, function(err, token) {
                assert(!err);
                assert(token);
                done();
            });
        });

        it('"attemptClientAuth", {password: <invalid password>}', function(done) {

            this.timeout(5000);

            const badCreds = {"password": "fail"};

            this.mediaHubConnection.attemptClientAuth(badCreds, function(err, token, room, group) {
                assert(err === "Invalid Password");
                assert(token === null);
                done();
            });
        });
        it('"attemptClientAuth", {username:<invalid username> password: <invalid password>}', function(done){

            const goodCreds = {"password": "kittens"};

            this.mediaHubConnection.attemptClientAuth(goodCreds, function(err, token) {
                assert(!err);
                assert(token);
                done();
            });
        });
    //---
        it('"attemptClientAuth", {username:<valid username> password: <invalid password>}', function(done) {

            this.timeout(5000);

            const badCreds = {"password": "fail"};

            this.mediaHubConnection.attemptClientAuth(badCreds, function(err, token, room, group) {
                assert(err === "Invalid Password");
                assert(token === null);
                done();
            });
        });
        it('"attemptClientAuth", {username:<invalid username> password: <valid password>}', function(done){

            const goodCreds = {"password": "kittens"};

            this.mediaHubConnection.attemptClientAuth(goodCreds, function(err, token) {
                assert(!err);
                assert(token);
                done();
            });
        });

        it('"attemptClientAuth", {username:<valid username> password: <valid password>}', function(done) {

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