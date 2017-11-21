'use strict';

const ConnectionBrokerSubscriber = require('../../src/modules/connection-broker-subscriber');
const ConnectionBrokerConstants = require('../../src/modules/connection-broker-constants');
const assert = require('assert');
const amqp = require('amqplib/callback_api');

describe('connection-broker-subscriber', function() {

    describe('connect', function() {
        before(function(done){
            this.topic = ConnectionBrokerConstants.LEGACY_WS_TOPIC;
            this.address = 'amqp://localhost';
            this.connectionBroker = new ConnectionBrokerSubscriber(this.topic, this.address);
            done();
        });

        it('should call back when complete and setup', function(done) {
            this.connectionBroker.connect(done);
        });

        after(function(done){
            this.connectionBroker.ch.close(done);
        });
    });

    describe('onMessage receives messages', function() {
        before(function(done){
            this.topic = ConnectionBrokerConstants.LEGACY_WS_TOPIC;
            this.address = 'amqp://localhost';
            done();
        });

        class TestConnectionBrokerSubscriber extends ConnectionBrokerSubscriber {
            constructor(topic, connectionBrokerAMQPAddress, onMessageCb) {
                super(topic, connectionBrokerAMQPAddress);
                this.onMessageCb = onMessageCb;
            }

            onMessage(msg) {
                console.log("TestConnectionBrokerSubscriber - onMessage - msg: ", msg.content.toString());
                this.onMessageCb(msg);
            }
        }

        it('should consume messages given a publisher sends one', function(done) {

            var self = this;
            var expectedMessage = "test";

            var subscriber = new TestConnectionBrokerSubscriber(this.topic, this.address, function(actualMessage) {
                assert(expectedMessage, actualMessage.content.toString());
                done();
            });

            // APEP now we are connected, lets make a publisher and publish a message
            subscriber.connect(function() {
                amqp.connect(self.address, function(err, conn) {
                    // APEP if we fail to connect, throw and fail the test
                    if(err) throw err;

                    conn.createChannel(function (err, ch) {
                        ch.assertExchange(ConnectionBrokerConstants.AMQP_EXCHANGE, 'topic', {durable: false});
                        self.amqpChannel = ch;
                        self.amqpChannel.publish(ConnectionBrokerConstants.AMQP_EXCHANGE, self.topic, new Buffer(expectedMessage));
                        done();
                    });
                });
            });
        });
    });

});