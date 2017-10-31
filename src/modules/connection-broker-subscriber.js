"use strict";

var amqp = require('amqplib/callback_api');

class ConnectionBrokerSubscriber {

    constructor(topic, connectionBrokerAMQPAddress) {
        this.topic = topic;
        this.connectionBrokerAMQPAddress = connectionBrokerAMQPAddress;
    }

    connect(callback) {
        var self = this;

        amqp.connect(this.connectionBrokerAMQPAddress, function(err, conn) {

            // APEP if we fail to connect, for now throw the error and stop the application.
            if(err) throw err;

            // APEP subscribing for updates from the media hub
            conn.createChannel(function(err, ch) {
                ch.assertQueue(self.topic, {durable: false});

                // console.log(" [*] Waiting for messages in %s.", self.topic);

                ch.consume(self.topic, self.onMessageReceived.bind(self), {noAck: true});

                self.ch = ch;

                callback();
            });
        });
    }

    onMessageReceived(msg) {
        // console.log(" [x] Received %s", msg.content.toString());

        // APEP TODO we can then publish to our clients via there choice of client protocol.
        // APEP for now this will mostly just be WS.
        // var command = msg.content.toJSON();
        // console.log(" [x.2] JSON %s", command);

        this.onMessage(msg);
    }

    onMessage(msg) {
        console.log("onMessage - Override me");
    }

}

module.exports = ConnectionBrokerSubscriber;