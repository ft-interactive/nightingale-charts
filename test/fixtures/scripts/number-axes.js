var oCharts = require('../../../src/scripts/nightingale-charts');
var d3 = require('d3');
var slug = require('slug');

var margin = {
    top: 20, left: 50, bottom: 70, right: 50
};
var axesDefinitions = [
    {
        title: 'six or less',
        simple: false,
        start: 11.2,
        end: 7
    },
    {
        title: 'more than 6',
        simple: false,
        start: 356,
        end: 0
    },
    {
        title: 'six or less (simple)',
        simple: true,
        start: 11.2,
        end: 7
    },
    {
        title: 'more than 6 (simple)',
        simple: true,
        start: 356,
        end: 0
    },
    {
        title: 'six or less',
        simple: false,
        orient: 'bottom',
        start: 7,
        end: 11.2
    },
    {
        title: 'six or less (simple)',
        simple: true,
        orient: 'bottom',
        start: 7,
        end: 11.2
    },
    {
        title: 'above zero, below 3, decimals',
        simple: false,
        start: 2.95,
        end: 0.2
    },
    {
        title: 'reversed scale',
        reverse: true,
        simple: false,
        start: 2.95,
        end: 0.2
    }];

function createAxesDefArrayOfWidth(axisWidth, axesDefinitionArray) {

    var sizedAxesDefinitions = [];
    axesDefinitionArray.forEach(function (axis) {
        var sizedAxis = {
            title: axis.title,
            orient: axis.orient,
            simple: axis.simple,
            reverse: axis.reverse,
            scale: d3.scale.linear()
                .range([0, axisWidth])
                .domain([axis.start, axis.end])
        };
        sizedAxesDefinitions.push(sizedAxis);
    });
    return sizedAxesDefinitions;
}

function renderAxesArrayIntoDiv(div, axesDefinitionArray) {
    var divs = d3.select('#views')
        .selectAll('div')
        .data(axesDefinitionArray)
        .enter().append('div')
        .attr('class', 'axis-test');

    divs.append('h2')
        .text(function (d) {
            return d.title
        });

    divs.append('svg')
        .attr('id', function(d) {
            return slug(d.title).toLowerCase();
        })
        .attr('width', function (d) {
            if (d.orient) {
                var r = d.scale.range();
                return r[0] + r[1] + margin.bottom
            }
            return margin.left + margin.right
        })
        .attr('class', 'ft-chart')
        .attr('height', function (d) {
            if (d.orient) {
                return margin.bottom
            }
            var r = d.scale.range();
            return r[0] + r[1] + margin.bottom
        })
        .each(function (d, i) {
            var axis = oCharts.axis.number()
                .simple(d.simple)
                .orient(d.orient)
                .reverse(d.reverse)
                .scale(d.scale);

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);
        });
}

module.exports = {
    init: function () {
        renderAxesArrayIntoDiv('#views', createAxesDefArrayOfWidth(200, axesDefinitions));
    }
};
