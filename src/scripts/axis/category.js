var d3 = require('d3');
var styler = require('../util/chart-attribute-styles');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var timeDiff = dates.timeDiff;

function categoryAxis() {

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
        dataType: false,
        keepD3Style: true
    };

    function render(g) {

        g = g.append('g').attr('transform', 'translate(' + config.xOffset + ',' + config.yOffset + ')');

        g.append('g').attr('class', 'x axis').each(function () {
            var g = d3.select(this);
            labels.add(g, config);
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

    render.dataType = function (bool) {
        if (!arguments.length) return config.dataType;
        config.dataType = bool;
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
