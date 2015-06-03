describe('bar-chart.js', function(){

    beforeEach(function(){
        //pm: hack to stop spec rewriting dom too early :(
        require('../helper').loadAssets('bar-chart');
        require('../../demo/scripts/bar-chart').init();
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

    });

});
