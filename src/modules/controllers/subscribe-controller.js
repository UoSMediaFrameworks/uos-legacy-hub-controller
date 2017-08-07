"use strict";

class SubscribeController {
    constructor() {
        console.log("SubscribeController - constructor");
    }

    unsubScene(mediaHubConnection, socket, sceneId, callback) {
        mediaHubConnection.emit("loadScene", sceneId, function(err, scene) {
            socket.leave(sceneId);

            callback(err, scene);
        });
    }

    subScene(mediaHubConnection, socket, sceneId, callback) {
        mediaHubConnection.emit("loadScene", sceneId, function(err, scene) {
            socket.join(sceneId);

            callback(err, scene);
        });
    }

    register(socket, roomId) {
        roomId = roomId.replace("/#", "");

        socket.join(roomId);
    }
}

module.exports = SubscribeController;