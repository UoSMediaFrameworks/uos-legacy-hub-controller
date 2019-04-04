"use strict";

var http = require('http');
var SocketIO = require('socket.io');
var httpShutdown = require('http-shutdown');
let WebSocketServer = require('websocket').server;

var MediaHubConnection = require('./modules/media-hub-connection');

/**
 * Main Application Class
 * Creates a self serving web socket server
 */
class LegacyHubControllerNativeWebsockets {
    constructor(config, optMediaHubConnection) {
        console.log("LegacyHubController - constructor", config.port || 3000);

        this.server = http.createServer();
        this.server = httpShutdown(this.server);
        this.server.listen(config.port || 3000);

        this.authGracePeriod = config.authGracePeriod || 10000;

        this.connections = new Map(); // <int id>, <connection>
        this.connectionIdCounter = 0;

        this.wsServer = new WebSocketServer({
            httpServer: this.server
        });

        this.wsServer.on('request', this.clientSocketConnected.bind(this));

        this.mediaHubConnection = optMediaHubConnection ? optMediaHubConnection : new MediaHubConnection(config);

    }

    init(callback) {
        this.mediaHubConnection.tryConnect(callback);
    }

    clientSocketSuccessfulAuth(connection) {
        console.log("LegacyHubControllerNativeWebsockets - clientSocketSuccessfulAuth");
    }

    clientSocketConnected(request) {

        console.log("LegacyHubControllerNativeWebsockets - Client connected");

        let connection = request.accept(null, request.origin);

        connection.id = this.connectionIdCounter++;
        this.connections.set(connection.id, connection);

        var disconnectTimer = setTimeout(function() {
            connection.close();
        }, this.authGracePeriod);

        var self = this;

        connection.on('message', function(message) {

            if (message.type !== 'utf8') {
                return; // binary messages are not accepted
            }

            // process WebSocket message
            console.log(`message ${message.utf8Data}`);

            try {
                let json = JSON.parse(message.utf8Data);

                if (!(json.hasOwnProperty("type") && json.hasOwnProperty("payload"))) {
                    console.log(`missing REQUIRED params for web socket messages ${json}`);
                }

                switch (json.type) {
                    case "auth":
                        console.log("auth payload");
                        let authPayload = json.payload;
                        console.log(authPayload);

                        self.mediaHubConnection.attemptClientAuth(authPayload, function(err, token, roomId, groupId) {
                            if(err) {
                                // callback(err, token, roomId, groupId);
                                connection.close();
                            } else {
                                clearTimeout(disconnectTimer);
                                // socket.groupId = groupId;
                                // socket.token = token;
                                self.clientSocketSuccessfulAuth(connection);
                                //callback(err, token, roomId, groupId);
                            }
                        });

                        break;
                }

            } catch (e) {
                console.error("failed to parse and process JSON", e);
            }
        });
    }

    shutdown(callback) {
        this.server.shutdown(function() {
            console.log('Everything is cleanly shutdown.');
            callback();
        });
    }
}

module.exports = LegacyHubControllerNativeWebsockets;