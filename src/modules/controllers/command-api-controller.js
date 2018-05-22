"use strict";

const _ = require('lodash');

const COMMAND_KEYS = {
    HUB: {
        SEND_COMMAND: 'sendCommand'
    },
    DIRECT_CLIENTS: {
        COMMAND: 'command'
    },
    PLAY_SCENE_THEME_COMMAND_NAME: "playSceneAndThemes",
    SHOW_SCENES_COMMAND_NAME: "showScenes",

    PLAYBACK_SCENE_AUDIO_SCALE: "sceneAudioScale"
};

class CommandAPIController {

    static getCommandKeys() {
        return COMMAND_KEYS;
    }

    constructor(mediaHubConnection, io) {
        console.log("CommandAPIController - constructor");
        this.mediaHubConnection = mediaHubConnection;
        this.io = io;
    }

    sendCommand(roomId, commandName, commandValue) {
        // APEP ensure we publish this for any legacy clients still connecting directly to the media hub
        this.mediaHubConnection.emit(COMMAND_KEYS.HUB.SEND_COMMAND, roomId, commandName, commandValue);

        // APEP publish for any clients connected directly to controller
        this.io.to(roomId).emit(COMMAND_KEYS.DIRECT_CLIENTS.COMMAND, {name: commandName, value: commandValue});
    }

    playSceneAndThemes(roomId, sceneAndThemesHolder, callback) {
        if (!this._isValidSceneAndThemeHolder(sceneAndThemesHolder)) {
            if (callback) {
                return callback(new Error("Scene and Themes holder invalid, check documentation"));
            }
        }

        // APEP ensure we publish this for any legacy clients still connecting directly to the media hub
        this.mediaHubConnection.emit(COMMAND_KEYS.HUB.SEND_COMMAND, roomId, COMMAND_KEYS.PLAY_SCENE_THEME_COMMAND_NAME, sceneAndThemesHolder);

        // APEP publish for any clients connected directly to controller
        this.io.to(roomId).emit(COMMAND_KEYS.DIRECT_CLIENTS.COMMAND, {name: COMMAND_KEYS.PLAY_SCENE_THEME_COMMAND_NAME, value: sceneAndThemesHolder});

        if (callback) {
            callback();
        }
    }

    showScenes(roomId, sceneList, callback) {
        if (!this._isValidSceneList(sceneList)) {
            if (callback) {
                return callback(new Error("SceneList invalid, check documentation"));
            }
        }

        // APEP ensure we publish this for any legacy clients still connecting directly to the media hub
        this.mediaHubConnection.emit(COMMAND_KEYS.HUB.SEND_COMMAND, roomId, COMMAND_KEYS.SHOW_SCENES_COMMAND_NAME, sceneList);

        // APEP publish for any clients connected directly to controller
        this.io.to(roomId).emit(COMMAND_KEYS.DIRECT_CLIENTS.COMMAND, {name: COMMAND_KEYS.SHOW_SCENES_COMMAND_NAME, value: sceneList});

        if (callback) {
            callback();
        }
    }

    _isValidSceneAndThemeHolder(sceneAndThemesHolder) {
        var hasCorrectPropertiesKeys = sceneAndThemesHolder.hasOwnProperty("scenes") && sceneAndThemesHolder.hasOwnProperty("themes");

        if (!hasCorrectPropertiesKeys)
            return false;

        return _.isArray(sceneAndThemesHolder.scenes) && _.isArray(sceneAndThemesHolder.themes);
    }

    _isValidSceneList(sceneList) {
        return _.isArray(sceneList);
    }
}

module.exports = CommandAPIController;