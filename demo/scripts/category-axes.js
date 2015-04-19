
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var margin = {
    top:20, left:50, bottom:70, right:50
};


var d3 = require('d3');

var axesDefinitions = [
    {
        title: 'smallest',
        scale: d3.scale.linear()
            .range([0, 400])
            .domain([-0.1, 0.36])
    },
    {
        title: 'smaller',
        scale: d3.scale.linear()
            .range([0, 400])
            .domain([0, 33])
    },
    {
        title: 'medium',
        scale: d3.scale.linear()
            .range([0, 400])
            .domain([-100, 100])
    },
    {
        title: 'bigger',
        scale: d3.scale.linear()
            .range([0, 400])
            .domain([0, 1000])
    },
    {
        title: 'MASSIVE(ish)',
        scale: d3.scale.linear()
            .range([0, 400])
            .domain([-1000, 3000000])
    },
    {
        title: 'non zero',
        scale: d3.scale.linear()
            .range([0, 400])
            .domain([30, 130])
    }
];;

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
                .scale(d.scale);

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);
        });
}

module.exports = {
    init: function(){
        //renderAxesArrayIntoDiv('#views', createAxesDefArrayOfWidth(400,axesDefinitions));
        //renderAxesArrayIntoDiv('#viewsSmall', createAxesDefArrayOfWidth(200,axesDefinitions));
    }
};
