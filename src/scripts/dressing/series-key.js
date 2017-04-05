const d3 = require('d3');
const lineThickness = require('../util/line-thickness.js');
const themes = require('../themes');

function seriesKey(options) {


    options = options || {};

    let theme = options.theme;
    let columns = options.keyColumns || 1;
    let width = options.keyWidth || options.width || 300;
    const strokeLength = 15;
    let lineHeight = 16;
    const lineAttr = themes.check(theme, 'lines').attributes;
    const colAttr = themes.check(theme, 'columns').attributes;
    const strokeWidth = lineThickness(options.lineThickness);
    let colours = [
        '#af516c', '#ecafaf', '#d7706c', '#76acb8', '#7fd8f5', '#3d7ab3', '#b8b1a9'
    ];
    const padding = 0;
    let paddingY = 0;
    let paddingX = 0;
    const xOffset = 0;
    const yOffset = 0;
    let background = false;
    let attr = {};

    const charts = {
        'line' : addLineKeys,
        'column' : addColumnKeys,
        'bar' : addColumnKeys
    };

    let style = function (d) {
        return d.style;
    };

    let label = function (d) {
        return d.label;
    };

    const filter = function () {
        return true;
    };

    function addBackgroundColor (keyItems){
        if (!background) return;
        const parent = keyItems.node().parentNode;
        const box = parent.getBoundingClientRect();
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
        const innerWidth = width - (paddingX * 2);
        let columnWidth = 10;
        keyItems.each(function(d, i){
            if (i === keyItems[0].length - 1) return;
            columnWidth = Math.max(this.getBoundingClientRect().width, columnWidth) + 10;
        });
        while (columnWidth * columns > innerWidth && columns>1) columns --;

        keyItems.attr({
            'class':'key__item',
            'transform': function (d, i) {
                const column = (i % columns);
                const row = Math.ceil((i + 1) / columns);
                const x = column * (columnWidth + 8) + paddingX;
                const y = (row * lineHeight) + paddingY;
                return 'translate(' + x + ',' + y + ')';
            }
        });
    }

    function key(g) {
        const gKey = g.append('g').attr('class', 'key');
        const keyItems = gKey.selectAll('g')
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
        for (const prop in attr){
            if (key[prop]) key[prop](obj[prop]);
        }
        return key;
    };


    return key;
}

module.exports = seriesKey;
