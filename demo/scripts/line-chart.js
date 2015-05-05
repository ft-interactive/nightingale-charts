var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var y = [   { series: ['value', 'value2', 'value3'] },
            { series: [  {key:'value', label:'String Value'},
                         {key:'value2', label:'Another String Value'} ]
            },
            { series: [ {key:'value', label:function(){ return 'Function Value';}},
                        {key:'value2', label:function(){ return 'Another function Value';}} ]
            },
            { series: ['value'] }];
var hideSource = [true, true, false];
var numberAxisOrient = ['left', 'right', 'left', 'right'];

var quarterlyData =  [
    { date: new Date('3/31/05'), value: 0.583},
    { date: new Date('6/30/05'), value: -1.027},
    { date: new Date('9/30/05'), value: 1.03},
    { date: new Date('12/30/05'), value: 1.348}
];
var timeData = [
    {date: new Date('2000-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
    {date: new Date('2001-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
    {date: new Date('2002-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66},
    {date: new Date('2003-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40, value3:66}
];

function getChartData(i) {
    return {
        comment: "Line chart",
        footnote: "this is just for testing!",
        source: "tbc",
        title: "Some Simple Lines: " + (i + 1),
        subtitle: i===3 ? "Quarterly Axis" : "Drawn for you",
        numberAxisOrient: numberAxisOrient[i], //todo: refactor onto y object
        hideSource: hideSource[i],
        x: {
            series: {key: 'date', label: 'year'}
        },
        y: y[i],
        data: i===3 ? quarterlyData : timeData,
        groupDates: i===3 ? ['quarterly', 'yearly'] : false
    };
}

module.exports = {
    getChartData: getChartData,
    init: function () {
        for (var i = 0; i < 4; i++) {
            d3.select('body').append('div').attr('id', 'line-chart' + (i + 1));
            d3.select('#line-chart' + (i + 1)).data([getChartData(i)]).call(oCharts.chart.line);
        }
    }
};
