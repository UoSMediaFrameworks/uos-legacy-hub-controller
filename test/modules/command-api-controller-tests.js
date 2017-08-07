var CommandAPIController = require('../../src/modules/controllers/command-api-controller');

var assert = require('assert');
var _ = require('lodash');

describe('data-controller', function() {

    beforeEach(function () {
    });

    it('listScenes uses the mediaHubConnection to request data from that socket', function (done) {

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

});