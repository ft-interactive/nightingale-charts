var DataModel = require('../../../src/scripts/util/data.model');

describe('data model', function () {

    it('returns a set of defaults when nothing is defined', function(){
        var model = new DataModel('line');

        expect(model.chartType).toBe('line');
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
        var model = new DataModel('line', {
            height: 100,
            width: 100,
            key: true,
            falseOrigin: false,
            lineThickness: 10,
            data: [
                {date: new Date('2000-01-01T00:00:00.000Z'), value: 10.23, value2: 12},
                {date: new Date('2001-01-01T00:00:00.000Z'), value: 29.23, value2: 29},
                {date: new Date('2002-01-01T00:00:00.000Z'), value: 32.23, value2: 32},
                {date: new Date('2003-01-01T00:00:00.000Z'), value: 39.23, value2: 37}
            ],
            x: { series:{key:'date',label:'myValue'}},
            y: { series: [{key:'value', label:'String Value'},
                {key:'value2', label:'Another String Value'}]}
        });

        expect(model.height).toBe(100);
        expect(model.width).toBe(100);
        expect(model.chartHeight).toBe(88);
        expect(model.chartWidth).toBe(80);
        expect(model.timeDomain.length).toBe(2);
        expect(model.timeDomain[0].toString()).toBe(new Date('2000-01-01T00:00:00.000Z').toString());
        expect(model.timeDomain[1].toString()).toBe(new Date('2003-01-01T00:00:00.000Z').toString());
        expect(model.valueDomain.length).toBe(2);
        expect(model.valueDomain[0]).toBe(0);
        expect(model.valueDomain[1]).toBe(39.23);
        expect(model.key).toBe(true);
        expect(model.lineStrokeWidth).toBe(10);

    });

    it('groups dates with the correct key', function(){
        var model = new DataModel('column', {
            height: 100,
            width: 100,
            key: true,
            falseOrigin: false,
            lineThickness: 10,
            data: [
                {quartersCol: new Date('2000-01-01T00:00:00.000Z'), qValue: 10.23, value2: 12},
                {quartersCol: new Date('2001-01-01T00:00:00.000Z'), qValue: 29.23, value2: 29},
                {quartersCol: new Date('2002-01-01T00:00:00.000Z'), qValue: 32.23, value2: 32},
                {quartersCol: new Date('2003-01-01T00:00:00.000Z'), qValue: 39.23, value2: 37}
            ],
            groupDates: ['quarterly','yearly'],
            x: { series:{key:'quartersCol',label:'myValue'}},
            y: { series: [{key:'qValue', label:'String Value'},
                {key:'value2', label:'Another String Value'}]}
        });

        expect(model.chartType).toBe('column');
        expect(model.timeDomain.length).toBe(4);
        expect(model.timeDomain[0]).toBe('Q1 2000');
        expect(model.timeDomain[1]).toBe('Q1 01');

    });

    it('handles errs', function(){
        spyOn(DataModel.prototype,'error').and.callFake(function(msg){
            return msg;
        });
        var model = new DataModel('line', {
            chartHeight: 100,
            chartWidth: 100,
            key: false,
            falseOrigin: false,
            lineThickness: 10,
            data: [
                {date: '2000-01-01T00:00:00.000Z', value: 10.23, value2: 12},
                {date: '2001-01-01T00:00:00.000Z', value: 't', value2: 29},
                {date: undefined, value: 32.23, value2: undefined},
                {date: '2003-01-01T00:00:00.000Z', value: 39.23, value2: 37}
            ],
            x: { series:{key:'date',label:'myValue'}},
            y: { series: [{key:'value', label:'String Value'},
                {key:'value2', label:'Another String Value'}]}
        });
        expect(DataModel.prototype.error.calls.count()).toBe(6);
        expect(DataModel.prototype.error).toHaveBeenCalledWith(jasmine.objectContaining({
            node: null,
            message: "Value is not a valid date",
            row: 0,
            column: 'date',
            value: '2000-01-01T00:00:00.000Z'
        }));
        expect(DataModel.prototype.error).toHaveBeenCalledWith(jasmine.objectContaining({
            node: null,
            message: "Value is not a number",
            row: 1,
            column: 'value',
            value: 't'
        }));
        expect(DataModel.prototype.error).toHaveBeenCalledWith(jasmine.objectContaining({
            node: null,
            message: "X axis value is empty or null",
            row: 2,
            column: 'date',
            value: undefined
        }));
        expect(DataModel.prototype.error).toHaveBeenCalledWith(jasmine.objectContaining({
            message: "Value is not a number",
            row: 2,
            column: 'value2',
            value: undefined
        }));
        expect(model.height).toBe(undefined);
        expect(model.width).toBe(300);
        expect(model.chartHeight).toBe(100);
        expect(model.chartWidth).toBe(100);
        expect(model.timeDomain.length).toBe(2);
        expect(model.timeDomain[0]).toBe(undefined);
        expect(model.timeDomain[1]).toBe(null);
        expect(model.valueDomain.length).toBe(2);
        expect(model.valueDomain[0]).toBe(0);
        expect(model.valueDomain[1]).toBe(39.23);
        expect(model.key).toBe(false);
        expect(model.lineStrokeWidth).toBe(10);

    });
});
