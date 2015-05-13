
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var hideSource = [true, true, false];
var numberAxisOrient = ['left','right','left'];

var fixtures = {
    year : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348}
    ],
    yearWithNegative : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: -1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348}
    ],
    years : [
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('3/31/06'), value:      0.583},
        { date: new Date('6/30/06'), value:      0.501},
        { date: new Date('9/29/06'), value:      0.175},
        { date: new Date('12/29/06'), value:     0.753},
        { date: new Date('3/30/07'), value:      0.763},
        { date: new Date('6/29/07'), value:      0.601},
        { date: new Date('9/28/07'), value:      0.843},
        { date: new Date('12/31/07'), value:     0.468},
        { date: new Date('3/31/08'), value:      0.313},
        { date: new Date('6/30/08'), value:      0.231},
        { date: new Date('9/30/08'), value:      1.664},
        { date: new Date('12/31/08'), value:     2.229},
        { date: new Date('3/31/09'), value:      1.79},
        { date: new Date('6/30/09'), value:      0.261},
        { date: new Date('9/30/09'), value:      0.2}
    ],
    yearsWithNegative : [//remove q labels keep ticks + remove duplicate year labels + extend q1 tick. year label is primary
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('3/31/06'), value:      0.583},
        { date: new Date('6/30/06'), value:      0.501},
        { date: new Date('9/29/06'), value:      0.175},
        { date: new Date('12/29/06'), value:     0.753},
        { date: new Date('3/30/07'), value:      0.763},
        { date: new Date('6/29/07'), value:      0.601},
        { date: new Date('9/28/07'), value:      0.843},
        { date: new Date('12/31/07'), value:     0.468},
        { date: new Date('3/31/08'), value:      0.313},
        { date: new Date('6/30/08'), value:      -0.231},
        { date: new Date('9/30/08'), value:      -1.664},
        { date: new Date('12/31/08'), value:     -2.229},
        { date: new Date('3/31/09'), value:      -1.79},
        { date: new Date('6/30/09'), value:      -0.261},
        { date: new Date('9/30/09'), value:      0.2}
    ],
    decade : [//get rid of Qs + show yearly ticks (decade rule)
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('3/31/06'), value:      0.583},
        { date: new Date('6/30/06'), value:      0.501},
        { date: new Date('9/29/06'), value:      0.175},
        { date: new Date('12/29/06'), value:     0.753},
        { date: new Date('3/30/07'), value:      0.763},
        { date: new Date('6/29/07'), value:      0.601},
        { date: new Date('9/28/07'), value:      0.843},
        { date: new Date('12/31/07'), value:     0.468},
        { date: new Date('3/31/08'), value:      0.313},
        { date: new Date('6/30/08'), value:      -0.231},
        { date: new Date('9/30/08'), value:      -1.664},
        { date: new Date('12/31/08'), value:     -2.229},
        { date: new Date('3/31/09'), value:      -1.79},
        { date: new Date('6/30/09'), value:      -0.261},
        { date: new Date('9/30/09'), value:      0.2},
        { date: new Date('12/31/09'), value:     0.389},
        { date: new Date('3/31/10'), value:      0.509},
        { date: new Date('6/30/10'), value:      0.977},
        { date: new Date('9/30/10'), value:      0.647},
        { date: new Date('12/31/10'), value:     0.025},
        { date: new Date('3/31/11'), value:      0.536},
        { date: new Date('6/30/11'), value:      0.228},
        { date: new Date('9/30/11'), value:      0.696},
        { date: new Date('12/30/11'), value:     -0.015},
        { date: new Date('3/30/12'), value:      0.068},
        { date: new Date('6/29/12'), value:      -0.178},
        { date: new Date('9/28/12'), value:      0.833},
        { date: new Date('12/31/12'), value:     -0.338},
        { date: new Date('3/29/13'), value:      0.596},
        { date: new Date('6/28/13'), value:      0.643},
        { date: new Date('9/30/13'), value:      0.717},
        { date: new Date('12/31/13'), value:     0.406},
        { date: new Date('3/31/14'), value:      0.882},
        { date: new Date('6/30/14'), value:      0.833},
        { date: new Date('9/30/14'), value:      0.619},
        { date: new Date('12/31/14'), value:     0.607}
    ],
    month : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348}
    ],
    multiple:[
        {date: new Date('3/31/05'), value: Math.floor(Math.random() * 40) + 10, value2: 99, value3: 26},
        {date: new Date('6/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: 21},
        {date: new Date('9/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 70, value3: 13},
        {date: new Date('12/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: 29}
    ],
    stacked:[
        {date: new Date('3/31/05'), value: 50, value2: 99, value3: 26, value4: 40, value5: 15},
        {date: new Date('6/30/05'), value: 25, value2: 10, value3: 21, value4: 36, value5: 22},
        {date: new Date('9/30/05'), value: 75, value2: 70, value3: 13, value4: 12, value5: 110},
        {date: new Date('12/30/05'), value: 125, value2: 10, value3: 29, value4: 31, value5: 40},
        {date: new Date('5/30/06'), value: 133, value2: 25, value3: 72, value4: 105, value5: 200}
    ]
};

var units = {
    month: ['monthly', 'yearly']
}
var widths = [600, 300];
var series = {
    multiple: ['value', 'value2', 'value3'],
    stacked: ['value', 'value2', 'value3', 'value4', 'value5']
}
function getChartData(timeFrame){
    var ySeries = series[timeFrame] || ['value'];
    return {
        comment: 'Column chart',
        footnote: 'this is just for testing!',
        source: 'tbc',
        title: 'Columns: ' + timeFrame,
        subtitle: 'Drawn for you',
        numberAxisOrient: 'left', //todo: refactor onto y object
        hideSource: false,
        x:{series: {key:'date', label:'yearly'}},
        tickSize: 5,
        y: { series: ySeries} ,
        seriesLength: ySeries.length,
        groupDates: units[timeFrame] || ['quarterly', 'yearly'],
        data: fixtures[timeFrame],
        chartSubtype: timeFrame,
    };
}

module.exports = {
    getChartData: getChartData,
    init: function(){
        var demos = ['year','yearWithNegative','years','yearsWithNegative','decade', 'month', 'multiple', 'stacked'];

        demos.forEach(function(timeFrame){
            d3.select('#views').append('div').attr({
                'id':'column-chart__' + timeFrame
            });
            widths.forEach(function (width){
                var data = getChartData(timeFrame);
                data.width = width;
                d3.select('#column-chart__' + timeFrame).append('span')
                    .attr('class', 'width' + width)
                    .data([data]).call(oCharts.chart.column);
            });
        });
    }
};
