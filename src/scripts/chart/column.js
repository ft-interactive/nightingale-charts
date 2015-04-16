var d3 = require('d3');
var Axes = require('./line.axes.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');

//null values in the data are interpolated over, filter these out
//NaN values are represented by line breaks
function plotSeries(plotSVG, model, axes, series) {

	var data = model.data.map(function(d){
		return {
			name:d[model.x.series.key],
			value:d[series.key]
		};
	}).filter(function(d){
		return (d.y !== null);
	});

    var timeBands = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.name; }))
        .rangeRoundBands([0, model.plotWidth], .2);

    plotSVG.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) { return "column "  + series.className + (d.value < 0 ? " negative" : " positive"); })
        .attr("data-value", function(d) { return d.value; })
        .attr("x", function(d) { return axes.timeScale(d.name); })
        .attr("y", function(d) { return axes.valueScale(Math.max(0, d.value)); })
        .attr("height", function(d) { return Math.abs(axes.valueScale(d.value) - axes.valueScale(0)); })
        .attr("width", timeBands.rangeBand());
}

function columnChart(g) {
	'use strict';

	var model = new DataModel(Object.create(g.data()[0]));
	var svg = g.append('svg')
		.attr({
			'class': 'graphic line-chart',
			height: model.height,
			width: model.width,
			xmlns:"http://www.w3.org/2000/svg",
			version:"1.2"
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

module.exports = columnChart;
