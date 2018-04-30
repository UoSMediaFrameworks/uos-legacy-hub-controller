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
        this.hubAuthCreds = {
            "username": this.hubPassword,
            "password": this.hubPassword
        };

        this.hub = null;
        this.hubConnectedCallback = null;
    }

    tryConnect(callback) {
        this.hubConnectedCallback = callback;

        this.hub = SocketIOClient(this.hubUrl);

        this.hub.on('connect', this.hubConnection.bind(this));
    }

    hubConnection() {
        console.log('connection to hub established');

        this.authenticateToHub();
    }

    authenticateToHub() {
        this.hub.emit('auth', this.hubAuthCreds, this._authCallback.bind(this));
    }

    _authCallback(err, token, socketID, groupID) {
        if (err) {
            this.hub.disconnect();
            return this.hubConnectedCallback();
        }

        console.log("successful auth to hub: ", token, socketID, groupID);

        if (this.hubConnectedCallback) {
            this.hubConnectedCallback()
        }
    }

    attemptClientAuth(creds, callback) {
        this.hub.emit('authProvider', creds, callback);
    }
}

module.exports = MediaHubConnection;