
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var margin = {
    top:20, left:50, bottom:70, right:50
};

var data = [
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
];

function getChartData(i){
    return {
        title: 'Some Simple Columns: ' + (i + 1),
        x:{
            series: {key:'date', label:'year'},
        },
        y: { series: ['value']},
        data: data,
        scale: d3.scale
            .ordinal()
            .rangeRoundBands([0, 400], 0, 0)
            .domain(data.map(function (d){return d.key;}))
    };
}

module.exports = {
    init: function(){

        data = d3.nest()
            .key(function(d)  { return 'Q' + Math.floor((d.date.getMonth()+3)/3) + ' ' + (d.date.getYear() + 1900);  })
            .entries(data);

        for(var i=0;i<3;i++){
            d3.select('body')
                .append('div').attr('id','column-chart' + (i+1))
                .data([getChartData(i)])
                .append('h2')
                .text(function (d) {
                    return d.title
                })
                .append('svg')
                .attr('width', function (d) {
                    var r = d.scale.range();
                    return (r[r.length-1] - r[0]) + margin.left + margin.right;
                })
                .each(function (d, i) {
                    var axis = oCharts.axis.category()
                        .scale(d.scale);

                    d3.select(this)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .call(axis);
                });
        }
    }
};