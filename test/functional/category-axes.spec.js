require('../helper').loadAssets('category-axes');
var d3 = require('d3');
var catAxes = require('../../demo/scripts/category-axes');
catAxes.init();

describe('category axis', function () {

    beforeEach(function(){
        require('../helper').loadAssets('category-axes');
        require('../../demo/scripts/category-axes').init();
    });

    describe('daily scale', function () {
        var days = document.querySelectorAll('svg')[0];
        var manyDays = document.querySelectorAll('svg')[1];

        it('shows all ticks', function () {
            var tickss = days.querySelectorAll('.x.axis .primary .tick');
            expect(tickss.length).toBe(catAxes.fixtures.days.length);

            var ticksl = manyDays.querySelectorAll('.x.axis .primary .tick');
            expect(ticksl.length).toBe(catAxes.fixtures['many-days'].length);
        });

        it('shows one month for the small time period', function () {
            var labels = days.querySelectorAll('.x.axis .primary .tick text');
            expect(labels.length).toBe(1);
            expect(labels[0].textContent).toBe('May');
        });

    });

    describe('weekly scale', function() {
        var weeks = document.querySelectorAll('svg')[2];
        var manyWeeks = document.querySelectorAll('svg')[3];

        it('shows all ticks', function() {
            var xs = weeks.querySelector('.x.axis');
            var tickss = xs.querySelectorAll('.primary .tick');
            expect(tickss.length).toBe(catAxes.fixtures.weeks.length);

            var xl = manyWeeks.querySelector('.x.axis');
            var ticksl = xl.querySelectorAll('.primary .tick');
            expect(ticksl.length).toBe(catAxes.fixtures['many-weeks'].length);
        });

        it('shows three months for the small time period', function() {
            var labels = weeks.querySelectorAll('.x.axis .primary .tick text');
            expect(labels.length).toBe(3);
            expect(labels[0].textContent).toBe('May');
            expect(labels[1].textContent).toBe('Jun');
            expect(labels[2].textContent).toBe('Jul');
        });
    });


    describe('monthly scale', function () {
        var months = document.querySelectorAll('svg')[4];
        var manyMonths = document.querySelectorAll('svg')[5];

        it('shows all months for a small time period ', function () {
            var x = months.querySelector('.x.axis');
            var ticks = x.querySelectorAll('.primary .tick');
            var labels = x.querySelectorAll('.primary .tick text');
            var secondaryLabels = x.querySelectorAll('.secondary .tick text');
            expect(ticks.length).toBe(9);
            expect(labels.length).toBe(9);
            expect(secondaryLabels.length).toBe(2);
            expect(labels[0].textContent).toBe('Dec');
            expect(labels[1].textContent).toBe('Jan');
            expect(labels[2].textContent).toBe('Feb');
            expect(labels[3].textContent).toBe('Mar');
            expect(labels[4].textContent).toBe('Apr');
            expect(labels[5].textContent).toBe('May');
            expect(secondaryLabels[0].textContent).toBe('2005');
            expect(secondaryLabels[1].textContent).toBe('2006');
        });

        it('extends ticks when months labels are removed', function(){
            var x = manyMonths.querySelector('.x.axis');
            var ticks = x.querySelectorAll('.primary .tick line');
            var labels = x.querySelectorAll('.primary .tick text');
            var secondaryLabels = x.querySelectorAll('.secondary .tick text');
            expect(ticks.length).toBe(23);
            expect(ticks[0].getAttribute('y2')).toBe('5');
            expect(ticks[1].getAttribute('y2')).toBe('7.5');
            expect(ticks[2].getAttribute('y2')).toBe('5');
            expect(ticks[3].getAttribute('y2')).toBe('5');
            expect(ticks[4].getAttribute('y2')).toBe('5');
            expect(ticks[5].getAttribute('y2')).toBe('5');
            expect(ticks[12].getAttribute('y2')).toBe('5');
            expect(ticks[13].getAttribute('y2')).toBe('7.5');
            expect(ticks[14].getAttribute('y2')).toBe('5');
            expect(labels.length).toBe(3);
            expect(labels[0].textContent).toBe('Dec');
            expect(labels[1].textContent).toBe('Jan');
            expect(labels[2].textContent).toBe('Nov');
            expect(secondaryLabels.length).toBe(2);
            expect(secondaryLabels[0].textContent).toBe('2005');
            expect(secondaryLabels[1].textContent).toBe('2007');
        });

    });

    describe('quarterly scale', function () {
        var quarters = document.querySelectorAll('svg')[6];
        var manyQuarters = document.querySelectorAll('svg')[7];

        it('shows all quarters for a small time period ', function () {
            var x = quarters.querySelector('.x.axis');
            var ticks = x.querySelectorAll('.primary .tick');
            var labels = x.querySelectorAll('.primary .tick text');
            expect(ticks.length).toBe(5);
            expect(labels.length).toBe(5);
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
            expect(labels[4].textContent).toBe('Q1');
        });

        it('extends ticks when quarter labels are removed', function(){
            var x = manyQuarters.querySelector('.x.axis');
            var ticks = x.querySelectorAll('.primary .tick line');
            var labels = x.querySelectorAll('.primary .tick text');
            expect(ticks.length).toBe(24);
            expect(ticks[0].getAttribute('y2')).toBe('7.5');
            expect(ticks[1].getAttribute('y2')).toBe('5');
            expect(ticks[2].getAttribute('y2')).toBe('5');
            expect(ticks[3].getAttribute('y2')).toBe('5');
            expect(ticks[4].getAttribute('y2')).toBe('7.5');
            expect(ticks[5].getAttribute('y2')).toBe('5');
            expect(labels.length).toBe(6);
            expect(labels[0].textContent).toBe('2005');
            expect(labels[1].textContent).toBe('2006');
            expect(labels[2].textContent).toBe('2007');
            expect(labels[3].textContent).toBe('2008');
            expect(labels[4].textContent).toBe('2009');
            expect(labels[5].textContent).toBe('2010');
        });

    });

    describe('yearly scale', function () {
        var years = document.querySelectorAll('svg')[8];
        var manyYears = document.querySelectorAll('svg')[9];

        it('shows all years for a small time period ', function () {
            var x = years.querySelector('.x.axis');
            var ticks = x.querySelectorAll('.primary .tick');
            var labels = x.querySelectorAll('.primary .tick text');
            expect(ticks.length).toBe(11);
            expect(labels.length).toBe(11);
            expect(labels[0].textContent).toBe('2005');
            expect(labels[1].textContent).toBe('06');
            expect(labels[2].textContent).toBe('07');
            expect(labels[3].textContent).toBe('08');
            expect(labels[4].textContent).toBe('09');
        });

    });

    describe('label positions', function () {
        it('Text labels should have textAnchor: center', function() {
            var primaryTicks = document.querySelectorAll('.x.axis .primary .tick text');
            var secondaryTicks = document.querySelectorAll('.x.axis .secondary .tick text');

            // turn NodeList into Arrays;
            primaryTicks = Array.prototype.slice.call(primaryTicks);
            secondaryTicks = Array.prototype.slice.call(secondaryTicks);

            var ticks = primaryTicks.concat(secondaryTicks);

            for (var i = 0; i < ticks.length; i++) {
                expect(ticks[i].style.textAnchor).toEqual('middle');
            }

        });
    });

});
