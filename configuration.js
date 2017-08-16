/**
 * Created by aaa48574 on 16/08/2017.
 */
class Configuration {
    constructor() {
        this.port = process.env.PORT;
        this.hubUrl = process.env.HUB_URL;
        this.hubPassword = process.env.HUB_PASSWORD;
    }
}

module.exports = Configuration;