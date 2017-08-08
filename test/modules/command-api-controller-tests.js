var CommandAPIController = require('../../src/modules/controllers/command-api-controller');

var assert = require('assert');
var _ = require('lodash');

describe('command-api-controller', function() {

    beforeEach(function () {
    });

    it('sendCommand uses the mediaHubConnection to request data from that socket', function (done) {

        var roomId = "testroom";
        var commandName = "playSceneAndThemes";
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
                        assert(messageType === "command");
                        assert(_.isEqual(data, {name: commandName, value: commandValue}));
                        assert(didUseMediaHubConnection);
                        done();
                    }
                }
            }
        };

        var mockMediaHubConnection = {
            emit: function (messageType, rId, cName, cValue, callback) {
                assert(messageType === "sendCommand");
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
        }

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
                        assert(messageType === "command");
                        assert(_.isEqual(data, {name: "playSceneAndThemes", value: validSceneThemeHolder}));
                        didPublishToSocketRoom = true;
                    }
                }
            }
        };
        var mockMediaHubConnection = {
            emit: function (messageType, rId, cName, cValue, callback) {
                assert(messageType === "sendCommand");
                assert(rId === roomId);
                assert(cName === "playSceneAndThemes");
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

});