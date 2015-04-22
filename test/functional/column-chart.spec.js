describe('column-chart.js', function(){

    beforeEach(function(){
        //pm: hack to stop spec rewriting dom too early :(
        require('../helper').loadAssets('column-chart');
        require('../../demo/scripts/column-chart').init();
    })

    xdescribe('hides ticks ', function(){

        it('when no labels have been removed and there is no negative value', function(){
            var ticksA = document.querySelectorAll('svg')[0].querySelectorAll('.x.axis ticks');
            var ticksB = document.querySelectorAll('svg')[1].querySelectorAll('.x.axis ticks');
            expect(ticksA.length).toBe(4);
            expect(ticksB.length).toBe(0);
        });

    });

    xdescribe('hides labels ', function(){
        it('when no labels have been removed and there is no negative value', function(){

        });
    });

    describe('y-axis values', function(){

        it('can positive only numbers', function(){
            var values = document.querySelectorAll('svg')[0].querySelectorAll('.y.axis text');
            expect(values[0].textContent).toBe('0');
            expect(values[7].textContent).toBe('1.4');
        });
        it('can handle negative numbers', function(){
            var values = document.querySelectorAll('svg')[3].querySelectorAll('.y.axis text');
            expect(values[0].textContent).toBe('-2');
            expect(values[1].textContent).toBe('-1');
            expect(values[2].textContent).toBe('0');
            expect(values[3].textContent).toBe('1');
            expect(values[4].textContent).toBe('-3');
            expect(values[5].textContent).toBe('2');
        });
    });

    describe('column values ', function(){
        it('match d3 and >= 0', function(){
            var cols = document.querySelectorAll('svg')[0].querySelectorAll('rect');
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
            var cols = document.querySelectorAll('svg')[3].querySelectorAll('rect');
            var min = 0;
            var i = cols.length;

            while(i--){
                expect(cols[i].__data__.value).toBe(Number(cols[i].getAttribute('data-value')))
                min = (cols[i].__data__.value < 0) ? cols[i].__data__.value : min;
            }

            expect(cols.length).toBe(39);
            expect(min).toBeLessThan(0);
        });


        it('match d3 with primary labels appearing as abbreviated months', function(){
            var txt = document.querySelectorAll('svg')[4].querySelectorAll('g.x.axis .primary text');
            var cols = document.querySelectorAll('svg')[4].querySelectorAll('rect');
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var i = txt.length;

            while(i--){
                expect(cols[i].__data__.value).toBe(Number(cols[i].getAttribute('data-value')));
                expect(months.indexOf(txt[i].textContent)).toBeGreaterThan(-1);
            }

            expect(cols.length).toBe(4);
        });

        xit('to display empty month columns even if date is missing', function(){
            var txt = document.querySelectorAll('svg')[2].querySelectorAll('g.x.axis .primary text');
//todo: Months card is later!
            expect(txt[0].textContent).toBe('Mar');
            expect(txt[1].textContent).toBe('Apr');
            expect(txt[2].textContent).toBe('May');
            expect(txt[3].textContent).toBe('Jun');
        });
    });
});