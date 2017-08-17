"use strict"

var express = require('express');
var http = require('http');
var SocketIO = require('socket.io');

var MediaHubConnection = require('./modules/media-hub-connection');

/**
 * Main Application Class
 * Creates a self serving web socket server
 */
class LegacyHubController {
    constructor(config, optMediaHubConnection) {
        console.log("LegacyHubController - constructor");

        this.app = express();
        this.server = http.Server(this.app);
        this.server = require('http-shutdown')(this.server);

        this.io = SocketIO(this.server);

        this.io.set('origins', '*:*');

        this.io.on('connection', this.clientSocketConnected.bind(this));

        this.server.listen(config.port || 3000);

        this.mediaHubConnection = optMediaHubConnection ? optMediaHubConnection : new MediaHubConnection(config);

    }

    init(callback) {
        this.mediaHubConnection.tryConnect(callback);
    }

    clientSocketSuccessfulAuth(socket) {
        console.log("LegacyHubController - clientSocketSuccessfulAuth");
    }

    clientSocketConnected(socket) {
        console.log("LegacyHubController - Client connected");

        var disconnectTimer = setTimeout(function() {
            socket.disconnect();
        }, 10000);

        var self = this;

        socket.on('auth', function(creds, callback) {

            console.log("auth attempt");

            self.mediaHubConnection.hub.emit("authProvider", creds, function(err, token, roomId, groupId) {
                if(err) {
                    callback(err, token, roomId, groupId);
                    socket.disconnect();
                } else {
                    clearTimeout(disconnectTimer);
                    // APEP assign a groupId variable to the socket for later use
                    socket.groupId = groupId;
                    self.clientSocketSuccessfulAuth(socket);
                    callback(err, token, roomId, groupId);
                }
            });
        });
    }

    shutdown(callback) {
        this.server.shutdown(function() {
            console.log('Everything is cleanly shutdown.');
            callback();
        });
    }
}

module.exports = LegacyHubController;