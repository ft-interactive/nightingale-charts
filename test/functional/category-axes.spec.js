require('../helper').loadAssets('category-axes');
require('../../demo/scripts/category-axes').init();

describe('category axis', function () {

    describe('shows 4 quarters for a year', function () {
        var aYear = document.querySelectorAll('svg')[0];
        var x = aYear.querySelector('.x.axis');
        var ticks = x.querySelectorAll('.primary .tick');
        var labels = x.querySelectorAll('.primary .tick text');

        it('with one tick for each quarter', function () {
            expect(ticks.length).toBe(4);
        });

        it('with one label for each viewable quarter', function () {
            expect(labels.length).toBe(4);
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
        });

    });

});