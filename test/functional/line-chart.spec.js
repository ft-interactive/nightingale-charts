/* Add HTML + CSS to setup page for functional testing */

describe('line-chart  ', function () {

    let lineChart1;
    let lineChart2;
    let lineChart3;
    let lineChart4;
    let lineChart5;
    let lineChart6;
    let lineChart7;
    let lineChart8;
    let lineChart9;
    let lineChart10; // eslint-disable-line no-unused-vars
    let lineChart11;

    beforeEach(function(){
        //pm: hack to stop spec rewriting dom too early :(
        require('../helper').loadAssets('line-chart');
        require('../fixtures/scripts/line-chart').init();

        lineChart1 = document.querySelector('#line-chart1 svg');
        lineChart2 = document.querySelector('#line-chart2 svg');
        lineChart3 = document.querySelector('#line-chart3 svg');
        lineChart4 = document.querySelector('#line-chart4 svg');
        lineChart5 = document.querySelector('#line-chart5 svg');
        lineChart6 = document.querySelector('#line-chart6 svg');
        lineChart7 = document.querySelector('#line-chart7 svg');
        lineChart8 = document.querySelector('#line-chart8 svg');
        lineChart9 = document.querySelector('#line-chart9 svg');
        lineChart10 = document.querySelector('#line-chart10 svg');
        lineChart11 = document.querySelector('#line-chart11 svg');
    });

    describe('shows line keys as ', function () {

        it('Strings', function () {
            const labels = lineChart1.querySelectorAll('.chart__key text');
            expect(labels[0].textContent).toBe('value');
            expect(labels[1].textContent).toBe('value2');
        });

        it('key value pair', function () {
            const labels = lineChart2.querySelectorAll('.chart__key text');
            expect(labels[0].textContent).toBe('String Value');
            expect(labels[1].textContent).toBe('Another String Value');
        });

        it('result of a function', function () {
            const labels = lineChart3.querySelectorAll('.chart__key text');
            expect(labels[0].textContent).toBe('Function Value');
            expect(labels[1].textContent).toBe('Another function Value');
        });

        it('hovering over the chart', function(){
            const chart = lineChart11.querySelectorAll('.chart')[0].getBoundingClientRect() ;
            const key = lineChart11.querySelectorAll('.chart__key')[0].getBoundingClientRect() ;
            expect(chart.top + 5).toBeGreaterThan(key.top);
        });

    });

    describe('shows titles', function () {

        it('main title', function () {
            const title = lineChart1.querySelectorAll('.chart-title text');
            expect(title[0].textContent).toBe('Some Simple Lines: 1');
        });

        it('sub-title', function () {
            const title = lineChart1.querySelectorAll('.chart-subtitle text');
            expect(title[0].textContent).toBe('Drawn for you');
        });

        it('main title metadata', function () {
            const metaTitle = lineChart1.querySelectorAll('title');
            expect(metaTitle[0].textContent).toBe('Some Simple Lines: 1');
        });

        it('sub-title metadata', function () {
            const metaDescription = lineChart1.querySelectorAll('desc');
            expect(metaDescription[0].textContent).toBe('Drawn for you');
        });

    });

    describe('toggles data source if configured', function () {

        it('as false : it will be hidden', function () {
            const hiddenSource = lineChart1.querySelectorAll('.chart-source');
            expect(hiddenSource.length).toBe(0);
        });

        it('as true : it will be visible', function () {
            const visibleSource = lineChart3.querySelectorAll('.chart-source');
            expect(visibleSource.length).toBe(1);
            expect(visibleSource[0].textContent).toBe('Source: tbc');
        });

        it('Can handle zero\s', function () {
            const lines = lineChart4.querySelectorAll('.plot path');
            expect(lines.length).toBe(3);
        });

    });

    describe('positions y axis ', function () {

        it('without error', function () {
            let yAxis = lineChart1.querySelector('.y.axis text');
            expect(yAxis.textContent).not.toBe('NaN');

            yAxis = lineChart2.querySelector('.y.axis text');
            expect(yAxis.textContent).not.toBe('NaN');
        });

        it('on the left', function () {
            const yAxis = lineChart1.querySelector('.y.axis text');
            expect(parseInt(yAxis.getAttribute('x')) <0 ).toBeTruthy();
        });

        it('on the right', function () {
            const yAxis = lineChart2.querySelector('.y.axis text');
            expect(parseInt(yAxis.getAttribute('x')) >0 ).toBeTruthy();
        });

        it('with a reversed scale', function () {
            const yAxis = lineChart4.querySelectorAll('.y.axis g[transform="translate(0,0)"]');
            const yOrigin = lineChart4.querySelectorAll('.y.axis .origin');
            expect(yAxis[0].textContent).toBe('2.0');
            expect(yAxis[0].classList.contains('origin')).toBe(false);
            expect(yOrigin[0].textContent).toBe('-1.0');
            expect(yOrigin[1].textContent).toBe('0');

            const yAxisReversed = lineChart5.querySelectorAll('.y.axis g[transform="translate(0,0)"]');
            const yOriginReversed = lineChart5.querySelectorAll('.y.axis .origin');
            expect(yAxisReversed[0].textContent).toBe('-1.0');
            expect(yAxisReversed[0].classList.contains('origin')).toBe(false);
            expect(yOriginReversed[0].textContent).toBe('0');
            expect(yOriginReversed[1].textContent).toBe('2.0');
        });

    });


    describe('attaches style attributes to html elements', function () {

        it('line series', function () {
            const yAxis = lineChart2.querySelector('.chart .plot path');
            expect(yAxis.getAttribute('stroke-width')).toBeTruthy();
            expect(yAxis.getAttribute('stroke')).toBeTruthy();
            expect(yAxis.getAttribute('fill')).toBeTruthy();
        });

        it('line series key', function () {

            const yAxis = lineChart2.querySelector('.chart__key line');
            expect(yAxis.getAttribute('stroke-width')).toBeTruthy();
            expect(yAxis.getAttribute('stroke')).toBeTruthy();
            expect(yAxis.getAttribute('fill')).toBeTruthy();

        });

        it('keeps correct positioning with custom height', function(){
            const lines = lineChart11.querySelector('.line.line--series2');
            const footer = lineChart11.querySelector('.chart-footnote');
            expect(lines.getBoundingClientRect().width).toBeGreaterThan(550);
            expect(lines.getBoundingClientRect().width).toBeLessThan(553);
            expect(footer.getAttribute('transform')).toBe('translate(0,394)');
        });

    });

    describe('Quarterly Axis ', function () {

        it('Can be displayed', function () {
            const labels = lineChart6.querySelectorAll('.chart .x text');
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
        });

    });

    describe('has ticks ', function(){

        it('displayed even when no labels have been removed and there are no negative value', function(){
            const quarterlyTicksGraphA = lineChart7.querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphA.length).toBe(5);
            expect(quarterlyTicksGraphA[0].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphA[1].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphA[2].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphA[3].getAttribute('y2')).toBe('5');
        });

        it('extended when quarter `labels` are removed', function(){
            const quarterlyTicksGraphC = lineChart8.querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC[0].getAttribute('y2')).toBe('7.5');
            expect(quarterlyTicksGraphC[1].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[2].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[3].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[4].getAttribute('y2')).toBe('7.5');
            expect(quarterlyTicksGraphC[5].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[6].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[7].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[8].getAttribute('y2')).toBe('7.5');
        });

        it('removed when timeframe is over a decade', function(){
            const quarterlyTicksGraphC = lineChart9.querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC.length).toBe(11);
        });

        it('small when quarter `ticks` are removed', function(){
            const quarterlyTicksGraphC = lineChart9.querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC[0].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[1].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[2].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[3].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[4].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[5].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[6].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[7].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[8].getAttribute('y2')).toBe('5');
        });

    });

    describe('has labels ', function(){

        it('hidden when any quarter overlaps', function(){
            const quarterlyTicksGraphA = lineChart8.querySelectorAll('.x.axis .primary line');
            const quarterlyLabelsGraphA = lineChart8.querySelectorAll('.x.axis .primary text');
            const yearlyLabelsGraphA = lineChart8.querySelectorAll('.x.axis .secondary text');
            expect(quarterlyTicksGraphA.length).toBe(17);
            expect(quarterlyLabelsGraphA.length).toBe(5);
            expect(quarterlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA.length).toBe(0);
        });

        it('hidden when there are duplicate year labels', function(){
            const yearlyLabelsGraphA = lineChart6.querySelectorAll('.x.axis .secondary text');
            expect(yearlyLabelsGraphA.length).toBe(2);
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('06');
        });

        xit('shortened to 2 digits on the year that is not significant (ie. not the millenium)', function(){
            const yearlyLabelsGraphA = lineChart3.querySelectorAll('.x.axis .primary text');
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('06');
            expect(yearlyLabelsGraphA[2].textContent).toBe('07');
            expect(yearlyLabelsGraphA[3].textContent).toBe('08');
        });

    });
});
