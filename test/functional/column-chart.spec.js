describe('column-chart.js', function(){

    beforeEach(function(){
        //pm: hack to stop spec rewriting dom too early :(
        require('../helper').loadAssets('column-chart');
        require('../fixtures/scripts/column-chart').init();
    });

    describe('has the key  ', function(){

        it('horizontal when all items fit', function() {
            const stackedColumnsL = document.querySelectorAll('.width600 svg')[8].querySelectorAll('.key__item');
            expect(stackedColumnsL.length).toBe(5);
            expect(stackedColumnsL[0].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsL[1].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsL[2].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsL[3].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsL[4].getAttribute('transform')).toContain(',24)');
        });

        it('columns when only some items fit', function(){
            const stackedColumnsS = document.querySelectorAll('.width300 svg')[8].querySelectorAll('.key__item');
            expect(stackedColumnsS.length).toBe(5);
            expect(stackedColumnsS[0].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsS[1].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsS[2].getAttribute('transform')).toContain(',24)');
            expect(stackedColumnsS[3].getAttribute('transform')).toContain(',40)');
            expect(stackedColumnsS[4].getAttribute('transform')).toContain(',40)');
        });

        it('vertical when not all items fit', function(){
            const verticalColumnsS = document.querySelectorAll('.width300 svg')[18].querySelectorAll('.key__item');
            expect(verticalColumnsS.length).toBe(5);
            expect(verticalColumnsS[0].getAttribute('transform')).toContain(',24)');
            expect(verticalColumnsS[1].getAttribute('transform')).toContain(',40)');
            expect(verticalColumnsS[2].getAttribute('transform')).toContain(',56)');
            expect(verticalColumnsS[3].getAttribute('transform')).toContain(',72)');
            expect(verticalColumnsS[4].getAttribute('transform')).toContain(',88)');
        });

    });

    describe('has ticks ', function(){

        it('hidden when no labels have been removed and there is no negative value', function(){
            const quarterlyTicksGraphA = document.querySelectorAll('.width600 svg')[0].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphA.length).toBe(4);
            expect(quarterlyTicksGraphA[0].getAttribute('y2')).toBe('0');
            expect(quarterlyTicksGraphA[1].getAttribute('y2')).toBe('0');
            expect(quarterlyTicksGraphA[2].getAttribute('y2')).toBe('0');
            expect(quarterlyTicksGraphA[3].getAttribute('y2')).toBe('0');
        });

        it('displayed when there is negative value', function(){
            const quarterlyTicksGraphB = document.querySelectorAll('.width600 svg')[1].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphB.length).toBe(4);
        });

        it('displayed when labels have been removed', function(){
            const quarterlyTicksGraphC = document.querySelectorAll('.width600 svg')[4].querySelectorAll('.x.axis .primary line');
            expect(quarterlyTicksGraphC.length).toBe(43);
        });

        it('extended when quarter labels are removed', function(){
            const quarterlyTicksGraphC = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary line');
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
            const quarterlyTicksGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary line');
            const quarterlyLabelsGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary text');
            const yearlyLabelsGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .secondary text');
            expect(quarterlyTicksGraphA.length).toBe(18);
            expect(quarterlyLabelsGraphA.length).toBe(5);
            expect(quarterlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA.length).toBe(0);
        });

        it('hidden when there are duplicate year labels', function(){
            const yearlyLabelsGraphA = document.querySelectorAll('.width600 svg')[0].querySelectorAll('.x.axis .secondary text');
            const yearlyLabelsGraphB = document.querySelectorAll('.width600 svg')[1].querySelectorAll('.x.axis .secondary text');
            const yearlyLabelsGraphC = document.querySelectorAll('.width600 svg')[2].querySelectorAll('.x.axis .secondary text');
            expect(yearlyLabelsGraphA.length).toBe(1);
            expect(yearlyLabelsGraphB.length).toBe(1);
            expect(yearlyLabelsGraphC.length).toBe(5);
        });

        it('shortened to 2 digits on the year that is not significant (ie. not the millenium)', function(){
            const yearlyLabelsGraphA = document.querySelectorAll('.width300 svg')[2].querySelectorAll('.x.axis .primary text');
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('06');
            expect(yearlyLabelsGraphA[2].textContent).toBe('07');
            expect(yearlyLabelsGraphA[3].textContent).toBe('08');
        });

        it('promoted and kept even if more labels overlap', function(){
            const yearlyLabelsGraphA = document.querySelectorAll('.width300 svg')[4].querySelectorAll('.x.axis .primary text');
            expect(yearlyLabelsGraphA[0].textContent).toBe('2005');
            expect(yearlyLabelsGraphA[1].textContent).toBe('07');
            expect(yearlyLabelsGraphA[2].textContent).toBe('09');
            expect(yearlyLabelsGraphA[3].textContent).toBe('11');
        });

    });

    describe('null values', function() {
        it('has N/A labels when null values are present', function() {
            const nullValsGraph = document.querySelector('#column-chart__nullValues .width600 svg');
            const nullLabels = nullValsGraph.querySelectorAll('text.null-label');
            expect(nullLabels.length).toBe(2);
            for (let i = 0; i < nullLabels.length; i++) {
                expect(nullLabels[i].innerHTML).toBe('n/a');
            }
        });

        it('has ≁ labels when null values are present on small charts', function() {
            const nullValsGraph = document.querySelector('#column-chart__nullMultiple .width300 svg');
            const nullLabels = nullValsGraph.querySelectorAll('text.null-label');
            expect(nullLabels.length).toBe(2);
            for (let i = 0; i < nullLabels.length; i++) {
                expect(nullLabels[i].innerHTML).toBe('–');
            }
        });

    });

    describe('y-axis values', function(){

        it('can positive only numbers', function(){
            const values = document.querySelectorAll('.width600 svg')[0].querySelectorAll('.y.axis text');
            expect(values[0].textContent).toBe('0');
            expect(values[7].textContent).toBe('1.4');
        });

        it('can handle negative numbers', function(){
            const values = document.querySelectorAll('.width600 svg')[3].querySelectorAll('.y.axis text');
            expect(values[0].textContent).toBe('-3');
            expect(values[1].textContent).toBe('-2');
            expect(values[2].textContent).toBe('-1');
            expect(values[3].textContent).toBe('0');
            expect(values[4].textContent).toBe('1');
            expect(values[5].textContent).toBe('2');
        });

    });

    describe('column values ', function(){

        it('Can handle zero\s', function () {
            const columns = document.querySelectorAll('.width600 svg')[7].querySelectorAll('.plot rect');
            expect(columns.length).toBe(4);
        });

        xit('to display empty month columns even if date is missing', function(){
            const txt = document.querySelectorAll('.width600 svg')[2].querySelectorAll('g.x.axis .primary text');
//todo: Months card is later!
            expect(txt[0].textContent).toBe('Mar');
            expect(txt[1].textContent).toBe('Apr');
            expect(txt[2].textContent).toBe('May');
            expect(txt[3].textContent).toBe('Jun');
        });

        it('are less than the y axis maximum', function(){
            const cols = document.querySelectorAll('.width600 svg')[8].querySelectorAll('.plot rect');
            const ticks = document.querySelectorAll('.width600 svg')[8].querySelectorAll('.y.axis .tick text');
            const lastTick = ticks[ticks.length - 1];

            for(let i = 0; i < cols.length; i++){
                expect(cols[i].__data__.value).not.toBeGreaterThan(Number(lastTick.textContent));
            }
        });
    });

    describe('stacked column chart ', function(){ //still working on this one, had to leave a bit early

        it('has the same number of stacks in each grouping', function(){
            const series = document.querySelectorAll('.width600 svg')[8].querySelectorAll('.plot g.series');
            let i = series.length;

            expect(series.length).toBe(5);
            while(i--){
                const thisGroup = series[i].querySelectorAll('rect');
                expect(thisGroup.length).toBe(5);
            }
        });

        it('display columns associated with month labels', function(){
            const chart = document.querySelectorAll('.width600 svg')[9];
            const series = chart.querySelectorAll('.plot g.series');
            let i = series.length;
            expect(chart.querySelectorAll('.x .primary text').length).toBe(3);
            expect(chart.querySelectorAll('.x .secondary text').length).toBe(2);
            while(i--){
                const thisGroup = series[i].querySelectorAll('rect');
                expect(thisGroup.length).toBe(14);
            }
        });

        it('correctly stacks negative numbers', function(){
            const chart = document.querySelectorAll('.width600 svg')[11];
            const rect = chart.querySelectorAll('.plot rect');
            expect(parseInt(rect[0].getAttribute('y'),10)).toBeLessThan(parseInt(rect[4].getAttribute('y'),10));
            expect(parseInt(rect[4].getAttribute('y'),10)).toBeGreaterThan(parseInt(rect[8].getAttribute('y'),10));
            expect(parseInt(rect[8].getAttribute('y'),10)).toBeLessThan(parseInt(rect[12].getAttribute('y'),10));
        });

        it('correctly stacks categories', function(){
            const chart = document.querySelectorAll('.width600 svg')[13];
            const rect = chart.querySelectorAll('.plot rect');
            expect(rect.length).toBe(10);
            expect(parseInt(rect[0].getAttribute('y'),10)).toBeGreaterThan(0);
            expect(parseInt(rect[0].getAttribute('x'),10)).toBe(parseInt(rect[5].getAttribute('x'),10));
            expect(parseInt(rect[0].getAttribute('y'),10)).toBeGreaterThan(parseInt(rect[5].getAttribute('y'),10));
        });

        it('correctly converts NaN values to 0', function(){
            const chart = document.querySelectorAll('.width600 svg')[23];
            const rect = chart.querySelectorAll('.plot g.series rect');
            let i = rect.length;
            while(i--){
                expect(parseInt(rect[i].getAttribute('width'), 10)).not.toBeLessThan(0);
            }
        });

    });

    describe('attaches style attributes to', function () {

        it('the columns', function () {

            const plot = document.querySelectorAll('.width600 svg')[1].querySelector('.chart .plot rect');
            expect(plot.getAttribute('stroke-width')).toBe(null);
            expect(plot.getAttribute('stroke')).toBe(null);
            expect(plot.getAttribute('fill')).toBeTruthy();

        });

        it('the column series key', function () {

            const plot = document.querySelectorAll('.width600 svg')[6].querySelector('.chart__key rect');
            expect(plot.getAttribute('stroke-width')).toBe(null);
            expect(plot.getAttribute('stroke')).toBe(null);
            expect(plot.getAttribute('fill')).toBeTruthy();

        });
    });


    describe('Time Axis ', function () {

        it('Can be displayed', function () {
            const labels = document.querySelectorAll('.width600 svg')[7].querySelectorAll('.x text');
            expect(labels[0].textContent).toBe('Mar');
            expect(labels[1].textContent).toBe('May');
            expect(labels[2].textContent).toBe('Jul');
            expect(labels[3].textContent).toBe('Sep');
        });

    });
});
