var DataModel = require('../../../src/scripts/util/data.model');

describe('data model', function () {

    it('returns a set of defaults when nothing is defined', function(){
        var model = new DataModel('line');

        expect(model.chartType).toBe('line');
        expect(model.height).toBe(undefined);
        expect(model.width).toBe(300);
        expect(model.chartHeight).toBe(194);
        expect(model.chartWidth).toBe(296);
        expect(model.independentDomain.length).toBe(2);
        expect(model.independentDomain[0]).toBe(undefined);
        expect(model.independentDomain[1]).toBe(undefined);
        expect(model.dependentDomain.length).toBe(2);
        expect(model.dependentDomain[0]).toBe(undefined);
        expect(model.dependentDomain[1]).toBe(undefined);
        expect(model.key).toBe(false);
        expect(model.lineStrokeWidth).toBe(4);

    });

    it('doesnt reorder grouped dates (chrome test)', function(){
        var model = new DataModel('column', {
            units: ['yearly'],
            data: [
                {date: new Date('2008'), value: 10, value2: 1},
                {date: new Date('2009'), value: 11, value2: 1},
                {date: new Date('2010'), value: 12, value2: 1},
                {date: new Date('2011'), value: 13, value2: 1}
            ],
            x: { series: ['date']},
            y: { series: ['value', 'value2']},
            stack: false
        });
        expect(model.groupData).toBe(true);
        expect(model.data[0].key).toBe('2008');
        expect(model.data[1].key).toBe('09');
        expect(model.data[2].key).toBe('10');
        expect(model.data[3].key).toBe('11');
    });

    it('returns values as set in options', function(){
        var model = new DataModel('line', {
            height: 100,
            width: 100,
            key: true,
            falseOrigin: false,
            lineThickness: 10,
            stack: false,
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
        expect(model.chartHeight).toBe(77.60000000000001);
        expect(model.chartWidth).toBe(80);
        expect(model.independentDomain.length).toBe(2);
        expect(model.independentDomain[0].toString()).toBe(new Date('2000-01-01T00:00:00.000Z').toString());
        expect(model.independentDomain[1].toString()).toBe(new Date('2003-01-01T00:00:00.000Z').toString());
        expect(model.dependentDomain.length).toBe(2);
        expect(model.dependentDomain[0]).toBe(0);
        expect(model.dependentDomain[1]).toBe(39.23);
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
            stack: false,
            data: [
                {quartersCol: new Date('2000-01-01T00:00:00.000Z'), qValue: 10.23, value2: 12},
                {quartersCol: new Date('2001-01-01T00:00:00.000Z'), qValue: 29.23, value2: 29},
                {quartersCol: new Date('2002-01-01T00:00:00.000Z'), qValue: 32.23, value2: 32},
                {quartersCol: new Date('2003-01-01T00:00:00.000Z'), qValue: 39.23, value2: 37}
            ],
            units: ['quarterly','yearly'],
            x: { series:{key:'quartersCol',label:'myValue'}},
            y: { series: [{key:'qValue', label:'String Value'},
                {key:'value2', label:'Another String Value'}]}
        });

        expect(model.chartType).toBe('column');
        expect(model.independentDomain.length).toBe(4);
        expect(model.independentDomain[0]).toBe('Q1 2000');
        expect(model.independentDomain[1]).toBe('Q1 01');

    });

    it('handles line-chart errors', function(){
        spyOn(DataModel.prototype,'error').and.callFake(function(msg){
            return msg;
        });
        var model = new DataModel('line', {
            chartHeight: 100,
            chartWidth: 100,
            key: false,
            falseOrigin: false,
            lineThickness: 10,
            stack: false,
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
        expect(model.chartHeight).toBe(72);
        expect(model.chartWidth).toBe(100);
        expect(model.independentDomain.length).toBe(2);
        expect(model.independentDomain[0]).toBe(undefined);
        expect(model.independentDomain[1]).toBe(undefined);
        expect(model.dependentDomain.length).toBe(2);
        expect(model.dependentDomain[0]).toBe(0);
        expect(model.dependentDomain[1]).toBe(39.23);
        expect(model.key).toBe(false);
        expect(model.lineStrokeWidth).toBe(10);

    });

    it('handles column-chart errors', function(){
        spyOn(DataModel.prototype,'error').and.callFake(function(msg){
            return msg;
        });
        var model = new DataModel('column', {
            chartHeight: 100,
            chartWidth: 100,
            key: false,
            falseOrigin: false,
            lineThickness: 10,
            stack: false,
            data: [
                {date: '2000-01-01T00:00:00.000Z', value: 10.23, value2: 12},
                {date: '2001-01-01T00:00:00.000Z', value: 't', value2: 29},
                {date: undefined, value: 32.23, value2: undefined},
                {date: '2003-01-01T00:00:00.000Z', value: 39.23, value2: 37}
            ],
            x: { series:{key:'date',label:'myValue'}},
            y: { series: [{key:'value', label:'String Value'},
                {key:'value2', label:'Another String Value'}]},
            dataType: 'categorical'
        });
        expect(DataModel.prototype.error.calls.count()).toBe(3);
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
        expect(model.chartHeight).toBe(72);
        expect(model.chartWidth).toBe(100);
        expect(model.independentDomain.length).toBe(4);
        expect(model.independentDomain[0]).toBe('2000-01-01T00:00:00.000Z');
        expect(model.independentDomain[1]).toBe('2001-01-01T00:00:00.000Z');
        expect(model.dependentDomain.length).toBe(2);
        expect(model.dependentDomain[0]).toBe(0);
        expect(model.dependentDomain[1]).toBe(39.23);
        expect(model.key).toBe(false);
        expect(model.lineStrokeWidth).toBe(10);

    });

    it('sets the max value of the dependentDomain to zero when all values are neg on column and bar charts', function() {
        var columnModel = new DataModel('column', {
            height: 100,
            width: 100,
            key: true,
            falseOrigin: false,
            lineThickness: 10,
            stack: false,
            data: [
                {quartersCol: new Date('2000-01-01T00:00:00.000Z'), qValue: -10.23, value2: -12},
                {quartersCol: new Date('2001-01-01T00:00:00.000Z'), qValue: -29.23, value2: -29},
                {quartersCol: new Date('2002-01-01T00:00:00.000Z'), qValue: -32.23, value2: -32},
                {quartersCol: new Date('2003-01-01T00:00:00.000Z'), qValue: -39.23, value2: -37}
            ],
            units: ['quarterly','yearly'],
            x: { series:{key:'quartersCol',label:'myValue'}},
            y: { series: [{key:'qValue', label:'String Value'},
                {key:'value2', label:'Another String Value'}]}
        });
        var barModel = new DataModel('bar', {
            height: 100,
            width: 100,
            key: true,
            falseOrigin: false,
            lineThickness: 10,
            stack: false,
            data: [
                {quartersCol: new Date('2000-01-01T00:00:00.000Z'), qValue: -10.23, value2: -12},
                {quartersCol: new Date('2001-01-01T00:00:00.000Z'), qValue: -29.23, value2: -29},
                {quartersCol: new Date('2002-01-01T00:00:00.000Z'), qValue: -32.23, value2: -32},
                {quartersCol: new Date('2003-01-01T00:00:00.000Z'), qValue: -39.23, value2: -37}
            ],
            units: ['quarterly','yearly'],
            x: { series:{key:'quartersCol',label:'myValue'}},
            y: { series: [{key:'qValue', label:'String Value'},
                {key:'value2', label:'Another String Value'}]}
        });

        expect(columnModel.dependentDomain[1]).toBe(0);
        expect(barModel.dependentDomain[1]).toBe(0);

    });

});
