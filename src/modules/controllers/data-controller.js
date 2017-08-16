"use strict";

/**
 * Controller providing the simple data collection requests from ws connections from clients
 */
class DataController {
    constructor(mediaHubConnection) {
        console.log("AuthorController - constructor");

        this.mediaHubConnection = mediaHubConnection;
    }

    listScenes(groupId, callback) {
        this.mediaHubConnection.emit('listScenes', groupId, callback);
    }

    listSceneGraphs(callback) {
        this.mediaHubConnection.emit('listSceneGraphs', callback);
    }

    loadScene(sceneId, callback) {
        this.mediaHubConnection.emit('loadScene', sceneId, callback);
    }

    loadSceneGraph(sceneGraphId, callback) {
        this.mediaHubConnection.emit('loadSceneGraph', sceneGraphId, callback);
    }

    loadSceneByName(sceneName, callback) {
        this.mediaHubConnection.emit('loadSceneByName', sceneName, callback);
    }
}

module.exports = DataController;