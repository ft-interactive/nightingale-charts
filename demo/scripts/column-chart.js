var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var hideSource = [true, true, false];
var dependentAxisOrient = ['left', 'right', 'left'];

var fixtures = {
    quarters : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348}
    ],
    quartersWithNegative : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: -1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348}
    ],
    quartersWithZero : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: 0},
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
        { date: new Date('12/31/14'), value:     0.607},
        { date: new Date('3/31/15'), value:      0.882},
        { date: new Date('6/30/15'), value:      0.833},
        { date: new Date('9/30/15'), value:      0.619},
        { date: new Date('12/31/15'), value:     0.607}
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
        {date: new Date('12/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: 99}
    ],
    time: [
        {date: new Date('3/31/05'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
        {date: new Date('6/30/05'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
        {date: new Date('9/30/05'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
        {date: new Date('12/30/05'), value: Math.random() * 40, value2: Math.random() * 40, value3:66}
    ],
    stack:[
        {myDateColumn: new Date('3/31/05'), value: 50, value2: 99, value3: 26, value4: 40, value5: 15},
        {myDateColumn: new Date('6/30/05'), value: 25, value2: 10, value3: 21, value4: 36, value5: 22},
        {myDateColumn: new Date('9/30/05'), value: 75, value2: 70, value3: 13, value4: 12, value5: 110},
        {myDateColumn: new Date('12/30/05'), value: 125, value2: 10, value3: 29, value4: 31, value5: 40},
        {myDateColumn: new Date('5/30/06'), value: 133, value2: 25, value3: 72, value4: 105, value5: 200}
    ],
    stackMonthly:[
        {myDateColumn: new Date('1/28/05'), value: 50, value2: 99, value3: 26, value4: 40, value5: 15},
        {myDateColumn: new Date('2/28/05'), value: 25, value2: 10, value3: 21, value4: 36, value5: 22},
        {myDateColumn: new Date('3/28/05'), value: 75, value2: 70, value3: 13, value4: 12, value5: 110},
        {myDateColumn: new Date('4/28/05'), value: 125, value2: 10, value3: 29, value4: 31, value5: 40},
        {myDateColumn: new Date('5/28/05'), value: 133, value2: 25, value3: 72, value4: 105, value5: 200},
        {myDateColumn: new Date('6/28/05'), value: 133, value2: 25, value3: 72, value4: 105, value5: 200},
        {myDateColumn: new Date('7/28/05'), value: 133, value2: 25, value3: 2, value4: 105, value5: 00},
        {myDateColumn: new Date('8/28/05'), value: 133, value2: 2, value3: 72, value4: 105, value5: 20},
        {myDateColumn: new Date('9/28/05'), value: 133, value2: 25, value3: 72, value4: 105, value5: 20},
        {myDateColumn: new Date('10/28/05'), value: 13, value2: 5, value3: 7, value4: 15, value5: 20},
        {myDateColumn: new Date('11/28/05'), value: 133, value2: 25, value3: 72, value4: 105, value5: 20},
        {myDateColumn: new Date('12/28/05'), value: 13, value2: 25, value3: 2, value4: 105, value5: 20},
        {myDateColumn: new Date('1/28/06'), value: 33, value2: 25, value3: 72, value4: 105, value5: 2},
        {myDateColumn: new Date('2/28/06'), value: 10, value2: 5, value3: 35, value4: 43, value5: 78}
    ],
    multipleWithNegatives:[
        {date: new Date('3/31/05'), value: Math.floor(Math.random() * 40) + 10, value2: -99, value3: 26},
        {date: new Date('6/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: 21},
        {date: new Date('9/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 70, value3: -13},
        {date: new Date('12/30/05'), value: Math.floor(Math.random() * -40) + 10, value2: 10, value3: 99}
    ],
    stackWithAllNegatives:[
        {myDateColumn: new Date('3/31/05'), value: -50, value2: -99, value3: -26, value4: -40, value5: -15},
        {myDateColumn: new Date('6/30/05'), value: 50, value2: 99, value3: 26, value4: 40, value5: 15},
        {myDateColumn: new Date('9/30/05'), value: -75, value2: -70, value3: -13, value4: -12, value5: -110},
        {myDateColumn: new Date('12/30/05'), value: 75, value2: 70, value3: 13, value4: 12, value5: 110}
    ],
    categories : [
        { key: 'red', value:      0.583, value2:      1.583},
        { key: 'blue', value: 1.027, value2:  2},
        { key: 'green', value: 1.03, value2:  1.4},
        { key: 'purple', value:     1.348, value2:  1.9},
        { key: 'pink', value:     -1.048, value2:  -2}
    ],
    categoriesStack : [
        { key: 'red', value:      0.583, value2:      1.583},
        { key: 'blue', value: 1.027, value2:  2},
        { key: 'green', value: 1.03, value2:  1.4},
        { key: 'purple', value:     1.348, value2:  1.9},
        { key: 'pink', value:     -1.048, value2:  -2}
    ],
    dateCategories : [
        { key: new Date(2011,10,25), value:      0.583, value2:      1.583},
        { key: new Date(2011,10,26), value: 1.027, value2:  2},
        { key: new Date(2011,10,27), value: 1.03, value2:  1.4},
        { key: new Date(2011,10,28), value:     1.348, value2:  1.9},
        { key: new Date(2011,10,29), value:     -1.048, value2:  -2}
    ],
    quarterCategories : [
        { key: '2005 Q1', value:      0.583, value2:      1.583},
        { key: '2005 Q2', value: 1.027, value2:  2},
        { key: '2005 Q3', value: 1.03, value2:  1.4},
        { key: '2005 Q4', value:     1.348, value2:  1.9},
        { key: '2006 Q1', value:     -1.048, value2:  -2}
    ],
    nullValues : [
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('3/31/06'), value:      0.583},
        { date: new Date('6/30/06'), value:      0.501},
        { date: new Date('9/29/06'), value:      null},
        { date: new Date('12/29/06'), value:     0.753},
        { date: new Date('3/30/07'), value:      0.763},
        { date: new Date('6/29/07'), value:      0.601},
        { date: new Date('9/28/07'), value:      null},
        { date: new Date('12/31/07'), value:     0.468},
        { date: new Date('3/31/08'), value:      0.313}
    ],
    nullMultiple:[
        {date: new Date('3/31/05'), value: Math.floor(Math.random() * 40) + 10, value2: 99, value3: 26},
        {date: new Date('6/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: null, value3: 21},
        {date: new Date('9/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 70, value3: 13},
        {date: new Date('12/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: null}
    ],
    nullStack:[
        {myDateColumn: new Date('3/31/05'), value: 50, value2: 99, value3: 26, value4: 40, value5: 15},
        {myDateColumn: new Date('6/30/05'), value: 25, value2: 10, value3: 21, value4: 36, value5: null},
        {myDateColumn: new Date('9/30/05'), value: 75, value2: 70, value3: null, value4: 12, value5: 110},
        {myDateColumn: new Date('12/30/05'), value: null, value2: 10, value3: 29, value4: 31, value5: 40},
        {myDateColumn: new Date('5/30/06'), value: 133, value2: 25, value3: 72, value4: 105, value5: 200}
    ],
    weekly : [
        { date: new Date('5/07/2014'), value:      0.368069},
        { date: new Date('5/14/2014'), value: 0.472146},
        { date: new Date('5/21/2014'), value: 0.743529},
        { date: new Date('5/28/2014'), value:     0.600043},
        { date: new Date('6/04/2014'), value:     0.301624},
        { date: new Date('6/11/2014'), value:     0.277067},
        { date: new Date('6/18/2014'), value:     -0.239283},
        { date: new Date('6/25/2014'), value:     0.619157},
        { date: new Date('7/02/2014'), value:     0.090189}
    ],
    daily : [
        { date: new Date('5/07/2014'), value:      0.368069},
        { date: new Date('5/08/2014'), value: 0.472146},
        { date: new Date('5/09/2014'), value: 0.743529},
        { date: new Date('5/10/2014'), value:     0.600043},
        { date: new Date('5/11/2014'), value:     0.301624},
        { date: new Date('5/12/2014'), value:     0.277067},
        { date: new Date('5/13/2014'), value:     -0.239283},
        { date: new Date('5/14/2014'), value:     0.619157},
        { date: new Date('5/15/2014'), value:     0.090189}
    ]
};

var units = {
    quarters: ['quarterly', 'yearly'],
    quartersWithNegative: ['quarterly', 'yearly'],
    years: ['quarterly', 'yearly'],
    yearsWithNegative: ['quarterly', 'yearly'],
    decade: ['quarterly', 'yearly'],
    multiple: ['quarterly', 'yearly'],
    month: ['monthly', 'yearly'],
    time : false,
    stack: ['quarterly', 'yearly'],
    stackMonthly: ['monthly', 'yearly'],
    multipleWithNegatives: ['quarterly', 'yearly'],
    stackWithAllNegatives: ['quarterly', 'yearly'],
    nullValues: ['quarterly', 'yearly'],
    nullMultiple: ['quarterly', 'yearly'],
    nullStack: ['quarterly', 'yearly'],
    weekly: ['weekly', 'monthly', 'yearly'],
    daily: ['daily', 'monthly', 'yearly']
};
var ySeriesData = {
    weekly: ['value'],
    daily: ['value'],
    categories: ['value', 'value2'],
    categoriesStack: ['value', 'value2'],
    dateCategories: ['value', 'value2'],
    quarterCategories: ['value', 'value2'],
    multiple: ['value', 'value2', 'value3'],
    nullMultiple: ['value', 'value2', 'value3'],
    multipleWithNegatives: ['value', 'value2', 'value3'],
    stack: ['value', 'value2', 'value3', 'value4', 'value5'],
    nullStack: ['value', 'value2', 'value3', 'value4', 'value5'],
    stackWithNegatives: ['value', 'value2', 'value3', 'value4', 'value5'],
    stackWithAllNegatives: ['value', 'value2', 'value3', 'value4', 'value5'],
    stackMonthly: ['value', 'value2', 'value3', 'value4', 'value5']
};
var xSeriesData = {
    categories: {key:'key', label:'Colours'},
    categoriesStack: {key:'key', label:'Colours'},
    dateCategories: {key:'key', label:'Colours'},
    quarterCategories: {key:'key', label:'Colours'},
    stack: {key:'myDateColumn', label:'yearly'},
    nullStack: {key:'myDateColumn', label:'yearly'},
    stackMonthly: {key:'myDateColumn', label:'yearly'},
    stackWithAllNegatives: {key:'myDateColumn', label:'yearly'}
};
function getChartData(timeFrame){
    var ySeries = ySeriesData[timeFrame] || ['value'];
    var xSeries = xSeriesData[timeFrame] ||  {key:'date', label:'yearly'};
    return {
        comment: 'Column chart',
        footnote: 'this is just for testing!',
        source: 'tbc',
        title: 'Columns: ' + timeFrame,
        subtitle: 'Drawn for you',
        dependentAxisOrient: 'left', //todo: refactor onto y object
        hideSource: false,
        x: { series: xSeries },
        y: { series: ySeries },
        units: units[timeFrame],
        data: fixtures[timeFrame],
        stack: ['stack', 'nullStack','stackMonthly', 'stackWithAllNegatives', 'categoriesStack'].indexOf(timeFrame)>-1,
        dataType: ['categories','categoriesStack','dateCategories', 'quarterCategories'].indexOf(timeFrame)>-1 ? 'categorical' : 'time'
    };
}

var widths = [600, 300];

module.exports = {
    getChartData: getChartData,
    init: function(){
        var demos = [
            'quarters','quartersWithNegative','years','yearsWithNegative','decade', 'month',
            'multiple', 'time', 'stack', 'stackMonthly', 'multipleWithNegatives', 'stackWithAllNegatives',
            'categories', 'categoriesStack', 'dateCategories', 'quarterCategories',
            'nullMultiple', 'nullValues', 'nullStack',
            'weekly', 'daily'];
        demos.forEach(function(timeFrame, i){
            var textContent = '';
            if (i===7){
                textContent = 'NOTE: This chart highlights how columns should rarely be used for time-data. This example should check that charts of this form render but not that they should look good.'
            }
            d3.select('#views').append('p').text(textContent).append('div').attr({
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
