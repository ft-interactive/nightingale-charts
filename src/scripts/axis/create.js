var d3 = require('d3');
var axis = {
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};
var intraDay = require('../scales/intra-day');
var themes = require('../themes');


var PADDING = 4;

function getDimension(dimension, selection) {
    if (!selection.node()) return 0;
    return Math.ceil(selection.node().getBoundingClientRect()[dimension]);
}
function getWidth(selection)  { return getDimension('width', selection);  }
function getHeight(selection) { return getDimension('height', selection); }
function isVertical(orient)   { return orient == 'right' || orient == 'left'; }

function getRange(model, orientation)     {
    var plotWidth = model.plotWidth = model.chartWidth - model.yLabelWidth;
    var plotHeight = model.plotHeight =  model.chartHeight - model.xLabelHeight;
    return (isVertical(orientation)) ? [0, plotHeight] : [0, plotWidth];
}

function ordinalScale(model, options, orientation) {
    var range = getRange(model, orientation);
    return d3.scale.ordinal()
        .domain(model.independentDomain)
        .rangeRoundBands(range, 0, options.margin);
}

function timeScale(model, options, orientation) {
    var range = getRange(model, orientation);
    return d3.time.scale()
        .domain(model.independentDomain)
        .range(range);
}

function intraDayScale(model, options, orientation) {
    var range = getRange(model, orientation);
    return intraDay(model.open, model.close)
        .domain(model.independentDomain)
        .range(range);
}

function linearScale(model, options, orientation) {
    var range = getRange(model, orientation);
    var domain = (isVertical(orientation)) ? model.dependentDomain.reverse() : model.dependentDomain;
    return d3.scale.linear()
        .range(range)
        .domain(domain);
}

function setChartPosition(g, model){
    var labelSpace = 0,
        spacing = PADDING,
        top = model.chartPosition.top,
        left = model.chartPosition.left;
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
    var tickCount = this.chart.selectAll('.x.axis .primary line')[0].length;
    var labelCount= this.chart.selectAll('.x.axis .primary text')[0].length;
    var labelsShownRatio = labelCount/tickCount;
    var allPositiveValues = Math.min.apply(null, this.dependentAxisScale.domain()) >= 0;
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
            .yOffset(model.dependentAxisOrient =='bottom' ? model.plotHeight : 0);
        //this.dependentAxis.noLabels(true);
    }
    // THIS IS A HACK BECAUSE FOR SOME REASON THE
    // DOMAIN IS COMING BACK DIFFERENT ON THESE SCALES
    // ;_;
    this.dependentAxis.scale(this.dependentAxisScale);
    this.dependentAxis.scale().domain(this.dependentAxisScale.domain());
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
    // ?? do we need to do the same here?
    this.chart.call(this.independentAxis);
};

Create.prototype.repositionAxis = function () {
    var model = this.model;
    var independentRange = getRange(model, model.independentAxisOrient);
    var dependentRange = getRange(model, model.dependentAxisOrient);

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
    var model = this.model;
    if(scale == 'ordinal'){
        this.independentAxisScale = ordinalScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.category().dataType(model.dataType);
    } else if (model.intraDay) {
        this.independentAxisScale = intraDayScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.date();
    } else {
        this.independentAxisScale = timeScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.date();
    }
    this.configureIndependentScale(this.model);
};

Create.prototype.dependentScale = function (scale) {
    var model = this.model;
    this.dependentAxisScale = linearScale(model, this, model.dependentAxisOrient);
    this.dependentAxis = axis.number();
    if (model.niceValue) {
        this.dependentAxisScale.nice();
    }
    this.configureDependentScale(this.model);
};

Create.prototype.yLabelWidth = function () {
    var widest  = 0;
    this.chart.selectAll('.axis.y text').each(function(d, i){
        widest = Math.max(getWidth(d3.select(this)) + PADDING, widest);
    });
    return widest;
};

Create.prototype.createAxes = function (axesSpec) {
    var model = this.model;
    var spacing = model.tickSize + (PADDING * 2);
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
    this.model.tickSize = (model.chartType == 'column' && this.hideTicks()) ? 0 : model.tickSize;
    this.chart.selectAll('*').remove();
    this.repositionAxis();
    model.chartPosition = setChartPosition(this.chart, model);
    this.chart.attr('transform', model.translate(model.chartPosition));
};

module.exports = Create;
