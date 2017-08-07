
var AuthorController = require('../../src/modules/controllers/author-controller');

var assert = require('assert');

var _ = require('lodash');

describe('author-controller', function() {

    describe('saveScene', function() {
        it('callback with when error from mediaHubConnection', function(done){
            var didUseMediaHubConnection = false;

            var sceneToSave = {};

            var mockMediaHubConnection = {
                emit: function(messageType, scene, callback) {
                    didUseMediaHubConnection = true;
                    callback("error", null)
                }
            };

            var dataController = new AuthorController(mockMediaHubConnection, {});

            dataController.saveScene(sceneToSave, function(err, actualScene) {
                assert(didUseMediaHubConnection);
                assert(err);
                done();
            });
        });

        it('uses the media hub connection and callbacks', function(done) {

            var sceneToSave = {};

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                emit: function(messageType, scene, callback) {
                    assert(_.isEqual(sceneToSave, scene));
                    didUseMediaHubConnection = true;
                    callback(null, scene)
                }
            };

            var mockIO = {
                to: function(roomId) {
                    return {
                        emit: function(messageType, data) {
                        }
                    }
                }
            };

            var dataController = new AuthorController(mockMediaHubConnection, mockIO);

            dataController.saveScene(sceneToSave, function(err, actualScene) {
                assert(didUseMediaHubConnection);
                assert(!err);
                assert(_.isEqual(sceneToSave, actualScene));
                done();
            });

        });

        it('uses the media hub connection, provides callback support and publishes update to all sockets listening to scene changes', function(done) {

            var sceneToSave = {
                "_id": "mongodbID",
                "name": "new-scene",
                "version": "0.1",
                "maximumOnScreen": {
                    "image": 3,
                    "text": 1,
                    "video": 1,
                    "audio": 1
                },
                "displayDuration": 10,
                "displayInterval": 3,
                "transitionDuration": 1.4,
                "themes": {},
                "style": {
                    "backgroundColor": "black"
                },
                "scene": [],
            };

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                emit: function(messageType, scene, callback) {
                    assert(_.isEqual(sceneToSave, scene));
                    didUseMediaHubConnection = true;
                    callback(null, scene)
                }
            };

            var didPublishIO = false;

            var mockIO = {
                to: function(roomId) {
                    assert(roomId === sceneToSave._id);
                    return {
                        emit: function(messageType, data) {
                            assert(messageType === 'sceneUpdate');
                            assert(_.isEqual(sceneToSave, data));
                            didPublishIO = true;
                        }
                    }
                }
            };

            var dataController = new AuthorController(mockMediaHubConnection, mockIO);

            dataController.saveScene(sceneToSave, function(err, actualScene) {
                assert(didUseMediaHubConnection);
                assert(didPublishIO);
                assert(!err);
                assert(_.isEqual(sceneToSave, actualScene));
                done();
            });

        });
    });

    describe('saveSceneGraph', function() {
        it('callback with when error from mediaHubConnection', function(done){
            var didUseMediaHubConnection = false;

            var sceneGraphToSave = {};

            var mockMediaHubConnection = {
                emit: function(messageType, sceneGraph, callback) {
                    assert(messageType === "saveSceneGraph");
                    didUseMediaHubConnection = true;
                    callback("error", null)
                }
            };

            var dataController = new AuthorController(mockMediaHubConnection, {});

            dataController.saveSceneGraph(sceneGraphToSave, function(err, actualSceneGraph) {
                assert(didUseMediaHubConnection);
                assert(err);
                done();
            });
        });

        it('uses the media hub connection and callbacks', function(done) {

            var sceneGraphToSave = {};

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                emit: function(messageType, sceneGraph, callback) {
                    assert(messageType === "saveSceneGraph");
                    assert(_.isEqual(sceneGraphToSave, sceneGraph));
                    didUseMediaHubConnection = true;
                    callback(null, sceneGraph)
                }
            };

            var mockIO = {
                to: function(roomId) {
                    return {
                        emit: function(messageType, data) {
                        }
                    }
                }
            };

            var dataController = new AuthorController(mockMediaHubConnection, mockIO);

            dataController.saveSceneGraph(sceneGraphToSave, function(err, actualSceneGraph) {
                assert(didUseMediaHubConnection);
                assert(!err);
                assert(_.isEqual(sceneGraphToSave, actualSceneGraph));
                done();
            });

        });

        it('uses the media hub connection, provides callback support and publishes update to all sockets listening to scene changes', function(done) {

            var sceneGraphToSave = {
                "_id": "mongodbID",
                "sceneIds": [ "scene1", "scene2"],
                "nodeList": [ { type: "root", children: []}]
            };

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                emit: function(messageType, sceneGraph, callback) {
                    assert(messageType === "saveSceneGraph");
                    assert(_.isEqual(sceneGraphToSave, sceneGraph));
                    didUseMediaHubConnection = true;
                    callback(null, sceneGraph)
                }
            };

            var didPublishIO = false;

            var mockIO = {
                to: function(roomId) {
                    assert(roomId === sceneGraphToSave._id);
                    return {
                        emit: function(messageType, data) {
                            assert(messageType === 'sceneGraphUpdate');
                            assert(_.isEqual(sceneGraphToSave, data));
                            didPublishIO = true;
                        }
                    }
                }
            };

            var dataController = new AuthorController(mockMediaHubConnection, mockIO);

            dataController.saveSceneGraph(sceneGraphToSave, function(err, actualSceneGraph) {
                assert(didUseMediaHubConnection);
                assert(didPublishIO);
                assert(!err);
                assert(_.isEqual(sceneGraphToSave, actualSceneGraph));
                done();
            });

        });
    });

    describe('deletes', function() {
        it('deleteScene calls the mediaHubConnection accordingly', function(done) {

            var scene = "testID";

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                emit: function(messageType, sceneToDelete, callback) {
                    assert(messageType === "deleteScene");
                    assert(_.isEqual(scene, sceneToDelete));
                    didUseMediaHubConnection = true;
                    callback(null)
                }
            };

            var authorController = new AuthorController(mockMediaHubConnection);

            authorController.deleteScene(scene, function(err) {
                assert(didUseMediaHubConnection);
                done();
            });
        });

        it('deleteSceneGraph calls the mediaHubConnection accordingly', function(done) {
            var sceneGraph = "testID";

            var didUseMediaHubConnection = false;

            var mockMediaHubConnection = {
                emit: function(messageType, sceneGraphToDelete, callback) {
                    assert(messageType === "deleteSceneGraph");
                    assert(_.isEqual(sceneGraph, sceneGraphToDelete));
                    didUseMediaHubConnection = true;
                    callback(null)
                }
            };

            var authorController = new AuthorController(mockMediaHubConnection);

            authorController.deleteSceneGraph(sceneGraph, function(err) {
                assert(didUseMediaHubConnection);
                done();
            });
        });
    })
});