var d3 = require('d3');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var dateScale = require('./date.scale.js');
var timeDiff = dates.timeDiff;

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
        showDomain: false,
        attr: {
            ticks: {
                'stroke': 'rgba(0, 0, 0, 0.3)',
                'shape-rendering': 'crispEdges'
            },
            primary: {
                fill:'#757470',
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12
            },
            secondary: {},
            xAxisLabel: {
              'text-anchor': 'start'
            },
            yAxisLabel: {
              'text-anchor': 'end'
            },
            yAxisLine: {}
        }
    };

    function isVertical(){
        if (!config.axes.length) return true; //todo: log error. no axis
        return ['right','left'].indexOf(config.axes[0].orient())>-1;
    }

    function render(g) {

        var lineChartTextAnchor = isVertical() ? 'end' : 'start';

        if(config.attr['chart-type'] === 'line') {
          lineChartTextAnchor = isVertical() ? config.attr.yAxisLabel['text-anchor'] : config.attr.xAxisLabel['text-anchor'];
        }

        config.attr.primary['text-anchor'] = lineChartTextAnchor;
        config.attr.secondary['text-anchor'] = isVertical() ? 'end' : 'start';

        g = g.append('g').attr('transform', 'translate(' + config.xOffset + ',' + config.yOffset + ')');
        g.append('g').attr('class', 'x axis axis--independent axis--date').each(function () {
            labels.add(d3.select(this), config);
        });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
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

    render.orient = function (string) {
        if (!arguments.length) return config.axes[0].orient();
        if (!config.axes.length) return render;
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

    render.attrs = function (obj, target) {
        if (!arguments.length) return config.attr[target || 'primary'];
        if (typeof obj !== "undefined") config.attr[target || 'primary'] = obj;
        //for (var prop in config.attr){
        //    if (render[prop]) render[prop](obj[prop]);
        //}
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
