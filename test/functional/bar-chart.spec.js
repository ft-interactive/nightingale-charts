describe('bar-chart.js', function(){

    beforeEach(function(){
        //pm: hack to stop spec rewriting dom too early :(
        require('../helper').loadAssets('bar-chart');
        require('../fixtures/scripts/bar-chart').init();
    });

    describe('displays ', function() {
        it('origin lines', function() {
            var chart = document.querySelector('#bar-chart__categories .width600 svg');
            var origins = chart.querySelectorAll('.origin');
            expect(origins.length).toBe(1);
            expect(origins[0].textContent).toBe('0');
        });

        it('origin lines with negatives', function() {
            var chart = document.querySelector('#bar-chart__multipleWithNegatives .width600 svg');
            var origins = chart.querySelectorAll('.origin');
            expect(origins.length).toBe(2);
            expect(origins[0].textContent).toBe('-100');
            expect(origins[1].textContent).toBe('0');
        });

        it(' null values as N/A labels when null values are present', function() {
            var chart = document.querySelector('#bar-chart__multipleWithNegatives .width600 svg');
            var nullLabels = chart.querySelectorAll('text.null-label');
            expect(nullLabels.length).toBe(1);
            for (var i = 0; i < nullLabels.length; i++) {
                expect(nullLabels[i].innerHTML).toBe('n/a');
            }
        });

        it('null values as - labels when null values are present on small charts', function() {
            var chart = document.querySelector('#bar-chart__multipleWithNegatives .width300 svg');
            var nullLabels = chart.querySelectorAll('text.null-label');
            expect(nullLabels.length).toBe(1);
            for (var i = 0; i < nullLabels.length; i++) {
                expect(nullLabels[i].innerHTML).toBe('–');
            }
        });

        it('dependent axis at the top of the chart', function() {
            var chart = document.querySelector('#bar-chart__categoriesStack .width600 svg');
            var axis = chart.querySelector('.axis--dependent').parentNode;
            expect(axis.getAttribute('transform')).toBe('translate(0,0)');
        });

        it('dependent axis at the bottom of the chart', function() {
            var chart = document.querySelector('#bar-chart__categories .width600 svg');
            var axis = chart.querySelector('.axis--dependent').parentNode;
            expect(axis.getAttribute('transform')).toBe('translate(0,306)');
        });

        it('no primary ticks', function() {
            var chart = document.querySelector('#bar-chart__categories .width600 svg');
            var ticks = chart.querySelectorAll('.axis--independent .primary line');
            expect(ticks.length).toBe(4);
            expect(ticks[0].getAttribute('x2')).toBe('0');
            expect(ticks[0].getAttribute('y2')).toBe('0');
            expect(ticks[1].getAttribute('x2')).toBe('0');
            expect(ticks[1].getAttribute('y2')).toBe('0');
            expect(ticks[2].getAttribute('x2')).toBe('0');
            expect(ticks[2].getAttribute('y2')).toBe('0');
            expect(ticks[3].getAttribute('x2')).toBe('0');
            expect(ticks[3].getAttribute('y2')).toBe('0');
        });

    });

    describe('stacked bar charts ', function() {

        it('has the same number of stacks in each grouping', function(){
            var chart = document.querySelector('#bar-chart__stack .width600 svg').querySelectorAll('.plot g.series');
            var i = chart.length;
            expect(chart.length).toBe(5);
            while(i--){
                var thisGroup = chart[i].querySelectorAll('rect');
                expect(thisGroup.length).toBe(5);
            }
        });

        it('correctly stacks negative numbers', function(){
            var chart = document.querySelector('#bar-chart__stackWithNegatives .width600 svg');
            var rect = chart.querySelectorAll('.plot g.series rect');
            expect(parseInt(rect[0].getAttribute('x'),10)).toBe(parseInt(rect[5].getAttribute('x'),10));
            expect(parseInt(rect[4].getAttribute('x'),10)).toBe(parseInt(rect[9].getAttribute('x'),10));
            expect(parseInt(rect[10].getAttribute('x'),10)).toBe(parseInt(rect[20].getAttribute('x'),10));
        });

        it('correctly converts NaN values to 0', function(){
            var chart = document.querySelector('#bar-chart__stackWithValuesMissing .width600 svg');
            var rect = chart.querySelectorAll('.plot g.series rect');
            var i = rect.length;
            while(i--){
                expect(parseInt(rect[i].getAttribute('width'), 10)).not.toBeLessThan(0);
            }
        });

    });

});
