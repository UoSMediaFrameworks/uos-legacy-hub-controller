"use strict"

var LegacyHubController = require('./src/hub-controller');

class Configuraion {
    constructor() {
        this.secret = process.env.HUB_SECRET;
        this.secret_1 = process.env.HUB_SECRET_1;
        this.secret_2 = process.env.HUB_SECRET_2;
        this.secret_101 = process.env.HUB_SECRET_101;
        this.secret_102 = process.env.HUB_SECRET_102;
        this.secret_103 = process.env.HUB_SECRET_103;
        this.secret_104 = process.env.HUB_SECRET_104;
        this.secret_105 = process.env.HUB_SECRET_105;
        this.secret_106 = process.env.HUB_SECRET_106;
        this.secret_107 = process.env.HUB_SECRET_107;
        this.secret_108 = process.env.HUB_SECRET_108;
        this.secret_109 = process.env.HUB_SECRET_109;
        this.secret_110 = process.env.HUB_SECRET_110;
        this.secret_111 = process.env.HUB_SECRET_111;
        this.secret_112 = process.env.HUB_SECRET_112;
        this.secret_113 = process.env.HUB_SECRET_113;
        this.mongo = process.env.HUB_MONGO;
        this.port = process.env.PORT;
    }
}

var hubController = new LegacyHubController(new Configuraion());