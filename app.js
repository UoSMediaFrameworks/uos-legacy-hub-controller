"use strict"

var LegacyMediaHubController = require('./src/legacy-media-hub-controller');
var Configuration = require('./configuration');

var hubController = new LegacyMediaHubController(new Configuration());
hubController.init();