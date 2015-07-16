var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var themes = require('../themes');

function seriesKey(options) {
    'use strict';

    options = options || {};

    var theme = options.theme;
    var columns = options.keyColumns || 1;
    var width = options.keyWidth || options.width || 300;
    var strokeLength = 15;
    var lineHeight = 16;
    var lineAttr = themes.check(theme, 'lines').attributes;
    var colAttr = themes.check(theme, 'columns').attributes;
    var strokeWidth = lineThickness(options.lineThickness);
    var colours = [
        '#af516c', '#ecafaf', '#d7706c', '#76acb8', '#7fd8f5', '#3d7ab3', '#b8b1a9'
    ];
    var padding = 0;
    var paddingY = 0;
    var paddingX = 0;
    var xOffset = 0;
    var yOffset = 0;
    var background = false;
    var attr = {};

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

    function addBackgroundColor (keyItems){
        if (!background) return;
        var parent = keyItems.node().parentNode;
        var box = parent.getBoundingClientRect();
        return d3.select(parent).insert('rect', ':first-child')
            .attr({
                'class': 'background',
                'fill': background,
                'x': 0,
                'y': 5,
                'width': box.width + (paddingX * 2),
                'height': box.height + (paddingY * 2),
                'transform': 'translate(' + xOffset +','+ yOffset +')'
            });
    }

    function addLineKeys(keyItems, isBorder){
        if (lineAttr.border && !isBorder){
            addLineKeys(keyItems, true).attr(lineAttr)
                .attr({
                    'stroke': lineAttr.border,
                    'stroke-width': strokeWidth * 2,
                    'class': 'key__border'
                });
        }
        return keyItems.append('line').attr(lineAttr).attr({
            'class': style,
            x1: 1,
            y1: -5,
            x2: strokeLength,
            y2: -5,
            'stroke-width':strokeWidth,
            'stroke':function (d, i) {
                return colours[i];
            }
        }).classed('key__line', true);
    }

    function addColumnKeys(keyItems){
        keyItems.append('rect').attr(colAttr).attr({
            'class': style,
            x: 1,
            y: -10,
            width: strokeLength,
            height: 10,
            'fill':function (d, i) {
                return colours[i];
            }
        }).classed('key__column', true);
    }

    function addKey(keyItems){
        charts[options.chartType](keyItems);
        attr.x = strokeLength + 10;
        keyItems.append('text').attr(attr).text(label);
    }

    function positionKey(keyItems){
        var innerWidth = width - (paddingX * 2);
        var columnWidth = 10;
        keyItems.each(function(d, i){
            if (i == keyItems[0].length-1) return;
            columnWidth = Math.max(this.getBoundingClientRect().width, columnWidth) + 10;
        });
        while (columnWidth * columns > innerWidth && columns>1) columns --;

        keyItems.attr({
            'class':'key__item',
            'transform': function (d, i) {
                var column = (i % columns);
                var row = Math.ceil((i + 1) / columns);
                var x = column * (columnWidth + 8) + paddingX;
                var y = (row * lineHeight) + paddingY;
                return 'translate(' + x + ',' + y  + ')';
            }
        });
    }

    function key(g) {
        var gKey = g.append('g').attr('class', 'key');
        var keyItems = gKey.selectAll('g')
            .data(g.datum().filter(filter))
            .enter()
            .append('g');

        addKey(keyItems);
        positionKey(keyItems);
        addBackgroundColor(keyItems);
    }

    key.colours = function (col) {
        if (!arguments.length) return colours;
        if (col) colours = col;
        return key;
    };

    key.theme = function (themeUpdate) {
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

    key.lineHeight = key['line-height'] = function (x) {
        if (!arguments.length) return lineHeight;
        lineHeight = x;
        return key;
    };

    key.columns = function (x) {
        if (!arguments.length) return columns;
        columns = x;
        return key;
    };

    key.background = function (color) {
        if (!arguments.length) return background;
        background = color;
        return key;
    };

    key['padding-x'] = function (pad) {
        if (!arguments.length) return paddingX;
        paddingX = pad;
        return key;
    };

    key['padding-y'] = function (pad) {
        if (!arguments.length) return paddingY;
        paddingY = pad;
        return key;
    };

    key.padding = function (pad) {
        if (!arguments.length) return padding;
        paddingX = pad;
        paddingY = pad;
        return key;
    };

    key.attrs = function (obj) {
        if (!arguments.length) return attr;
        if (typeof obj !== "undefined") attr = obj;
        for (var prop in attr){
            if (key[prop]) key[prop](obj[prop]);
        }
        return key;
    };


    return key;
}

module.exports = seriesKey;
