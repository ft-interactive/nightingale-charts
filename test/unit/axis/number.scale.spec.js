var numberScale = require('../../../src/scripts/axis/number.scale');
var DataModel = require('../../../src/scripts/util/data.model');
var d3 = require('d3');

describe('number scale', function () {

    it('tickIntervalBoundaries can calculate float maths', function(){
        expect(numberScale.tickIntervalBoundaries([0, 0.2, 0.4, 0.6, 0.8, 1])).toBe(0.2);
    });

    it('detailedTicks for a number scale (i.e. horizontal)', function(){

        spyOn(numberScale, 'tickCount').and.callFake(function(){return 10;});
        spyOn(numberScale, 'tickIntervalBoundaries').and.callFake(function(){return 1;});
        var scale = {
            ticks: function(){ return [-3, -2, -1, 0, 1, 2, 3]; },
            domain: function() { return [-3.5,3.5]; },
            range: function() { return [0,300]; }
        };
        var result = numberScale.detailedTicks(scale, 100);
        expect(result.length).toBe(9);
        expect(result[0]).toBe(-4);
        expect(result[6]).toBe(2);
        expect(result[7]).toBe(3);
        expect(result[8]).toBe(4);
    });

    it('detailedTicks for a reversed number scale  (i.e. vertical)', function(){

        spyOn(numberScale, 'tickCount').and.callFake(function(){return 5;});
        spyOn(numberScale, 'tickIntervalBoundaries').and.callFake(function(){return 20;});
        var scale = {
            ticks: function(){ return [0, 20, 40, 60]; },
            domain: function() { return [70, 0]; },
            range: function() { return [0,300]; }
        };
        var result = numberScale.detailedTicks(scale, 100);
        expect(result.length).toBe(6);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[3]).toBe(40);
        expect(result[4]).toBe(60);
        expect(result[5]).toBe(80);
    });

    it('hardRule to show zero when all positive ', function(){

        spyOn(numberScale, 'detailedTicks').and.callFake(function(){return [0, 20, 40, 60,80,0];});
        spyOn(numberScale, 'removeDuplicateTicks').and.callFake(function(){return [0, 20, 40, 60,80,0];});
        var scale = function () {
            return {
                ticks: function(){ return [0, 20, 40, 60]; },
                domain: function() { return [70, 0]; }
            }
        };
        var config = {axes:{scale:scale}, pixelsPerTick: 100, hardRules: [0], simple:false};
        numberScale.customTicks(config, DataModel);
        expect(config.hardRules[0]).toBe(0);
        expect(config.hardRules[1]).toBe(0);
    });

    it('hardRule to show zero + negative when some negative ', function(){

        spyOn(numberScale, 'detailedTicks').and.callFake(function(){return [-3, -2, -1, 0, 1, 2, 3, 4, -4];});
        spyOn(numberScale, 'removeDuplicateTicks').and.callFake(function(){return [-3.5,3.5, 4, -4];});
        var scale = function () {
            return {
            ticks: function(){ return [-3, -2, -1, 0, 1, 2, 3]; },
            domain: function() { return [-3.5,3.5]; }
            }
        };
        var config = {axes:{scale:scale}, pixelsPerTick: 100, hardRules: [0], simple:false};
        numberScale.customTicks(config, DataModel);
        expect(config.hardRules[0]).toBe(0);
        expect(config.hardRules[1]).toBe(-3.5);
    });

});
