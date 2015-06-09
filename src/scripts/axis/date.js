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

        g.append('g').attr('class', 'x axis axis--independent').each(function () {
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
