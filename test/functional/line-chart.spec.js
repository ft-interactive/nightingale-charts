/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('line-chart');

require('../../demo/scripts/line-chart').init();

fdescribe('line-chart  ', function () {

    var lineChart1 = document.querySelector('#line-chart1 svg');
    var lineChart2 = document.querySelector('#line-chart2 svg');
    var lineChart3 = document.querySelector('#line-chart3 svg');
    var lineChart4 = document.querySelector('#line-chart4 svg');

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

    });

    describe('Quarterly Axis ', function () {

        it('Can be displayed', function () {
            var labels = lineChart4.querySelectorAll('.chart .x text');
            expect(labels[0].textContent).toBe('Q1');
            expect(labels[1].textContent).toBe('Q2');
            expect(labels[2].textContent).toBe('Q3');
            expect(labels[3].textContent).toBe('Q4');
        });
        //todo: test: get line in middle of groupedTimeScale tick
        xit('first plot lines up with first tick', function () {
            //var labels = lineChart4.querySelector('.chart .x text');
            //expect(labels[0].textContent).toBe('Q1');
            //expect(labels[1].textContent).toBe('Q2');
            //expect(labels[2].textContent).toBe('Q3');
            //expect(labels[3].textContent).toBe('Q4');
        });

    });

});
