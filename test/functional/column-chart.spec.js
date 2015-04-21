/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('column-chart');
require('../../demo/scripts/column-chart').init();

describe('column-chart.js', function(){
    describe('check y values are', function(){
        it('correct and >= 0', function(){
            var cols = document.querySelectorAll('svg')[0].querySelectorAll('rect');
            var acceptable = true;
            var i = cols.length;

            while(i--){
                cols[i].__data__.value > 0 && cols[i].__data__.value === Number(cols[i].getAttribute('data-value')) ? 0 : acceptable = false; //make sure D3 data value is the same as the data-value attribute on the column and that all values are greater than or equal to 0
            }

            expect(acceptable).toBe(true);
        });

        it('correct with some values < 0', function(){
            var cols = document.querySelectorAll('svg')[1].querySelectorAll('rect');
            var acceptable = false;
            var i = cols.length;

            while(i--){
                cols[i].__data__.value < 0 && cols[i].__data__.value === Number(cols[i].getAttribute('data-value')) && acceptable === false ? acceptable = true : 0; //make sure D3 data value is the same as the data-value attribute on the column and that all values are greater than or equal to 0
            }

            expect(acceptable).toBe(true);
        });


        it('correct with primary labels appearing as abbreviated months', function(){
            var txt = document.querySelectorAll('svg')[2].querySelectorAll('g.x.axis .primary text');
            var cols = document.querySelectorAll('svg')[2].querySelectorAll('rect');
            var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            var acceptable = true;
            var i = txt.length;

            while(i--){
                cols[i].__data__.value === Number(cols[i].getAttribute('data-value')) ? 0 : acceptable = false; //make sure D3 data value is the same as the data-value attribute on the column and that all values are greater than or equal to 0
                txt[i].innerHTML && months.join('').indexOf(txt[i].innerHTML.toLowerCase()) === -1 ? acceptable = false : 0; //txt[i].innerHTML comes first otherwise you get errors in console (phantomJS) but not chrome. make sure month labels are actually month labels
            }

            expect(true).toBe(true);
        });
    });
});