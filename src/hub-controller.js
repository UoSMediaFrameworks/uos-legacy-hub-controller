"use strict"

var express = require('express');
var http = require('http');
var SocketIO = require('socket.io');

var MediaHubConnection = require('./modules/media-hub-connection');

// var AuthorController = require('modules/controllers/author-controller');
// var CommandAPIController = require('modules/controllers/command-api-controller');
// var SubscribeController = require('modules/controllers/subscribe-controller');

/**
 * Main Application Class
 * Creates a self serving web socket server
 */
class LegacyHubController {
    constructor(config) {
        console.log("LegacyHubController - constructor");

        this.app = express();
        this.server = http.Server(this.app);
        this.server = require('http-shutdown')(this.server);
        this.io = SocketIO(this.server);

        this.io.set('origins', '*:*');

        this.io.on('connection', function(socket) {
            console.log("Client connected");
        });

        this.server.listen(config.port || 3000);

        this.mediaHubConnection = new MediaHubConnection(config);

    }

    init(callback) {
        this.mediaHubConnection.tryConnect(callback);
    }

    shutdown(callback) {
        this.server.shutdown(function() {
            console.log('Everything is cleanly shutdown.');
            callback();
        });
    }
}

module.exports = LegacyHubController;