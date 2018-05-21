var CommandAPIController = require('../../src/modules/controllers/command-api-controller'),
    CommandKeys = CommandAPIController.getCommandKeys();

var assert = require('assert');
var _ = require('lodash');

describe('command-api-controller', function() {

    beforeEach(function () {
    });

    it('sendCommand uses the mediaHubConnection to request data from that socket', function (done) {

        var roomId = "testroom";
        var commandName = CommandKeys.PLAY_SCENE_THEME_COMMAND_NAME;
        var commandValue = {
            scenes: ["scene1"],
            themes: []
        };

        var didUseMediaHubConnection = false;

        var mockIO = {
            to: function(rId) {
                assert(rId === roomId);
                return {
                    emit: function(messageType, data) {
                        assert(messageType === CommandKeys.DIRECT_CLIENTS.COMMAND);
                        assert(_.isEqual(data, {name: commandName, value: commandValue}));
                        assert(didUseMediaHubConnection);
                        done();
                    }
                }
            }
        };

        var mockMediaHubConnection = {
            emit: function (messageType, rId, cName, cValue, callback) {
                assert(messageType === CommandKeys.HUB.SEND_COMMAND);
                assert(rId === roomId);
                assert(cName === commandName);
                assert(_.isEqual(cValue, commandValue));
                didUseMediaHubConnection = true;
            }
        };

        var commandController = new CommandAPIController(mockMediaHubConnection, mockIO);

        commandController.sendCommand(roomId, commandName, commandValue);

    });

    it('playSceneAndThemes fails given an incorrect sceneAndThemeHolder with optional callback', function(done) {
        var roomId = "testroom";

        var invalidSceneThemeHolder = {
            "scenes": "scene1, scene2",
            "themes": []
        };

        var mockIO = {};
        var mockMediaHubConnection = {};

        var commandController = new CommandAPIController(mockMediaHubConnection, mockIO);

        commandController.playSceneAndThemes(roomId, invalidSceneThemeHolder, function(err) {
            assert(err);
            done();
        });
    });

    it('playSceneAndThemes publishes generic command when valid to media hub via connection', function(done) {
        var roomId = "testroom";

        var validSceneThemeHolder = {
            "scenes": ["scene1", "scene2"],
            "themes": []
        };

        var didUseMediaHubConnection = false;
        var didPublishToSocketRoom = false;

        var mockIO = {
            to: function(rId) {
                assert(rId === roomId);
                return {
                    emit: function(messageType, data) {
                        assert(messageType === CommandKeys.DIRECT_CLIENTS.COMMAND);
                        assert(_.isEqual(data, {name: CommandKeys.PLAY_SCENE_THEME_COMMAND_NAME, value: validSceneThemeHolder}));
                        didPublishToSocketRoom = true;
                    }
                }
            }
        };
        var mockMediaHubConnection = {
            emit: function (messageType, rId, cName, cValue, callback) {
                assert(messageType === CommandKeys.HUB.SEND_COMMAND);
                assert(rId === roomId);
                assert(cName === CommandKeys.PLAY_SCENE_THEME_COMMAND_NAME);
                assert(_.isEqual(cValue, validSceneThemeHolder));
                didUseMediaHubConnection = true;
            }
        };

        var commandController = new CommandAPIController(mockMediaHubConnection, mockIO);

        commandController.playSceneAndThemes(roomId, validSceneThemeHolder, function(err) {
            assert(didUseMediaHubConnection);
            assert(didPublishToSocketRoom);
            assert(!err);

            done();
        });
    });

    it('showScenes fails given an incorrect sceneList with optional callback', function(done) {
        var roomId = "testroom";

        var invalidSceneList = "scene1, scene2";

        var mockIO = {};
        var mockMediaHubConnection = {};

        var commandController = new CommandAPIController(mockMediaHubConnection, mockIO);

        commandController.showScenes(roomId, invalidSceneList, function(err) {
            assert(err);
            done();
        });
    });

    it('showScenes publishes generic command when valid to media hub via connection', function(done) {
        var roomId = "testroom";

        var validSceneList = ["scene1", "scene2"];

        var didUseMediaHubConnection = false;
        var didPublishToSocketRoom = false;

        var mockIO = {
            to: function(rId) {
                assert(rId === roomId);
                return {
                    emit: function(messageType, data) {
                        assert(messageType === CommandKeys.DIRECT_CLIENTS.COMMAND);
                        assert(_.isEqual(data, {name: CommandKeys.SHOW_SCENES_COMMAND_NAME, value: validSceneList}));
                        didPublishToSocketRoom = true;
                    }
                }
            }
        };
        var mockMediaHubConnection = {
            emit: function (messageType, rId, cName, cValue, callback) {
                assert(messageType === CommandKeys.HUB.SEND_COMMAND);
                assert(rId === roomId);
                assert(cName === CommandKeys.SHOW_SCENES_COMMAND_NAME);
                assert(_.isEqual(cValue, validSceneList));
                didUseMediaHubConnection = true;
            }
        };

        var commandController = new CommandAPIController(mockMediaHubConnection, mockIO);

        commandController.showScenes(roomId, validSceneList, function(err) {
            assert(didUseMediaHubConnection);
            assert(didPublishToSocketRoom);
            assert(!err);

            done();
        });
    });

});