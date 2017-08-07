"use strict";

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
}

module.exports = CommandAPIController;