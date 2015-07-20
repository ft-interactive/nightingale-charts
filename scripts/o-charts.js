require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={"version":"0.5.7"}

},{}],2:[function(require,module,exports){
var d3 = require('d3');
var themes = require('../themes');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var timeDiff = dates.timeDiff;

function categoryAxis() {

    var config = {
        theme: false,
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        stack: false,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false,
        dataType: 'categorical',
        keepD3Style: true
    };

    function isVertical(){
        return ['right','left'].indexOf(config.axes[0].orient())>-1;
    }

    function render(g) {
        var orientOffset = (isVertical()) ? -config.axes[0].tickSize() : 0;
        g = g.append('g').attr('transform', 'translate(' + (config.xOffset + orientOffset) + ',' + config.yOffset + ')');
        g.append('g').attr('class', isVertical() ? 'y axis axis--independent axis--category' : 'x axis axis--independent axis--category').each(function () {
            var g = d3.select(this);
            labels.add(g, config);
        });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
    }

    render.theme = function (themeUpdate) {
        if (!arguments.length) return config.theme;
        config.theme = themeUpdate;
        return render;
    };

    render.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return render;
    };

    render.dataType = function (dataType) {
        if (!arguments.length) return config.dataType;
        config.dataType = dataType;
        return render;
    };

    render.nice = function (bool) {
        if (!arguments.length) return config.nice;
        config.nice = bool;
        return render;
    };

    render.tickSize = function (int) {
        if (!arguments.length) return config.tickSize;
        config.tickSize = int;
        return render;
    };

    render.labelWidth = function (int) {
        if (!arguments.length) return config.labelWidth;
        config.labelWidth = int;
        return render;
    };

    render.lineHeight = function (int) {
        if (!arguments.length) return config.lineHeight;
        config.lineHeight = int;
        return render;
    };

    render.orient = function (string) {
        if (!arguments.length) return config.axes[0].orient();
        config.axes[0].orient(string);
        return render;
    };

    render.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return render;
    };

    render.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return render;
    };

    render.stack = function (bool) {
        if (!arguments.length) return config.stack;
        config.stack = bool;
        return render;
    };

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        units = units || ['unknown'];
        if (config.dataType === 'categorical'){
            units = ['categorical'];
        }
        config.scale = scale;
        config.units = units;

        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (dates.formatGroups[unit]) {
                var axis = d3.svg.axis()
                    .orient(config.axes[0].orient())
                    .scale(scale)
                    .tickFormat(dates.formatGroups[unit])
                    .tickSize(config.tickSize, 0);
                axes.push(axis);
            }
        }

        config.axes = axes;
        return render;
    };

    return render;
}

module.exports = categoryAxis;

},{"../themes":28,"../util/dates.js":32,"../util/labels.js":33,"d3":"d3"}],3:[function(require,module,exports){
var d3 = require('d3');
var axis = {
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};
var intraDay = require('../scales/intra-day');


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
}

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
        .theme(model.theme)
        .simple(model.simpleValue)
        .orient(model.dependentAxisOrient)
        .reverse(model.y.reverse);

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
        .theme(model.theme)
        .simple(model.simpleDate)
        .tickSize(model.tickSize)
        .orient(model.independentAxisOrient);
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

Create.prototype.createAxes = function (axesSpec) {
    var model = this.model;
    var spacing = model.tickSize + (PADDING * 2);
    this.independentScale(axesSpec.independent);

    if (isVertical(model.dependentAxisOrient)) {
        model.xLabelHeight = getHeight(this.chart) + spacing;
        this.dependentScale(axesSpec.dependent); //create Y
        model.yLabelWidth = getWidth(this.chart) - model.chartWidth;// measure Y
    } else {
        model.yLabelWidth = getWidth(this.chart) + spacing;// measure Y
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

},{"../scales/intra-day":25,"./category.js":2,"./date.js":4,"./number.js":7,"d3":"d3"}],4:[function(require,module,exports){
var d3 = require('d3');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var dateScale = require('./date.scale.js');
var themes = require('../themes');
var timeDiff = dates.timeDiff;

function dateAxis() {
    var config = {
        theme: false,
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        stack: false,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false,
        keepD3Style: false
    };

    function render(g) {

        g = g.append('g').attr('transform', 'translate(' + config.xOffset + ',' + config.yOffset + ')');

        g.append('g').attr('class', 'x axis axis--independent axis--date').each(function () {
            labels.add(d3.select(this), config);
        });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
    }

    render.theme = function (themeUpdate) {
        if (!arguments.length) return config.theme;
        config.theme = themeUpdate;
        return render;
    };

    render.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return render;
    };

    render.nice = function (bool) {
        if (!arguments.length) return config.nice;
        config.nice = bool;
        return render;
    };

    render.tickSize = function (int) {
        if (!arguments.length) return config.tickSize;
        config.tickSize = int;
        return render;
    };

    render.labelWidth = function (int) {
        if (!arguments.length) return config.labelWidth;
        config.labelWidth = int;
        return render;
    };

    render.lineHeight = function (int) {
        if (!arguments.length) return config.lineHeight;
        config.lineHeight = int;
        return render;
    };

    render.orient = function (string) {
        if (!arguments.length) return config.axes[0].orient();
        if (!config.axes.length) return; //todo: why i sthis being called when axes dont exist
        config.axes[0].orient(string);
        return render;
    };

    render.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return render;
    };

    render.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return render;
    };

    render.stack = function (bool) {
        if (!arguments.length) return config.stack;
        config.stack = bool;
        return render;
    };

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        if (!units ||
            (units[0] === 'daily' && timeDiff(scale.domain()).months > 1) ||
            (units[0] === 'weekly' && timeDiff(scale.domain()).years > 1) ||
            (units[0] === 'quarterly' && timeDiff(scale.domain()).decades > 1) ||
            (units[0] === 'monthly' && timeDiff(scale.domain()).years > 4.9) ||
            (units[0] === 'yearly' && timeDiff(scale.domain()).years > 10)){
            units = dates.unitGenerator(scale.domain(), config.simple);
        }
        if (config.nice) {
            scale.nice((scale.range()[1] - scale.range()[0]) / config.pixelsPerTick);
        }
        config.units = units;
        config.scale = scale;
        config.axes = dateScale.render(scale, units, config);
        return render;
    };

    return render;
}

module.exports = dateAxis;

},{"../themes":28,"../util/dates.js":32,"../util/labels.js":33,"./date.scale.js":5,"d3":"d3"}],5:[function(require,module,exports){
var d3 = require('d3');
var utils = require('../util/dates.js');

var interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    yearly: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    quarterly: d3.time.month,
    monthly: d3.time.month,
    months: d3.time.month,
    weeks: d3.time.week,
    weekly: d3.time.week,
    days: d3.time.day,
    daily: d3.time.day,
    hours: d3.time.hours
};

var increment = {
    centuries: 100,
    decades: 10,
    yearly: 1,
    years: 1,
    fullYears: 1,
    quarterly: 3,
    monthly: 1,
    months: 1,
    weeks: 1,
    weekly: 1,
    days: 1,
    daily: 1,
    hours: 1
};

module.exports = {
    customTicks: function (scale, unit, primaryUnit) {
        if (primaryUnit == 'quarterly' && unit == 'yearly') unit = 'quarterly';
        var customTicks = scale.ticks(interval[unit], increment[unit]);
        customTicks.push(scale.domain()[0]); //always include the first and last values
        customTicks.push(scale.domain()[1]);
        customTicks.sort(this.dateSort);

        //if the last 2 values labels are the same, remove them
        var labels = customTicks.map(utils.formatter[unit]);
        if (labels[labels.length - 1] == labels[labels.length - 2]) {
            customTicks.pop();
        }
        return customTicks;
    },
    dateSort: function (a, b) {
        return (a.getTime() - b.getTime());
    },
    createAxes: function(scale, unit, config, primaryUnit){
        var firstDate ;
        var customTicks = (config.simple) ? scale.domain() : this.customTicks(scale, unit, primaryUnit);
        var axis = d3.svg.axis()
            .scale(scale)
            .tickValues(customTicks)
            .tickFormat(function(d,i){
                firstDate = firstDate || d;
                return utils.formatter[unit](d,i, firstDate);
            })
            .tickSize(config.tickSize, 0);
        return axis;
    },
    render: function (scale, units, config) {
        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (utils.formatter[unit]) {
                axes.push(this.createAxes(scale, unit, config, units[0]));
            }
        }
        return axes;
    }
};

},{"../util/dates.js":32,"d3":"d3"}],6:[function(require,module,exports){
module.exports = {
    Create: require('./create.js'),
    Plot: require('./plot.js'),
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};

},{"./category.js":2,"./create.js":3,"./date.js":4,"./number.js":7,"./plot.js":10}],7:[function(require,module,exports){
//this is wrapper for d3.svg.axis
//for a standard FT styled numeric axis
//usually these are vertical

var d3 = require('d3');
var numberLabels = require('./number.labels');
var numberScales = require('./number.scale');
var themes = require('../themes');

function numericAxis() {
    'use strict';

    var theme;
    var tickSize = 5;
    var a = d3.svg.axis().orient('left').tickSize(tickSize, 0);
    var lineHeight = 16;
    var userTicks = [];
    var hardRules = [0];
    var yOffset = 0;
    var xOffset = 0;
    var reverse = false;
    var simple = false;
    var noLabels = false;
    var pixelsPerTick = 100;
    var tickExtension = 0;

    function axis(g) {
        var orientOffset = (a.orient() === 'right') ? -a.tickSize() : 0;

        g = g.append('g').attr('transform', 'translate(' + (xOffset + orientOffset) + ',' + yOffset + ')');
        numberLabels.render(g, {
            axes: a, lineHeight: lineHeight, hardRules: hardRules, extension: tickExtension
        });
        if (noLabels) {
            g.selectAll('text').remove();
        }
        themes.applyTheme(g, theme);
    }

    axis.theme = function (themeUpdate) {
        if (!arguments.length) return theme;
        theme = themeUpdate;
        return axis;
    };

    axis.tickExtension = function (int) { // extend the axis ticks to the right/ left a specified distance
        if (!arguments.length) return tickExtension;
        tickExtension = int;
        return axis;
    };

    axis.tickSize = function (int) {
        if (!arguments.length) return a.tickSize();
        a.tickSize(-int);
        return axis;
    };

    axis.ticks = function (int) {
        if (!arguments.length) return a.ticks();
        if (int.length > 0) {
            userTicks = int;
        }
        return axis;
    };

    axis.orient = function (string) {
        if (!arguments.length) return a.orient();
        if (string) {
            a.orient(string);
        }
        return axis;
    };

    axis.reverse = function (bool) {
        if (!arguments.length) return reverse;
        reverse = bool;
        if (reverse){
            a.scale().domain(a.scale().domain().reverse());
        }
        return axis;
    };

    axis.simple = function (bool) {
        if (!arguments.length) return simple;
        simple = bool;
        return axis;
    };

    axis.pixelsPerTick = function (int) {
        if (!arguments.length) return pixelsPerTick;
        pixelsPerTick = int;
        return axis;
    };

    axis.scale = function (x) {
        if (!arguments.length) return a.scale();
        a.scale(x);
        axis.reverse(reverse);
        if (userTicks.length > 0) {
            a.tickValues(userTicks);
        } else {
            var customTicks = numberScales.customTicks(a.scale(), pixelsPerTick, hardRules, simple, reverse);
            a.tickValues(customTicks);
        }
        reverse = false; //only reverse once, even if scale is called twice i.e. in redraw
        return axis;
    };

    axis.hardRules = function (int) { //this allows you to set which lines will be solid rather than dotted, by default it's just zero and the bottom of the chart
        if (!arguments.length) return hardRules;
        hardRules = int;
        return axis;
    };

    axis.yOffset = function (int) {
        if (!arguments.length) return yOffset;
        yOffset = int;
        return axis;
    };

    axis.xOffset = function (int) {
        if (!arguments.length) return xOffset;
        xOffset = int;
        return axis;
    };

    axis.tickFormat = function (format) {
        if (!arguments.length) return a.tickFormat();
        a.tickFormat(format);
        return axis;
    };

    axis.noLabels = function (bool) {
        if (!arguments.length) return noLabels;
        noLabels = bool;
        return axis;
    };

    return axis;
}

module.exports = numericAxis;

},{"../themes":28,"./number.labels":8,"./number.scale":9,"d3":"d3"}],8:[function(require,module,exports){
module.exports = {

    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function (g, axes, lineHeight, hardRules) {
        var textWidth = this.textWidth(g, axes.orient());
        g.selectAll('.tick').classed('origin', function (d, i) {
            return hardRules.indexOf(d) > -1;
        });
        if (this.isVertical(axes)) {
            g.selectAll('text').attr('transform', 'translate( ' + textWidth + ', ' + -(lineHeight / 2) + ' )');
        }
    },
    extendAxis: function (g, axes, extension) {
        var rules = g.selectAll('line');
        if (axes.orient() == 'right') {
            rules.attr('x1', extension);
        } else {
            rules.attr('x1', -extension);
        }
    },
    textWidth: function (g, orient) {
        var textWidth = 0;
        if (orient == 'right') {
            g.selectAll('text').each(function (d) {
                textWidth = Math.max(textWidth, Math.ceil(this.getBoundingClientRect().width));
            });
        }
        return textWidth;
    },
    removeDecimals: function (g) {
        var decimalTotal = 0;
        g.selectAll('text').each(function (d) {
            var val0 = parseFloat(this.textContent.split('.')[0]);
            var val1 = parseFloat(this.textContent.split('.')[1]);
            decimalTotal += val1;
            if (val0 === 0 && val1 === 0) {
                this.textContent = 0;
            }
        });
        if (!decimalTotal) {
            g.selectAll('text').each(function (d) {
                this.textContent = this.textContent.split('.')[0];
            });
        }
    },
    render: function (g, config) {
        g.append('g')
            .attr('class', (this.isVertical(config.axes)) ? 'axis axis--dependent axis--number y left' : 'axis axis--dependent axis--number  x')
            .append('g')
            .attr('class', 'primary')
            .call(config.axes);

        this.removeDecimals(g);
        this.arrangeTicks(g, config.axes, config.lineHeight, config.hardRules);
        if (this.isVertical(config.axes)) {
            this.extendAxis(g, config.axes, config.extension);
        }
    }

};

},{}],9:[function(require,module,exports){
module.exports = {
    removeDuplicateTicks: function (scale, ticks) {
        var formatted = [];
        var tickFormat = scale.tickFormat();
        ticks = ticks.filter(function (d) {
            var f = tickFormat(d);
            if (formatted.indexOf(f) > -1) {
                return false;
            }
            formatted.push(f);
            return true;
        });
        return ticks;
    },
    tickIntervalBoundaries: function (ticks) {
        var interval = 0, step;
        ticks.forEach(function (d, i) {
            if (i == ticks.length - 1)  return;
            // there was an issue with float precission
            // so we're ensuring the step is sound
            step = +((ticks[i + 1] - d).toPrecision(12));
            interval = Math.max(step, interval);
        });
        return interval;
    },
    detailedTicks: function (scale, pixelsPerTick) {
        var count = this.tickCount(scale, pixelsPerTick);
        var ticks = scale.ticks(count);
        var interval = this.tickIntervalBoundaries(ticks);
        var pos = scale.domain()[0] > scale.domain()[1] ? 0 : 1;
        var d1 = Math.ceil(scale.domain()[pos] / interval) * interval;
        var d2 = Math.floor(scale.domain()[1-pos] / interval) * interval;
        ticks[d1<=0 ? 'unshift' : 'push'](d1);
        ticks[d2<=0 ? 'unshift' : 'push'](d2);
        scale.domain()[pos] = d1;
        scale.domain()[1-pos] = d2;
        return ticks;
    },
    simpleTicks: function (scale) {
        var customTicks = [];
        var domain = scale.domain();
        if (Math.min(domain[0], domain[1]) < 0 && Math.max(domain[0], domain[1]) > 0) {
            customTicks.push(0);
        }
        customTicks.push(domain[1]);
        customTicks.push(domain[0]);
        return customTicks;
    },
    tickCount: function (scale, pixelsPerTick) {
        var count = Math.round((scale.range()[1] - scale.range()[0]) / pixelsPerTick);
        if (count < 2) {
            count = 3;
        }
        else if (count < 5) {
            count = 5;
        }
        else if (count < 10) {
            count = 10;
        }
        return count;
    },
    customTicks: function (scale, pixelsPerTick, hardRules, simple, reverse) {
        var customTicks = [];
        if (simple) {
            customTicks = this.simpleTicks(scale);
        } else {
            customTicks = this.detailedTicks(scale, pixelsPerTick);
            var pos = scale.domain()[0] > scale.domain()[1] ? 1 : 0;
            if (reverse) pos = 1 - pos;
            hardRules.push(scale.domain()[pos]);
        }
        customTicks = this.removeDuplicateTicks(scale, customTicks);
        return customTicks;
    }
};

},{}],10:[function(require,module,exports){
var d3 = require('d3');

function stackSeries(model, value, stack){
    if(!model.stacks )        model.stacks = [];
    if (!model.stacks[stack]) model.stacks[stack] = [];
    model.stacks[stack].push(value);
    return d3.sum(model.stacks[stack]);
}

function Plot(model, axes) {
    this.model = model;
    this.axes = axes;
}

Plot.prototype.columnHeight = function (value){
    return Math.abs(this.axes.dependentAxisScale(value) - this.axes.dependentAxisScale(0));
};

Plot.prototype.barWidth = function(value) {
    return Math.abs(this.axes.dependentAxisScale(value) - this.axes.dependentAxisScale(0));
};

Plot.prototype.columnWidth = function (){
    var size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if(!this.model.stack){
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.barHeight = function() {
    var size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if (!this.model.stack) {
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.x = function (){
    if (['bottom','top'].indexOf(this.model.independentAxisOrient)>-1){
        return this.xIndependent.apply(this, arguments);
    } else {
        return this.xDependent.apply(this, arguments);
    }
};

Plot.prototype.y = function(){
    if (['bottom','top'].indexOf(this.model.independentAxisOrient)>-1){
        return this.yDependent.apply(this, arguments);
    } else {
        return this.yIndependent.apply(this, arguments);
    }
};

Plot.prototype.xDependent = function(value, stack) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.min(0, value);
    if (this.model.stack) {
        var xValue = stackSeries(this.model, value, stack);
        var width = this.model.stacks[stack][this.model.stacks[stack].length-1];
        maxValue = (xValue<0) ? xValue : xValue - width ;
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.yDependent = function(value, stack) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.max(0, value);
    if (this.model.stack) {
        var yValue = stackSeries(this.model, value, stack);
        var height = this.model.stacks[stack][this.model.stacks[stack].length-1];
        maxValue = (yValue<0) ? yValue - height : Math.max(0, yValue);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.xIndependent = function(key, seriesNumber) {
    var position = this.axes.independentAxisScale(key);
    var adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

Plot.prototype.yIndependent = function(key, seriesNumber) {
    var position = this.axes.independentAxisScale(key);
    var adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

module.exports = Plot;

},{"d3":"d3"}],11:[function(require,module,exports){
var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){
	var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var s = plotSVG.append('g').attr('class', 'series');

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'bar '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x',      function (d, i){ return plot.x(d.value, i); })
        .attr('y',      function (d, i){ return plot.y(d.key, seriesNumber); })
        .attr('height', function (d, i){ return plot.barHeight(d, i); })
        .attr('width',  function (d, i){ return plot.barWidth(d.value, i); });

    if (!model.stack) {
        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('class', 'null-label')
            .attr('x',  function (d, i) { return plot.x(d.value, i); })
            .attr('y',  function (d, i) {
                var yPos = plot.y(d.key, seriesNumber);
                var halfHeight = plot.barHeight(d, i) / 2;
                return yPos + halfHeight;
            })
            .attr('dx', '1em')
            .attr('dy', '0.31em')
            .text('n/a');
    }

    themes.applyTheme(plotSVG, model.theme);

    if (!model.stack) {
        // make those labels who don't fit smaller
        s.selectAll('text.null-label')
            .each(function(d, i) {
                var w = this.getBoundingClientRect();
                if ((w.height + 2) >= plot.barHeight(d, i)) {
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

function barChart(g){
	'use strict';

	var model = new DataModel('bar', Object.create(g.data()[0]));
	var svg = g.append('svg')
		.attr({
			'class': 'graphic bar-chart',
			height: model.height,
			width: model.width,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.2'
		});
	metadata.create(svg, model);

	var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

	var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    model.tickSize = 0;
    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

	var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, creator, model.y.series[i], i);
	}
}

module.exports = barChart;

},{"../axis":6,"../dressing":17,"../themes":28,"../util/data.model.js":31,"../util/metadata.js":36}],12:[function(require,module,exports){
//var d3 = require('d3');

function blankChart() {
    'use strict';

    function buildModel(opts) {
        var m = {
            //layout stuff
            title: 'chart title',
            subtitle: 'chart subtitle (letters)',
            height: undefined,
            width: 300,
            chartHeight: 300,
            chartWidth: 300,
            blockPadding: 8,
            data: [],
            error: function (err) {
                console.log('ERROR: ', err);
            }
        };

        for (var key in opts) {
            m[key] = opts[key];
        }

        return m;
    }

    function getHeight(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().height);
    }

    function getWidth(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().width);
    }

    function translate(position) {
        return 'translate(' + position.left + ',' + position.top + ')';
    }

    function chart(g) {

        var model = buildModel(g.data()[0]);

        if (!model.height) {
            model.height = model.width;
        }

        var svg = g.append('svg')
            .attr({
                'class': 'null-chart',
                height: model.height,
                width: model.width
            });

        var title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
        title.attr('transform', translate({top: getHeight(title), left: 0}));
        var subtitle = svg.append('text').text(model.subtitle);
        subtitle.attr('transform', translate({top: getHeight(title) + getHeight(subtitle), left: 0}));

        svg.selectAll('text').attr({
            fill: '#000',
            stroke: 'none'
        });
    }

    return chart;
}

module.exports = blankChart;

},{}],13:[function(require,module,exports){
var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

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

    themes.applyTheme(plotSVG, model.theme);

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
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

	var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
	var creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

	var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, creator, model.y.series[i], i);
	}
}

module.exports = columnChart;

},{"../axis":6,"../dressing":17,"../themes":28,"../util/data.model.js":31,"../util/metadata.js":36}],14:[function(require,module,exports){
module.exports = {
    line: require('./line.js'),
    blank: require('./blank.js'),
    pie: require('./pie.js'),
    column: require('./column.js'),
    bar: require('./bar.js')
};

},{"./bar.js":11,"./blank.js":12,"./column.js":13,"./line.js":15,"./pie.js":16}],15:[function(require,module,exports){
var d3 = require('d3');
var axes = require('../axis');
var interpolator = require('../util/line-interpolators.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series) {
    var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var line = d3.svg.line()
        .interpolate(interpolator.gappedLine)
        .x(function (d, i) { return plot.x(d.key, 0); })
        .y(function (d, i) { return plot.y(d.value, i);});

    plotSVG.append('path')
        .datum(data)
        .attr('class', function (d){ return 'line '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('stroke-width', model.lineStrokeWidth)
        .attr('d', function (d) { return line(d); });

    themes.applyTheme(plotSVG, model.theme);
}

function formatData(model, series) {
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function (d) {
        return {
            key: d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        return (d.value !== null);
    });
    return data;
}

function lineChart(g) {
    'use strict';

    var model = new DataModel('line',Object.create(g.data()[0]));
    var svg = g.append('svg')
        .attr({
            'class': 'graphic line-chart',
            height: model.height,
            width: model.width,
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.2'
        });
    metadata.create(svg, model);

    var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

    var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({
        dependent:'number',
        independent: 'time'
    });

    model.keyHover && dressing.addSeriesKey();

    var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = model.y.series.length;

    while (i--) {
        plotSeries(plotSVG, model, creator, model.y.series[i], i);
    }
}

module.exports = lineChart;

},{"../axis":6,"../dressing":17,"../themes":28,"../util/data.model.js":31,"../util/line-interpolators.js":34,"../util/metadata.js":36,"d3":"d3"}],16:[function(require,module,exports){
//var d3 = require('d3');

function pieChart() {
    'use strict';

    function buildModel(opts) {
        var m = {
            //layout stuff
            title: 'chart title',
            height: undefined,
            width: 300,
            chartHeight: 300,
            chartWidth: 300,
            indexProperty: '&',
            valueProperty: 'value',
            blockPadding: 8,
            data: [],
            error: function (err) {
                console.log('ERROR: ', err);
            }
        };

        for (var key in opts) {
            m[key] = opts[key];
        }

        return m;
    }

    function getHeight(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().height);
    }

    function getWidth(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().width);
    }

    function translate(position) {
        return 'translate(' + position.left + ',' + position.top + ')';
    }

    function chart(g) {
        var model = buildModel(g.data()[0]);
        if (!model.height) {
            model.height = model.width;
        }
        var svg = g.append('svg')
            .attr({
                'class': 'null-chart',
                'height': model.height,
                'width': model.width
            });

        var title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
        title.attr('transform', translate({top: getHeight(title), left: 0}));

        var subtitle = svg.append('text').text(model.subtitle);
        subtitle.attr('transform', translate({top: getHeight(title) + getHeight(subtitle), left: 0}));

        var chartSvg = svg.append('g').attr('class', 'chart');

        if (model.data.length > 3) {
            model.error('PIE warning: too many segments!');
        }

        var outerRadius = model.width / 2;

        chartSvg.selectAll('.slice')
            .data(model.data)
            .enter();
        //.append(path);

        svg.selectAll('text').attr({
            fill: '#000',
            stroke: 'none'
        });
    }

    return chart;
}

module.exports = pieChart;

},{}],17:[function(require,module,exports){
var textArea = require('./text-area.js');
var seriesKey = require('./series-key.js');
var ftLogo = require('./logo.js');
var themes = require('../themes');

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function Dressing(svg, model) {
    this.svg = svg;
    this.model = model;
    this.blockPadding = 8;
    this.defaultLineHeight = 1.2;
    this.titleFontSize = themes.check(model.theme, 'chart-title').attributes['font-size'];
    this.footerLineHeight = themes.check(model.theme, 'dressing-footnote').attributes['line-height'];
    this.subtitleFontSize = themes.check(model.theme, 'chart-subtitle').attributes['font-size'];
    this.sourceFontSize = themes.check(model.theme, 'dressing-source').attributes['font-size'];
    this.halfLineStrokeWidth = Math.ceil(model.lineStrokeWidth / 2);
    this.headerHeight = 0;
    this.footerHeight = 0;
    this.entries = model.y.series.map(function (d) {
        return {key: d.label, value: d.className};
    });
}

Dressing.prototype.addHeader = function () {
    this.addHeaderItem('title');
    this.addHeaderItem('subtitle');
    this.addSeriesKey();
};

Dressing.prototype.addFooter = function () {
    var footerText = this.addFooterItem('footnote');
    var sourceText = this.addFooterItem('source', this.model.sourcePrefix);
    this.setHeight();
    this.addLogo();
    this.positionFooterItem(footerText, sourceText);
    this.positionFooterItem(sourceText);
};

Dressing.prototype.addLogo = function () {
    var model = this.model;
    var logo = this.svg.append('g').attr('class', 'chart-logo').call(ftLogo, model.logoSize);
    logo.attr('transform', model.translate({
        left: model.width - model.logoSize - 3,
        top: model.height - getHeight(logo) - 3
    }));
};

Dressing.prototype.addHeaderItem = function(item){
    if (!this.model[item]) return;
    var svg = this.svg;
    var model = this.model;
    var lineHeight = Math.ceil(this[item + 'FontSize'] * this.defaultLineHeight);
    var textWrapper = textArea().width(model.contentWidth).lineHeight(lineHeight);
    var gText = svg.append('g').attr('class', 'chart-' + item).datum(model[item]).call(textWrapper);
    var currentPosition = {top: this.headerHeight + this[item + 'FontSize'], left: 0};
    this.headerHeight += (getHeight(gText) + this.halfLineStrokeWidth);
    gText.attr('transform', model.translate(currentPosition));
    this.setChartPosition();
};

Dressing.prototype.addSeriesKey = function () {
    if (!this.model.key) {        return;    }
    var model = this.model;

    model.keyPosition = model.keyPosition || {
            top: this.headerHeight + this.blockPadding,
            left: this.halfLineStrokeWidth
        };

    var labelWidth = model.yLabelWidth + this.blockPadding;
    var labelHeight = model.xLabelHeight + this.blockPadding;
    var hasTopAxis = [model.dependentAxisOrient,model.independentAxisOrient].indexOf('top')>-1;
    var hasLeftAxis = [model.dependentAxisOrient,model.independentAxisOrient].indexOf('left')>-1;
    if (hasLeftAxis && model.keyHover && model.keyPosition.left < labelWidth) {
        model.keyPosition.left = labelWidth;
        model.keyWidth = model.keyWidth || model.width - labelWidth;
    }
    if (hasTopAxis && model.keyHover && model.keyPosition.top < labelHeight) {
        model.keyPosition.top = labelHeight;
    }

    var chartKey = seriesKey(model)
        .style(function (d) {
            return d.value;
        })
        .label(function (d) {
            return d.key;
        })
        .width(model.keyWidth || model.width);

    var gText = this.svg.append('g').attr('class', 'chart__key').datum(this.entries).call(chartKey);
    gText.attr('transform', model.translate(model.keyPosition));

    if (!model.keyHover){
        this.headerHeight += getHeight(gText) + this.blockPadding;
    }
    this.setChartPosition();
};

Dressing.prototype.addFooterItem = function(item, prefix){
    if (!this.model[item]) return;
    var model = this.model;
    var text = textArea().width(model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var gText = this.svg.append('g').attr('class', 'chart-' + item).datum((prefix || '') + this.model[item]).call(text);
    this.footerHeight += getHeight(gText) + this.blockPadding;
    gText.currentPosition = this.footerHeight;
    return gText;
};

Dressing.prototype.positionFooterItem = function(gText){
    if (!gText) return;
    var model = this.model;
    gText.attr('transform', model.translate({top: model.chartPosition.top + model.chartHeight + gText.currentPosition + this.halfLineStrokeWidth}));
};

Dressing.prototype.setHeight = function () {
    var model = this.model;
    var footerHeight = Math.max(this.footerHeight + this.blockPadding * 2, model.logoSize);
    if (model.height) {
        model.chartHeight = model.height - this.headerHeight - footerHeight;
        if (model.chartHeight < 0) {
            model.error({ message: 'calculated plot height is less than zero' });
        }
    } else {
        model.height = this.headerHeight + model.chartHeight + footerHeight;
    }
    this.svg.attr('height', Math.ceil(model.height));
};

Dressing.prototype.setChartPosition = function () {
    this.model.chartPosition = {
        top: this.headerHeight + this.halfLineStrokeWidth + this.blockPadding,
        left: (this.model.dependentAxisOrient === 'left' ? 0 : this.halfLineStrokeWidth)
    };
};

module.exports = Dressing;

},{"../themes":28,"./logo.js":18,"./series-key.js":19,"./text-area.js":20}],18:[function(require,module,exports){
//the ft logo there's probably an easier ay to do this...
//var d3 = require('d3');

function ftLogo(g, dim) {
    'use strict';

    if (!dim) {
        dim = 32;
    }
    var d = 'M21.777,53.336c0,6.381,1.707,7.1,8.996,7.37v2.335H1.801v-2.335c6.027-0.27,7.736-0.989,7.736-7.37v-41.67 c0-6.387-1.708-7.104-7.556-7.371V1.959h51.103l0.363,13.472h-2.519c-2.16-6.827-4.502-8.979-16.467-8.979h-9.27 c-2.785,0-3.415,0.624-3.415,3.142v19.314h4.565c9.54,0,11.61-1.712,12.779-8.089h2.338v21.559h-2.338 c-1.259-7.186-4.859-8.981-12.779-8.981h-4.565V53.336z M110.955,1.959H57.328l-1.244,13.477h3.073c1.964-6.601,4.853-8.984,11.308-8.984h7.558v46.884 c0,6.381-1.71,7.1-8.637,7.37v2.335H98.9v-2.335c-6.931-0.27-8.64-0.989-8.64-7.37V6.453h7.555c6.458,0,9.351,2.383,11.309,8.984 h3.075L110.955,1.959z';
    var path = g.append('path').attr('d', d); //measure and rescale to the bounds
    var rect = path.node().getBoundingClientRect();
    if (!rect.width) return; //todo: look into why this is being added before a svg exists?
    //the logo is square so
    var scale = Math.min(dim / rect.width, dim / rect.height);

    path.attr({
        'transform': 'scale(' + scale + ')',
        'fill': 'rgba(0,0,0,0.1)'
    });
}

module.exports = ftLogo;

/*
 <path fill="none" d="M21.777,53.336c0,6.381,1.707,7.1,8.996,7.37v2.335H1.801v-2.335c6.027-0.27,7.736-0.989,7.736-7.37v-41.67
 c0-6.387-1.708-7.104-7.556-7.371V1.959h51.103l0.363,13.472h-2.519c-2.16-6.827-4.502-8.979-16.467-8.979h-9.27
 c-2.785,0-3.415,0.624-3.415,3.142v19.314h4.565c9.54,0,11.61-1.712,12.779-8.089h2.338v21.559h-2.338
 c-1.259-7.186-4.859-8.981-12.779-8.981h-4.565V53.336z"/>
 <path fill="none" d="M110.955,1.959H57.328l-1.244,13.477h3.073c1.964-6.601,4.853-8.984,11.308-8.984h7.558v46.884
 c0,6.381-1.71,7.1-8.637,7.37v2.335H98.9v-2.335c-6.931-0.27-8.64-0.989-8.64-7.37V6.453h7.555c6.458,0,9.351,2.383,11.309,8.984
 h3.075L110.955,1.959z"/>
 */

},{}],19:[function(require,module,exports){
var lineThickness = require('../util/line-thickness.js');
var themes = require('../themes');

function lineKey(options) {
    'use strict';

    options = options || {};

    var theme = options.theme;
    var columns = options.keyColumns || 1;
    var width = options.keyWidth || options.width || 300;
    var strokeLength = 15;
    var lineHeight = themes.check(options.theme, 'key-label').attributes['line-height'];
    var strokeWidth = lineThickness(options.lineThickness);

    var charts = {
        'line' : addLineKeys,
        'column' : addColumnKeys,
        'bar' : addColumnKeys
    };

    var style = function (d) {
        return d.style;
    };

    var label = function (d) {
        return d.label;
    };

    var filter = function () {
        return true;
    };

    function addLineKeys(keyItems){
        keyItems.append('line').attr({
            'class': style,
            x1: 1,
            y1: -5,
            x2: strokeLength,
            y2: -5
        })
        .attr('stroke-width', strokeWidth)
        .classed('key__line', true);

    }

    function addColumnKeys(keyItems){
        keyItems.append('rect').attr({
            'class': style,
            x: 1,
            y: -10,
            width: strokeLength,
            height: 10
        })
        .classed('key__column', true);

    }

    function addKey(keyItems){
        charts[options.chartType](keyItems);
        keyItems.append('text').attr({
            'class': 'key__label',
            x: strokeLength + 10
        }).text(label);
    }

    function positionKey(keyItems){
        var columnWidth = 10;
        keyItems.each(function(d, i){
            if (i == keyItems[0].length-1) return;
            columnWidth = Math.max(this.getBoundingClientRect().width, columnWidth) + 10;
        });
        while (columnWidth * columns > width && columns>1) columns --;

        keyItems.attr({
            'class': 'key__item',
            'transform': function (d, i) {
                var column = (i % columns);
                var row = Math.ceil((i + 1) / columns);
                var x = column * columnWidth;
                var y = row * lineHeight;
                return 'translate(' + x + ',' + y  + ')';
            }
        });
    }

    function key(g) {
        g = g.append('g').attr('class', 'key');
        var keyItems = g.selectAll('g').data(g.datum().filter(filter))
            .enter()
            .append('g').attr({ 'class': 'key__item' });

        addKey(keyItems);
        positionKey(keyItems);
        themes.applyTheme(g, theme);
    }

    key.theme = function (g, themeUpdate) {
        if (!arguments.length) return theme;
        if (themeUpdate) theme = themeUpdate;
        return key;
    };

    key.label = function (f) {
        if (!arguments.length) return label;
        label = f;
        return key;
    };

    key.style = function (f) {
        if (!arguments.length) return style;
        style = f;
        return key;
    };

    key.width = function (x) {
        if (!arguments.length) return width;
        width = x;
        return key;
    };

    key.lineHeight = function (x) {
        if (!arguments.length) return lineHeight;
        lineHeight = x;
        return key;
    };

    key.columns = function (x) {
        if (!arguments.length) return columns;
        columns = x;
        return key;
    };

    return key;
}

module.exports = lineKey;

},{"../themes":28,"../util/line-thickness.js":35}],20:[function(require,module,exports){
/*jshint -W084 */
//text area provides a wrapping text block of a given type
var d3 = require('d3');
var themes = require('../themes');

function textArea(options) {
    'use strict';

    options = options || {};

    var xOffset = 0,
        yOffset = 0,
        width = 1000,
        lineHeight = 20,
        units = 'px', //pixels by default
        bounds,
        theme = options.theme;

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().trim().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                y = text.attr('y'),
                dy = parseFloat(text.attr('dy'));

            if (isNaN(dy)) {
                dy = 0;
            }

            var tspan = text.text(null).append('tspan')
                .attr('x', 0)
                .attr('y', y)
                .attr('dy', dy + units);

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    lineNumber++;
                    var newY = (lineNumber * lineHeight);
                    tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('y', +newY + units).text(word);
                }
            }
        });
    }

    function area(g, accessor) {
        if (!accessor) {
            accessor = function (d) {
                return d;
            };
        }
        g = g.append('g').attr('transform', 'translate(' + xOffset + ',' + yOffset + ')');
        g.append('text').text(accessor).call(wrap, width);
        bounds = g.node().getBoundingClientRect();
        themes.applyTheme(g, theme);
    }

    area.theme = function (themeUpdate) {
        if (!arguments.length) return theme;
        if (themeUpdate) theme = themeUpdate;
        return area;
    };

    area.bounds = function () {
        return bounds;
    };

    area.units = function (x) { //px, em, rem
        if (!arguments.length) return units;
        units = x;
        return area;
    };

    area.lineHeight = function (x) { //pixels by default
        if (!arguments.length) return lineHeight;
        lineHeight = x;
        return area;
    };

    area.width = function (x) {
        if (!arguments.length) return width;
        width = x;
        return area;
    };

    area.yOffset = function (y) {
        if (!arguments.length) return yOffset;
        yOffset = y;
        return area;
    };

    area.xOffset = function (x) {
        if (!arguments.length) return xOffset;
        xOffset = x;
        return area;
    };

    return area;
}

module.exports = textArea;

},{"../themes":28,"d3":"d3"}],21:[function(require,module,exports){
var d3 = require('d3');
var identity = require('./discontinuityProviders/identity');


module.exports = function() {
    return discontinuableDateTime();
};

// obtains the ticks from the given scale, transforming the result to ensure
// it does not include any discontinuities
module.exports.tickTransformer = function(ticks, discontinuityProvider, domain) {
    var clampedTicks = ticks.map(function(tick, index) {
        if (index < ticks.length - 1) {
            return discontinuityProvider.clampUp(tick);
        } else {
            var clampedTick = discontinuityProvider.clampUp(tick);
            return clampedTick < domain[1] ?
                clampedTick : discontinuityProvider.clampDown(tick);
        }
    });
    var uniqueTicks = clampedTicks.reduce(function(arr, tick) {
        if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
            arr.push(tick);
        }
        return arr;
    }, []);
    return uniqueTicks;
};

/**
* The `discontinuableDateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
* As an example, you can use this scale to render a chart where the weekends are skipped.
*/
function discontinuableDateTime(adaptedScale, discontinuityProvider) {

    if (!arguments.length) {
        adaptedScale = d3.time.scale();
        discontinuityProvider = identity();
    }

    function scale(date) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        // The discontinuityProvider is responsible for determine the distance between two points
        // along a scale that has discontinuities (i.e. sections that have been removed).
        // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
        // over the domain of this axis, versus the discontinuous distance to 'x'
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = discontinuityProvider.distance(domain[0], date);
        var ratioToX = distanceToX / totalDomainDistance;
        var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
        return scaledByRange;
    }

    scale.invert = function(x) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        var ratioToX = (x - range[0]) / (range[1] - range[0]);
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = ratioToX * totalDomainDistance;
        return discontinuityProvider.offset(domain[0], distanceToX);
    };

    scale.domain = function(x) {
        if (!arguments.length) {
            return adaptedScale.domain();
        }
        // clamp the upper and lower domain values to ensure they
        // do not fall within a discontinuity
        var domainLower = discontinuityProvider.clampUp(x[0]);
        var domainUpper = discontinuityProvider.clampDown(x[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.nice = function() {
        adaptedScale.nice();
        var domain = adaptedScale.domain();
        var domainLower = discontinuityProvider.clampUp(domain[0]);
        var domainUpper = discontinuityProvider.clampDown(domain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.ticks = function() {
        var ticks = adaptedScale.ticks.apply(this, arguments);
        return module.exports.tickTransformer(ticks, discontinuityProvider, scale.domain());
    };

    scale.copy = function() {
        return discontinuableDateTime(adaptedScale.copy(), discontinuityProvider.copy());
    };

    scale.discontinuityProvider = function(x) {
        if (!arguments.length) {
            return discontinuityProvider;
        }
        discontinuityProvider = x;
        return scale;
    };

    return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
        'tickFormat');
}

},{"./discontinuityProviders/identity":22,"d3":"d3"}],22:[function(require,module,exports){
var d3 = require('d3');


/**
    # Discontinuity Providers

    The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps. As an
    example, you can use this scale to render a chart where the weekends are skipped.

    You can use a discontinuity provider to inform the `dateTime` scale of the discontinuities between a particular range of dates. In order
    to achieve this, the discontinuity provider must expose the following functions:

     + `clampUp` - When given a date, if it falls within a discontinuity (i.e. an excluded period of time) it should be shifted
     forwards in time to the discontinuity boundary. Otherwise, it should be returned unchanged.
     + `clampDown` - When given a date, if it falls within a discontinuity (i.e. an excluded period of time) it should be shifted
     backwards in time to the discontinuity boundary. Otherwise, it should be returned unchanged.
     + `distance` - When given a pair of dates this function returns the number of milliseconds between the two dates minus any
     discontinuities.
     + `offset` - When given a date and a number of milliseconds, the date should be advanced by the number of milliseconds, skipping
     any discontinuities, to return the final date.
     + `copy` - When the `dateTime` scale is copied, the discontinuity provider is also copied.
 */
module.exports = function() {

    var identity = {};

    identity.distance = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    };

    identity.offset = function(startDate, ms) {
        return new Date(startDate.getTime() + ms);
    };

    identity.clampUp = function(date) {
        return date;
    };

    identity.clampDown = function(date) {
        return date;
    };

    identity.copy = function() { return identity; };

    return identity;
};

},{"d3":"d3"}],23:[function(require,module,exports){
var d3 = require('d3');

var createIntraDay = function(openTime, closeTime) {

    if (!openTime) {
        throw new Error("You need to provide an opening time as 24H time, i.e. 08:30");
    }

    if (!closeTime) {
        throw new Error("You need to provide a closing time as 24H time, i.e. 16:30");
    }

    var open = openTime;
    var close = closeTime;


    var millisPerDay = 864e5;
    var millisPerWorkDay = calculateMillis();
    var millisPerWorkWeek = millisPerWorkDay * 5;
    var millisPerWeek = millisPerDay * 7;

    var intraDay = {};


    function calculateMillis() {
        var openHour = +open.split(':')[0];
        var openMinute = +open.split(':')[1];
        var closeHour = +close.split(':')[0];
        var closeMinute = +close.split(':')[1];
        var openDate = new Date(1970, 0, 0, openHour, openMinute);
        var closeDate = new Date(1970, 0, 0, closeHour, closeMinute);
        return closeDate.getTime() - openDate.getTime();
    }

    function isWeekend(date) {
        return [0, 6].indexOf(date.getDay()) >= 0;
    }

    function isTradingHours(date) {

        if (isWeekend(date)) {
            return false;
        }

        var openDate = dateFromTime(date, open);
        var closeDate = dateFromTime(date, close);

        return (openDate <= date) && (date <= closeDate);
    }

    // given a date and a time in 24h,
    // create a new date with the time
    // specified
    function dateFromTime(date, time) {
        var hour = +time.split(':')[0];
        var minute = +time.split(':')[1];
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute
        );
    }

    function calculateOpenTimeFor(date) {
        return dateFromTime(date, open);
    }

    function calculateCloseTimeFor(date) {
        return dateFromTime(date, close);
    }

    function moveToNextBoundary(date) {
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        if (date.getTime() === closeTimeToday.getTime()) {
            // add a second and clamp, you'll get tomorrow
            date = intraDay.clampUp(new Date(date.getTime() + 1000));
            return date;
        }

        return closeTimeToday;

    }

    function moveToPrevBoundary(date) {
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        if (date.getTime() === openTimeToday.getTime()) {
            // add a second and clamp, you'll get tomorrow
            return intraDay.clampDown(new Date(date.getTime() - 1000));
        }

        return openTimeToday;

    }



    intraDay.clampDown = function(date) {
        // first move the date back into the week
        // if it's in the weekend
        if (isWeekend(date)) {
            var daysToSubtract = date.getDay() === 0 ? 2 : 1;
            var newDate = d3.time.day.ceil(date);
            date = d3.time.day.offset(newDate, -daysToSubtract);
        }
        // and now check if it's working hours
        if (isTradingHours(date)) {
            return date;
        }

        // when we get here, we know it's not a weekend or working hours, so
        // we have to find the closest date
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        // date is before open time
        if (date < openTimeToday) {
            // we gotta return yesterday's close time, if it is
            // monday, then it's 3 days back, otherwise it is just one
            var prevWorkDays = date.getDay() === 1 ? 3 : 1;
            var yesterdayClose = d3.time.day.offset(closeTimeToday, -prevWorkDays);
            return yesterdayClose;
        }

        // date is after close time today
        if (date > closeTimeToday) {
            return closeTimeToday;
        }

    };

    intraDay.clampUp = function(date) {
        // first move the date forward into the week
        // if it's in the weekend
        if (isWeekend(date)) {
            var daysToAdd = date.getDay() === 0 ? 2 : 1;
            var newDate = d3.time.day.ceil(date);
            date = d3.time.day.offset(newDate, daysToAdd);
        }

        // check if it's working hours after moving it
        // out of the weekend
        if (isTradingHours(date)) {
            return date;
        }

        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        // date is before open time
        if (date < openTimeToday) {
            return openTimeToday;
        }

        if (date > closeTimeToday) {
            var nextWorkDays = (date.getDay() === 5) ? 3 : 1;
            var tomorrowOpen = d3.time.day.offset(openTimeToday, nextWorkDays);
            return tomorrowOpen;
        }

    };

    // number of ms within discontinuities along the scale
    intraDay.distance = function(startDate, endDate) {
        startDate = intraDay.clampUp(startDate);
        endDate = intraDay.clampDown(endDate);

        var openTimeStart = calculateOpenTimeFor(startDate);
        var closeTimeStart = calculateCloseTimeFor(startDate);
        var openTimeEnd = calculateOpenTimeFor(endDate);
        var closeTimeEnd = calculateCloseTimeFor(endDate);

        if (endDate < closeTimeStart) {
            return endDate.getTime() - startDate.getTime();
        }

        var msStartDayAdded = closeTimeStart.getTime() - startDate.getTime();
        var msEndDayRemoved = openTimeEnd.getTime() - endDate.getTime();

        // move the end date to the end of week boundary
        var offsetStart = d3.time.saturday.ceil(startDate);
        var offsetEnd = d3.time.saturday.ceil(endDate);
        // determine how many weeks there are between these two dates
        var weeks = (offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek;

        if (!weeks) {
            var offsetDayStart = d3.time.day.ceil(startDate);
            var offsetDayEnd = d3.time.day.ceil(endDate);
            var days = (offsetDayEnd.getTime() - offsetDayStart.getTime()) / millisPerDay;

            if (days > 1) {
                return days * millisPerWorkDay + msStartDayAdded - msEndDayRemoved;
            }
        }

        return weeks * millisPerWorkWeek + msStartDayAdded - msEndDayRemoved;
    };

    intraDay.offset = function(startDate, ms) {
        var date = isTradingHours(startDate) ? startDate : intraDay.clampUp(startDate);
        var remainingms = Math.abs(ms);
        var diff;

        if (ms >= 0) {
            while (remainingms > 0) {
                var closeTimeStart = calculateCloseTimeFor(date);
                diff = closeTimeStart.getTime() - date.getTime();
                if (diff < remainingms) {
                    date = new Date(date.getTime() + diff);
                    remainingms -= diff;

                    // we've crossed a boundary;
                    date = moveToNextBoundary(date);
                } else {
                    return new Date(date.getTime() + remainingms);
                }

            }
        } else {
            // we're going backwards!
            while (remainingms > 0) {
                var openTimeStart = calculateOpenTimeFor(date);
                diff = date.getTime() - openTimeStart.getTime();
                if (diff < remainingms) {
                    date = new Date(date.getTime() - diff);
                    remainingms -= diff;

                    date = moveToPrevBoundary(date);
                } else {
                    return new Date(date.getTime() - remainingms);
                }

            }
        }

        return date;

    };

    intraDay.copy = function() {
        return createIntraDay(open, close);
    };

    return intraDay;
};

module.exports = createIntraDay;

},{"d3":"d3"}],24:[function(require,module,exports){
module.exports = {
    intraDay: require('./intra-day.js')
};

},{"./intra-day.js":25}],25:[function(require,module,exports){
var discontScale = require('./discontinuableDateTime');
var intraDayDiscontinuity = require('./discontinuityProviders/intra-day');


/*
this is just a wrapper for the discontinuity scale, so that we get
a scale
 */
module.exports = function(open, close) {

    return discontScale()
        .discontinuityProvider(intraDayDiscontinuity(open, close));

};

},{"./discontinuableDateTime":21,"./discontinuityProviders/intra-day":23}],26:[function(require,module,exports){
module.exports = {
  line: [
    '#af516c',
    '#ecafaf',
    '#d7706c',
    '#76acb8',
    '#7fd8f5',
    '#3d7ab3',
    '#b8b1a9'
  ],
  area: [
    '#bb6d82',
    '#ecafaf',
    '#d7706c',
    '#cb9f8c',
    '#b07979',
    '#ccc2c2',
    '#8f7d95',
    '#b8b1a9'
  ],
  accent: '#9e2f50'
};

},{}],27:[function(require,module,exports){
var colours = require('./colours');

module.exports = [
    //general
    {
        'selector': 'svg text',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'fill': '#a7a59b',
            'stroke': 'none'
        }
    },
    //axes
    {
        'selector': '.axis path, .axis line, .axis .tick',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'fill': 'none'
        }
    }, {
        'selector': '.axis--dependent path.domain, .secondary path.domain, .secondary .tick line',
        'attributes': {
            'stroke': 'none'
        }
    },
    {
        'selector': '.axis--dependent .tick line',
        'attributes': {
            'stroke-dasharray': '2 2',
            'stroke': 'rgba(0, 0, 0, 0.1)'
        }
    },
    {
        'selector': '.primary .origin line, .axis--independent .primary .tick line',
        'attributes': {
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-dasharray': 'none'
        }
    }, {
        'selector': '.axis',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'fill': 'none',
            'stroke': 'rgba(0, 0, 0, 0.5)'
        }
    }, {
        'selector': '.axis text',
        'attributes': {
            'stroke': 'none',
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    }, {
        'selector': '.x.axis.axis--category text',
        'attributes': {
            'text-anchor': 'middle'
        }
    }, {
        'selector': '.y.axis text',
        'attributes': {
            'text-anchor': 'end'
        }
    }, {
        'selector': '.x.axis.axis--number text, .x.axis.axis--date text, .y.axis.right text',
        'attributes': {
            'text-anchor': 'start'
        }
    }, {
        'selector': '.axis--independent .primary path.domain',
        'attributes': {
            'stroke': '#757470'
        }
    },
    //lines
    {
        'selector': 'path.line, line.key__line',
        'attributes': {
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
        }
    }, {
        'selector': '.line--series1',
        'attributes': {
            'stroke': colours.line[0]
        }
    }, {
        'selector': '.line--series2',
        'attributes': {
            'stroke': colours.line[1]
        }
    }, {
        'selector': '.line--series3',
        'attributes': {
            'stroke': colours.line[2]
        }
    }, {
        'selector': '.line--series4',
        'attributes': {
            'stroke': colours.line[3]
        }
    }, {
        'selector': '.line--series5',
        'attributes': {
            'stroke': colours.line[4]
        }
    }, {
        'selector': '.line--series6',
        'attributes': {
            'stroke': colours.line[5]
        }
    }, {
        'selector': '.line--series7',
        'attributes': {
            'stroke': colours.line[6]
        }
    },
    //Columns
    {
        'selector': '.column, .key__column, .bar, .key__bar',
        'attributes': {
            'stroke': 'none'
        }
    }, {
        'selector': '.column--series1, .bar--series1',
        'attributes': {
            'fill': colours.area[0]
        }
    }, {
        'selector': '.column--series2, .bar--series2',
        'attributes': {
            'fill': colours.area[1]
        }
    }, {
        'selector': '.column--series3, .bar--series3',
        'attributes': {
            'fill': colours.area[2]
        }
    }, {
        'selector': '.column--series4, .bar--series4',
        'attributes': {
            'fill': colours.area[3]
        }
    }, {
        'selector': '.column--series5, .bar--series5',
        'attributes': {
            'fill': colours.area[4]
        }
    }, {
        'selector': '.column--series6, .bar--series6',
        'attributes': {
            'fill': colours.area[5]
        }
    }, {
        'selector': '.column--series7, .bar--series7',
        'attributes': {
            'fill': colours.area[6]
        }
    }, {
        'selector': 'path.accent, line.accent, rect.accent',
        'attributes': {
            'stroke': colours.accent
        }
    }, {
        'selector': '.series text.null-label',
        'attributes': {
            'text-anchor': 'middle',
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 0.4)'
        }
    },

    //text
    {   'id': 'chart-title',
        'selector': '.chart-title text, .chart-title tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 18,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'selector': '.chart-subtitle text, .chart-subtitle tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'dressing-source',
        'selector': '.chart-source text, .chart-source tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'dressing-footnote',
        'selector': '.chart-footnote text, .chart-footnote tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 15,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'key-label',
        'selector': 'text.key__label',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    }, {
        'selector': '.primary .tick text',
        'attributes': {
            'font-size': 12,
            'fill': '#757470'
        }
    }, {
        'selector': '.secondary .tick text',
        'attributes': {
            'font-size': 10,
            'fill': '#757470'
        }
    }
];

},{"./colours":26}],28:[function(require,module,exports){
// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied
var d3 = require('d3');

var themes = {
    ft: require('./ft'),
    video: require('./video'),
    applyTheme: applyAttributes,
    check: checkAttributes
};

function applyAttributes(g, theme, keepD3Styles) {
    theme = theme || 'ft';
    if (!keepD3Styles) {
        (g || d3).selectAll('*').attr('style', null);
    }
    themes[theme].forEach(function (style, i) {
        (g || d3).selectAll(style.selector).attr(style.attributes);
    });
    return true;
}

function checkAttributes(theme, selector) {
    theme = theme || 'ft';
    return themes[theme].filter(function (style, i) {
        return (style.id == selector);
    })[0];//return only a single object by id
}

module.exports = themes;

},{"./ft":27,"./video":29,"d3":"d3"}],29:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"./colours":26,"dup":27}],30:[function(require,module,exports){
// More info:
// http://en.wikipedia.org/wiki/Aspect_ratio_%28image%29

var commonRatios = {
    square: {width: 1, height: 1},
    standard: {width: 4, height: 3},
    golden: {width: 1.618, height: 1},
    classicPhoto: {width: 3, height: 2},
    widescreen: {width: 16, height: 9},
    panoramic: {width: 2.39, height: 1}
};

function getRatio(name) {
    if (!name) return;

    if (name in commonRatios) {
        return commonRatios[name];
    }

    if (typeof name === 'string') {
        var p = name.split(':');
        return {width: p[0], height: p[1]};
    }

    return name;
}

module.exports = {

    commonRatios: commonRatios,

    widthFromHeight: function (height, ratio) {

        ratio = getRatio(ratio);

        if (!ratio) {
            throw new Error('Ratio is falsey');
        }

        if (typeof ratio === 'number') return height * ratio;

        if (!ratio.height || !ratio.width) {
            throw new Error('Ratio must have width and height values');
        }

        ratio = ratio.width / ratio.height;

        return Math.ceil(height * ratio);
    },

    heightFromWidth: function (width, ratio) {

        ratio = getRatio(ratio);

        if (!ratio) {
            throw new Error('Ratio is falsey');
        }

        if (typeof ratio === 'number') return width * ratio;

        if (!ratio.height || !ratio.width) {
            throw new Error('Ratio must have width and height values');
        }

        ratio = ratio.height / ratio.width;

        return Math.ceil(width * ratio);
    }
};

},{}],31:[function(require,module,exports){
var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var ratios = require('../util/aspect-ratios.js');
var seriesOptions = require('../util/series-options.js');
var dateUtil = require('../util/dates.js');

function isDate(d) {
    return d && d instanceof Date && !isNaN(+d);
}

function translate(margin) {
    return function (position) {
        var left = position.left || 0;
        var top = position.top || 0;
        return 'translate(' + (margin + left) + ',' + top + ')';
    };
}

function chartWidth(model) {
    if (model.chartWidth) {
        return model.chartWidth;
    }
    var rightGutter = model.contentWidth < 260 ? 16 : 26;
    return model.contentWidth - rightGutter;
}

function setExtents(model){
	var extents = [];
	model.y.series.forEach(function (l) {
		var key = l.key;
		model.data = model.data.map(function (d, j) {
			var value = (Array.isArray(d.values)) ? d.values[0][key] : d[key];
			var isValidNumber = value === null || typeof value === 'number';
			if (!isValidNumber) {
				model.error({
					node: null,
					message: 'Value is not a number',
					value: value,
					row: j,
					column: key
				});
			}
			return d;
		});
		var ext = d3.extent(model.data, function(d){
			return (Array.isArray(d.values)) ? d.values[0][key] : d[key];
		});
		extents = extents.concat (ext);
	});
	return extents;
}

function findOpenCloseTimes(model) {
    var maxGap = Number.MIN_VALUE;
    var gapIndex;
    // brute force search for maximum gap.
    // this will also work for weekend skips
    // since intra-day skips weekends automatically
    model.data.forEach(function(d, i) {
        if (!i) return;
        var prevdt = model.data[i-1][model.x.series.key];
        var dt = d[model.x.series.key];
        var gap = dt - prevdt;
        if (gap > maxGap) {
            gapIndex = i;
            maxGap = gap;
        }
    });

    var openTime = model.data[gapIndex][model.x.series.key];
    var closeTime = model.data[gapIndex-1][model.x.series.key];

    var fmt = d3.time.format("%H:%M");

    var open = fmt(new Date(openTime-60*1000));
    var close = fmt(new Date(closeTime.getTime()+60*1000));

    // ;_; side effects ewww
    model.open = open;
    model.close = close;

}




function independentDomain(model, chartType) {
    if (model.independentDomain) { return model.independentDomain;  }

    var isCategorical = model.dataType === 'categorical';
    var isBarOrColumn = ['column', 'bar'].indexOf(chartType) >= 0;

    if ((model.groupData || isCategorical) && isBarOrColumn){
        model.data = (model.groupData && !isCategorical) ? groupDates(model, model.units) : model.data;
        return model.data.map(function (d) {
            return d[model.x.series.key];
        });
    } else {
        return d3.extent(model.data, function (d) {
            return d[model.x.series.key];
        });
    }
}

function sumStackedValues(model){
    var extents = [];
    model.data.map(function (d, j) {
        var key, sum = 0;
        var values = Array.isArray(d.values) ? d.values[0] : d;
        for (key in values) {
            if (key !== model.x.series.originalKey) {
                sum += values[key];
            }
        }
        extents.push(sum);
    });
    return extents;
}

function dependentDomain(model, chartType){
    if(model.dependentDomain){ return model.dependentDomain; }

    var extents = (model.stack) ? sumStackedValues(model) : setExtents(model);
    var domain = d3.extent(extents);
    if(!model.falseOrigin && domain[0] > 0){
        domain[0] = 0;
    }

    var isBarOrColumn = ['column', 'bar'].indexOf(chartType) >= 0;
    if (isBarOrColumn && domain[1] < 0) {
        domain[1] = 0;
    }

    return domain;
}

function chartHeight(model) {
    if (model.chartHeight) {
        return model.chartHeight;
    }
    var isNarrow = model.chartWidth < 220;
    var isWide = model.chartWidth > 400;
    var ratio = isNarrow ? 1.1 : (isWide ? ratios.commonRatios.widescreen : ratios.commonRatios.standard);
    return ratios.heightFromWidth(model.chartWidth, ratio);
}

function verifyData(model) {
    return !Array.isArray(model.data) ? [] : model.data.map(function (dataItem, i) {

        var s = dataItem[model.x.series.key];
        var error = {
            node: null,
            message: '',
            row: i,
            column: model.x.series.key,
            value: s
        };

        if (!dataItem) {
            error.message = 'Empty row';
        } else if (!s) {
            error.message = 'X axis value is empty or null';
        } else if (!isDate(s) && model.chartType == 'line') {
            error.message = 'Value is not a valid date';
        }

        if (error.message) {
            model.error(error);
            dataItem[model.x.series.key] = null;
        }

        return dataItem;

    });
}

function setKey(model) {
    var key = model.key;
    if (typeof model.key !== 'boolean') {
        key = model.y.series.length > 1;
    } else if (model.key && !model.y.series.length) {
        key = false;
    }
    return key;
}

function groupDates(m, units){
    var firstDate = m.data[0][m.x.series.key];
    var data = [];
    m.data.forEach(function(d,i){
        var dateStr = [dateUtil.formatter[units[0]](d[m.x.series.key], i, firstDate)];
        units[1] && dateStr.push(dateUtil.formatter[units[1]](d[m.x.series.key], i, firstDate));
        units[2] && dateStr.push(dateUtil.formatter[units[2]](d[m.x.series.key], i, firstDate));
        data.push({key:dateStr.join(' '),values:[d]});
    });
    m.data = data;
	m.x.series.key = 'key';
	return m.data;
}

function needsGrouping(units){
    if (!units) return false;
    var isGroupingUnit = false;
    units.forEach(function(unit){
        var groupThis = ['weekly', 'quarterly', 'monthly', 'yearly'].indexOf(unit);
        isGroupingUnit = isGroupingUnit || (groupThis>-1);
    });
    return isGroupingUnit;
}

function Model(chartType, opts) {
    var classes = {
        line: ['line--series1', 'line--series2', 'line--series3', 'line--series4', 'line--series5', 'line--series6', 'line--series7', 'accent'],
        column: ['column--series1', 'column--series2', 'column--series3', 'column--series4', 'column--series5', 'column--series6', 'column--series7', 'accent'],
        bar: ['bar--series1', 'bar--series2', 'bar--series3', 'bar--series4', 'bar--series5', 'bar--series6', 'bar--series7', 'accent']
    };
    var m = {
        //layout stuff
        theme: 'ft',
        chartType: chartType,
        keyColumns: (chartType == 'column' ? 5 : 1),
        keyHover: false,
        height: undefined,
        tickSize: 5,
        width: 300,
        chartHeight: undefined,
        chartWidth: undefined,
        simpleDate: false,
        simpleValue: false,
        logoSize: 28,
        //data stuff
        falseOrigin: false, //TODO, find out if there's a standard 'pipeline' temr for this
        error: this.error,
        lineClasses: {},
        columnClasses: {},
        niceValue: true,
        stack: false,
        dependentAxisOrient: 'left',
        independentAxisOrient: 'bottom',
        margin: 2,
        lineThickness: undefined,
        yLabelWidth: 0,
        xLabelHeight: 0,
        x: {
            series: '&'
        },
        y: {
            series: [], reverse: false
        },
        labelLookup: null,
        sourcePrefix: 'Source: '
    };

    for (var key in opts) {
        m[key] = opts[key];
    }

    m.x.series = seriesOptions.normalise(m.x.series);
    m.y.series = seriesOptions.normaliseY(m.y.series)
        .filter(function (d) {
            return !!d.key && d.key !== m.x.series.key;
        })
        .map(function (d, i) {
            d.index = i;
            d.className = classes[chartType][i];
            return d;
        });

	m.contentWidth = m.width - (m.margin * 2);
	m.chartWidth = chartWidth(m);
	m.chartHeight = chartHeight(m);
	m.translate = translate(0);
	m.data = verifyData(m);
    m.groupData = needsGrouping(m.units);
    m.independentDomain = independentDomain(m, chartType);
	m.dependentDomain = dependentDomain(m, chartType);
	m.lineStrokeWidth = lineThickness(m.lineThickness, m.theme);
	m.key = setKey(m);
    if (m.intraDay) {
        findOpenCloseTimes(m);
    }
    return m;
}

Model.prototype.error = function (err) {
    console.log('ERROR: ', err);
};
module.exports = Model;

},{"../util/aspect-ratios.js":30,"../util/dates.js":32,"../util/line-thickness.js":35,"../util/series-options.js":37,"d3":"d3"}],32:[function(require,module,exports){
var d3 = require('d3');

var formatter = {
    centuries: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    decades: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    years: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    fullYears: function (d, i) {
        return d3.time.format('%Y')(d);
    },
    yearly: function (d, i, firstDate) {
        var years = (firstDate && !Array.isArray(firstDate) &&
        (formatter.years(firstDate, i) == formatter.years(d, i))) ?
            'fullYears' : 'years';

        return formatter[years](d, i);
    },
    quarterly: function (d, i) {
        return 'Q' + Math.floor((d.getMonth() + 3) / 3);
    },
    weekly: function (d, i) {
        return d3.time.format('%W')(d);
    },
    monthly: function (d, i) {
        return formatter.months(d, i);
    },
    shortmonths: function (d, i) {
        return d3.time.format('%b')(d)[0];
    },
    months: function (d, i) {
        return d3.time.format('%b')(d);
    },

    weeks: function (d, i) {
        return d3.time.format('%e %b')(d);
    },

    days: function (d, i) {
        return d3.time.format('%e')(d);
    },

    daily: function (d, i) {
        var str = d3.time.format('%e')(d);
        if (str[0] === ' ') str = str.substring(1);
        return str;
    },

    hours: function (d, i) {
        return parseInt(d3.time.format('%H')(d)) + ':00';
    }
};

function timeDiff(domain){
    if (!domain[0].getTime || !domain[1].getTime) return {};
    var jsTimeDiff = domain[1].getTime() - domain[0].getTime();
    var dayLength = 86400000;
    return {
        days: jsTimeDiff / dayLength,
        months: jsTimeDiff / (dayLength * 30),
        years: jsTimeDiff / (dayLength * 365.25),
        decades: jsTimeDiff / (dayLength * 365.25 * 10),
        centuries: jsTimeDiff / (dayLength * 365.25 * 100)
    };
}

function unitGenerator(domain, simple) {	//which units are most appropriate
    if (!domain[0].getTime || !domain[1].getTime) return [];
    var timeDif = timeDiff(domain);
    var units;
    if (timeDif.days < 2) {
        units = ['hours', 'days', 'months'];
    } else if (timeDif.days < 60) {
        units = ['days', 'months'];
    } else if (timeDif.years < 1) {
        units = ['months', 'years'];
    } else if (timeDif.decades < 1.5) {
        units = ['years'];
    } else if (timeDif.centuries < 1.5) {
        units = ['decades'];
    } else if (timeDif.centuries < 10) {
        units = ['centuries'];
    } else {
        units = ['multi'];
    }
    if (simple && (
        units.indexOf('years') > -1 ||
        units.indexOf('decades') ||
        units.indexOf('centuries'))) {
        units = ['fullYears']; //simple axis always uses full years
    }
    return units;
}

var groups = {
    unknown: function (d, i) {
        return d;
    },
    years: function (d, i) {
        return formatter.years(new Date(d), i);
    },
    yearly: function (d, i) {
        return d.split(' ')[d.split(' ').length-1];
    },
    quarterly: function (d, i) {
        return d.split(' ')[0];
    },
    weekly: function (d, i) {
        return d.split(' ')[0];
    },
    daily: function (d, i) {
        if (d[0] === ' ') {
            d = d.substring(1);
        }
        return d.split(' ')[0];
    },
    monthly: function (d, i) {
        var parts = d.split(' ');
        var pos = (parts.length == 3) ? 1 : 0;
        return parts[pos];
    },
    months: function (d, i) {
        return d.split(' ')[0];
    },
    decades: function (d, i) {
        return d.split(' ')[1];
    },
    centuries: function (d, i) {
        return d.split(' ')[1];
    },
    categorical: function (d, i) {
        return d;
    }
};

module.exports = {
    timeDiff: timeDiff,
    formatGroups: groups,
    formatter: formatter,
    unitGenerator: unitGenerator
};

},{"d3":"d3"}],33:[function(require,module,exports){
var d3 = require('d3');
var dates = require('../util/dates');
var themes = require('../themes');
var dateFormatter = dates.formatter;

module.exports = {
    extendedTicks : function (g, config) {
        var tickExtender = 1.5;
        var extendedTicks_selector = ".tick line[y2=\"" + (config.tickSize * tickExtender) + "\"]";
        var ticks_selector = ".tick line";

        g.selectAll(ticks_selector)
            .attr("y2", function (d) {
                var formatted = d.getMonth ? dateFormatter[config.units[0]](d) : d.toString();
                var isFirstInPeriod = formatted.indexOf('Q1') === 0 || formatted.indexOf('Jan') === 0;
                return (isFirstInPeriod) ? (config.tickSize * tickExtender) : config.tickSize ;
            });
        var tickCount = g.selectAll(ticks_selector)[0].length;
        var extendedCount = g.selectAll(extendedTicks_selector)[0].length;
        if (extendedCount+2 >= tickCount){
            //take into account of first + last starting on something not q1
            g.selectAll(extendedTicks_selector).attr("y2", config.tickSize);
        }
    },
    add: function(g, config){
        var self = this;
        var options = { row: 0 };

        config.axes.forEach(function (axis, i) {
            self.addRow(g, axis, options, config);
            options.row ++;
        });

        //remove text-anchor attribute from year positions
        g.selectAll('.x.axis .primary text').attr({
            x: null,
            y: null,
            dy: 15 + config.tickSize
        });

    },

    addRow: function(g, axis, options, config){
        var rowClass = (options.row) ? 'secondary': 'primary';
        g.append('g')
            .attr('class', rowClass)
            .attr('transform', 'translate(0,' + (options.row * config.lineHeight) + ')')
            .call(axis);

        // style the row before we do any removing, to ensure that
        // collision detection is done correctly
        themes.applyTheme(g, config.theme, config.keepD3Style);

        if (config.dataType === 'categorical') {
            return;
        }

        this.removeDuplicates(g, '.' + rowClass + ' text');
        if (options.extendTicks) {
            this.extendedTicks(g, config, options.extendTicks);
        }
        if (dates.unitGenerator(config.scale.domain())[0] == 'days') {
            this.removeDays(g, '.primary text');
        }
        if (config.units[0] == 'quarterly'){
            this.removeQuarters(g, axis, options);
        }
        if (config.units[0] == 'weekly'){
            this.removeWeekly(g, axis, options);
        }
        if (config.units[0] == 'daily'){
            // in this case we don't remove daily ticks
        }
        if (config.units[0] == 'monthly'){
            this.removeMonths(g, axis, options, config);
        }
        this.removeOverlapping(g, '.' + rowClass + ' text');

    },

    intersection: function (a, b) {
        var PADDING = 2;
        var overlap = (
        a.left <= b.right + PADDING &&
        b.left <= a.right + PADDING &&
        a.top <= b.bottom &&
        b.top <= a.bottom
        );
        return overlap;
    },

    overlapping: function (dElements) {
        var self = this;
        var bounds = [];
        var overlap = false;
        dElements.each(function (d, i) {
            var rect = this.getBoundingClientRect();
            var include = true;
            bounds.forEach(function (b, i) {
                if (self.intersection(b, rect)) {
                    include = false;
                    overlap = true;
                }
            });
            if (include) {
                bounds.push(rect);
            }
        });
        return overlap;
    },

    removeQuarters: function(g, axis, options){
        if (!this.overlapping(g.selectAll(".primary text")) || options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeWeekly: function(g, axis, options){
        if (options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeDaily: function(g, axis, options){
        if (options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeMonths: function(g, axis, options, config){
        if (g.selectAll(".primary text")[0].length < 13) return;
        options.extendTicks = true;
        var text = g.selectAll('.primary .tick text');
        text.each(function(d,i){
            if (i === 0 || i === text[0].length-1 || d3.select(this).text() == 'Jan') return;
            d3.select(this).remove();
        });
    },

    removeDays: function (g, selector) {
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;

        function remove(d, i) {
            var d3This = d3.select(this);
            if (i !== 0 && i !== elementCount - 1 && d3This.text() != 1) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    },

    removeOverlapping: function (g, selector) {
        var self = this;
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;
        var limit = 5;

        function remove(d, i) {
            var last = i === elementCount - 1;
            var previousLabel = dElements[0][elementCount - 2];
            var lastOverlapsPrevious = (last && self.intersection(previousLabel.getBoundingClientRect(), this.getBoundingClientRect()));
            if (last && lastOverlapsPrevious) {
                d3.select(previousLabel).remove();
            } else if (i % 2 !== 0 && !last) {
                d3.select(this).remove();
            }
        }

        while (self.overlapping(g.selectAll(selector)) && limit > 0) {
            limit--;
            g.selectAll(selector).each(remove);
            dElements = g.selectAll(selector);
            elementCount = dElements[0].length;
        }
    },

    removeDuplicates: function (g, selector) {
        var dElements = g.selectAll(selector);

        function remove(label, i) {
            if (i === 0) return;
            var d3This = d3.select(this);
            var previousLabel = dElements[0][i - 1];
            if (d3This.text() === d3.select(previousLabel).text()) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    }
};

},{"../themes":28,"../util/dates":32,"d3":"d3"}],34:[function(require,module,exports){
//a place to define custom line interpolators

var d3 = require('d3');

function gappedLineInterpolator(points) {  //interpolate straight lines with gaps for NaN
    'use strict';

    var section = 0;
    var arrays = [[]];
    points.forEach(function (d, i) {
        if (isNaN(d[1])) {
            if (arrays[section].length == 1) {
                console.log('warning: Found a line fragment which is a single point this won\'t be drawn');
            }
            section++;
            arrays[section] = [];
        } else {
            arrays[section].push(d);
        }
    });

    var pathSections = [];
    arrays.forEach(function (points) {
        pathSections.push(d3.svg.line()(points));
    });
    var joined = pathSections.join('');
    return joined.substr(1); //substring becasue D£ always adds an M to a path so we end up with MM at the start
}

module.exports = {
    gappedLine: gappedLineInterpolator
};

},{"d3":"d3"}],35:[function(require,module,exports){
var thicknesses = {
    small: 2,
    medium: 4,
    large: 6
};

var defaultThickness = thicknesses.medium;

module.exports = function (value) {

    // fail fast
    if (!value) {
        return defaultThickness;
    }

    var lineThicknessIsNumber = value &&
        typeof value === 'number' && !isNaN(value);

    if (lineThicknessIsNumber) {
        return value;
    } else if (typeof value === 'string' && value.toLowerCase() in thicknesses) {
        return thicknesses[value];
    } else {
        return defaultThickness;
    }
};

},{}],36:[function(require,module,exports){
//example:
//http://codinginparadise.org/projects/svgweb-staging/tests/htmlObjectHarness/basic-metadata-example-01-b.html
var svgSchema = 'http://www.w3.org/2000/svg';
var xlinkSchema = 'http://www.w3.org/1999/xlink';
var xmlnsSchema = 'http://www.w3.org/2000/xmlns/';
var rdfSchema = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
var dcSchema = 'http://purl.org/dc/elements/1.1/';
var ccSchema = 'http://creativecommons.org/ns#';
var prismSchema = "http://prismstandard.org/namespaces/1.0/basic/";
var rdfsSchema = "http://www.w3.org/2000/01/rdf-schema#";

function create(svg, model) {
    svg.append('title').text(model.title);
    svg.append('desc').text(model.subtitle);
    svg.append('metadata').attr({'id': "license"});

    var container = svg.node();
    var meta = container.querySelector('metadata');

    var rdf = document.createElement('rdf:RDF');
    var rdfDesc = document.createElement('rdf:Description');
    var title = document.createElement('dc:title');
    var description = document.createElement('dc:description');
    var format = document.createElement('dc:format');
    var date = document.createElement('dc:date');

    container.setAttribute('xmlns', svgSchema);
    container.setAttributeNS(xmlnsSchema, 'xmlns:xlink', xlinkSchema);
    rdfDesc.setAttribute('rdf:about', '');
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:rdf', rdfSchema);
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:dc', dcSchema);
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:cc', ccSchema);

    title.textContent = model.title;
    description.textContent = model.subtitle;
    format.textContent = 'image/svg+xml';
    date.textContent = (new Date()).toString();

    meta.appendChild(rdf);
    rdf.appendChild(rdfDesc);
    rdfDesc.appendChild(title);
    rdfDesc.appendChild(description);
    rdfDesc.appendChild(format);
    rdfDesc.appendChild(date);
}

module.exports = {
    create: create
};

},{}],37:[function(require,module,exports){
function isTruthy(value) {
    return !!value;
}

function normalise(value) {
    var d = {key: null, label: null};

    if (!value) {
        return d;
    }

    if (typeof value === 'string') {
        d.key = d.label = value;
    } else if (Array.isArray(value) && value.length <= 2 && typeof value[0] === 'string') {
        d.key = value[0];
        d.label = (typeof value[1] === 'string') ? value[1] : d.key;
    } else if (typeof value === 'function') {
        d = value();
    } else if (value.key) {
        d.key = value.key;
        d.label = value.label || d.key;
    }

    if (typeof d.key === 'function') {
        d.key = d.key();
    }

    if (typeof d.label === 'function') {
        d.label = d.label();
    }
    d.originalKey = d.key;

    return d;
}

function normaliseY(value) {
    if (!value) return [];
    return (!Array.isArray(value) ? [normalise(value)] : value.map(normalise)).filter(isTruthy);
}

module.exports = {
    normaliseY: normaliseY,
    normalise: normalise
};

},{}],38:[function(require,module,exports){
var app = require('../../app.json');
module.exports = app.version;

},{"../../app.json":1}],"o-charts":[function(require,module,exports){
module.exports = {
    chart: require('./chart/index.js'),

    axis: require('./axis/index.js'),

    dressing: {
        seriesKey: require('./dressing/series-key.js'),
        textArea: require('./dressing/text-area.js'),
        logo: require('./dressing/logo.js')
    },

    util: {
        themes: require('./themes'),
        dates: require('./util/dates.js')
    },

    scale: require('./scales/index.js'),

    version: require('./util/version')

};

},{"./axis/index.js":6,"./chart/index.js":14,"./dressing/logo.js":18,"./dressing/series-key.js":19,"./dressing/text-area.js":20,"./scales/index.js":24,"./themes":28,"./util/dates.js":32,"./util/version":38}]},{},["o-charts"]);
