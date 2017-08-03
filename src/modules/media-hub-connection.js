"use strict";

var SocketIOClient = require('socket.io-client');

/**
 * Creates an authenticated web socket connection to media hub
 *
 * An instance of this connect will be used to fulfil the MF API.
 */
class MediaHubConnection {
    constructor(config) {
        this.hubUrl = config.hubUrl;
        this.hubPassword = config.hubPassword;
        this.hub = SocketIOClient(this.hubUrl);

        this.hub.on('connect', this.hubConnection);
    }

    hubConnection() {
        console.log('connection to hub established');

    }

    authenticateToHub() {

    }
}

module.exports = MediaHubConnection;