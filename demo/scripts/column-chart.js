
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var y = [
    { series: ['value']},
    { series: [{key:'value', label:'String Value'}]},
    { series: [{key:'value', label:function(){ return 'Function Value';}}]}
];
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
        /*
        {
            group:'Q1',
            items:[
                {label:'S&P 500', value:310504},
                {label:'3 Month', value:552339},
                {label:'6 Month', value:259034},
                {label:'1 Year', value:450818},
                {label:'3 Year', value:1231572},
                {label:'10 Year', value:1215966},
                {label:'20 Year', value:641667}
            ]
        },
        {
            group:'Q2',
            items:[
                {label:'S&P 500', value:52083},
                {label:'3 Month', value:185640},
                {label:'6 Month', value:1002153},
                {label:'1 Year', value:1074257},
                {label:'3 Year', value:198724},
                {label:'10 Year', value:783159},
                {label:'20 Year', value:50277}
            ]
        },
        {
            group:'Q3',
            items:[
                {label:'S&P 500', value:515910},
                {label:'3 Month', value:828669},
                {label:'6 Month', value:362642},
                {label:'1 Year', value:601943},
                {label:'3 Year', value:1804762},
                {label:'10 Year', value:1523681},
                {label:'20 Year', value:862573}
            ]
        }

        */

        {
            date: new Date('3/31/05'), value: Math.floor(Math.random() * 40) + 10, value2: 99, value3: 26
        },
        {
            date: new Date('6/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: 21
        },
        {
            date: new Date('9/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 70, value3: 13
        },
        {
            date: new Date('12/30/05'), value: Math.floor(Math.random() * 40) + 10, value2: 10, value3: 29
        }
    ]
};

var units = {
    month: ['monthly', 'yearly']
}
var widths = [600]; //set this back to 600, 300 - I simply wanted to read fewer console logs

function getChartData(timeFrame){
    return {
        comment: 'Column chart',
        footnote: 'this is just for testing!',
        source: 'tbc',
        title: 'Columns: ' + timeFrame,
        subtitle: 'Drawn for you',
        numberAxisOrient: 'left', //todo: refactor onto y object
        hideSource: false,
        x:{
          series: {key:'date', label:'yearly'}
        },
        tickSize: 5,
        y: yKey(timeFrame),
        seriesLength: yKey(timeFrame).series.length,
        groupDates: units[timeFrame] || ['quarterly', 'yearly'],
        data: fixtures[timeFrame]
    };
}

function yKey(timeFrame){ //this just makes it easier to add values and not have to recode static info
    var o = {series:[]};

    if(timeFrame !== 'multiple'){
        o.series.push('value');
    }else{
        for(var k in fixtures[timeFrame][0]){
            k !== 'date' ? o.series.push(k) : 0; 
        }       
    }

    return o;
}

module.exports = {
    getChartData: getChartData,
    init: function(){
        var demos = ['year','yearWithNegative','years','yearsWithNegative','decade', 'month', 'multiple'];
        //var demos = ['multiple'];
        demos.forEach(function(timeFrame){
            d3.select('#views').append('div').attr({
                'id':'column-chart__' + timeFrame
            });
            widths.forEach(function (width){
                var data = getChartData(timeFrame);
                data.width = width;
                
                data.originalData = data.data;

                d3.select('#column-chart__' + timeFrame).append('span')
                    .attr('class', 'width' + width)
                    .data([data]).call(oCharts.chart.column);
            });
        });
    }
};
