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

    PLAY_SCENE_THEME_SINGULAR_COMMAND_NAME: "playSceneOptThemeAndVolume",
    STOP_PLAY_SCENE_THEME_SINGULAR_COMMAND_NAME: "stopSceneOptThemeAndVolume",

    SHOW_SCENES_COMMAND_NAME: "showScenes",

    PLAYBACK_SCENE_AUDIO_SCALE: "sceneAudioScale",
    PLAYBACK_SCENE_AUDIO_SCALE_LIST: "sceneAudioListScale",
    PLAYBACK_SCENE_AUDIO_STEP: "sceneAudioStep",

    PLAYBACK_SCENE_CONFIG_APPLY_BY_NAME: "applyNamedSceneConfig",
    PLAYBACK_SCENE_CONFIG_APPLY: "applySceneConfig",

    PLAYBACK_MEDIA_ENGINE_REFRESH: "mediaEngineRefresh",

    PLAYBACK_NODE_CONTENT_SHOW: "nodeContentShow",
    PLAYBACK_NODE_CONTENT_STOP: "nodeContentStop",
    PLAYBACK_NODE_CONTENT_REPLACE: "nodeContentReplace",
    PLAYBACK_NODE_CONTENT_AUDIO_SCALE: "nodeContentAudioScale",
    PLAYBACK_PLAYER_REGIONS_CONFIG_SET: "playerRegionsConfigSet",

    PROJECT: {
        CERAMIC: {
            PLAY_SCENE_THEME_SINGULAR_COMMAND_NAME: "ceramicPlaySceneOptThemeAndVolume",
            STOP_PLAY_SCENE_THEME_SINGULAR_COMMAND_NAME: "ceramicStopSceneOptThemeAndVolume",
        }
    }
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