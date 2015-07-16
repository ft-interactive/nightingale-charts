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
