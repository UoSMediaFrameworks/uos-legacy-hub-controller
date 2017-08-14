"use strict"

var LegacyMediaHubController = require('./src/legacy-media-hub-controller');

class Configuration {
    constructor() {
        this.port = process.env.PORT;
        this.hubUrl = process.env.HUB_URL;
        this.hubPassword = process.env.HUB_PASSWORD;
    }
}

var hubController = new LegacyMediaHubController(new Configuration());
hubController.init();