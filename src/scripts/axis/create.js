const d3 = require('d3');
const axis = {
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};
const intraDay = require('../scales/intra-day');
const themes = require('../themes');


const PADDING = 4;

function getDimension(dimension, selection) {
    if (!selection.node()) return 0;
    return Math.ceil(selection.node().getBoundingClientRect()[dimension]);
}
function getWidth(selection) { return getDimension('width', selection); }
function getHeight(selection) { return getDimension('height', selection); }
function isVertical(orient) { return orient === 'right' || orient === 'left'; }

function getRange(model, orientation) {
    const chartType = model.chartType;
    const plotWidth = model.plotWidth = model.chartWidth - model.yLabelWidth;
    const plotHeight = model.plotHeight = model.chartHeight - model.xLabelHeight;
    const plotPaddingX = themes.check(model.theme, 'chart-plot').attributes['padding-x'] || 0;
    const plotWidthInPixels = (chartType !== 'bar' && plotPaddingX > 0) ? (plotWidth * plotPaddingX) : 0;
    const rangePlotWidth = (plotWidthInPixels > 0) ? [0 + plotWidthInPixels, plotWidth - plotWidthInPixels] : [0, plotWidth];
    return (isVertical(orientation)) ? [0, plotHeight] : rangePlotWidth;
}

function ordinalScale(model, options, orientation) {
    const range = getRange(model, orientation);
    return d3.scale.ordinal()
        .domain(model.independentDomain)
        .rangeRoundBands(range, 0, options.margin);
}

function timeScale(model, options, orientation) {
    const range = getRange(model, orientation);
    return d3.time.scale()
        .domain(model.independentDomain)
        .range(range);
}

function intraDayScale(model, options, orientation) {
    const range = getRange(model, orientation);
    return intraDay(model.open, model.close)
        .domain(model.independentDomain)
        .range(range);
}

function linearScale(model, options, orientation) {
    const range = getRange(model, orientation);
    const domain = (isVertical(orientation)) ? model.dependentDomain.reverse() : model.dependentDomain;
    return d3.scale.linear()
        .range(range)
        .domain(domain);
}

function setChartPosition(g, model){
    let labelSpace = 0;
    let spacing = PADDING;
    let top = model.chartPosition.top;
    let left = model.chartPosition.left;
    if (isVertical(model.independentAxisOrient)) {
        spacing = model.tickSize + (PADDING * 2);
    } else {
        top += (getHeight(g.select('.y.axis')) - model.plotHeight);
    }
    if ([model.dependentAxisOrient,model.independentAxisOrient].indexOf('top') >-1) {
        g.selectAll('.x.axis text').each(function () {
            labelSpace = Math.max(labelSpace, getHeight(d3.select(this)));
        });
        top += labelSpace;
    }
    if ([model.dependentAxisOrient,model.independentAxisOrient].indexOf('left') >-1) {
        g.selectAll('.y.axis text').each(function () {
            labelSpace = Math.max(labelSpace, getWidth(d3.select(this)));
        });
        left += labelSpace + spacing;
    }
    return { top: top, left: left};
}

function Create(svg, model) {
    if (!model.independentAxisOrient) {
        throw new Error("No independent axis orientation {left, right, top, bottom}");
    }
    if (!model.dependentAxisOrient) {
        throw new Error("No dependent axis orientation {left, right, top, bottom}");
    }

    this.model = model;
    this.chart = svg;
    this.margin = 0.2;
    this.attrs = {};
}

Create.prototype.getAttr = function(id){
    if (!this.attrs[id]){
        this.attrs[id] = themes.check(this.model.theme, id).attributes;
    }
    return this.attrs[id];
};

Create.prototype.hideTicks = function () {
    const tickCount = this.chart.selectAll('.x.axis .primary line')[0].length;
    const labelCount= this.chart.selectAll('.x.axis .primary text')[0].length;
    const labelsShownRatio = labelCount/tickCount;
    const allPositiveValues = Math.min.apply(null, this.dependentAxisScale.domain()) >= 0;
    return labelsShownRatio===1 && allPositiveValues;
};

Create.prototype.configureDependentScale = function (model) {
    this.dependentAxis
        .tickFormat(model.numberAxisFormatter)
        .simple(model.simpleValue)
        .orient(model.dependentAxisOrient)
        .reverse(model.y.reverse)
        .attrs(model.chartType, 'chart-type')
        .attrs(model.dependentAxisOrient, 'chart-alignment')
        .attrs(this.getAttr('dependent-ticks'), 'ticks')
        .attrs(this.getAttr('origin-ticks'), 'origin')
        .attrs(this.getAttr('axis-text'), 'primary')
        .attrs(this.getAttr('x-axis-text'), 'xAxisLabel')
        .attrs(this.getAttr('y-axis-text'), 'yAxisLabel')
        .attrs(this.getAttr('y-axis-line'), 'yAxisLine');

    if (isVertical(model.dependentAxisOrient)) {
        this.dependentAxis.tickSize(model.plotWidth)
            .tickExtension(model.yLabelWidth);
    } else {
        this.dependentAxis.tickSize(model.plotHeight)
            .yOffset(model.dependentAxisOrient ==='bottom' ? model.plotHeight : 0);
    }
    this.dependentAxis.scale(this.dependentAxisScale);
    this.chart.call(this.dependentAxis);
};

Create.prototype.configureIndependentScale = function (model) {
    this.independentAxis
        .simple(model.simpleDate)
        .tickSize(model.tickSize)
        .orient(model.independentAxisOrient)
        .attrs(model.chartType, 'chart-type')
        .attrs(model.dependentAxisOrient, 'chart-alignment')
        .attrs(this.getAttr('independent-ticks'), 'ticks')
        .attrs(this.getAttr('origin-ticks'), 'origin')
        .attrs(this.getAttr('axis-text'), 'primary')
        .attrs(this.getAttr('axis-secondary-text'), 'secondary')
        .attrs(this.getAttr('x-axis-text'), 'xAxisLabel')
        .attrs(this.getAttr('y-axis-text'), 'yAxisLabel')
        .attrs(this.getAttr('y-axis-line'), 'yAxisLine');
    if (!isVertical(model.independentAxisOrient)) {
        this.independentAxis.yOffset(model.plotHeight);	//position the axis at the bottom of the chart
    }
    this.independentAxis.scale(this.independentAxisScale, this.model.units);
    this.chart.call(this.independentAxis);
};

Create.prototype.repositionAxis = function () {
    const model = this.model;
    const independentRange = getRange(model, model.independentAxisOrient);
    const dependentRange = getRange(model, model.dependentAxisOrient);

    if (this.independentAxisScale.rangeRoundBands) {
        this.independentAxisScale.rangeRoundBands(independentRange, this.margin);
    } else {
        this.independentAxisScale.range(independentRange);
    }
    this.dependentAxisScale.range(dependentRange);

    this.configureIndependentScale(model);
    this.configureDependentScale(model);
};

Create.prototype.independentScale = function (scale) {
    const model = this.model;
    if(scale === 'ordinal'){
        this.independentAxisScale = ordinalScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.category(model).dataType(model.dataType);
    } else if (model.intraDay) {
        this.independentAxisScale = intraDayScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.date(model);
    } else {
        this.independentAxisScale = timeScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.date(model);
    }
    this.configureIndependentScale(this.model);
};

Create.prototype.dependentScale = function () {
    const model = this.model;
    this.dependentAxisScale = linearScale(model, this, model.dependentAxisOrient);
    this.dependentAxis = axis.number();
    if (model.niceValue) {
        this.dependentAxisScale.nice();
    }
    this.configureDependentScale(this.model);
};

Create.prototype.yLabelWidth = function () {
    let widest = 0;
    this.chart.selectAll('.axis.y text').each(function(){
        widest = Math.max(getWidth(d3.select(this)) + PADDING, widest);
    });
    return widest;
};

Create.prototype.createAxes = function (axesSpec) {
    const model = this.model;
    const spacing = model.tickSize + (PADDING * 2);
    this.independentScale(axesSpec.independent);

    if (isVertical(model.dependentAxisOrient)) {
        model.xLabelHeight = getHeight(this.chart) + spacing;
        this.dependentScale(axesSpec.dependent); //create Y
        model.yLabelWidth = this.yLabelWidth();
    } else {
        model.yLabelWidth = this.yLabelWidth();
        this.dependentScale(axesSpec.dependent);
        model.xLabelHeight = getHeight(this.chart) - model.chartHeight;
    }
    this.model.tickSize = (model.chartType === 'column' && this.hideTicks()) ? 0 : model.tickSize;
    this.chart.selectAll('*').remove();
    this.repositionAxis();
    model.chartPosition = setChartPosition(this.chart, model);
    this.chart.attr('transform', model.translate(model.chartPosition));
};

module.exports = Create;
