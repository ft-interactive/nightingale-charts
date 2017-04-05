const series = require('../../../src/scripts/util/series-options');

describe('line chart normalises given options', function () {

    describe('for a series:', function(){

        it('no args returns object with null key and label', function(){
            const data = {
            };
            const normalised = series.normalise(data.series);

            expect(normalised.key).toBe(null);
            expect(normalised.label).toBe(null);
        });

        it('string returns object with matching key and label', function(){
            const data = {
                series : 'value'
            };
            const normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('value');
        });

        it('Array returns object with matching key and label', function(){
            const data = {
                series : ['value', 'secondVal']
            };
            const normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('secondVal');
        });

        it('Object with missing label returns matching values', function(){
            const data = {
                series : {key:'value'}
            };
            const normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('value');
        });

        it('Object with label returns correct values', function(){
            const data = {
                series : {key:'value',label: 'a label'}
            };
            const normalised = series.normalise(data.series);

            expect(normalised.key).toBe('value');
            expect(normalised.label).toBe('a label');
        });

        it('function returns return value', function(){
            const fn = function(){return 'fubar';};
            const data = {
                series : function(){return {key: fn,label: fn}; }
            };
            const normalised = series.normalise(data.series);

            expect(normalised.key).toBe('fubar');
            expect(normalised.label).toBe('fubar');
        });

    });

});
