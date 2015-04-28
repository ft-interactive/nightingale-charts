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

function Axes(svg, model) {
    this.model = model;
    this.svg = svg;
    this.margin = 0.2;
    this.tickExtender = 1.5;
}

Axes.prototype.rearrangeLabels = function () {
    var model = this.model;
    var showsAllLabels = this.timeScale.domain().length === this.svg.selectAll('.x.axis .primary text')[0].length;
    var allPositiveValues = Math.min.apply(null, this.valueScale.domain()) >= 0;
    if (showsAllLabels && allPositiveValues) {
        this.timeAxis.tickSize(0).scale(this.timeScale, this.units);
    } else if (!showsAllLabels) { //todo: should/can this be in category.js?
        this.timeAxis.tickSize(model.tickSize * this.tickExtender)
            .scale(this.timeScale, ['yearly']);
        this.svg.call(this.timeAxis);
    }
};

Axes.prototype.addGroupedTimeScale = function (units) {
    var model = this.model;
    this.units = units;
    var plotWidth = model.chartWidth - (getWidth(this.svg) - model.chartWidth);
    this.timeScale = d3.scale.ordinal()
        .domain(model.timeDomain)
        .rangeRoundBands([0, plotWidth], 0, this.margin);

    this.timeAxis = categoryAxis()
        .simple(model.simpleDate)
        .yOffset(model.chartHeight)
        .tickSize(model.tickSize)
        .scale(this.timeScale, units);
    this.svg.call(this.timeAxis);
    this.rearrangeLabels();
};

Axes.prototype.addTimeScale = function () {
    var model = this.model;
    this.timeScale = d3.time.scale()
        .domain(model.timeDomain)
        .range([0, model.chartWidth]);
    this.timeAxis = dateAxis()
        .simple(model.simpleDate)
        .yOffset(model.chartHeight)	//position the axis at the bottom of the chart
        .scale(this.timeScale);
    this.svg.call(this.timeAxis);
};

Axes.prototype.addValueScale = function () {
    var model = this.model;
    this.valueScale = d3.scale.linear()
        .domain(model.valueDomain.reverse())
        .range([0, model.chartHeight]);

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
};

Axes.prototype.reduceExtendedTicks = function () {
    var model = this.model;
    var self = this;
    var extendedTicks_selector = ".x.axis .tick line[y2=\"" + (model.tickSize * this.tickExtender) + "\"]";
    this.svg.selectAll(extendedTicks_selector)
        .attr("y2", function (d) {
            return (d.toString().indexOf('Q1') < 0 ) ? model.tickSize : (model.tickSize * self.tickExtender);
        });
};

Axes.prototype.repositionAxis = function () {
    var model = this.model;
    var xLabelHeight = getHeight(this.svg) - model.chartHeight;
    var yLabelWidth = getWidth(this.svg) - model.chartWidth;
    var plotHeight = model.chartHeight - xLabelHeight;
    var plotWidth = model.chartWidth - yLabelWidth;
    var vLabelWidth = 0;

    this.valueScale.range([this.valueScale.range()[0], plotHeight]);
    this.timeAxis.yOffset(plotHeight);
    this.vAxis.tickSize(plotWidth).tickExtension(yLabelWidth);

    if (this.timeScale.rangeRoundBands) {
        this.timeScale.rangeRoundBands([0, plotWidth], this.margin);
    } else {
        this.timeScale.range([this.timeScale.range()[0], plotWidth]);
    }

    this.svg.selectAll('*').remove();
    this.svg.call(this.vAxis);
    this.svg.call(this.timeAxis);

    this.reduceExtendedTicks();

    if (model.numberAxisOrient !== 'right') {
        this.svg.selectAll('.y.axis text').each(function () {
            vLabelWidth = Math.max(vLabelWidth, getWidth(d3.select(this)));
        });
        model.chartPosition.left += vLabelWidth + 4;//NOTE magic number 4
    }
    model.chartPosition.top += (getHeight(this.svg.select('.y.axis')) - plotHeight);
    model.plotWidth = plotWidth;
    model.plotHeight = plotHeight;

    this.svg.attr('transform', model.translate(model.chartPosition));
};

module.exports = Axes;
