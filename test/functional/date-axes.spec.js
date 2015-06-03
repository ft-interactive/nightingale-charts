/* Start Test */
describe('When the date axis is', function () {

    beforeEach(function() {
        require('../helper').loadAssets('date-axes');
        require('../../demo/scripts/date-axes').init();
    });

    describe('a day or less,', function () {
        var dayOrLess, x, ticks, labels, firstTick, finalTick, firstTickLine,
            firstTickLabel, finalTickLine, finalTickLabel;

        beforeEach(function() {
            dayOrLess = document.querySelector('#views .axis-test:nth-child(1) svg');
            x = dayOrLess.querySelector('.x.axis');
            ticks = x.querySelectorAll('.primary .tick');
            labels = x.querySelectorAll('.primary .tick text');
            firstTick = ticks[0];
            finalTick = ticks[ticks.length-1];
            firstTickLine = firstTick.querySelectorAll('line');
            firstTickLabel = firstTick.querySelectorAll('text');
            finalTickLine = finalTick.querySelectorAll('line');
            finalTickLabel = finalTick.querySelectorAll('text');
        });

        afterEach(function() {
            document.body.innerHTML = '';
        });

        it('one tick for each hour is shown', function () {
            expect(ticks.length).toBe(12);
            expect(firstTickLine.length).toBe(1);
        });

        it('one label for each hour is shown', function () {
            expect(labels.length).toBe(7);
            expect(labels[0].textContent).toBe('11:00');
            expect(labels[1].textContent).toBe('13:00');
            expect(labels[2].textContent).toBe('15:00');
            expect(labels[3].textContent).toBe('17:00');
            expect(labels[4].textContent).toBe('19:00');
            expect(labels[5].textContent).toBe('21:00');
            expect(labels[6].textContent).toBe('22:00');
        });

        it('the time for the final tick is always shown (bug: NG-54)', function(){
            expect(finalTickLine.length).toBe(1);
            expect(finalTickLabel.length).toBe(1);
            expect(labels[labels.length-1].textContent).toBe('22:00');
        });

    });

    describe('a day or less (small),', function () {
        var dayOrLessSmall, x, ticks, labels, firstTick, firstTickLine;

        beforeEach(function() {

            dayOrLessSmall = document.querySelector('#viewsSmall .axis-test:nth-child(1) svg');
            x = dayOrLessSmall.querySelector('.x.axis');
            ticks = x.querySelectorAll('.primary .tick');
            labels = x.querySelectorAll('.primary .tick text');
            firstTick = ticks[0];
            firstTickLine = firstTick.querySelectorAll('line');

        });

        afterEach(function() {
            document.body.innerHTML = '';
        });

        it('one tick for each hour is shown', function () {
            expect(ticks.length).toBe(12);
            expect(firstTickLine.length).toBe(1);
        });

        it('one label for each non-overlapping hour is shown (bug: NG-60)', function () {
            expect(labels.length).toBe(6);
            expect(labels[0].textContent).toBe('11:00');
            expect(labels[1].textContent).toBe('13:00');
            expect(labels[2].textContent).toBe('15:00');
            expect(labels[3].textContent).toBe('17:00');
            expect(labels[4].textContent).toBe('19:00');
            expect(labels[5].textContent).toBe('22:00');
        });
    });

    describe('a few weeks,', function () {
        var aFewWeeks, x, ticks, labels, firstTick, firstTickLine;

        beforeEach(function() {
            aFewWeeks = document.querySelector('#views .axis-test:nth-child(2) svg');
            x = aFewWeeks.querySelector('.x.axis');
            ticks = x.querySelectorAll('.primary .tick');
            labels = x.querySelectorAll('.primary .tick text');
            firstTick = ticks[0];
            firstTickLine = firstTick.querySelectorAll('line');
        });

        afterEach(function() {
            document.body.innerHTML = '';
        });

        it('one tick for each day is shown', function () {
            expect(ticks.length).toBe(26);
            expect(firstTickLine.length).toBe(1);
        });

        it('one label for each first day, first of the month, and last day are shown', function () {
            expect(labels.length).toBe(3);
            expect(labels[0].textContent).toBe('13');
            expect(labels[1].textContent).toBe(' 1');
            expect(labels[2].textContent).toBe(' 7');
        });

    });

    describe('between 3 - 15 years,', function () {
        var threeToFifteenYears, x, ticks, labels, firstTick, firstTickLine;

        beforeEach(function() {
            threeToFifteenYears = document.querySelector('#views .axis-test:nth-child(5) svg');
            x = threeToFifteenYears.querySelector('.x.axis');
            ticks = x.querySelectorAll('.primary .tick');
            labels = x.querySelectorAll('.primary .tick text');
            firstTick = ticks[0];
            firstTickLine = firstTick.querySelectorAll('line');
        });

        afterEach(function() {
            document.body.innerHTML = '';
        });

        it('shows one tick for each year', function () {
            expect(ticks.length).toBe(10);
            expect(firstTickLine.length).toBe(1);
        });

        it('shows one label for each year', function () {
            expect(labels.length).toBe(10);

        });

        it('shows first label as the full year', function () {
            expect(labels[0].textContent).toBe('2001');

        });

        it('shows subsequent labels as last 2 digits of year', function () {
            expect(labels[1].textContent).toBe('02');
            expect(labels[2].textContent).toBe('03');
            expect(labels[3].textContent).toBe('04');
            expect(labels[4].textContent).toBe('05');
            expect(labels[5].textContent).toBe('06');
            expect(labels[6].textContent).toBe('07');
            expect(labels[7].textContent).toBe('08');
            expect(labels[8].textContent).toBe('09');
            expect(labels[9].textContent).toBe('10');
        });

    });

    describe('has 2 ticks very close to each other, ', function () {
        var overlapping, overlappingX, ticks, overlappingLabels;

        beforeEach(function() {
            overlapping = document.querySelector('#viewsSmall .axis-test:nth-child(9) svg');
            overlappingX = overlapping.querySelector('.x.axis');
            ticks = overlappingX.querySelectorAll('.primary .tick');
            overlappingLabels = overlappingX.querySelectorAll('.primary .tick text');
        });

        afterEach(function() {
            document.body.innerHTML = '';
        });

        it('they should not overlap (ng-65)', function () {
            expect(ticks.length).toBe(15);
            expect(overlappingLabels.length).toBe(5);
            expect(overlappingLabels[0].textContent).toBe('1999');
            expect(overlappingLabels[4].textContent).toBe('13');
        });

        xit('they should show full label if significant change', function () {
            var hundreds = document.querySelector('#viewsSmall .axis-test:nth-child(8) svg');
            var hundredsX = hundreds.querySelector('.x.axis');
            var hundredsLabels = hundredsX.querySelectorAll('.primary .tick text');
            expect(hundredsLabels[0].textContent).toBe('1500');
            expect(hundredsLabels[3].textContent).toBe('2015');

            expect(overlappingLabels[0].textContent).toBe('1999');
            expect(overlappingLabels[1].textContent).toBe('2003');
            expect(overlappingLabels[4].textContent).toBe('13');
        });
    });

    describe('X axis labels', function() {
        var intersection = require('../../src/scripts/util/labels').intersection;
        var axes;

        beforeEach(function() {
            axes = document.querySelectorAll('g.x.axis g.primary,g.secondary');
        });

        afterEach(function() {
            document.body.innerHTML = '';
        });

        it('should never overlap', function() {
            var ax, i, j, textLabels, parent;
            for (i = 0; i < axes.length; i ++) {
                ax = axes[i];
                textLabels = ax.querySelectorAll('text');
                for (j = 1; j < textLabels.length; j++) {
                    var previous = textLabels[j-1].getBoundingClientRect();
                    var current = textLabels[j].getBoundingClientRect();
                    expect(intersection(previous, current)).toBe(false);
                }
            }
        });

        it('should have no textAnchor', function() {
            var primaryTicks = document.querySelectorAll('.x.axis .primary .tick text');
            var secondaryTicks = document.querySelectorAll('.x.axis .secondary .tick text');

            // turn NodeList into Arrays;
            primaryTicks = Array.prototype.slice.call(primaryTicks);
            secondaryTicks = Array.prototype.slice.call(secondaryTicks);

            var ticks = primaryTicks.concat(secondaryTicks);

            for (var i = 0; i < ticks.length; i++) {
                expect(ticks[i].style.textAnchor).toEqual("");
            }
        });

    });


});
