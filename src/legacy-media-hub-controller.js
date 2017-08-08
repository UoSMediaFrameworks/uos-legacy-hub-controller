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
        this.mediaHubConnection.tryConnect(callback);

        this.authorController = new AuthorController(this.mediaHubConnection.hub, this.io);
        this.dataController = new DataController(this.mediaHubConnection.hub, this.io);
    }

    clientSocketConnected(socket) {
        var self = this;

        socket.on("saveScene", this.authorController.saveScene);

        socket.on("listScenes", function(callback) {
            self.dataController.listScenes(0, callback);
        });
        socket.on("listSceneGraphs", this.dataController.listSceneGraphs);
        socket.on("loadScene", function(sceneId, callback) {
            self.dataController.loadScene(sceneId, callback);
        });
        socket.on("loadSceneGraph", this.dataController.loadSceneGraph);
        socket.on("loadSceneByName", this.dataController.loadSceneByName);
    }
}

module.exports = LegacyMediaHubController;