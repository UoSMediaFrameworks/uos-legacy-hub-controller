
var SubscribeController = require('../../src/modules/controllers/subscribe-controller');
var assert = require('assert');
describe('subscribe-controller', function(){
    describe('register', function() {

        beforeEach(function(){
            this.subscribeController = new SubscribeController();
        });

        it('socket joins based off room id', function(done) {

            var roomId = "testing-room";
            var mockSocket = {
                join: function(roomId) {
                    assert(roomId);
                    done();
                }
            };
            this.subscribeController.register(mockSocket, roomId);
        });

        it('if room id includes a /#, then this is stripped before join', function(done){

            var roomId = "/#testing-room";
            var mockSocket = {
                join: function(rId) {
                    assert(rId.indexOf('/#') === -1);
                    assert(rId);
                    done();
                }
            };
            this.subscribeController.register(mockSocket, roomId);

        });

        // APEP TODO consider adding test for handling missing room id
    });
});