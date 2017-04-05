const number = require('../../../src/scripts/axis/number');

describe('return configure functions', function () {

    it('tickExtension', function(){
        expect(number().tickExtension()).toBe(0);

        const s = number().tickExtension(13);
        expect(s.tickExtension()).toBe(13);
    });

    xit('tickSize', function(){
        expect(number().tickSize()).toBe(5);

        const s = number().tickSize(26);
        expect(s.tickSize()).toBe(26);
    });

    xit('ticks', function(){
        expect(number().ticks()[0]).toBe(0);

        const s = number().ticks(10);
        expect(s.ticks()[0]).toBe(10);
    });

    it('ticks cant be less than 0', function(){
        const s = number().ticks(-10);
        expect(s.ticks()[0]).toBe(10);
    });

    it('orient', function(){
        expect(number().orient()).toBe('left');

        const s = number().orient('right');
        expect(s.orient()).toBe('right');
    });

    it('simple', function(){
        expect(number().simple()).toBe(false);

        const s = number().simple(true);
        expect(s.simple()).toBe(true);
    });

    it('pixelsPerTick', function(){
        expect(number().pixelsPerTick()).toBe(100);

        const s = number().pixelsPerTick(10);
        expect(s.pixelsPerTick()).toBe(10);
    });


    it('yOffset', function(){
        expect(number().yOffset()).toBe(0);

        const s = number().yOffset(10);
        expect(s.yOffset()).toBe(10);
    });

    it('xOffset', function(){
        expect(number().xOffset()).toBe(0);

        const s = number().xOffset(10);
        expect(s.xOffset()).toBe(10);
    });

    it('hardRules', function(){
        expect(number().hardRules()[0]).toBe(0);

        const s = number().hardRules([10]);
        expect(s.hardRules()[0]).toBe(10);
    });

    it('tickFormat', function(){
        expect(number().tickFormat()).toBe(undefined);

        const s = number().tickFormat(",.0f");
        expect(s.tickFormat()).toBe(",.0f");
    });

    it('noLabels', function(){
        expect(number().noLabels()).toBe(false);

        const s = number().noLabels(true);
        expect(s.noLabels()).toBe(true);
    });
});
