require('../helper').loadAssets('quarterly-axes');
require('../../demo/scripts/quarterly-axes').init();

describe('quarterly axis', function () {

    describe('shows a year on the x axis', function () {
        var aYear = document.querySelector('#views .axis-test:nth-child(1) svg');
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

    describe('handles missing data and shows 2 years on x axis', function () {
        var twoYears = document.querySelector('#views .axis-test:nth-child(2) svg');
        var x = twoYears.querySelector('.x.axis');
        var ticks = x.querySelectorAll('.primary .tick');
        var labels = x.querySelectorAll('.primary .tick text');

        it('with one tick for each quarter', function () {
            expect(ticks.length).toBe(8);
        });

        it('with one label for each viewable quarter', function () {
            expect(labels.length).toBe(8);
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
            expect(labels[4].textContent).toBe('Q1');
            expect(labels[5].textContent).toBe('Q2');
            expect(labels[6].textContent).toBe('Q3');
            expect(labels[7].textContent).toBe('Q4');
        });


    });

});