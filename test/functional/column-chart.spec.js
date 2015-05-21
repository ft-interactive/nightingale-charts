describe('column-chart.js', function(){

    beforeEach(function(){
        //pm: hack to stop spec rewriting dom too early :(
        require('../helper').loadAssets('column-chart');
        require('../../demo/scripts/column-chart').init();
    })

    describe('has ticks ', function(){

        it('hidden when no labels have been removed and there is no negative value', function(){
            var quarterlyTicksGraphA = document.querySelectorAll('.width600 svg')[0].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphA.length).toBe(4);
            expect(quarterlyTicksGraphA[0].getAttribute('y2')).toBe('0');
            expect(quarterlyTicksGraphA[1].getAttribute('y2')).toBe('0');
            expect(quarterlyTicksGraphA[2].getAttribute('y2')).toBe('0');
            expect(quarterlyTicksGraphA[3].getAttribute('y2')).toBe('0');
        });

        it('displayed when there is negative value', function(){
            var quarterlyTicksGraphB = document.querySelectorAll('.width600 svg')[1].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphB.length).toBe(4);
        });

        it('displayed when labels have been removed', function(){
            var quarterlyTicksGraphC = document.querySelectorAll('.width600 svg')[4].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC.length).toBe(43);
        });

        it('extended when quarter labels are removed', function(){
            var quarterlyTicksGraphC = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC[0].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[1].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[2].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[3].getAttribute('y2')).toBe('7.5');
            expect(quarterlyTicksGraphC[4].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[5].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[6].getAttribute('y2')).toBe('5');
            expect(quarterlyTicksGraphC[7].getAttribute('y2')).toBe('7.5');
            expect(quarterlyTicksGraphC[8].getAttribute('y2')).toBe('5');
        });

    });

    describe('has labels ', function(){

        it('hidden when any quarter overlaps', function(){
            var quarterlyTicksGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary line');
            var quarterlyLabelsGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary text');
            var yearlyLabelsGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .secondary text');
            expect(quarterlyTicksGraphA.length).toBe(18);
            expect(quarterlyLabelsGraphA.length).toBe(5);
            expect(quarterlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA.length).toBe(0);
        });

        it('hidden when there are duplicate year labels', function(){
            var yearlyLabelsGraphA = document.querySelectorAll('.width600 svg')[0].querySelectorAll('.x.axis .secondary text');
            var yearlyLabelsGraphB = document.querySelectorAll('.width600 svg')[1].querySelectorAll('.x.axis .secondary text');
            var yearlyLabelsGraphC = document.querySelectorAll('.width600 svg')[2].querySelectorAll('.x.axis .secondary text');
            expect(yearlyLabelsGraphA.length).toBe(1);
            expect(yearlyLabelsGraphB.length).toBe(1);
            expect(yearlyLabelsGraphC.length).toBe(5);
        });

        it('shortened to 2 digits on the year that is not significant (ie. not the millenium)', function(){
            var yearlyLabelsGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary text');
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('06');
            expect(yearlyLabelsGraphA[2].textContent).toBe('07');
            expect(yearlyLabelsGraphA[3].textContent).toBe('08');
        });

    });

    describe('y-axis values', function(){

        it('can positive only numbers', function(){
            var values = document.querySelectorAll('.width600 svg')[0].querySelectorAll('.y.axis text');
            expect(values[0].textContent).toBe('0');
            expect(values[7].textContent).toBe('1.4');
        });

        it('can handle negative numbers', function(){
            var values = document.querySelectorAll('.width600 svg')[3].querySelectorAll('.y.axis text');
            expect(values[0].textContent).toBe('-2');
            expect(values[1].textContent).toBe('-1');
            expect(values[2].textContent).toBe('0');
            expect(values[3].textContent).toBe('1');
            expect(values[4].textContent).toBe('-3');
            expect(values[5].textContent).toBe('2');
        });

    });

    describe('column values ', function(){

        it('Can handle zero\s', function () {
            var columns = document.querySelectorAll('.width600 svg')[7].querySelectorAll('.plot rect');
            expect(columns.length).toBe(4);
        });

        it('match d3 and >= 0', function(){
            var cols = document.querySelectorAll('.width600 svg')[0].querySelectorAll('rect');
            var max = 0;
            var i = cols.length;

            while(i--){
                expect(cols[i].__data__.value).toBe(Number(cols[i].getAttribute('data-value')));
                max = (cols[i].__data__.value > 0) ? cols[i].__data__.value : max;
            }

            expect(cols.length).toBe(4);
            expect(max).toBeGreaterThan(0);
        });

        it('match d3 with some values < 0', function(){
            var cols = document.querySelectorAll('.width600 svg')[1].querySelectorAll('rect');
            var min = 0;
            var i = cols.length;

            while(i--){
                expect(cols[i].__data__.value).toBe(Number(cols[i].getAttribute('data-value')));
                min = (cols[i].__data__.value < 0) ? cols[i].__data__.value : min;
            }

            expect(cols.length).toBe(4);
            expect(min).toBeLessThan(0);
        });


        it('match d3 with primary labels appearing as abbreviated months', function(){
            var txt = document.querySelectorAll('.width600 svg')[5].querySelectorAll('g.x.axis .primary text');
            var cols = document.querySelectorAll('.width600 svg')[5].querySelectorAll('rect');
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var i = txt.length;

            while(i--){
                expect(cols[i].__data__.value).toBe(Number(cols[i].getAttribute('data-value')));
                expect(months.indexOf(txt[i].textContent)).toBeGreaterThan(-1);
            }

            expect(cols.length).toBe(4);
        });

        xit('to display empty month columns even if date is missing', function(){
            var txt = document.querySelectorAll('.width600 svg')[2].querySelectorAll('g.x.axis .primary text');
//todo: Months card is later!
            expect(txt[0].textContent).toBe('Mar');
            expect(txt[1].textContent).toBe('Apr');
            expect(txt[2].textContent).toBe('May');
            expect(txt[3].textContent).toBe('Jun');
        });
    });

    describe('attaches style attributes to', function () {
        it('the columns', function () {

            var plot = document.querySelectorAll('.width600 svg')[1].querySelector('.chart .plot rect');
            expect(plot.getAttribute('stroke-width')).toBe(null);
            expect(plot.getAttribute('stroke')).toBe('none');
            expect(plot.getAttribute('fill')).toBeTruthy();

        });
        it('the column series key', function () {

            var plot = document.querySelectorAll('.width600 svg')[6].querySelector('.chart__key rect');
            expect(plot.getAttribute('stroke-width')).toBe(null);
            expect(plot.getAttribute('stroke')).toBe('none');
            expect(plot.getAttribute('fill')).toBeTruthy();

        });
    });


    describe('Time Axis ', function () {

        it('Can be displayed', function () {
            var labels = document.querySelectorAll('.width600 svg')[8].querySelectorAll('.x text');
            expect(labels[0].textContent).toBe('Mar');
            expect(labels[1].textContent).toBe('May');
            expect(labels[2].textContent).toBe('Jul');
            expect(labels[3].textContent).toBe('Sep');
        });

    });
});
