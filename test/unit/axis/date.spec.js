const date = require('../../../src/scripts/axis/date');

describe('return configure functions', function () {

    it('simple', function(){
        expect(date().simple()).toBe(false);

        const s = date().simple(true);
        expect(s.simple()).toBe(true);
    });

    it('nice', function(){
        expect(date().nice()).toBe(false);

        const s = date().nice(true);
        expect(s.nice()).toBe(true);
    });

    it('labelWidth', function(){
        expect(date().labelWidth()).toBe(0);

        const s = date().labelWidth(10);
        expect(s.labelWidth()).toBe(10);
    });

    it('lineHeight', function(){
        expect(date().lineHeight()).toBe(20);

        const s = date().lineHeight(30);
        expect(s.lineHeight()).toBe(30);
    });

    it('tickSize', function(){
        expect(date().tickSize()).toBe(5);

        const s = date().tickSize(50);
        expect(s.tickSize()).toBe(50);
    });

    it('yOffset', function(){
        expect(date().yOffset()).toBe(0);

        const s = date().yOffset(10);
        expect(s.yOffset()).toBe(10);
    });

    it('xOffset', function(){
        expect(date().xOffset()).toBe(0);

        const s = date().xOffset(10);
        expect(s.xOffset()).toBe(10);
    });

});
