/* Add HTML + CSS to setup page for functional testing */

describe('line-chart  ', function () {

    var lineChart1, lineChart2, lineChart3, lineChart4, lineChart5, lineChart6, lineChart7, lineChart8, lineChart9, lineChart10, lineChart11;

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
            var labels = lineChart1.querySelectorAll('.chart__key text');
            expect(labels[0].textContent).toBe('value');
            expect(labels[1].textContent).toBe('value2');
        });

        it('key value pair', function () {
            var labels = lineChart2.querySelectorAll('.chart__key text');
            expect(labels[0].textContent).toBe('String Value');
            expect(labels[1].textContent).toBe('Another String Value');
        });

        it('result of a function', function () {
            var labels = lineChart3.querySelectorAll('.chart__key text');
            expect(labels[0].textContent).toBe('Function Value');
            expect(labels[1].textContent).toBe('Another function Value');
        });

        it('hovering over the chart', function(){
            var chart = lineChart11.querySelectorAll('.chart')[0].getBoundingClientRect() ;
            var key = lineChart11.querySelectorAll('.chart__key')[0].getBoundingClientRect() ;
            expect(chart.top + 5).toBeGreaterThan(key.top);
        });

    });

    describe('shows titles', function () {

        it('main title', function () {
            var title = lineChart1.querySelectorAll('.chart-title text');
            expect(title[0].textContent).toBe('Some Simple Lines: 1');
        });

        it('sub-title', function () {
            var title = lineChart1.querySelectorAll('.chart-subtitle text');
            expect(title[0].textContent).toBe('Drawn for you');
        });

        it('main title metadata', function () {
            var metaTitle = lineChart1.querySelectorAll('title');
            expect(metaTitle[0].textContent).toBe('Some Simple Lines: 1');
        });

        it('sub-title metadata', function () {
            var metaDescription = lineChart1.querySelectorAll('desc');
            expect(metaDescription[0].textContent).toBe('Drawn for you');
        });

    });

    describe('toggles data source if configured', function () {

        it('as false : it will be hidden', function () {
            var hiddenSource = lineChart1.querySelectorAll('.chart-source');
            expect(hiddenSource.length).toBe(0);
        });

        it('as true : it will be visible', function () {
            var visibleSource = lineChart3.querySelectorAll('.chart-source');
            expect(visibleSource.length).toBe(1);
            expect(visibleSource[0].textContent).toBe('Source: tbc');
        });

        it('Can handle zero\s', function () {
            var lines = lineChart4.querySelectorAll('.plot path');
            expect(lines.length).toBe(3);
        });

    });

    describe('positions y axis ', function () {

        it('without error', function () {
            var yAxis = lineChart1.querySelector('.y.axis text');
            expect(yAxis.textContent).not.toBe('NaN');

            yAxis = lineChart2.querySelector('.y.axis text');
            expect(yAxis.textContent).not.toBe('NaN');
        });

        it('on the left', function () {
            var yAxis = lineChart1.querySelector('.y.axis text');
            expect(parseInt(yAxis.getAttribute('x')) <0 ).toBeTruthy();
        });

        it('on the right', function () {
            var yAxis = lineChart2.querySelector('.y.axis text');
            expect(parseInt(yAxis.getAttribute('x')) >0 ).toBeTruthy();
        });

        it('with a reversed scale', function () {
            var yAxis = lineChart4.querySelectorAll('.y.axis g[transform="translate(0,0)"]');
            var yOrigin = lineChart4.querySelectorAll('.y.axis .origin');
            expect(yAxis[0].textContent).toBe('2.0');
            expect(yAxis[0].classList.contains('origin')).toBe(false);
            expect(yOrigin[0].textContent).toBe('-1.0');
            expect(yOrigin[1].textContent).toBe('0');

            var yAxisReversed = lineChart5.querySelectorAll('.y.axis g[transform="translate(0,0)"]');
            var yOriginReversed = lineChart5.querySelectorAll('.y.axis .origin');
            expect(yAxisReversed[0].textContent).toBe('-1.0');
            expect(yAxisReversed[0].classList.contains('origin')).toBe(false);
            expect(yOriginReversed[0].textContent).toBe('0');
            expect(yOriginReversed[1].textContent).toBe('2.0');
        });

    });


    describe('attaches style attributes to html elements', function () {

        it('line series', function () {
            var yAxis = lineChart2.querySelector('.chart .plot path');
            expect(yAxis.getAttribute('stroke-width')).toBeTruthy();
            expect(yAxis.getAttribute('stroke')).toBeTruthy();
            expect(yAxis.getAttribute('fill')).toBeTruthy();
        });

        it('line series key', function () {

            var yAxis = lineChart2.querySelector('.chart__key line');
            expect(yAxis.getAttribute('stroke-width')).toBeTruthy();
            expect(yAxis.getAttribute('stroke')).toBeTruthy();
            expect(yAxis.getAttribute('fill')).toBeTruthy();

        });

        it('keeps correct positioning with custom height', function(){
            var lines = lineChart11.querySelector('.line.line--series2');
            var footer = lineChart11.querySelector('.chart-footnote');
            expect(lines.getBoundingClientRect().width).toBe(552);
            expect(footer.getAttribute('transform')).toBe('translate(0,394)');
        });

    });

    describe('Quarterly Axis ', function () {

        it('Can be displayed', function () {
            var labels = lineChart6.querySelectorAll('.chart .x text');
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
        });

    });

    describe('has ticks ', function(){

        it('displayed even when no labels have been removed and there are no negative value', function(){
            var quarterlyTicksGraphA = lineChart7.querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphA.length).toBe(5);
            expect(quarterlyTicksGraphA[0].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphA[1].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphA[2].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphA[3].getAttribute('y2')).toBe('5');
        });

        it('extended when quarter `labels` are removed', function(){
            var quarterlyTicksGraphC = lineChart8.querySelectorAll('.x.axis .primary line');
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
            var quarterlyTicksGraphC = lineChart9.querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC.length).toBe(11);
        });

        it('small when quarter `ticks` are removed', function(){
            var quarterlyTicksGraphC = lineChart9.querySelectorAll('.x.axis .primary line');
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
            var quarterlyTicksGraphA = lineChart8.querySelectorAll('.x.axis .primary line');
            var quarterlyLabelsGraphA = lineChart8.querySelectorAll('.x.axis .primary text');
            var yearlyLabelsGraphA = lineChart8.querySelectorAll('.x.axis .secondary text');
            expect(quarterlyTicksGraphA.length).toBe(17);
            expect(quarterlyLabelsGraphA.length).toBe(5);
            expect(quarterlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA.length).toBe(0);
        });

        it('hidden when there are duplicate year labels', function(){
            var yearlyLabelsGraphA = lineChart6.querySelectorAll('.x.axis .secondary text');
            expect(yearlyLabelsGraphA.length).toBe(2);
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('06');
        });

        xit('shortened to 2 digits on the year that is not significant (ie. not the millenium)', function(){
            var yearlyLabelsGraphA = lineChart3.querySelectorAll('.x.axis .primary text');
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('06');
            expect(yearlyLabelsGraphA[2].textContent).toBe('07');
            expect(yearlyLabelsGraphA[3].textContent).toBe('08');
        });

    });
});
