var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var margin = {
    top: 20, left: 50, bottom: 70, right: 50
}

var axesDefinitions = [
    {
        title: 'A Year',
        dateStart: new Date("March 31, 1981"),
        dateEnd: new Date("December 31, 1981")
    },
    {
        title: 'A Few Years',
        dateStart: new Date("June 30, 1981"),
        dateEnd: new Date("March 31, 1985")
    },
    {
        title: 'many many many',
        dateStart: new Date("June 30, 1981"),
        dateEnd: new Date("March 31, 2012")
    }
];

function createAxesDefArrayOfWidth(axisWidth, axesDefinitionArray) {

    var sizedAxesDefinitions = [];
    axesDefinitionArray.forEach(function (axis) {
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

module.exports = {
    init: function () {
        renderAxesArrayIntoDiv('#views', createAxesDefArrayOfWidth(400, axesDefinitions));
        renderAxesArrayIntoDiv('#viewsSmall', createAxesDefArrayOfWidth(200, axesDefinitions));
    }
}
