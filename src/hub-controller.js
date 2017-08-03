"use strict"

var AuthModule = require('modules/auth-module');
var AuthorController = require('modules/controllers/author-controller');
var CommandAPIController = require('modules/controllers/command-api-controller');
var SubscribeController = require('modules/controllers/subscribe-controller');

class LegacyHubController {
    constructor(config) {
        console.log("LegacyHubController - constructor");
    }
}

module.exports = LegacyHubController;