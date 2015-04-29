var d3 = require('d3');
var Axes = require('../util/draw-axes.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');

function plotSeries(plotSVG, model, axes, series, i){
	var data = formatData(model, series);
	var s = plotSVG.append('g')
		.attr('class', 'series');

//todo:  sort out scale so you dont have to do the maths for width & x-position
//	http://bl.ocks.org/mbostock/3887051
//console.log(data)
//	var x1= d3.scale.ordinal()
//	var bars = d3.keys(data).filter(function(key) { return key !== "State"; });
//	console.log(bars)
//	x1.domain(bars).rangeRoundBands([0, axes.timeScale.rangeBand()]);

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'column column--'  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){	return d.value;})
		.attr('x', function (d){return axes.timeScale(d.key) + ((axes.timeScale.rangeBand() / model.y.series.length) * i);}) //adjust the x position based on the series number
		//.attr("x", function(d) { return x1(d.key); })
		.attr('y', function (d){return axes.valueScale(Math.max(0, d.value));})
        .attr('height', function (d){return 	Math.abs(axes.valueScale(d.value) - axes.valueScale(0));})
		//.attr("width", x1.rangeBand())
        .attr('width', axes.timeScale.rangeBand() / model.y.series.length); //width is divided by series length
}

function formatData(model, series) {
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: d.values[0][series.key]
        };
    }).filter(function (d) {
        return (d.y !== null);
    });
    return data;
}

function columnChart(g){
	'use strict';

	var model = new DataModel(Object.create(g.data()[0]));
	var i = model.y.series.length;
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

	if(model.groupDates){
		axes.addGroupedTimeScale(model.groupDates);
	}else{
		axes.addTimeScale();
	}
	axes.repositionAxis();

	var plotSVG = chartSVG.append('g').attr('class', 'plot');

	while(i--){
		plotSeries(plotSVG, model, axes, model.y.series[i], i);
	}
}

module.exports = columnChart;
