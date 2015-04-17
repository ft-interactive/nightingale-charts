
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var y = [
    { series: ['value']},
    { series: [{key:'value', label:'String Value'}]},
    { series: [{key:'value', label:function(){ return 'Function Value';}}]}
];
var hideSource = [true, true, false];
var numberAxisOrient = ['left','right','left'];

function getChartData(i){
    return {
        comment: "Column chart",
        footnote: "this is just for testing!",
        source: "tbc",
        title: "Some Simple Columns: " + (i+1),
        subtitle: "Drawn for you",
        numberAxisOrient: numberAxisOrient[i], //todo: refactor onto y object
        hideSource: hideSource[i],
        x:{
          series: {key:'date', label:'year'}
        },
        y: y[i],
        //groupDates: 'quarters',
        data: [
            { date: new Date('6/30/05'), value: 1.027, value2: 0.5027},
            { date: new Date('9/30/05'), value: 1.03, value2: 0.503},
            { date: new Date('12/30/05'), value:  1.348, value2:  0.5348},
            { date: new Date('3/31/06'), value:  0.583, value2:  0.583},
            { date: new Date('6/30/06'), value:  0.501, value2:  0.501},
            { date: new Date('9/29/06'), value:  0.175, value2:  0.175},
            { date: new Date('12/29/06'), value:  0.753, value2:  0.753},
            { date: new Date('3/30/07'), value:  0.763, value2:  0.763},
            { date: new Date('6/29/07'), value:  0.601, value2:  0.601},
            { date: new Date('9/28/07'), value:  0.843, value2:  0.843},
            { date: new Date('12/31/07'), value:  0.468, value2:  0.468},
            { date: new Date('3/31/08'), value:  0.313, value2:  0.313},
            { date: new Date('6/30/08'), value:  -0.231, value2:  -0.231},
            { date: new Date('9/30/08'), value:  -1.664, value2:  -1.664},
            { date: new Date('12/31/08'), value:  -2.229, value2:  -2.229},
            { date: new Date('3/31/09'), value:  -1.79, value2:  -1.79},
            { date: new Date('6/30/09'), value:  -0.261, value2:  -0.261},
            { date: new Date('9/30/09'), value:  0.2, value2:  0.2},
            { date: new Date('12/31/09'), value:  0.389, value2:  0.389},
            { date: new Date('3/31/10'), value:  0.509, value2:  0.509},
            { date: new Date('6/30/10'), value:  0.977, value2:  0.977},
            { date: new Date('9/30/10'), value:  0.647, value2:  0.647},
            { date: new Date('12/31/10'), value:  0.025, value2:  0.025},
            { date: new Date('3/31/11'), value:  0.536, value2:  0.536},
            { date: new Date('6/30/11'), value:  0.228, value2:  0.228},
            { date: new Date('9/30/11'), value:  0.696, value2:  0.696},
            { date: new Date('12/30/11'), value:  -0.015, value2:  -0.015},
            { date: new Date('3/30/12'), value:  0.068, value2:  0.068},
            { date: new Date('6/29/12'), value:  -0.178, value2:  -0.178},
            { date: new Date('9/28/12'), value:  0.833, value2:  0.833},
            { date: new Date('12/31/12'), value:  -0.338, value2:  -0.338},
            { date: new Date('3/29/13'), value:  0.596, value2:  0.596},
            { date: new Date('6/28/13'), value:  0.643, value2:  0.643},
            { date: new Date('9/30/13'), value:  0.717, value2:  0.717},
            { date: new Date('12/31/13'), value:  0.406, value2:  0.406},
            { date: new Date('3/31/14'), value:  0.882, value2:  0.882},
            { date: new Date('6/30/14'), value:  0.833, value2:  0.833},
            { date: new Date('9/30/14'), value:  0.619, value2:  0.619},
            { date: new Date('12/31/14'), value:  0.607, value2:  0.607}
        ]
    };
}

module.exports = {
    getChartData: getChartData,
    init: function(){

        for(var i=0;i<3;i++){
            d3.select('body').append('div').attr('id','column-chart' + (i+1));
            d3.select('#column-chart'+ (i+1)).data([getChartData(i)]).call( oCharts.chart.column );
        }
    }
};
