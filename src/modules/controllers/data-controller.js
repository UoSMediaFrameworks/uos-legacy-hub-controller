"use strict";

/**
 * Controller providing the simple data collection requests from ws connections from clients
 */
class DataController {
    constructor(mediaHubConnection) {
        this.mediaHubConnection = mediaHubConnection;
    }

    listScenes(groupId, callback) {
        this.mediaHubConnection.emit('loadScenes', groupId, callback);
    }

    listSceneGraphs(callback) {
        this.mediaHubConnection.emit('listSceneGraphs', callback);
    }

    loadScene(sceneId) {
        throw new Error("Not Implemented");
    }

    loadSceneGraph(sceneGraphId) {
        throw new Error("Not Implemented");
    }

    loadSceneByName(sceneName) {
        throw new Error("Not Implemented");
    }
}

module.exports = DataController;