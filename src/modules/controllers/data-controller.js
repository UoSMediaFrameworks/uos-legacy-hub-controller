"use strict";

/**
 * Controller providing the simple data collection requests from ws connections from clients
 */
class DataController {
    constructor(mediaHubConnection) {
        this.mediaHubConnection = mediaHubConnection;
    }
}

module.exports = DataController;