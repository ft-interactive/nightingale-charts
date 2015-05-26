var d3 = require('d3');
var axis = {
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};

function getDimension(dimension, selection) {
    return Math.ceil(selection.node().getBoundingClientRect()[dimension]);
}
function getWidth(selection) { return getDimension('width', selection); }
function getHeight(selection) { return getDimension('height', selection); }

function ordinalScale(model, options) {
    var plotWidth = model.chartWidth - (getWidth(options.svg) - model.chartWidth);
    return d3.scale.ordinal()
        .domain(model.timeDomain)
        .rangeRoundBands([0, plotWidth], 0, options.margin);
}

function timeScale(model) {
    return d3.time.scale()
        .domain(model.timeDomain)
        .range([0, model.chartWidth]);
}

function updateChartPosition(g, model){
    var vLabelWidth = 0;
    model.chartPosition.top += (getHeight(g.select('.y.axis')) - model.plotHeight);
    if (model.numberAxisOrient === 'left') {
        g.selectAll('.y.axis text').each(function () {
            vLabelWidth = Math.max(vLabelWidth, getWidth(d3.select(this)));
        });
        model.chartPosition.left += vLabelWidth + 4;//NOTE magic number 4
    }
}

function Create(svg, model) {
    this.model = model;
    this.svg = svg;
    this.margin = 0.2;
}

Create.prototype.hideTicks = function () {
    var tickCount = this.svg.selectAll('.x.axis .primary line')[0].length;
    var labelCount= this.svg.selectAll('.x.axis .primary text')[0].length;
    var labelsShownRatio = labelCount/tickCount;
    var allPositiveValues = Math.min.apply(null, this.valueScale.domain()) >= 0;
    return labelsShownRatio===1 && allPositiveValues;
};

Create.prototype.repositionAxis = function () {
    if (!this.independentScaleCreated || !this.dependentScaleCreated) return;
    var model = this.model;
    var xLabelHeight = getHeight(this.svg) - model.chartHeight;
    var yLabelWidth = getWidth(this.svg) - model.chartWidth;
    var plotHeight = model.plotHeight = model.chartHeight - xLabelHeight;
    var plotWidth = model.plotWidth = model.chartWidth - yLabelWidth;
    model.tickSize = (model.chartType == 'column' && this.hideTicks()) ? 0 : model.tickSize;

    if (this.timeScale.rangeRoundBands) {
        this.timeScale.rangeRoundBands([0, plotWidth], this.margin);
    } else {
        this.timeScale.range([this.timeScale.range()[0], plotWidth]);
    }

    this.valueScale.range([this.valueScale.range()[0], plotHeight]);
    this.timeAxis.yOffset(plotHeight).tickSize(model.tickSize).scale(this.timeScale, model.units);
    this.vAxis.tickSize(plotWidth).tickExtension(yLabelWidth);
    this.svg.selectAll('*').remove();
    this.svg.call(this.vAxis);
    this.svg.call(this.timeAxis);
    updateChartPosition(this.svg, this.model);
    this.svg.attr('transform', model.translate(model.chartPosition));
};

Create.prototype.independentScale = function (scale) {
    var model = this.model;
    if(scale == 'ordinal'){
        this.timeScale = ordinalScale(model, this);
        this.timeAxis = axis.category();
    } else {
        this.timeScale = timeScale(model);
        this.timeAxis = axis.date();
    }
    this.timeAxis
        .simple(model.simpleDate)
        .yOffset(model.chartHeight)	//position the axis at the bottom of the chart
        .tickSize(model.tickSize)
        .scale(this.timeScale, this.model.units);
    this.svg.call(this.timeAxis);
    this.independentScaleCreated = true;
    this.repositionAxis();
};

Create.prototype.dependentScale = function (scale) {
    var model = this.model;
    this.valueScale = d3.scale.linear()
        .domain(model.valueDomain.reverse())
        .range([0, model.chartHeight]);

    if (model.niceValue) {
        this.valueScale.nice();
    }

    this.vAxis = axis.number()
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
    this.dependentScaleCreated = true;
    this.repositionAxis();
};

module.exports = Create;
