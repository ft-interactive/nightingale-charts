var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var styler = require('../util/chart-attribute-styles');

function lineKey(options) {
    'use strict';

    options = options || {};

    var width = 300;
    var strokeLength = 15;
    var lineHeight = 16;
    var strokeWidth = lineThickness(options.lineThickness);

    var style = function (d) {
        return d.style;
    };

    var label = function (d) {
        return d.label;
    };

    var filter = function () {
        return true;
    };

    function key(g) {
        g = g.append('g').attr('class', 'key');
        var keyItems = g.selectAll('g').data(g.datum().filter(filter))
            .enter()
            .append('g').attr({
                'class': 'key__item',
                'transform': function (d, i) {
                    return 'translate(0,' + (lineHeight + i * lineHeight) + ')';
                }
            });

        keyItems.append('line').attr({
            'class': style,
            x1: 1,
            y1: -5,
            x2: strokeLength,
            y2: -5
        })
            .attr('stroke-width', strokeWidth)
            .classed('key__line', true);

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
