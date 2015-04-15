
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var margin = {
    top:20, left:50, bottom:70, right:50
}

var axesDefinitions = [
    {
        title:'A Year',
        dateStart : new Date("March 31, 1981"),
        dateEnd: new Date("December 31, 1981")
    },
    {
        title:'A Few Years',
        dateStart : new Date("June 30, 1981"),
        dateEnd: new Date("March 31, 1985")
    },
    {
        title:'many many many',
        dateStart : new Date("June 30, 1981"),
        dateEnd: new Date("March 31, 2012")
    }
];

var nestData =  [
    { date: new Date('6/30/05'), value: 1.027},
    { date: new Date('9/30/05'), value: 1.03},
    { date: new Date('12/30/05'), value: 	 1.348},
    { date: new Date('3/31/06'), value: 	 0.583},
    { date: new Date('6/30/06'), value: 	 0.501},
    { date: new Date('9/29/06'), value: 	 0.175},
    { date: new Date('12/29/06'), value: 	 0.753},
    { date: new Date('3/30/07'), value: 	 0.763},
    { date: new Date('6/29/07'), value: 	 0.601},
    { date: new Date('9/28/07'), value: 	 0.843},
    { date: new Date('12/31/07'), value: 	 0.468},
    { date: new Date('3/31/08'), value: 	 0.313},
    { date: new Date('6/30/08'), value: 	 -0.231},
    { date: new Date('9/30/08'), value: 	 -1.664},
    { date: new Date('12/31/08'), value: 	 -2.229},
    { date: new Date('3/31/09'), value: 	 -1.79},
    { date: new Date('6/30/09'), value: 	 -0.261},
    { date: new Date('9/30/09'), value: 	 0.2},
    { date: new Date('12/31/09'), value: 	 0.389},
    { date: new Date('3/31/10'), value: 	 0.509},
    { date: new Date('6/30/10'), value: 	 0.977},
    { date: new Date('9/30/10'), value: 	 0.647},
    { date: new Date('12/31/10'), value: 	 0.025},
    { date: new Date('3/31/11'), value: 	 0.536},
    { date: new Date('6/30/11'), value: 	 0.228},
    { date: new Date('9/30/11'), value: 	 0.696},
    { date: new Date('12/30/11'), value: 	 -0.015},
    { date: new Date('3/30/12'), value: 	 0.068},
    { date: new Date('6/29/12'), value: 	 -0.178},
    { date: new Date('9/28/12'), value: 	 0.833},
    { date: new Date('12/31/12'), value: 	 -0.338},
    { date: new Date('3/29/13'), value: 	 0.596},
    { date: new Date('6/28/13'), value: 	 0.643},
    { date: new Date('9/30/13'), value: 	 0.717},
    { date: new Date('12/31/13'), value: 	 0.406},
    { date: new Date('3/31/14'), value: 	 0.882},
    { date: new Date('6/30/14'), value: 	 0.833},
    { date: new Date('9/30/14'), value: 	 0.619},
    { date: new Date('12/31/14'), value: 	 0.607}];

function createAxesDefArrayOfWidth(axisWidth, axesDefinitionArray) {

    var sizedAxesDefinitions = [];
    axesDefinitionArray.forEach(function(axis){
        var sizedAxis = {
            title: axis.title,
            simple: axis.simple,
            scale: d3.time.scale()
                .range([0, axisWidth])
                .domain([axis.dateStart, axis.dateEnd])
        };
        sizedAxesDefinitions.push(sizedAxis);
    });
    return sizedAxesDefinitions;
}

function renderAxesArrayIntoDiv(div, axesDefinitionArray) {

    var divs = d3.select(div)
        .selectAll('div')
        .data(axesDefinitionArray)
        .enter().append('div')
        .attr('class', 'axis-test');

    divs.append('h2')
        .text(function (d) {
            return d.title
        });

    divs.append('svg')
        .attr('width', function (d) {
            var r = d.scale.range();
            return (r[1] - r[0]) + margin.left + margin.right;
        })
        .attr('class', 'ft-chart')
        .attr('height', margin.top + margin.bottom)
        .each(function (d, i) {

            //create the axis, giving it a scale
            var axis = oCharts.axis.date()
                .simple(d.simple)
                .scale(d.scale, ['quarters', 'years']);

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);
        });
}

//function nest(){
//
//    var nested_data = d3.nest()
//        .key(function(d)  { return  Math.floor((d.date.getMonth()+3)/3);  })
//        .entries(nestData);
//
//    function getChartData() {
//        return {
//            title: "quarters",
//            numberAxisOrient: 'left', //todo: refactor onto y object
//            hideSource: true,
//            x: {
//                series: {key: 'date', label: 'year'}
//            },
//            y: { series: ['value']},
//            data: nestData
//        };
//    }
//
//    d3.select('body').append('div').attr('id','line-chart');
//    d3.select('#line-chart').data([getChartData()]).call( oCharts.chart.line() );
//}

module.exports = {
    init: function(){
        renderAxesArrayIntoDiv('#views', createAxesDefArrayOfWidth(400,axesDefinitions));
        renderAxesArrayIntoDiv('#viewsSmall', createAxesDefArrayOfWidth(200,axesDefinitions));
        //nest()
    }
}
