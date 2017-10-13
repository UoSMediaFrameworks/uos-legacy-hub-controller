"use strict";

var amqp = require('amqplib/callback_api');

class ConnectionBrokerSubscriber {

    constructor(topics, connectionBrokerAMQPAddress) {
        this.topics = topics;
        this.connectionBrokerAMQPAddress = connectionBrokerAMQPAddress;
    }

    connect(callback) {
        var self = this;

        amqp.connect(this.connectionBrokerAMQPAddress, function(err, conn) {

            // APEP if we fail to connect, for now throw the error and stop the application.
            if(err) throw err;

            // APEP subscribing for updates from the media hub
            conn.createChannel(function(err, ch) {
                ch.assertQueue(self.topics, {durable: false});

                console.log(" [*] Waiting for messages in %s.", self.topics);

                ch.consume(self.topics, self.onMessageReceived.bind(self), {noAck: true});

            });
        });
    }

    onMessageReceived(msg) {
        console.log("Override me");

        console.log(" [x] Received %s", msg.content.toString());

        // APEP TODO we can then publish to our clients via there choice of client protocol.
        // APEP for now this will mostly just be WS.

        var command = msg.content.toJSON();

        console.log(" [x.2] JSON %s", command);

        this.onMessage(msg);
    }

    onMessage(msg) {

    }

}