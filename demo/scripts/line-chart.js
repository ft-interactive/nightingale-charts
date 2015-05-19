var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var y = [   { series: ['value', 'value2', 'value3'] },
            { series: [  {key:'value', label:'String Value'},
                         {key:'value2', label:'Another String Value'} ]
            },
            { series: [ {key:'value', label:function(){ return 'Function Value';}},
                        {key:'value2', label:function(){ return 'Another function Value';}} ]
            },
            { series: ['value','value2','value3'] },
            { series: ['value'] },
            { series: ['value'] },
            { series: ['value'] },
            { series: ['value'] }];
var hideSource = [true, true, false];
var numberAxisOrient = ['left', 'right', 'left', 'right', 'right', 'right', 'right', 'right'];

var quarterlyDataPlus =  [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: 1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('01/01/06'), value: 1.348}
];
var quarterlyData5Months =  [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: -1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('01/01/06'), value: 1.348}
];
var quarterlyDataMany =  [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: -1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('1/1/06'), value: 0.583},
    { date: new Date('4/01/06'), value: -1.027},
    { date: new Date('7/01/06'), value: 1.03},
    { date: new Date('10/01/06'), value: 1.348},
    { date: new Date('1/1/07'), value: 0.583},
    { date: new Date('4/01/07'), value: -1.027},
    { date: new Date('7/01/07'), value: 1.03},
    { date: new Date('10/01/07'), value: 1.348},
    { date: new Date('1/1/08'), value: 0.583},
    { date: new Date('4/01/08'), value: -1.027},
    { date: new Date('7/01/08'), value: 1.03},
    { date: new Date('10/01/08'), value: 1.348},
    { date: new Date('01/01/09'), value: 1.348}
];
var quarterlyDataDecade =  [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: -1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('1/1/06'), value: 0.583},
    { date: new Date('4/01/06'), value: -1.027},
    { date: new Date('7/01/06'), value: 1.03},
    { date: new Date('10/01/06'), value: 1.348},
    { date: new Date('1/1/07'), value: 0.583},
    { date: new Date('4/01/07'), value: -1.027},
    { date: new Date('7/01/07'), value: 1.03},
    { date: new Date('10/01/07'), value: 1.348},
    { date: new Date('1/1/08'), value: 0.583},
    { date: new Date('4/01/08'), value: -1.027},
    { date: new Date('7/01/08'), value: 1.03},
    { date: new Date('10/01/08'), value: 1.348},
    { date: new Date('01/01/09'), value: 1.348},
    { date: new Date('4/01/09'), value: -1.027},
    { date: new Date('7/01/09'), value: 1.03},
    { date: new Date('10/01/09'), value: 1.348},
    { date: new Date('1/1/10'), value: 0.583},
    { date: new Date('4/01/10'), value: -1.027},
    { date: new Date('7/01/10'), value: 1.03},
    { date: new Date('10/01/10'), value: 1.348},
    { date: new Date('1/1/11'), value: 0.583},
    { date: new Date('4/01/11'), value: -1.027},
    { date: new Date('7/01/11'), value: 1.03},
    { date: new Date('10/01/11'), value: 1.348},
    { date: new Date('1/1/12'), value: 0.583},
    { date: new Date('4/01/12'), value: -1.027},
    { date: new Date('7/01/12'), value: 1.03},
    { date: new Date('10/01/12'), value: 1.348},
    { date: new Date('01/01/13'), value: 1.348}
];
var timeData = [
    {date: new Date('2000-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
    {date: new Date('2001-01-01T00:00:00.000Z'), value: 0, value2: Math.random() * 40, value3:66},
    {date: new Date('2002-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
    {date: new Date('2003-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66}
];
var dataWithZeros = [
    {date: new Date('2000-01-01T00:00:00.000Z'), value: 1, value2: 0, value3:1},
    {date: new Date('2001-01-01T00:00:00.000Z'), value: 0, value2: 1, value3:2},
    {date: new Date('2002-01-01T00:00:00.000Z'), value: -1, value2: 1.5, value3:0},
    {date: new Date('2003-01-01T00:00:00.000Z'), value: 1.5, value2: -1, value3:1}
];
var data = [timeData,timeData,timeData,dataWithZeros,quarterlyDataPlus, quarterlyData5Months, quarterlyDataMany, quarterlyDataDecade]

function getChartData(i) {
    var defaultData = {
        comment: "Line chart",
        footnote: "this is just for testing!",
        source: "tbc",
        title: "Some Simple Lines: " + (i + 1),
        subtitle: "Drawn for you",
        numberAxisOrient: numberAxisOrient[i], //todo: refactor onto y object
        hideSource: hideSource[i],
        x: {
            series: {key: 'date', label: 'year'}
        },
        y: y[i],
        data: data[i],
        units: false
    };
    if (i>=4){
        defaultData.subtitle = "Quarterly Axis";
        defaultData.units = ['quarterly', 'yearly'];
    }
    return defaultData;
}

module.exports = {
    getChartData: getChartData,
    init: function () {
        for (var i = 0; i < 8; i++) {
            d3.select('body').append('div').attr('id', 'line-chart' + (i + 1));
            d3.select('#line-chart' + (i + 1)).data([getChartData(i)]).call(oCharts.chart.line);
        }
    }
};
