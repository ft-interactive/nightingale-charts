var d3 = require('d3');
var categoryAxis = require('../axis/category.js');
var dateAxis = require('../axis/date.js');
var numberAxis = require('../axis/number.js');

function getHeight(selection) {
	return Math.ceil(selection.node().getBoundingClientRect().height);
}

function getWidth(selection) {
	return Math.ceil(selection.node().getBoundingClientRect().width);
}

function Axes(svg, model){
	this.model = model;
	this.svg = svg;
}


Axes.prototype.addGroupedTimeScale = function(units){
	var model = this.model;
	this.timeScale = d3.scale.ordinal().domain(model.timeDomain);
	this.timeAxis = categoryAxis()
		.simple(model.simpleDate)
		.yOffset(model.chartHeight)
		.scale(this.timeScale, units);
	this.svg.call(this.timeAxis);
};

Axes.prototype.addTimeScale = function(){
	var model = this.model;
	this.timeScale = d3.time.scale()
		.domain(model.timeDomain)
		.range([0, model.chartWidth]);
	this.timeAxis = dateAxis()
		.simple(model.simpleDate)
		.yOffset(model.chartHeight)	//position the axis at the bottom of the chart
		.scale(this.timeScale);
	this.svg.call(this.timeAxis);
};

Axes.prototype.addValueScale = function(){
	var model = this.model;
	this.valueScale = d3.scale.linear()
		.domain(model.valueDomain.reverse())
		.range([0, model.chartHeight ]);

	if (model.niceValue) {
		this.valueScale.nice();
	}

	this.vAxis = numberAxis()
		.tickFormat(model.numberAxisFormatter)
		.simple(model.simpleValue)
		.tickSize(model.chartWidth)	//make the ticks the width of the chart
		.scale(this.valueScale);

	if (model.numberAxisOrient !== 'right' && model.numberAxisOrient !== 'left') {
		this.vAxis.noLabels(true);
	} else {
		this.vAxis.orient(model.numberAxisOrient);
	}
	this.svg.call(this.vAxis);

	if (model.numberAxisOrient !== 'right') {
		//figure out how much of the extra width is the vertical axis lables
		var vLabelWidth = 0;
		this.svg.selectAll('.y.axis text').each(function(){
			vLabelWidth = Math.max(vLabelWidth, getWidth(d3.select(this)));
		});
		model.chartPosition.left += vLabelWidth + 4;//NOTE magic number 4
	}
};

Axes.prototype.repositionAxis = function(){
	var model = this.model;
	var xLabelHeight = getHeight(this.svg) - model.chartHeight;
	var yLabelWidth = getWidth(this.svg) - model.chartWidth;
	var plotHeight = model.chartHeight - xLabelHeight;
	var plotWidth = model.chartWidth - yLabelWidth;

	this.valueScale.range([this.valueScale.range()[0], plotHeight]);

	if (this.timeScale.rangeRoundBands){
		this.timeScale.rangeRoundBands([0, plotWidth], 0.2);
	} else {
		this.timeScale.range([this.timeScale.range()[0], plotWidth]);
	}

	this.timeAxis.yOffset(plotHeight);
	this.vAxis.tickSize(plotWidth).tickExtension(yLabelWidth);

	this.svg.selectAll('*').remove();
	this.svg.call(this.vAxis);
	this.svg.call(this.timeAxis);

	model.chartPosition.top += (getHeight(this.svg.select('.y.axis')) - plotHeight);
	this.svg.attr('transform', model.translate(model.chartPosition));
	model.plotWidth = plotWidth;
	model.plotHeight = plotHeight;
};

module.exports = Axes;
