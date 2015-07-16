var d3 = require('d3');
var axes = require('../axis');
var interpolator = require('../util/line-interpolators.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');
var extend = require('util')._extend;

function drawLine(plotSVG, data, attrs){
    plotSVG.append('path').datum(data).attr(attrs);
}

function plotSeries(plotSVG, model, createdAxes, series, lineAttr, borderAttrs) {
    var plot = new axes.Plot(model, createdAxes);
    var line = d3.svg.line()
        .interpolate(interpolator.gappedLine)
        .x(function (d, i) { return plot.x(d.key, 0); })
        .y(function (d, i) { return plot.y(d.value, i);});
    var data = formatData(model, series);
    lineAttr.d = function (d) { return line(d); };
    lineAttr.class = 'line '  + series.className;
    lineAttr.stroke = model.colours[series.index];
    if (lineAttr.border){
        borderAttrs.d = lineAttr.d;
        drawLine(plotSVG, data, borderAttrs);
    }
    drawLine(plotSVG, data, lineAttr);
}

function formatData(model, series) {
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function (d) {
        return {
            key: d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        return (d.value !== null);
    });
    return data;
}

function lineChart(g) {
    'use strict';

    var model = new DataModel('line',Object.create(g.data()[0]));
    var svg = g.append('svg')
        .attr({
            'class': 'graphic line-chart',
            height: model.height,
            width: model.width,
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.2'
        }).attr(themes.check(model.theme, 'svg').attributes);
    metadata.create(svg, model);

    var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

    var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({
        dependent:'number',
        independent: 'time'
    });

    model.keyHover && dressing.addSeriesKey();

    var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = model.y.series.length;
    var lineAttr = extend(
        themes.check(model.theme, 'lines').attributes,
        {'stroke-width': model.lineStrokeWidth});
    var borderAttrs = extend({}, lineAttr);
    borderAttrs.class = 'line line__border';
    borderAttrs['stroke-width'] =  lineAttr['stroke-width'] * 2;
    borderAttrs.stroke = lineAttr.border;

    while (i--) {
        plotSeries(plotSVG, model, creator, model.y.series[i], lineAttr, borderAttrs);
    }
}

module.exports = lineChart;
