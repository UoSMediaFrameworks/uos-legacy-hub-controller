"use strict"

var express = require('express');
var http = require('http');
var SocketIO = require('socket.io');

var AuthModule = require('modules/auth-module');
var AuthorController = require('modules/controllers/author-controller');
var CommandAPIController = require('modules/controllers/command-api-controller');
var SubscribeController = require('modules/controllers/subscribe-controller');

/**
 * Main Application Class
 * Creates a self serving web socket server
 * TODO creates connection to media hub
 * TODO setups all the correct listeners
 */
class LegacyHubController {
    constructor(config) {
        console.log("LegacyHubController - constructor");

        this.app = express();
        this.server = http.Server(this.app);
        this.io = SocketIO(this.server);

        this.io.set('origins', '*:*');
    }
}

module.exports = LegacyHubController;