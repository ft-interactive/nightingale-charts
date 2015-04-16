var d3 = require('d3');
var dateAxis = require('../axis/date.js');
var numberAxis = require('../axis/number.js');
var interpolator = require('../util/line-interpolators.js');
var DataModel = require('./data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function getWidth(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().width);
}

function lineChart(p) {
    'use strict';

	function chart(g){

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

		if (!model.height) {
			model.height = dressing.headerHeight + model.chartHeight + dressing.footerHeight;
		} else {
			model.chartHeight = model.height - dressing.headerHeight - dressing.footerHeight;
			if (model.chartHeight < 0) {
				model.error({
					node:chartSVG,
					message:'calculated plot height is less than zero'
				});
			}
		}

		svg.attr('height', Math.ceil(model.height));

        dressing.addLogo();

		//the business of the actual chart
		//make provisional scales
		var valueScale = d3.scale.linear()
			.domain(model.valueDomain.reverse())
			.range([0, model.chartHeight ]);

		if (model.niceValue) {
			valueScale.nice();
		}

		var timeScale = d3.time.scale()
			.domain(model.timeDomain)
			.range([0, model.chartWidth]);

		//first pass, create the axis at the entire chartWidth/Height

		var vAxis = numberAxis()
//				.orient( model.numberAxisOrient )
				.tickFormat(model.numberAxisFormatter)
				.simple(model.simpleValue)
				.tickSize(model.chartWidth)	//make the ticks the width of the chart
				.scale(valueScale),

			timeAxis = dateAxis()
				.simple(model.simpleDate)
				.yOffset(model.chartHeight)	//position the axis at the bottom of the chart
				.scale(timeScale);

		if (model.numberAxisOrient !== 'right' && model.numberAxisOrient !== 'left') {
			vAxis.noLabels(true);
		} else {
			vAxis.orient(model.numberAxisOrient);
		}

		chartSVG.call(vAxis);
		chartSVG.call(timeAxis);

		//measure chart
		var widthDifference = getWidth(chartSVG) - model.chartWidth, //this difference is the ammount of space taken up by axis labels
			heightDifference = getHeight(chartSVG) - model.chartHeight,
			//so we can work out how big the plot should be (the labels will probably stay the same...
			plotWidth = model.chartWidth - widthDifference,
			plotHeight = model.chartHeight - heightDifference,
			newValueRange = [valueScale.range()[0], plotHeight],
			newTimeRange = [timeScale.range()[0], plotWidth];

		valueScale.range(newValueRange);
		timeScale.range(newTimeRange);
		timeAxis.yOffset(plotHeight);
		vAxis.tickSize(plotWidth).tickExtension(widthDifference);

		//replace provisional axes
		chartSVG.selectAll('*').remove();
		chartSVG.call(vAxis);
		chartSVG.call(timeAxis);
		if (model.numberAxisOrient !== 'right') {
			//figure out how much of the extra width is the vertical axis lables
			var vLabelWidth = 0;
			chartSVG.selectAll('.y.axis text').each(function(){
				vLabelWidth = Math.max(vLabelWidth, getWidth(d3.select(this)));
			});
			model.chartPosition.left += vLabelWidth + 4;//NOTE magic number 4
		}

		model.chartPosition.top += (getHeight(chartSVG.select('.y.axis')) - plotHeight);
		chartSVG.attr('transform', model.translate(model.chartPosition));

		var plot = chartSVG.append('g').attr('class', 'plot');

		function drawPlot(g, series) {
			//null values in the data are interpolated over
			//NaN values are represented by line breaks
			var normalisedData = model.data.map(function(d){
				return {
					x:d[model.x.series.key],
					y:d[series.key]
				};
			});

			normalisedData = normalisedData.filter(function(d){
				return (d.y !== null);
			});	//filter out null values, these are to be interpolated over

			var line = d3.svg.line()
				.interpolate(interpolator.gappedLine)
				.x( function(d){ return timeScale(d.x); } )
				.y( function(d){ return valueScale(d.y); } );

			g.append('path')
				.datum(normalisedData)
				.attr('class', 'line ' + series.className)
				.attr('stroke-width', model.lineStrokeWidth)
				.attr('d', function(d){
					console.log('datum ', d);
					return line(d);
				});
		}

		var i = model.y.series.length;

		while (i--) {
			drawPlot(plot, model.y.series[i]);
		}

	}

	return chart;
}

module.exports = lineChart;
