"use strict"

var LegacyHubControllerNativeWebsockets = require('./src/hub-controller-native-ws');
var Configuration = require('./configuration');

var hubController = new LegacyHubControllerNativeWebsockets(new Configuration());
hubController.init();