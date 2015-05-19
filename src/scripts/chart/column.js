var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');
var styler = require('../util/chart-attribute-styles');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){
	var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var s = plotSVG.append('g').attr('class', 'series');
    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'column '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x',      function (d, i){ return plot.x(d.key, seriesNumber); })
        .attr('y',      function (d, i){ return plot.y(d.value, i); })
        .attr('height', function (d, i){ return plot.columnHeight(d.value); })
        .attr('width',  function (d, i){ return plot.columnWidth(d, i); });

    styler(plotSVG);
}

function formatData(model, series) {
    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: d[series.key] || d.values[0][series.key]
        };
    }).filter(function (d) {
        return (d.value !== null);
    });
    return data;
}

function columnChart(g){
	'use strict';

	var model = new DataModel('column', Object.create(g.data()[0]));
	var svg = g.append('svg')
		.attr({
			'class': 'graphic column-chart',
			height: model.height,
			width: model.width,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.2'
		});
	metadata.create(svg, model);

	var dressing = new Dressing(svg, model);
    dressing.addHeader();
    dressing.addFooter();

	var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

	var create = new axes.Create(chartSVG, model);
    create.dependentScale('number');
    create.independentScale(model.groupData ? 'ordinal' : 'time');

	var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, create, model.y.series[i], i);
	}
}

module.exports = columnChart;
