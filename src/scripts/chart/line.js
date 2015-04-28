var d3 = require('d3');
var Axes = require('../util/draw-axes.js');
var interpolator = require('../util/line-interpolators.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');

//null values in the data are interpolated over, filter these out
//NaN values are represented by line breaks
function plotSeries(plotSVG, model, axes, series) {

    var data = model.data.map(function (d) {
        return {
            x: d[model.x.series.key],
            y: d[series.key]
        };
    }).filter(function (d) {
        return (d.y !== null);
    });

    var line = d3.svg.line()
        .interpolate(interpolator.gappedLine)
        .x(function (d) {
            return axes.timeScale(d.x);
        })
        .y(function (d) {
            return axes.valueScale(d.y);
        });

    plotSVG.append('path')
        .datum(data)
        .attr('class', 'line line--' + series.className)
        .attr('stroke-width', model.lineStrokeWidth)
        .attr('d', function (d) {
            //console.log('datum ', d);//todo: log function that can be mocked in tests
            return line(d);
        });
}

function lineChart(g) {
    'use strict';

    var model = new DataModel(Object.create(g.data()[0]));
    var svg = g.append('svg')
        .attr({
            'class': 'graphic line-chart',
            height: model.height,
            width: model.width,
            xmlns: "http://www.w3.org/2000/svg",
            version: "1.2"
        });
    metadata.create(svg, model);

    var dressing = new Dressing(svg, model);
    dressing.addHeader();
    dressing.addFooter();

    var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    var axes = new Axes(chartSVG, model);
    axes.addValueScale();
    axes.addTimeScale();
    axes.repositionAxis();

    var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = model.y.series.length;
    while (i--) {
        plotSeries(plotSVG, model, axes, model.y.series[i]);
    }
}

module.exports = lineChart;
