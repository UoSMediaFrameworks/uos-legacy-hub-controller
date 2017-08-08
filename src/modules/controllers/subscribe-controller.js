"use strict";

class SubscribeController {
    constructor() {
        console.log("SubscribeController - constructor");
    }

    // APEP TODO should use data controller module rather than the media hub connection directly
    unsubScene(mediaHubConnection, socket, sceneId, callback) {
        mediaHubConnection.emit("loadScene", sceneId, function(err, scene) {
            socket.leave(sceneId);

            callback(err, scene);
        });
    }

    // APEP TODO should use data controller module rather than the media hub connection directly
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