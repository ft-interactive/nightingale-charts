var d3 = require('d3');
var Axes = require('../util/draw-axes.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');

function plotSeries(plotSVG, model, axes, series) {

	var data = formatData(model, series);

    plotSVG.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) { return "column column--"  + series.className + (d.value < 0 ? " negative" : " positive"); })
        .attr("data-value", function(d) { return d.value; })
        .attr("x", function(d) { return axes.timeScale(d.key); })
        .attr("y", function(d) { return axes.valueScale(Math.max(0, d.value)); })
        .attr("height", function(d) { return Math.abs(axes.valueScale(d.value) - axes.valueScale(0)); })
        .attr("width", axes.timeScale.rangeBand());
}

function formatData(model, series){
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function(d){
        return {
            key:d[model.x.series.key],
            value:d[series.key]
        };
    }).filter(function(d){
        return (d.y !== null);
    });
    return data;
}

function columnChart(g) {
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
	if (model.groupDates) {
		axes.addGroupedTimeScale(model.groupDates);
	} else {
		axes.addTimeScale();
	}
	axes.repositionAxis();

	var plotSVG = chartSVG.append('g').attr('class', 'plot');
	var i = model.y.series.length;
	while (i--) {
		plotSeries(plotSVG, model, axes, model.y.series[i]);
	}
}

module.exports = columnChart;
