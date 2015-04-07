var lineModel = require('../../../src/scripts/chart/line.model');

describe('line model', function () {

    it('returns a set of defaults when nothing is defined', function(){
        var model = lineModel.build();

        expect(model.height).toBe(undefined);
        expect(model.width).toBe(300);
        expect(model.chartHeight).toBe(203);
        expect(model.chartWidth).toBe(270);
        expect(model.timeDomain.length).toBe(2);
        expect(model.timeDomain[0]).toBe(undefined);
        expect(model.timeDomain[1]).toBe(undefined);
        expect(model.valueDomain.length).toBe(2);
        expect(model.valueDomain[0]).toBe(undefined);
        expect(model.valueDomain[1]).toBe(undefined);
        expect(model.key).toBe(false);
        expect(model.lineStrokeWidth).toBe(4);

    });

    it('returns values as set in options', function(){
        var model = lineModel.build({
            height: 100,
            width: 100,
            key: true,
            lineThickness: 10,
            //data:{myKey:[1,2,3,4]},
            //x: { series:{key:'myKey',value:'myValue'}},
            y: { series:[1,1]}
        });

        expect(model.height).toBe(100);
        expect(model.width).toBe(100);
        expect(model.chartHeight).toBe(88);
        expect(model.chartWidth).toBe(80);
        //expect(model.timeDomain.length).toBe(2);
        //expect(model.timeDomain[0]).toBe(undefined);
        //expect(model.timeDomain[1]).toBe(undefined);
        //expect(model.valueDomain.length).toBe(2);
        //expect(model.valueDomain[0]).toBe(undefined);
        //expect(model.valueDomain[1]).toBe(undefined);
        expect(model.key).toBe(true);
        expect(model.lineStrokeWidth).toBe(10);

    });
});