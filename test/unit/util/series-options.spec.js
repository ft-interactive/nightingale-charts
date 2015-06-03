var series = require('../../../src/scripts/util/series-options');
var d3 = require('d3');

describe('line chart normalises given options', function () {

    describe('for a series:', function(){

        it('no args returns object with null key and label', function(){
            var data = {
            };
            var normalised = series.normalise(data.series);

            expect(normalised.key).toBe(null);
            expect(normalised.label).toBe(null);
        });

        it('string returns object with matching key and label', function(){
            var data = {
                series : 'value'
            };
            var normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('value');
        });

        it('Array returns object with matching key and label', function(){
            var data = {
                series : ['value', 'secondVal']
            };
            var normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('secondVal');
        });

        it('Object with missing label returns matching values', function(){
            var data = {
                series : {key:'value'}
            };
            var normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('value');
        });

        it('Object with label returns correct values', function(){
            var data = {
                series : {key:'value',label: 'a label'}
            };
            var normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('a label');
        });

        it('function returns return value', function(){
            var fn = function(){return 'fubar';}
            var data = {
                series : function(){return {key: fn,label: fn}; }
            };
            var normalised = series.normalise(data.series);

            expect(normalised.key).toBe('fubar');
            expect(normalised.label).toBe('fubar');
        });

    });

});
