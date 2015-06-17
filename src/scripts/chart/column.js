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


    if (!model.stack) {
        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('class', 'null-label')
            .attr('x',  function (d, i) { return plot.x(d.key, seriesNumber); })
            .attr('y',  function (d, i) { return plot.y(d.value, i); })
            .attr('dy', '-0.5em')
            .attr('dx', function (d, i) { return plot.columnWidth(d, i) / 2;})
            .text('n/a');
    }

    styler(plotSVG);

    if (!model.stack) {
        // make those labels who don't fit smaller
        s.selectAll('text.null-label')
            .each(function(d, i) {
                var w = this.getBoundingClientRect();
                if ((w.width + 2) >= plot.columnWidth(d, i)) {
                    this.innerHTML = '–';
                }
            });
    }
}

function formatData(model, series) {

    var nulls = [];

    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        var isNull = !(d.value !== null && !isNaN(d.value));
        if (isNull) nulls.push(d);
        // if we're stacking - we transform nulls
        // into zeros to avoid problems
        if (model.stack && isNull) {
            d.value = 0;
            return true;
        }
        return !isNull;
    });

    data._nulls = nulls;

    return data;
}

function columnChart(g){
	'use strict';

	var model = new DataModel('column', Object.create(g.data()[0]));
	var svg = g.append('svg')
		.attr({
            'id': model.id,
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

    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
	var creator = new axes.Create(chartSVG, model);

    creator.createAxes({dependent:'number', independent: independent});

	var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, creator, model.y.series[i], i);
	}
}

module.exports = columnChart;
