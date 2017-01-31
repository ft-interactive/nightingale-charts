/*jshint -W084 */
//text area provides a wrapping text block of a given type
var d3 = require('d3');

function textArea() {

    var xOffset = 0,
        yOffset = 0,
        paddingX = 0,
        paddingY = 0,
        align = 'left',
        float = 'left',
        attr = {},
        width = 1000,
        lineHeight = 20,
        units = 'px', //pixels by default
        bounds,
        fill = false,
        background = false;

    function createBackgroundColor (g, viewBox, translate){
        return g.insert('rect', ':first-child')
            .attr({
                'class': 'background',
                'fill': background,
                'x': viewBox[0] * 2,
                'y': viewBox[1] * 0.85,// (i.e. -0.25em)
                'width': viewBox[2],
                'height': viewBox[3],
                'transform': 'translate(' +translate[0]+','+ translate[1]+')'
            });
    }

    function wrap(text, width) {
        var innerWidth = width - (paddingX * 2);
        var lines = 1;
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
                .attr('x', paddingX)
                .attr('y', y + paddingY )
                .attr('dy', dy + units);
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > innerWidth) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    lineNumber++;
                    var newY = (lineNumber * lineHeight) + paddingY;
                    tspan = text.append('tspan')
                        .attr('x', paddingX)
                        .attr('y', + newY + units)
                        .text(word);
                }
            }
            lines = lineNumber+1;
        });
        if (align === 'right' || float === 'right'){
            text.selectAll('tspan').each(function(d,i){
                var xPosRounded = Math.round(innerWidth - this.getComputedTextLength());
                d3.select(this).attr('x', xPosRounded);
            });
        }
        if (background){
            var d3El = d3.select(text.node().parentNode);
            var fillHeight = text.node().getBoundingClientRect().height + (paddingY * 2);
            fillHeight = Math.max(fillHeight, (lineHeight * lines)  + (paddingY * 2));
            var viewBox = [0, 0 - lineHeight, width, fillHeight];
            var translate = [xOffset, yOffset];
            createBackgroundColor(d3El, viewBox, translate);
        }
    }

    function area(g, accessor) {
        if (!accessor) {
            accessor = function (d) { return d; };
        }
        g.append('text').text(accessor).attr(attr).call(wrap, width);
    }

    area.bounds = function () {
        return bounds;
    };

    area.units = function (x) { //px, em, rem
        if (!arguments.length) return units;
        units = x;
        return area;
    };

    area['line-height'] = function (h) { //pixels by default
        if (!arguments.length) return lineHeight;
        if (typeof h !== "undefined") lineHeight = h;
        return area;
    };

    area.width = function (x) {
        if (!arguments.length) return width;
        width = x;
        return area;
    };

    area.yOffset = function (y) {
        if (!arguments.length) return yOffset;
        yOffset = y;
        return area;
    };

    area.xOffset = function (x) {
        if (!arguments.length) return xOffset;
        xOffset = x;
        return area;
    };

    area.fill = function (bool) {
        if (!arguments.length) return fill;
        fill = bool;
        return area;
    };

    area.background = function (color) {
        if (!arguments.length) return background;
        background = color;
        return area;
    };

    area.align = function (a) {
        if (!arguments.length) return align;
        if (typeof a !== "undefined") align = a;
        return area;
    };

    area.float = function (a) {
        if (!arguments.length) return float;
        if (typeof a !== "undefined") float = a;
        return area;
    };

    area.padding = function (pad) {
        if (!arguments.length) return [paddingX, paddingY];
        if (typeof pad !== "undefined"){
            paddingX = pad;
            paddingY = pad;
        }
        return area;
    };

    area['padding-x'] = function (pad) {
        if (!arguments.length) return paddingX;
        if (typeof pad !== "undefined") paddingX = pad;
        return area;
    };

    area['padding-y'] = function (pad) {
        if (!arguments.length) return paddingY;
        if (typeof pad !== "undefined") paddingY = pad;
        return area;
    };

    area.attrs = function (obj) {
        if (!arguments.length) return attr;
        if (typeof obj !== "undefined") attr = obj;
        for (var prop in attr){
            if (area[prop]) area[prop](obj[prop]);
        }
        return area;
    };

    return area;
}

module.exports = textArea;
