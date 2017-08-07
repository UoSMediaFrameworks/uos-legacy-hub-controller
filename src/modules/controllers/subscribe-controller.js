"use strict";

class SubscribeController {
    constructor() {
        console.log("SubscribeController - constructor");
    }

    unsubScene(socket, sceneId, callback) {
        throw new Error("Not implement");
    }

    subScene(socket, sceneId, callback) {
        throw new Error("Not implement");
    }

    register(socket, roomId) {
        roomId = roomId.replace("/#", "");

        socket.join(roomId);
    }
}

module.exports = SubscribeController;