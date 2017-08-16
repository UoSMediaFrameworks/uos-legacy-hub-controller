"use strict"

var HubController = require("./hub-controller");

var AuthorController = require('./modules/controllers/author-controller');
var CommandAPIController = require('./modules/controllers/command-api-controller');
var SubscribeController = require('./modules/controllers/subscribe-controller');
var DataController = require('./modules/controllers/data-controller');

class LegacyMediaHubController extends HubController {
    constructor(config) {
        super(config);
    }

    init(callback) {
        var self = this;
        this.mediaHubConnection.tryConnect(function() {
            self.authorController = new AuthorController(self.mediaHubConnection.hub, self.io);
            self.dataController = new DataController(self.mediaHubConnection.hub);
            self.subscribeController = new SubscribeController();
            self.commandAPIController = new CommandAPIController(self.mediaHubConnection.hub, self.io);
            if(callback)
                callback();
        });
    }

    clientSocketSuccessfulAuth(socket) {

        console.log("LegacyMediaHubController - clientSocketSuccessfulAuth");

        var self = this;

        // APEP setup authoring API
        socket.on("saveScene", this.authorController.saveScene.bind(self.authorController));
        socket.on("saveSceneGraph", this.authorController.saveSceneGraph.bind(self.authorController));
        socket.on("deleteScene", this.authorController.deleteScene.bind(self.authorController));
        socket.on("deleteSceneGraph", this.authorController.deleteSceneGraph.bind(self.authorController));

        // APEP setup data API
        socket.on("listScenes", function(callback) {
            // APEP TODO resolve this, the client should not send the group ID.
            // APEP the group ID assigned server side should be used
            self.dataController.listScenes(0, callback);
        });
        socket.on("listSceneGraphs", this.dataController.listSceneGraphs.bind(self.dataController));
        socket.on("loadScene",       this.dataController.loadScene.bind(self.dataController));
        socket.on("loadSceneGraph",  this.dataController.loadSceneGraph.bind(self.dataController));
        socket.on("loadSceneByName", this.dataController.loadSceneByName.bind(self.dataController));

        // APEP setup subscribe API
        socket.on("subScene", function(sceneId, cb){
            self.subscribeController.subScene(self.mediaHubConnection.hub, socket, sceneId, cb);
        });
        socket.on("unsubScene", function(sceneId, cb){
            self.subscribeController.unsubScene(self.mediaHubConnection.hub, socket, sceneId, cb);
        });
        socket.on("register", function(roomId){
            self.subscribeController.register(socket, roomId);
        });

        // APEP command API
        socket.on('sendCommand', this.commandAPIController.sendCommand.bind(self.commandAPIController));
    }
}

module.exports = LegacyMediaHubController;