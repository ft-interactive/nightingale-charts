var oCharts = require('../../../main');
var d3 = require('d3');

(() => {
    var margin = {
        top: 20, left: 50, bottom: 70, right: 50
    }
    var data = {
        orient: "left",
        simple: false,
        scale: d3.scale.linear()
        .range([0, 400])
        .domain([11.2, 7])
    };

    var divs = d3.select('#views');

    divs.append('h2')
    .text("Number Axis");

    divs.append('svg')
    .data([data])
    .attr('width', function (d) {
        if (d.orient == "bottom") {
            var r = d.scale.range();
            return r[0] + r[1] + margin.bottom
        }
        return margin.left + margin.right
    })
    .attr('class', 'ft-chart')
    .attr('height', function (d) {
        if (d.orient == "bottom") {
            return margin.bottom
        }
        var r = d.scale.range();
        return r[0] + r[1] + margin.bottom
    })
    .each(function (d, i) {
        var axis = oCharts.axis.number()
        .simple(d.simple)
        .scale(d.scale)
        .orient(d.orient);

        d3.select(this)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(axis);
    });
})();

(() => {
    var margin = {
        top: 20, left: 50, bottom: 70, right: 50
    }
    var data = {
        orient: "bottom",
        simple: false,
        scale: d3.scale.linear()
        .range([0, 400])
        .domain([11.2, 7])
    };

    var divs = d3.select('#horizontal');

    divs.append('h2')
    .text("Number Axis");

    divs.append('svg')
    .data([data])
    .attr('width', function (d) {
        if (d.orient == "bottom") {
            var r = d.scale.range();
            return r[0] + r[1] + margin.bottom
        }
        return margin.left + margin.right
    })
    .attr('class', 'ft-chart')
    .attr('height', function (d) {
        if (d.orient == "bottom") {
            return margin.bottom
        }
        var r = d.scale.range();
        return r[0] + r[1] + margin.bottom
    })
    .each(function (d, i) {
        var axis = oCharts.axis.number()
        .simple(d.simple)
        .scale(d.scale)
        .orient(d.orient);

        d3.select(this)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(axis);
    });
})();
