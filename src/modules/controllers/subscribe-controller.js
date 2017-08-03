"use strict";

class SubscribeController {
    constructor() {
        console.log("SubscribeController - constructor");
    }

    unsubScene(socket, sceneId, callback) {
    }

    subScene(socket, sceneId, callback) {
    }

    register(socket, roomId) {
        roomId = roomId.replace("/#", "");

        socket.join(roomId);
    }
}

module.exports = SubscribeController;