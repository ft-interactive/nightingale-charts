
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

function createChart(i){
    d3.select('body').append('div').attr('id','line-chart'+i);

    var simpleData = {
        comment: "Line chart",
        footnote: "this is just for testing!",
        source: "tbc",
        title: "Some Simple Lines",
        subtitle: "Drawn for you",
        numberAxisOrient:'right',//or 'left'//todo: refactor onto y object
        hideSource:true,
        x:{
          series: {key:'date', label:'year'}
        },
        y:{
          series: ['value', {key:'value2', label:function(){
              return 'foo'
          }}]  //could be an array of {key:, label}
        },
        data: [
            {date: new Date('2000-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40},
            {date: new Date('2001-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40},
            {date: new Date('2002-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40},
            {date: new Date('2003-01-01T00:00:00.000Z'), value: Math.random() * 40, value2: Math.random() * 40}
        ]
    };

    var lineChart = oCharts.chart.line();
    d3.select('#line-chart'+i).data([simpleData]).call( lineChart );
}

module.exports = {
    init: function(){
        for(var i=0;i<3;i++){
            createChart(i);
        }
    }
};
