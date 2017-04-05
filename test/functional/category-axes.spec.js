const d3 = require('d3');

describe('category axis', function () {

    let catAxes;

    beforeEach(function(){
        require('../helper').loadAssets('category-axes');
        catAxes = require('../fixtures/scripts/category-axes');
        catAxes.init();
    });

    describe('daily scale', function () {

        it('shows all ticks', function () {
            const days = document.querySelectorAll('svg')[0];
            const manyDays = document.querySelectorAll('svg')[2];
            const ticksS = days.querySelectorAll('.x.axis .primary .tick');
            expect(ticksS.length).toBe(catAxes.fixtures.days.length);
            const fmt = function(d, str) {
                str = d3.time.format('%e')(d);
                return (str[0] === ' ') ? str.substring(1) : str;
            };

            let txt;
            for (let i = 0; i < ticksS.length; i++) {
                txt = ticksS[i].querySelector('text').textContent;
                expect(txt).toBe(fmt(catAxes.fixtures.days[i].date));
            }

            const ticksl = manyDays.querySelectorAll('.x.axis .primary .tick');
            expect(ticksl.length).toBe(catAxes.fixtures['many-days'].length);
        });

        it('shows one month for the small time period', function () {
            const days = document.querySelectorAll('svg')[0];
            const manyDays = document.querySelectorAll('svg')[2]; // eslint-disable-line no-unused-vars
            const labels = days.querySelectorAll('.x.axis .primary .tick text');
            expect(labels.length).toBe(9);
        });

    });

    describe('weekly scale', function() {

        it('shows all ticks', function() {
            const weeks = document.querySelectorAll('svg')[4];
            const manyWeeks = document.querySelectorAll('svg')[6];

            const xs = weeks.querySelector('.x.axis');
            const tickss = xs.querySelectorAll('.primary .tick');
            expect(tickss.length).toBe(catAxes.fixtures.weeks.length);

            const xl = manyWeeks.querySelector('.x.axis');
            const ticksl = xl.querySelectorAll('.primary .tick');
            expect(ticksl.length).toBe(catAxes.fixtures['many-weeks'].length);
        });

        it('shows all ticks as circles', function() {
            const weeks = document.querySelectorAll('svg')[5];
            const manyWeeks = document.querySelectorAll('svg')[7];

            const xs = weeks.querySelector('.x.axis');
            const ticks = xs.querySelectorAll('.primary .tick circle');
            expect(ticks.length).toBe(catAxes.fixtures.weeks.length);

            const xl = manyWeeks.querySelector('.x.axis');
            const ticksl = xl.querySelectorAll('.primary .tick circle');
            expect(ticksl.length).toBe(catAxes.fixtures['many-weeks'].length);
        });

        it('shows three months for the small time period', function() {
            const weeks = document.querySelectorAll('svg')[4];
            const manyWeeks = document.querySelectorAll('svg')[6]; // eslint-disable-line no-unused-vars

            const labels = weeks.querySelectorAll('.x.axis .primary .tick text');
            expect(labels.length).toBe(3);
            expect(labels[0].textContent).toBe('May');
            expect(labels[1].textContent).toBe('Jun');
            expect(labels[2].textContent).toBe('Jul');
        });
    });


    describe('monthly scale', function () {

        it('shows all months for a small time period ', function () {
            const months = document.querySelectorAll('svg')[8];
            const manyMonths = document.querySelectorAll('svg')[10]; // eslint-disable-line no-unused-vars
            const x = months.querySelector('.x.axis');
            const ticks = x.querySelectorAll('.primary .tick');
            const labels = x.querySelectorAll('.primary .tick text');
            const secondaryLabels = x.querySelectorAll('.secondary .tick text');
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

        it('shows all months for a small time period with circle ticks displayed', function () {
            const months = document.querySelectorAll('svg')[9];
            const manyMonths = document.querySelectorAll('svg')[11]; // eslint-disable-line no-unused-vars
            const x = months.querySelector('.x.axis');
            const ticks = x.querySelectorAll('.primary .tick circle');
            const labels = x.querySelectorAll('.primary .tick text');
            expect(ticks.length).toBe(9);
            expect(ticks[0].getAttribute('r')).toBe('2');
            expect(ticks[1].getAttribute('r')).toBe('2');
            expect(ticks[2].getAttribute('r')).toBe('2');
            expect(ticks[3].getAttribute('r')).toBe('2');
            expect(ticks[4].getAttribute('r')).toBe('2');
            expect(ticks[5].getAttribute('r')).toBe('2');
            expect(ticks[6].getAttribute('r')).toBe('2');
            expect(ticks[7].getAttribute('r')).toBe('2');
            expect(ticks[8].getAttribute('r')).toBe('2');
            expect(labels.length).toBe(9);
            expect(labels[0].textContent).toBe('Dec');
            expect(labels[1].textContent).toBe('Jan');
            expect(labels[2].textContent).toBe('Feb');
        });

        it('extends ticks when months labels are removed', function(){
            const months = document.querySelectorAll('svg')[8]; // eslint-disable-line no-unused-vars
            const manyMonths = document.querySelectorAll('svg')[10];
            const x = manyMonths.querySelector('.x.axis');
            const ticks = x.querySelectorAll('.primary .tick line');
            const labels = x.querySelectorAll('.primary .tick text');
            const secondaryLabels = x.querySelectorAll('.secondary .tick text');
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

        it('shows all quarters for a small time period ', function () {
            const quarters = document.querySelectorAll('svg')[12];
            const manyQuarters = document.querySelectorAll('svg')[14]; // eslint-disable-line no-unused-vars
            const x = quarters.querySelector('.x.axis');
            const ticks = x.querySelectorAll('.primary .tick');
            const labels = x.querySelectorAll('.primary .tick text');
            expect(ticks.length).toBe(5);
            expect(labels.length).toBe(5);
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
            expect(labels[4].textContent).toBe('Q1');
        });

        it('extends ticks when quarter labels are removed', function(){
            const quarters = document.querySelectorAll('svg')[12]; // eslint-disable-line no-unused-vars
            const manyQuarters = document.querySelectorAll('svg')[14];
            const x = manyQuarters.querySelector('.x.axis');
            const ticks = x.querySelectorAll('.primary .tick line');
            const labels = x.querySelectorAll('.primary .tick text');
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

        it('shows all years for a small time period ', function () {
            const years = document.querySelectorAll('svg')[16];
            const manyYears = document.querySelectorAll('svg')[18]; // eslint-disable-line no-unused-vars
            const x = years.querySelector('.x.axis');
            const ticks = x.querySelectorAll('.primary .tick');
            const labels = x.querySelectorAll('.primary .tick text');
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
            let primaryTicks = document.querySelectorAll('.x.axis .primary .tick text');
            let secondaryTicks = document.querySelectorAll('.x.axis .secondary .tick text');

            // turn NodeList into Arrays;
            primaryTicks = Array.prototype.slice.call(primaryTicks);
            secondaryTicks = Array.prototype.slice.call(secondaryTicks);

            const ticks = primaryTicks.concat(secondaryTicks);

            for (let i = 0; i < ticks.length; i++) {
                expect(ticks[i].getAttribute('text-anchor')).toEqual('middle');
            }

        });
    });

});
