require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var d3 = require('d3');
var styler = require('../util/chart-attribute-styles');
var labels = require('../util/labels.js');
var utils = require('./category.utils.js');

function categoryAxis() {

    var config = {
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false
    };

    function render(g) {

        g = g.append('g').attr('transform', 'translate(' + config.xOffset + ',' + config.yOffset + ')');

        g.append('g').attr('class', 'x axis').each(function () {
            var g = d3.select(this);
            config.axes.forEach(function (a, i) {
                g.append('g')
                    .attr('class', ((i === 0) ? 'primary' : 'secondary'))
                    .attr('transform', 'translate(0,' + (i * config.lineHeight) + ')')
                    .call(a);
            });
            //remove text-anchor attribute from year positions
            g.selectAll('.primary text').attr({
                x: null,
                y: null,
                dy: 15 + config.tickSize
            });
            styler(g, true);
        });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
        labels.removeDuplicates(g, '.primary text');
        labels.removeDuplicates(g, '.secondary text');
        labels.removeOverlapping(g, '.primary text');
        labels.removeOverlapping(g, '.secondary text');
    }

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

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        units = units || ['unknown'];
        config.scale = scale;

        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (utils.formatter[unit]) {
                var axis = d3.svg.axis()
                    .scale(scale)
                    .tickFormat(utils.formatter[unit])
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

},{"../util/chart-attribute-styles":19,"../util/labels.js":24,"./category.utils.js":2,"d3":"d3"}],2:[function(require,module,exports){
var formatter = {
    unknown: function (d, i) {
        return d;
    },
    years: function (d, i) {
        return d.split(' ')[1];
    },
    yearly: function (d, i) {
        return d.split(' ')[1];
    },
    quarterly: function (d, i) {
        return d.split(' ')[0];
    },
    monthly: function (d, i) {
        return d.split(' ')[0];
    },
    months: function (d, i) {
        return d.split(' ')[0];
    },
    decades: function (d, i) {
        return d.split(' ')[1];
    },
    centuries: function (d, i) {
        return d.split(' ')[1];
    }
};

module.exports = {
    formatter: formatter
};

},{}],3:[function(require,module,exports){
var d3 = require('d3');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var dateScale = require('./date.scale.js');
var styler = require('../util/chart-attribute-styles');

function dateAxis() {
    var config = {
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false
    };

    function render(g) {

        g = g.append('g').attr('transform', 'translate(' + config.xOffset + ',' + config.yOffset + ')');

        g.append('g').attr('class', 'x axis').each(function () {
            var g = d3.select(this);
            config.axes.forEach(function (a, i) {
                g.append('g')
                    .attr('class', ((i === 0) ? 'primary' : 'secondary'))
                    .attr('transform', 'translate(0,' + (i * config.lineHeight) + ')')
                    .call(a);
            });
            //remove text-anchor attribute from year positions
            g.selectAll('.primary text').attr({
                x: null,
                y: null,
                dy: 15 + config.tickSize
            });
            styler(g);
        });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }

        if (dates.unitGenerator(config.scale.domain())[0] == 'days') {
            labels.removeDays(g, '.primary text');
        }
        labels.removeDuplicates(g, '.primary text');
        labels.removeDuplicates(g, '.secondary text');
        labels.removeOverlapping(g, '.primary text');
        labels.removeOverlapping(g, '.secondary text');
    }

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

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        if (config.nice) {
            scale.nice((scale.range()[1] - scale.range()[0]) / config.pixelsPerTick);
        }
        config.scale = scale;
        config.axes = dateScale.render(scale, units, config.tickSize, config.simple);
        return render;
    };

    return render;
}

module.exports = dateAxis;

},{"../util/chart-attribute-styles":19,"../util/dates.js":21,"../util/labels.js":24,"./date.scale.js":4,"d3":"d3"}],4:[function(require,module,exports){
var d3 = require('d3');
var utils = require('../util/dates.js');

var interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    quarterly: d3.time.month,
    months: d3.time.month,
    weeks: d3.time.week,
    days: d3.time.day,
    hours: d3.time.hours
};

var increment = {
    centuries: 100,
    decades: 10,
    years: 1,
    fullYears: 1,
    quarterly: 3,
    months: 1,
    weeks: 1,
    days: 1,
    hours: 1
};

module.exports = {
    customTicks: function (scale, unit) {
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
    createAxes: function(scale, unit, tickSize, simple){
        var firstDate ;
        var customTicks = (simple) ? scale.domain() : this.customTicks(scale, unit);
        var axis = d3.svg.axis()
            .scale(scale)
            .tickValues(customTicks)
            .tickFormat(function(d,i){
                firstDate = firstDate || d;
                return utils.formatter[unit](d,i, firstDate);
            })
            .tickSize(tickSize, 0);
        return axis;
    },
    render: function (scale, units, tickSize, simple) {
        if (!units) {
            units = utils.unitGenerator(scale.domain(), simple);
        }
        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (utils.formatter[unit]) {
                axes.push(this.createAxes(scale, unit, tickSize, simple));
            }
        }
        axes.forEach(function (axis) {
            axis.scale(scale);
        });
        return axes;
    }
};

},{"../util/dates.js":21,"d3":"d3"}],5:[function(require,module,exports){
module.exports = {
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};

},{"./category.js":1,"./date.js":3,"./number.js":6}],6:[function(require,module,exports){
//this is wrapper for d3.svg.axis
//for a standard FT styled numeric axis
//usually these are vertical

var d3 = require('d3');
var numberLabels = require('./number.labels');
var numberScales = require('./number.scale');
var styler = require('../util/chart-attribute-styles');

function numericAxis() {
    'use strict';

    var ticksize = 5;
    var a = d3.svg.axis().orient('left').tickSize(ticksize, 0);
    var lineHeight = 16;
    var userTicks = [];
    var hardRules = [0];
    var yOffset = 0;
    var xOffset = 0;
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
        styler(g);
    }

    axis.tickExtension = function (int) { // extend the axis ticks to the right/ left a specified distance
        if (!arguments.length) return tickExtension;
        tickExtension = int;
        return axis;
    };

    axis.tickSize = function (int) {
        if (!arguments.length) return ticksize;
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
        a.orient(string);
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
        if (userTicks.length > 0) {
            a.tickValues(userTicks);
        } else {
            var customTicks = numberScales.customTicks(a.scale(), pixelsPerTick, hardRules, simple);
            a.tickValues(customTicks);
        }
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

},{"../util/chart-attribute-styles":19,"./number.labels":7,"./number.scale":8,"d3":"d3"}],7:[function(require,module,exports){
module.exports = {

    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function (g, axes, lineHeight, hardRules) {
        var textWidth = this.textWidth(g, axes.orient());
        if (this.isVertical(axes)) {
            g.selectAll('text').attr('transform', 'translate( ' + textWidth + ', ' + -(lineHeight / 2) + ' )');
            g.selectAll('.tick').classed('origin', function (d, i) {
                return hardRules.indexOf(d) > -1;
            });
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
            .attr('class', (this.isVertical(config.axes)) ? 'y axis left' : 'x axis')
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

},{}],8:[function(require,module,exports){
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
        var interval = 0;
        ticks.forEach(function (d, i) {
            if (i < ticks.length - 1) {
                interval = Math.max(ticks[i + 1] - d, interval);
            }
        });
        return interval;
    },
    detailedTicks: function (scale, pixelsPerTick) {
        var count = this.tickCount(scale, pixelsPerTick);
        var ticks = scale.ticks(count);
        var interval = this.tickIntervalBoundaries(ticks);
        scale.domain()[0] = Math.ceil(scale.domain()[0] / interval) * interval;
        scale.domain()[1] = Math.floor(scale.domain()[1] / interval) * interval;
        ticks.push(scale.domain()[1]);
        ticks.push(scale.domain()[0]);
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
    customTicks: function (scale, pixelsPerTick, hardRules, simple) {
        var customTicks = [];
        if (simple) {
            customTicks = this.simpleTicks(scale);
        } else {
            customTicks = this.detailedTicks(scale, pixelsPerTick);
            hardRules.push(scale.domain()[1]);
        }
        customTicks = this.removeDuplicateTicks(scale, customTicks);
        return customTicks;
    }
};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
//var d3 = require('d3');
var Axes = require('../util/draw-axes.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');
var styler = require('../util/chart-attribute-styles');

function plotSeries(plotSVG, model, axes, series, i){
	var data = formatData(model, series);
    var colWidth = axes.columnWidth || 1;
    var adjustX = (axes.timeScale.rangeBand) ? (axes.timeScale.rangeBand() / model.y.series.length) : colWidth;

    var s = plotSVG.append('g').attr('class', 'series');
    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'column '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){	return d.value;})
		.attr('x', function (d){ return axes.timeScale(d.key) + (adjustX * i); })
		.attr('y', function (d){ return axes.valueScale(Math.max(0, d.value));})
        .attr('height', function (d){return Math.abs(axes.valueScale(d.value) - axes.valueScale(0));})
		.attr("width", colWidth);

    styler(plotSVG);
}

function formatData(model, series) {
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: d[series.key] || d.values[0][series.key]
        };
    }).filter(function (d) {
        return (d.y !== null);
    });
    return data;
}

function columnChart(g){
	'use strict';

	var model = new DataModel('column',Object.create(g.data()[0]));
	var i = model.y.series.length;
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

	if(model.groupData){
		axes.addGroupedTimeScale(model.units);
	}else{
		axes.addTimeScale();
	}
	axes.repositionAxis();

	var plotSVG = chartSVG.append('g').attr('class', 'plot');

	while(i--){
		plotSeries(plotSVG, model, axes, model.y.series[i], i);
	}
}

module.exports = columnChart;

},{"../util/chart-attribute-styles":19,"../util/data.model.js":20,"../util/draw-axes.js":22,"../util/dressing.js":23,"../util/metadata.js":27}],11:[function(require,module,exports){
module.exports = {
    line: require('./line.js'),
    blank: require('./blank.js'),
    pie: require('./pie.js'),
    column: require('./column.js')
};

},{"./blank.js":9,"./column.js":10,"./line.js":12,"./pie.js":13}],12:[function(require,module,exports){
var d3 = require('d3');
var Axes = require('../util/draw-axes.js');
var interpolator = require('../util/line-interpolators.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../util/dressing.js');
var styler = require('../util/chart-attribute-styles');

//null values in the data are interpolated over, filter these out
//NaN values are represented by line breaks
function plotSeries(plotSVG, model, axes, series) {

    var data = model.data.map(function (d) {
        return {
            x: d[model.x.series.key],
            y: d[series.key] || d.values[0][series.key]
        };
    }).filter(function (d) {
        return (d.y !== null);
    });

    var line = d3.svg.line()
        .interpolate(interpolator.gappedLine)
        .x(function (d) { return axes.timeScale(d.x); })
        .y(function (d) { return axes.valueScale(d.y);});

    plotSVG.append('path')
        .datum(data)
        .attr('class', 'line ' + series.className)
        .attr('stroke-width', model.lineStrokeWidth)
        .attr('d', function (d) {
            //console.log('datum ', d);//todo: log function that can be mocked in tests
            return line(d);
        });
    styler(plotSVG);
}

function lineChart(g) {
    'use strict';

    var model = new DataModel('line',Object.create(g.data()[0]));
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
    axes.addTimeScale(model.units);
    axes.repositionAxis();

    var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = model.y.series.length;

    while (i--) {
        plotSeries(plotSVG, model, axes, model.y.series[i]);
    }
}

module.exports = lineChart;

},{"../util/chart-attribute-styles":19,"../util/data.model.js":20,"../util/draw-axes.js":22,"../util/dressing.js":23,"../util/line-interpolators.js":25,"../util/metadata.js":27,"d3":"d3"}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
//var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var styler = require('../util/chart-attribute-styles');

function lineKey(options) {
    'use strict';

    options = options || {};

    var width = 300;
    var strokeLength = 15;
    var lineHeight = 16;
    var strokeWidth = lineThickness(options.lineThickness);

    var charts = {
        'line' : addLineKeys,
        'column' : addColumnKeys
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

    function addLineKeys(keyItems, label){
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

    function addColumnKeys(keyItems, label){
        keyItems.append('rect').attr({
            'class': style,
            x: 1,
            y: -10,
            width: strokeLength,
            height: 10
        })
        .classed('key__column', true);

    }

    function key(g) {
        var addKey = charts[options.chartType];
        g = g.append('g').attr('class', 'key');
        var keyItems = g.selectAll('g').data(g.datum().filter(filter))
            .enter()
            .append('g').attr({
                'class': 'key__item',
                'transform': function (d, i) {
                    return 'translate(0,' + (lineHeight + i * lineHeight) + ')';
                }
            });

        addKey(keyItems, label);

        keyItems.append('text').attr({
            'class': 'key__label',
            x: strokeLength + 10
        }).text(label);

        styler(g);

    }

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

    return key;
}

module.exports = lineKey;

},{"../util/chart-attribute-styles":19,"../util/line-thickness.js":26}],16:[function(require,module,exports){
/*jshint -W084 */
//text area provides a wrapping text block of a given type
var d3 = require('d3');

function textArea() {
    'use strict';

    var xOffset = 0,
        yOffset = 0,
        width = 1000,
        lineHeight = 20,
        units = 'px', //pixels by default
        bounds;

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
    }


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

    area.yOffset = function (x) {
        if (!arguments.length) return yOffset;
        yOffset = x;
        return area;
    };

    area.xOffset = function (x) {
        if (!arguments.length) return yOffset;
        yOffset = x;
        return area;
    };

    return area;
}

module.exports = textArea;

},{"d3":"d3"}],17:[function(require,module,exports){
module.exports = {
    chart: require('./chart/index.js'),

    axis: require('./axis/index.js'),

    element: {
        seriesKey: require('./element/series-key.js'),
        textArea: require('./element/text-area.js')
    },

    util: {
        attributeStyler: require('./util/chart-attribute-styles.js'),
        dates: require('./util/dates.js')
    },

    version: require('./util/version')

};

},{"./axis/index.js":5,"./chart/index.js":11,"./element/series-key.js":15,"./element/text-area.js":16,"./util/chart-attribute-styles.js":19,"./util/dates.js":21,"./util/version":29}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied

var d3 = require('d3');

function applyAttributes(g, keepD3Styles) {
    var styleList = [
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
            'selector': '.axis path, .axis line',
            'attributes': {
                'shape-rendering': 'crispEdges',
                'fill': 'none'
            }
        }, {
            'selector': '.y.axis path.domain, .secondary path.domain, .secondary .tick line',
            'attributes': {
                'stroke': 'none'
            }
        },

        {
            'selector': '.y.axis .tick line',
            'attributes': {
                'stroke-dasharray': '2 2'
            }
        },
        {
            'selector': '.y.axis .origin line',
            'attributes': {
                'stroke': '#333',
                'stroke-dasharray': 'none'
            }
        }, {
            'selector': '.y.axis .origin.tick line',
            'attributes': {
                'stroke': '#333',
                'stroke-dasharray': 'none'
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
        }, {
            'selector': '.primary .tick line',
            'attributes': {
                'stroke': '#a7a59b'
            }
        }, {
            'selector': '.y.axis.right text',
            'attributes': {
                'text-anchor': 'start'
            }
        }, {
            'selector': '.y.axis.left text',
            'attributes': {
                'text-anchor': 'end'
            }
        }, {
            'selector': '.x.axis .primary path.domain',
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
                'stroke': '#af516c'
            }
        }, {
            'selector': '.line--series2',
            'attributes': {
                'stroke': '#ecafaf'
            }
        }, {
            'selector': '.line--series3',
            'attributes': {
                'stroke': '#d7706c'
            }
        }, {
            'selector': '.line--series4',
            'attributes': {
                'stroke': '#76acb8'
            }
        }, {
            'selector': '.line--series5',
            'attributes': {
                'stroke': '#81d0e6'
            }
        }, {
            'selector': '.line--series6',
            'attributes': {
                'stroke': '#4086b6'
            }
        }, {
            'selector': '.line--series7',
            'attributes': {
                'stroke': '#b8b1a9'
            }
        }, {
            'selector': 'path.accent, line.accent',
            'attributes': {
                'stroke': 'rgb(184,177,169)'
            }
        },
        //Columns
        {
            'selector': '.column, .key__column',
            'attributes': {
                'stroke': 'none'
            }
        }, {
            'selector': '.column--series1',
            'attributes': {
                'fill': '#af516c'
            }
        }, {
            'selector': '.column--series2',
            'attributes': {
                'fill': '#ecafaf'
            }
        }, {
            'selector': '.column--series3',
            'attributes': {
                'fill': '#d7706c'
            }
        }, {
            'selector': '.column--series4',
            'attributes': {
                'fill': '#76acb8'
            }
        }, {
            'selector': '.column--series5',
            'attributes': {
                'fill': '#81d0e6'
            }
        }, {
            'selector': '.column--series6',
            'attributes': {
                'fill': '#4086b6'
            }
        }, {
            'selector': '.column--series7',
            'attributes': {
                'fill': '#b8b1a9'
            }
        }, {
            'selector': 'path.accent, line.accent',
            'attributes': {
                'stroke': 'rgb(184,177,169)'
            }
        },
        //text
        {
            'selector': '.chart-title text, .chart-title tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 18,
                'fill': 'rgba(0, 0, 0, 0.8)'
            }
        }, {
            'selector': '.chart-subtitle text, .chart-subtitle tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }, {
            'selector': '.chart-source text, .chart-source tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 10,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }, {
            'selector': '.chart-footnote text, .chart-footnote tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }, {
            'selector': 'text.key__label',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }
    ];
    if (!keepD3Styles) {
        (g || d3).selectAll('*').attr('style', null);
    }
    styleList.forEach(function (style, i) {
        (g || d3).selectAll(style.selector).attr(style.attributes);
    });
    return true;
}

module.exports = applyAttributes;

},{"d3":"d3"}],20:[function(require,module,exports){
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

function groupedTimeDomain(model) {
    if (model.timeDomain) {
        return model.timeDomain;
    }
    return model.data.map(function (d) {
        return d[model.x.series.key];
    });
}

function timeDomain(model) {
    if (model.timeDomain) {
        return model.timeDomain;
    }
    return d3.extent(model.data, function (d) {
        return d[model.x.series.key];
    });
}

function valueDomain(model) {
    if (model.valueDomain) {
        return model.valueDomain;
    }
    var extents = setExtents(model);
    var domain = d3.extent(extents);
    if (!model.falseOrigin && domain[0] > 0) {
        domain[0] = 0;
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
        } else if (!isDate(s)) {
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
	var i=0;
	var firstDate;
	m.data = d3.nest()
		.key(function(d)  {
            firstDate = firstDate || d[m.x.series.key];
            var dateStr = [dateUtil.formatter[units[0]](d[m.x.series.key], i++, firstDate)];
            units[1] && dateStr.push(dateUtil.formatter[units[1]](d[m.x.series.key], i++, firstDate));
            return  dateStr.join(' ');
		})
		.entries(m.data);
	m.x.series.key = 'key';
	return m.data;
}

function needsGrouping(units){
    if (!units) return false;
    var isGroupingUnit = false;
    units.forEach(function(unit){
        var groupThis = ['quarterly', 'monthly', 'yearly'].indexOf(unit);
        isGroupingUnit = isGroupingUnit || (groupThis>-1);
    });
    return isGroupingUnit;
}

function Model(chartType, opts) {
    var classes = {
        line: ['line--series1', 'line--series2', 'line--series3', 'line--series4', 'line--series5', 'line--series6', 'line--series7', 'accent'],
        column: ['column--series1', 'column--series2', 'column--series3', 'column--series4', 'column--series5', 'column--series6', 'column--series7', 'accent']
    };
    var m = {
        //layout stuff
        chartType: chartType,
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
        hideSource: false,
        numberAxisOrient: 'left',
        margin: 2,
        lineThickness: undefined,
        x: {
            series: '&'
        },
        y: {
            series: []
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

    if(m.groupData && chartType == 'column'){
        m.data = groupDates(m, m.units);
		m.timeDomain = groupedTimeDomain(m);
	}else{
		m.timeDomain = timeDomain(m);
	}

	m.valueDomain = valueDomain(m);
	m.lineStrokeWidth = lineThickness(m.lineThickness);
	m.key = setKey(m);

    return m;
}

Model.prototype.error = function (err) {
    console.log('ERROR: ', err);
};
module.exports = Model;

},{"../util/aspect-ratios.js":18,"../util/dates.js":21,"../util/line-thickness.js":26,"../util/series-options.js":28,"d3":"d3"}],21:[function(require,module,exports){
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
    monthly: function (d, i) {
        return formatter.months(d, i) + ' ' + formatter.fullYears(d, i);
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

    hours: function (d, i) {
        return parseInt(d3.time.format('%H')(d)) + ':00';
    }
};

function unitGenerator(domain, simple) {	//which units are most appropriate
    var timeDif = domain[1].getTime() - domain[0].getTime();
    var dayLength = 86400000;
    var units;
    if (timeDif < dayLength * 2) {
        units = ['hours', 'days', 'months'];
    } else if (timeDif < dayLength * 60) {
        units = ['days', 'months'];
    } else if (timeDif < dayLength * 365.25) {
        units = ['months', 'years'];
    } else if (timeDif < dayLength * 365.25 * 15) {
        units = ['years'];
    } else if (timeDif < dayLength * 365.25 * 150) {
        units = ['decades'];
    } else if (timeDif < dayLength * 365.25 * 1000) {
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

module.exports = {
    formatter: formatter,
    unitGenerator: unitGenerator
};

},{"d3":"d3"}],22:[function(require,module,exports){
var d3 = require('d3');
var categoryAxis = require('../axis/category.js');
var dateAxis = require('../axis/date.js');
var numberAxis = require('../axis/number.js');
var dateFormatter = require('./dates').formatter;

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
    var showsAllLabels = this.svg.selectAll('.x.axis .primary line')[0].length === this.svg.selectAll('.x.axis .primary text')[0].length;
    var allPositiveValues = Math.min.apply(null, this.valueScale.domain()) >= 0;

    if (showsAllLabels && allPositiveValues && model.chartType == 'column') {
        model.tickSize = 0;
        this.svg.selectAll('.x.axis').remove();
        this.timeAxis.tickSize(0).scale(this.timeScale, this.units);
        this.svg.call(this.timeAxis);
    } else if (!showsAllLabels) { //todo: should/can this be in category.js?
        this.svg.selectAll('.x.axis').remove();
        this.timeAxis.scale(this.timeScale, [model.units[1]]);
        this.svg.call(this.timeAxis);
    }
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
    this.units = units;
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

Axes.prototype.extendedTicks = function () {
    var showsAllLabels = this.svg.selectAll('.x.axis .primary line')[0].length === this.svg.selectAll('.x.axis .primary text')[0].length;
    if (showsAllLabels) return;
    var model = this.model;
    var self = this;
    var extendedTicks_selector = ".x.axis .tick line[y2=\"" + (model.tickSize * this.tickExtender) + "\"]";
    var ticks_selector = ".x.axis .tick line";

    this.svg.selectAll(ticks_selector)
        .attr("y2", function (d) {
            var quarter = d.getMonth ? dateFormatter[model.units[0]](d) : d.toString();
            return (quarter.indexOf('Q1') === 0) ? (model.tickSize * self.tickExtender) : model.tickSize ;
        });
    var tickCount = this.svg.selectAll(ticks_selector)[0].length;
    var extendedCount = this.svg.selectAll(extendedTicks_selector)[0].length;
    if (extendedCount+2 >= tickCount){
        //take into account of first + last starting on something not q1
        this.svg.selectAll(extendedTicks_selector).attr("y2", model.tickSize);
    }
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

    this.columnWidth = this.getColumnWidth();
    this.svg.selectAll('*').remove();
    this.svg.call(this.vAxis);
    this.svg.call(this.timeAxis);

    if (model.groupData && model.tickSize>0) {
        this.rearrangeLabels();
        this.extendedTicks();
    }

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

},{"../axis/category.js":1,"../axis/date.js":3,"../axis/number.js":6,"./dates":21,"d3":"d3"}],23:[function(require,module,exports){
var textArea = require('../element/text-area.js');
var seriesKey = require('../element/series-key.js');
var ftLogo = require('../element/logo.js');

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function Dressing(svg, model) {
    // TODO: don't hard-code the fontsize, get from CSS somehow.
    // TODO: move calculation of lineheight to the textarea component;
    this.svg = svg;
    this.model = model;
    this.blockPadding = 8;
    this.defaultLineHeight = 1.2;
    this.titleFontSize = 18;
    this.footerLineHeight = 15;
    this.subtitleFontSize = 12;
    this.sourceFontSize = 10;
    this.halfLineStrokeWidth = Math.ceil(model.lineStrokeWidth / 2);

    this.headerHeight = 0;
    this.footerHeight = 0;
    this.sourceFontOffset = 0;
}

Dressing.prototype.addHeader = function () {
    this.addTitle();
    this.addSubTitle();
    this.addSeriesKey();
    this.setPosition();
};

Dressing.prototype.addFooter = function () {
    this.addFootNotes();
    this.addSource();
    this.setHeight();
    this.addLogo();
};

Dressing.prototype.addLogo = function () {
    var svg = this.svg;
    var model = this.model;

    var logo = svg.append('g').attr('class', 'chart-logo').call(ftLogo, model.logoSize);
    var heightOfFontDescenders = 3;
    var baselineOfLastSourceLine = model.height - getHeight(logo) - heightOfFontDescenders - this.getSourceFontOffset();

    logo.attr('transform', model.translate({
        left: model.width - model.logoSize,
        top: baselineOfLastSourceLine
    }));
};

Dressing.prototype.addSubTitle = function () {
    var svg = this.svg;
    var model = this.model;

    var subtitleLineHeight = this.defaultLineHeight;
    var subtitleLineHeightActual = Math.ceil(this.subtitleFontSize * subtitleLineHeight);
    var subtitleTextWrapper = textArea().width(model.contentWidth).lineHeight(subtitleLineHeightActual);
    var subtitle = svg.append('g').attr('class', 'chart-subtitle').datum(model.subtitle).call(subtitleTextWrapper);
    if (!this.subtitlePosition) {
        if (model.subtitle) {
            this.subtitlePosition = {top: this.headerHeight + this.subtitleFontSize, left: 0};
            this.headerHeight += (getHeight(subtitle) + this.blockPadding);
        } else {
            this.subtitlePosition = {top: this.headerHeight, left: 0};
        }
    }
    subtitle.attr('transform', model.translate(this.subtitlePosition));
};

Dressing.prototype.addTitle = function () {
    var svg = this.svg;
    var model = this.model;

    var titleLineHeight = this.defaultLineHeight;
    var titleLineHeightActual = Math.ceil(this.titleFontSize * titleLineHeight);
    var titleLineSpacing = titleLineHeightActual - this.titleFontSize;
    var titleTextWrapper = textArea().width(model.contentWidth).lineHeight(titleLineHeightActual);

    var title = svg.append('g').attr('class', 'chart-title').datum(model.title).call(titleTextWrapper);
    if (!this.titlePosition) {
        if (model.title) {
            this.titlePosition = {top: this.headerHeight + this.titleFontSize, left: 0};
            this.headerHeight += (getHeight(title) + this.blockPadding - titleLineSpacing);
        } else {
            this.titlePosition = {top: this.headerHeight, left: 0};
        }
    }
    title.attr('transform', model.translate(this.titlePosition));
};

Dressing.prototype.addSeriesKey = function () {
    var svg = this.svg;
    var model = this.model;

    if (!model.key) {
        return;
    }
    var chartKey = seriesKey({
        lineThickness: model.lineStrokeWidth,
        chartType: model.chartType
    })
        .style(function (d) {
            return d.value;
        })
        .label(function (d) {
            return d.key;
        });
    var entries = model.y.series.map(function (d) {
        return {key: d.label, value: d.className};
    });

    var svgKey = svg.append('g').attr('class', 'chart__key').datum(entries).call(chartKey);
    if (!this.keyPosition) {
        this.keyPosition = {top: this.headerHeight, left: this.halfLineStrokeWidth};
        this.headerHeight += (getHeight(svgKey) + this.blockPadding);
    }
    svgKey.attr('transform', model.translate(this.keyPosition));
};


Dressing.prototype.addFootNotes = function () {
    var svg = this.svg;
    var model = this.model;

    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var footnotes = svg.append('g').attr('class', 'chart-footnote').datum(model.footnote).call(text);
    var footnotesHeight = getHeight(footnotes);
    var currentPosition = model.chartPosition.top + model.chartHeight;
    footnotes.attr('transform', model.translate({top: currentPosition + this.footerLineHeight + this.blockPadding}));
    this.footerHeight += footnotesHeight;
};

Dressing.prototype.addSource = function () {
    var svg = this.svg;
    var model = this.model;

    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var sourceLineHeight = this.defaultLineHeight;
    var sourceLineHeightActual = this.sourceFontSize * sourceLineHeight;
    var source = svg.append('g').attr('class', 'chart-source').datum(model.sourcePrefix + model.source).call(text);
    var sourceHeight = getHeight(source);
    var currentPosition = model.chartPosition.top + model.chartHeight;

    source.attr('transform', model.translate({top: this.footerHeight + currentPosition + sourceLineHeightActual + (this.blockPadding * 2)}));
    if (model.hideSource) {
        source.remove();
        sourceHeight = 0;
    }
    this.sourceFontOffset = sourceLineHeightActual - this.sourceFontSize;
    this.footerHeight += sourceHeight;
};

Dressing.prototype.getSourceFontOffset = function () {
    return this.sourceFontOffset;
};

Dressing.prototype.setHeight = function () {
    var model = this.model;
    var footerHeight = Math.max(this.footerHeight + (this.blockPadding * 2), model.logoSize) + this.blockPadding;
    if (!model.height) {
        model.height = this.headerHeight + model.chartHeight + footerHeight;
    } else {
        model.chartHeight = model.height - this.headerHeight - footerHeight;
        if (model.chartHeight < 0) {
            model.error({
                message: 'calculated plot height is less than zero'
            });
        }
    }
    this.svg.attr('height', Math.ceil(model.height));
};

Dressing.prototype.setPosition = function () {
    this.model.chartPosition = {
        top: this.headerHeight + this.halfLineStrokeWidth,
        left: (this.model.numberAxisOrient === 'left' ? 0 : this.halfLineStrokeWidth)
    };
};

module.exports = Dressing;

},{"../element/logo.js":14,"../element/series-key.js":15,"../element/text-area.js":16}],24:[function(require,module,exports){
var d3 = require('d3');

module.exports = {
    intersection: function (a, b) {
        var overlap = (
        a.left <= b.right &&
        b.left <= a.right &&
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

},{"d3":"d3"}],25:[function(require,module,exports){
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

},{"d3":"d3"}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
module.exports = "0.1.1";
},{}],"number-axes":[function(require,module,exports){
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var margin = {
    top: 20, left: 50, bottom: 70, right: 50
}
var axesDefinitions = [
    {
        title: '6 or less',
        simple: false,
        start: 11.2,
        end: 7
    },
    {
        title: 'more than 6',
        simple: false,
        start: 356,
        end: 0
    },
    {
        title: '6 or less (simple)',
        simple: true,
        start: 11.2,
        end: 7
    },
    {
        title: 'more than 6 (simple)',
        simple: true,
        start: 356,
        end: 0
    },
    {
        title: '6 or less',
        simple: false,
        orient: 'bottom',
        start: 7,
        end: 11.2
    },
    {
        title: '6 or less (simple)',
        simple: true,
        orient: 'bottom',
        start: 7,
        end: 11.2
    },
    {
        title: 'above zero, below 3, decimals',
        simple: false,
        start: 2.95,
        end: 0.2
    }];

function createAxesDefArrayOfWidth(axisWidth, axesDefinitionArray) {

    var sizedAxesDefinitions = [];
    axesDefinitionArray.forEach(function (axis) {
        var sizedAxis = {
            title: axis.title,
            orient: axis.orient,
            simple: axis.simple,
            scale: d3.scale.linear()
                .range([0, axisWidth])
                .domain([axis.start, axis.end])
        };
        sizedAxesDefinitions.push(sizedAxis);
    });
    return sizedAxesDefinitions;
}

function renderAxesArrayIntoDiv(div, axesDefinitionArray) {
    var divs = d3.select('#views')
        .selectAll('div')
        .data(axesDefinitionArray)
        .enter().append('div')
        .attr('class', 'axis-test');

    divs.append('h2')
        .text(function (d) {
            return d.title
        });

    divs.append('svg')
        .attr('width', function (d) {
            if (d.orient) {
                var r = d.scale.range();
                return r[0] + r[1] + margin.bottom
            }
            return margin.left + margin.right
        })
        .attr('class', 'ft-chart')
        .attr('height', function (d) {
            if (d.orient) {
                return margin.bottom
            }
            var r = d.scale.range();
            return r[0] + r[1] + margin.bottom
        })
        .each(function (d, i) {
            var axis = oCharts.axis.number()
                .simple(d.simple)
                .scale(d.scale);
            if (d.orient) {
                axis.orient(d.orient);
            }

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);
        });
}

module.exports = {
    init: function () {
        renderAxesArrayIntoDiv('#views', createAxesDefArrayOfWidth(200, axesDefinitions));
    }
};

},{"../../src/scripts/o-charts":17,"d3":"d3"}]},{},["number-axes"]);
