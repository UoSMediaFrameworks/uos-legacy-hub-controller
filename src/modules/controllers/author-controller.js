"use strict";

class AuthorController {
    constructor(mediaHubConnection, io) {
        console.log("AuthorController - constructor");

        this.mediaHubConnection = mediaHubConnection;
        this.io = io;
    }

    saveScene(scene, callback) {

        var self = this;

        this.mediaHubConnection.emit('saveScene', scene, function(err, savedScene) {

            if(err) {
                return callback(err, null);
            }

            // APEP capture the callback directly, so we can publish the sceneUpdate to any clients connected to the controller

            self.io.to(scene._id).emit('sceneUpdate', savedScene);

            callback(err, savedScene);

        });
    }

    saveSceneGraph(sceneGraph, callback) {

        var self = this;

        this.mediaHubConnection.emit('saveSceneGraph', sceneGraph, function(err, savedSceneGraph) {

            if(err) {
                return callback(err, null);
            }

            // APEP capture the callback directly, so we can publish the sceneUpdate to any clients connected to the controller

            self.io.to(savedSceneGraph._id).emit('sceneGraphUpdate', savedSceneGraph);

            callback(err, savedSceneGraph);

        });
    }

    deleteScene(sceneId, callback) {
        this.mediaHubConnection.emit('deleteScene', sceneId, callback);
    }

    deleteSceneGraph(sceneGraphId, callback) {
        this.mediaHubConnection.emit('deleteSceneGraph', sceneGraphId, callback);
    }

}

module.exports = AuthorController;