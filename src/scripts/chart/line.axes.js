var d3 = require('d3');
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

Axes.prototype.addTimeScale = function(){
	var model = this.model;
	var timeScale = d3.time.scale()
		.domain(model.timeDomain)
		.range([0, model.chartWidth]);
	var timeAxis = dateAxis()
		.simple(model.simpleDate)
		.yOffset(model.chartHeight)	//position the axis at the bottom of the chart
		.scale(timeScale);
	this.svg.call(timeAxis);


	var yLabelWidth = getWidth(this.svg) - model.chartWidth;
	var plotWidth = model.chartWidth - yLabelWidth;
	timeScale.range([timeScale.range()[0], plotWidth]);

	this.plotWidth = plotWidth;
	this.yLabelWidth = yLabelWidth;
	this.timeScale = timeScale;
	this.timeAxis = timeAxis;
};

Axes.prototype.repositionAxis = function(){
	var model = this.model;
	var xLabelHeight = getHeight(this.svg) - model.chartHeight;
	var plotHeight = model.chartHeight - xLabelHeight;
	this.valueScale.range([this.valueScale.range()[0], plotHeight]);

	var yLabelWidth = getWidth(this.svg) - model.chartWidth;
	var plotWidth = model.chartWidth - yLabelWidth;
	this.timeScale.range([this.timeScale.range()[0], plotWidth]);
	this.timeAxis.yOffset(plotHeight);

	this.vAxis.tickSize(this.plotWidth).tickExtension(this.yLabelWidth);

	this.svg.selectAll('*').remove();
	this.svg.call(this.vAxis);
	this.svg.call(this.timeAxis);

	model.chartPosition.top += (getHeight(this.svg.select('.y.axis')) - plotHeight);
	this.svg.attr('transform', model.translate(model.chartPosition));
};

Axes.prototype.addValueScale = function(){
	var model = this.model;
	var valueScale = d3.scale.linear()
		.domain(model.valueDomain.reverse())
		.range([0, model.chartHeight ]);
	if (model.niceValue) {
		valueScale.nice();
	}
	var vAxis = numberAxis()
		.tickFormat(model.numberAxisFormatter)
		.simple(model.simpleValue)
		.tickSize(model.chartWidth)	//make the ticks the width of the chart
		.scale(valueScale);
	if (model.numberAxisOrient !== 'right' && model.numberAxisOrient !== 'left') {
		vAxis.noLabels(true);
	} else {
		vAxis.orient(model.numberAxisOrient);
	}
	this.svg.call(vAxis);

	if (model.numberAxisOrient !== 'right') {
		//figure out how much of the extra width is the vertical axis lables
		var vLabelWidth = 0;
		this.svg.selectAll('.y.axis text').each(function(){
			vLabelWidth = Math.max(vLabelWidth, getWidth(d3.select(this)));
		});
		model.chartPosition.left += vLabelWidth + 4;//NOTE magic number 4
	}

	this.valueScale = valueScale;
	this.vAxis = vAxis;
};

module.exports = Axes;
