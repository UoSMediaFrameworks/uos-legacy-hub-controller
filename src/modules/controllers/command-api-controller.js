"use strict";

var _ = require('lodash');

let PLAY_SCENE_THEME_COMMAND_NAME = "playSceneAndThemes";

class CommandAPIController {

    constructor(mediaHubConnection, io) {
        console.log("CommandAPIController - constructor");

        this.mediaHubConnection = mediaHubConnection;
        this.io = io;
    }

    sendCommand(roomId, commandName, commandValue) {
        // APEP ensure we publish this for any legacy clients still connecting directly to the media hub
        this.mediaHubConnection.emit('sendCommand', roomId, commandName, commandValue);

        // APEP publish for any clients connected directly to controller
        this.io.to(roomId).emit('command', {name: commandName, value: commandValue});
    }

    playSceneAndThemes(roomId, sceneAndThemesHolder, callback) {
        if(!this._isValidateSceneAndThemeHolder(sceneAndThemesHolder)) {
            if(callback) {
                return callback(new Error("Scene and Themes holder invalid, check documentation"));
            }
        }

        // APEP ensure we publish this for any legacy clients still connecting directly to the media hub
        this.mediaHubConnection.emit('sendCommand', roomId, PLAY_SCENE_THEME_COMMAND_NAME, sceneAndThemesHolder);

        // APEP publish for any clients connected directly to controller
        this.io.to(roomId).emit('command', {name: PLAY_SCENE_THEME_COMMAND_NAME, value: sceneAndThemesHolder});

        callback();
    }

    _isValidateSceneAndThemeHolder(sceneAndThemesHolder) {
        var hasCorrectPropertiesKeys = sceneAndThemesHolder.hasOwnProperty("scenes") && sceneAndThemesHolder.hasOwnProperty("themes");

        if (!hasCorrectPropertiesKeys)
            return false;

        return _.isArray(sceneAndThemesHolder.scenes) && _.isArray(sceneAndThemesHolder.themes);
    }
}

module.exports = CommandAPIController;