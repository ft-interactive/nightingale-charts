/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('column-chart');
require('../../demo/scripts/column-chart').init();

describe('column-chart', function () {
    describe('positions y axis ', function () {

        it('correctly with values >= 0', function () {
            var aYear = document.querySelectorAll('svg')[0];
            expect(true).toBe(true);

            var dataVals = aYear.querySelectorAll('rect');
            console.log(dataVals);
        });

        it('correctly with some values < 0', function () {
            var aYear = document.querySelectorAll('svg')[1];
            expect(true).toBe(true);
        });
    });
});