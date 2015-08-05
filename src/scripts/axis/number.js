//this is wrapper for d3.svg.axis
//for a standard FT styled numeric axis
//usually these are vertical

var d3 = require('d3');
var numberLabels = require('./number.labels');
var numberScales = require('./number.scale');

function numericAxis() {
    'use strict';

    var config = {
        axes: d3.svg.axis().orient('left').tickSize(5, 0),
        tickSize: 5,
        lineHeight: 16,
        userTicks: [],
        hardRules: [0],
        yOffset: 0,
        xOffset: 0,
        reverse: false,
        simple: false,
        noLabels: false,
        pixelsPerTick: 100,
        tickExtension: 0,
        attr: {
            ticks: {
                'stroke': 'rgba(0, 0, 0, 0.1)',
                'shape-rendering': 'crispEdges'
            },
            origin: {
                'stroke': 'rgba(0, 0, 0, 0.3)',
                'stroke-dasharray': 'none'
            },
            primary:{
                fill:'#757470',
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12
            },
            secondary:{}
        }
    };

    function isVertical(){
        return ['right','left'].indexOf(config.axes.orient())>-1;
    }

    function axis(g) {
        var orientOffset = (config.axes.orient() === 'right') ? -config.axes.tickSize() : 0;
        config.attr.primary['text-anchor'] = isVertical() ? 'end' : 'start';
        config.attr.secondary['text-anchor'] = isVertical() ? 'end' : 'start';

        g = g.append('g').attr('transform', 'translate(' + (config.xOffset + orientOffset) + ',' + config.yOffset + ')');
        numberLabels.render(g, config);
        if (config.noLabels) {
            g.selectAll('text').remove();
        }
    }

    axis.tickExtension = function (int) { // extend the axis ticks to the right/ left a specified distance
        if (!arguments.length) return config.tickExtension;
        config.tickExtension = int;
        return axis;
    };

    axis.tickSize = function (int) {
        if (!arguments.length) return config.axes.tickSize();
        config.axes.tickSize(-int);
        return axis;
    };

    axis.ticks = function (int) {
        if (!arguments.length) return config.axes.ticks();
        if (int.length > 0) {
            config.userTicks = int;
        }
        return axis;
    };

    axis.orient = function (string) {
        if (!arguments.length) return config.axes.orient();
        if (string) {
            config.axes.orient(string);
        }
        return axis;
    };

    axis.reverse = function (bool) {
        if (!arguments.length) return config.reverse;
        config.reverse = bool;
        if (config.reverse){
            config.axes.scale().domain(config.axes.scale().domain().reverse());
        }
        return axis;
    };

    axis.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return axis;
    };

    axis.pixelsPerTick = function (int) {
        if (!arguments.length) return config.pixelsPerTick;
        config.pixelsPerTick = int;
        return axis;
    };

    axis.scale = function (x) {
        if (!arguments.length) return config.axes.scale();
        config.axes.scale(x);
        axis.reverse(config.reverse);
        if (config.userTicks.length > 0) {
            config.axes.tickValues(config.userTicks);
        } else {
            var customTicks = numberScales.customTicks(config);
            config.axes.tickValues(customTicks);
        }
        config.reverse = false; //only reverse once, even if scale is called twice i.e. in redraw
        return axis;
    };

    axis.hardRules = function (int) { //this allows you to set which lines will be solid rather than dotted, by default it's just zero and the bottom of the chart
        if (!arguments.length) return config.hardRules;
        config.hardRules = int;
        return axis;
    };

    axis.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return axis;
    };

    axis.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return axis;
    };

    axis.tickFormat = function (format) {
        if (!arguments.length) return config.axes.tickFormat();
        config.axes.tickFormat(format);
        return axis;
    };

    axis.noLabels = function (bool) {
        if (!arguments.length) return config.noLabels;
        config.noLabels = bool;
        return axis;
    };

    axis.attrs = function (obj, target) {
        if (!arguments.length) return config.attr[target || 'primary'];
        if (typeof obj !== "undefined") config.attr[target || 'primary'] = obj;
        //for (var prop in config.attr){
        //    if (axis[prop]) axis[prop](obj[prop]);
        //}
        return axis;
    };

    return axis;
}

module.exports = numericAxis;
