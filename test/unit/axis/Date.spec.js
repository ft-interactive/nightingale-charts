require('../../helper').loadAssets('date-axes');

var Date = require('../../../src/scripts/axis/Date');
var d3 = require('d3');

/* Start Test */
describe('Date module can ', function () {

    describe('return configure functions', function () {

        it('simple', function(){
            expect(new Date().simple()).toBe(false);

            var s = new Date().simple(true);
            expect(s.simple()).toBe(true);
        });

        it('nice', function(){
            expect(new Date().nice()).toBe(false);

            var s = new Date().nice(true);
            expect(s.nice()).toBe(true);
        });

        it('labelWidth', function(){
            expect(new Date().labelWidth()).toBe(0);

            var s = new Date().labelWidth(10);
            expect(s.labelWidth()).toBe(10);
        });

        it('lineHeight', function(){
            expect(new Date().lineHeight()).toBe(20);

            var s = new Date().lineHeight(30);
            expect(s.lineHeight()).toBe(30);
        });

        it('tickSize', function(){
            expect(new Date().tickSize()).toBe(5);

            var s = new Date().tickSize(50);
            expect(s.tickSize()).toBe(50);
        });

        it('yOffset', function(){
            expect(new Date().yOffset()).toBe(0);

            var s = new Date().yOffset(10);
            expect(s.yOffset()).toBe(10);
        });

        it('xOffset', function(){
            expect(new Date().xOffset()).toBe(0);

            var s = new Date().xOffset(10);
            expect(s.xOffset()).toBe(10);
        });

    });

});