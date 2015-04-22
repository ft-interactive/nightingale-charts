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

    xdescribe('hides q2, q3 + q4 when any quarter overlaps', function () {
        var twoYears = document.querySelectorAll('svg')[1];
        var x = twoYears.querySelector('.x.axis');
        var ticks = x.querySelectorAll('.primary .tick');
        var labels = x.querySelectorAll('.primary .tick text');
        var yearLabels = x.querySelectorAll('.secondary .tick text');

        it('with one tick for each quarter', function () {
            expect(ticks.length).toBe(16);
        });

        it('with one label for each viewable quarter', function () {
            expect(labels.length).toBe(5);
            expect(yearLabels.length).toBe(5);
            expect(labels[0].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q1');
            expect(labels[3].textContent).toBe('Q1');
            expect(labels[4].textContent).toBe('Q1');
            expect(labels[5].textContent).toBe('Q1');
            expect(yearLabels[0].textContent).toBe('1981');
            expect(yearLabels[1].textContent).toBe('82');
        });

    });

    xdescribe('shows years when more than a decade', function () {
        var decades = document.querySelectorAll('svg')[2];
        var x = decades.querySelector('.x.axis');
        var ticks = x.querySelectorAll('.primary .tick');
        var labels = x.querySelectorAll('.primary .tick text');
        var quarterLabels = x.querySelectorAll('.secondary .tick text');
        var quarterTicks = x.querySelectorAll('.secondary .tick');

        it('with one tick for each non-overlapping year', function () {
            expect(ticks.length).toBe(9);
        });
        it('with one tick for first quarter', function () {
            expect(quarterTicks.length).toBe(1);
            expect(quarterLabels[0].textContent).toBe('Q1');
        });

        it('with one label for each viewable year', function () {
            expect(labels.length).toBe(9);
            expect(labels[0].textContent).toBe('1981');
            expect(labels[2].textContent).toBe('85');
            expect(labels[3].textContent).toBe('89');
            expect(labels[4].textContent).toBe('93');
            expect(labels[5].textContent).toBe('01');
        });
    });

});