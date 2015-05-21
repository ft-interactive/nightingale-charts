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
}

Axes.prototype.hideTicks = function () {
    var tickCount = this.svg.selectAll('.x.axis .primary line')[0].length;
    var labelCount= this.svg.selectAll('.x.axis .primary text')[0].length;
    var labelsShownRatio = labelCount/tickCount;
    var allPositiveValues = Math.min.apply(null, this.valueScale.domain()) >= 0;
    return labelsShownRatio===1 && allPositiveValues;
};

Axes.prototype.getColumnWidth = function () {
    var model = this.model;
    var plotWidth = model.chartWidth - (getWidth(this.svg) - model.chartWidth);
    var range = this.timeScale.rangeBand ?
        this.timeScale.rangeBand() :
        d3.scale.ordinal()
            .domain(model.data.map(function(d) {
                return d[model.x.series.key];
            }))
            .rangeRoundBands([0, plotWidth], 0, this.margin)
            .rangeBand() / 2;
    return range / model.y.series.length;
};

Axes.prototype.addGroupedTimeScale = function (units) {
    var model = this.model;
    var plotWidth = model.chartWidth - (getWidth(this.svg) - model.chartWidth);
    this.timeScale = d3.scale.ordinal()
        .domain(model.timeDomain)
        .rangeRoundBands([0, plotWidth], 0, this.margin);

    this.columnWidth = this.getColumnWidth();

    this.timeAxis = categoryAxis()
        .simple(model.simpleDate)
        .yOffset(model.chartHeight)
        .tickSize(model.tickSize)
        .scale(this.timeScale, units);
    this.svg.call(this.timeAxis);
};

Axes.prototype.addTimeScale = function (units) {
    var model = this.model;
    this.timeScale = d3.time.scale()
        .domain(model.timeDomain)
        .range([0, model.chartWidth]);

    this.columnWidth = this.getColumnWidth();

    this.timeAxis = dateAxis()
        .simple(model.simpleDate)
        .yOffset(model.chartHeight)	//position the axis at the bottom of the chart
        .tickSize(model.tickSize)
        .scale(this.timeScale, units);
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

Axes.prototype.repositionAxis = function () {
    var model = this.model;

    var xLabelHeight = getHeight(this.svg) - model.chartHeight;
    var yLabelWidth = getWidth(this.svg) - model.chartWidth;
    var plotHeight = model.chartHeight - xLabelHeight;
    var plotWidth = model.chartWidth - yLabelWidth;
    var vLabelWidth = 0;
    model.tickSize = (model.chartType == 'column' && this.hideTicks()) ? 0 : model.tickSize;

    if (this.timeScale.rangeRoundBands) {
        this.timeScale.rangeRoundBands([0, plotWidth], this.margin);
    } else {
        this.timeScale.range([this.timeScale.range()[0], plotWidth]);
    }

    this.valueScale.range([this.valueScale.range()[0], plotHeight]);
    this.timeAxis.yOffset(plotHeight).tickSize(model.tickSize).scale(this.timeScale, model.units);
    this.vAxis.tickSize(plotWidth).tickExtension(yLabelWidth);
    this.columnWidth = this.getColumnWidth();
    this.svg.selectAll('*').remove();
    this.svg.call(this.vAxis);
    this.svg.call(this.timeAxis);

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
