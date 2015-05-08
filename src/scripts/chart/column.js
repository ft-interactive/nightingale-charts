var d3 = require('d3');
var Axes = require('../util/draw-axes.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');

function plotSeries(plotSVG, model, axes, series, i){
	var data = formatData(model, series);
	var s = plotSVG.append('g')
		.attr('class', 'series');

//@Peter, I left this stuff in here and made some additional comments. They can be removed whenever you're comfortable

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
        .attr('data-value', function (d){return d.value;})
		.attr('x', function (d){
			var adjustmentIfMultipleSeries = model.chartSubtype === 'multiple' ? ((axes.timeScale.rangeBand() / model.y.series.length) * i) : 0;
			return axes.timeScale(d.key) + adjustmentIfMultipleSeries;
		})
		.attr('y', function (d, j){
			var stackY = model.stackSeries({stack:j, value:d.value}, 0); //all series are now stacks
			return axes.valueScale(Math.max(0, stackY));
		})
        .attr('height', function (d){return Math.abs(axes.valueScale(d.value) - axes.valueScale(0));})
        .attr('width', function(){
        	var adjustmentIfMultipleSeries = model.chartSubtype === 'multiple' ? model.y.series.length : 1;
			return axes.timeScale.rangeBand() / adjustmentIfMultipleSeries;
    	});

        //.attr('x', function(d) { return x1(d.key); })
    	//.attr("width", x1.rangeBand())
}

function formatData(model, series){
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: d.values[0][series.key]
        };
    }).filter(function(d){
        return (d.y !== null);
    });
    return data;
}

function columnChart(g){
	'use strict';

	var model = new DataModel(Object.create(g.data()[0]));
	var i = 0;
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

	while(i < model.y.series.length){ //changed to order stacked colors
		plotSeries(plotSVG, model, axes, model.y.series[i], i);
		i++;
	}
}

module.exports = columnChart;
