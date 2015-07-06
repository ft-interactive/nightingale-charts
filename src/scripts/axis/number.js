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
