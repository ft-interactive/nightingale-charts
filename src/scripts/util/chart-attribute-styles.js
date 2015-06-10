// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied

var d3 = require('d3');
var colours = require('./colours');

function applyAttributes(g, keepD3Styles) {
    var styleList = [
        //general
        {
            'selector': 'svg text',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'fill': '#a7a59b',
                'stroke': 'none'
            }
        },
        //axes
        {
            'selector': '.axis path, .axis line',
            'attributes': {
                'shape-rendering': 'crispEdges',
                'fill': 'none'
            }
        }, {
            'selector': '.axis--dependent path.domain, .secondary path.domain, .secondary .tick line',
            'attributes': {
                'stroke': 'none'
            }
        },

        {
            'selector': '.axis--dependent .tick line',
            'attributes': {
                'stroke-dasharray': '2 2'
            }
        },
        {
            'selector': '.axis--dependent .origin line',
            'attributes': {
                'stroke': '#333',
                'stroke-dasharray': 'none'
            }
        }, {
            'selector': '.axis--dependent .origin.tick line',
            'attributes': {
                'stroke': '#333',
                'stroke-dasharray': 'none'
            }
        }, {
            'selector': '.primary .tick text',
            'attributes': {
                'font-size': 12,
                'fill': '#757470'
            }
        }, {
            'selector': '.secondary .tick text',
            'attributes': {
                'font-size': 10,
                'fill': '#757470'
            }
        }, {
            'selector': '.primary .tick line',
            'attributes': {
                'stroke': '#a7a59b'
            }
        }, {
            'selector': '.y.axis.right text',
            'attributes': {
                'text-anchor': 'start'
            }
        }, {
            'selector': '.y.axis.left text',
            'attributes': {
                'text-anchor': 'end'
            }
        }, {
            'selector': '.axis--independent .primary path.domain',
            'attributes': {
                'stroke': '#757470'
            }
        },
        //lines
        {
            'selector': 'path.line, line.key__line',
            'attributes': {
                'fill': 'none',
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round'
            }
        }, {
            'selector': '.line--series1',
            'attributes': {
                'stroke': colours.line[0]
            }
        }, {
            'selector': '.line--series2',
            'attributes': {
                'stroke': colours.line[1]
            }
        }, {
            'selector': '.line--series3',
            'attributes': {
                'stroke': colours.line[2]
            }
        }, {
            'selector': '.line--series4',
            'attributes': {
                'stroke': colours.line[3]
            }
        }, {
            'selector': '.line--series5',
            'attributes': {
                'stroke': colours.line[4]
            }
        }, {
            'selector': '.line--series6',
            'attributes': {
                'stroke': colours.line[5]
            }
        }, {
            'selector': '.line--series7',
            'attributes': {
                'stroke': colours.line[6]
            }
        },
        //Columns
        {
            'selector': '.column, .key__column, .bar, .key__bar',
            'attributes': {
                'stroke': 'none'
            }
        }, {
            'selector': '.column--series1, .bar--series1',
            'attributes': {
                'fill': colours.area[0]
            }
        }, {
            'selector': '.column--series2, .bar--series2',
            'attributes': {
                'fill': colours.area[1]
            }
        }, {
            'selector': '.column--series3, .bar--series3',
            'attributes': {
                'fill': colours.area[2]
            }
        }, {
            'selector': '.column--series4, .bar--series4',
            'attributes': {
                'fill': colours.area[3]
            }
        }, {
            'selector': '.column--series5, .bar--series5',
            'attributes': {
                'fill': colours.area[4]
            }
        }, {
            'selector': '.column--series6, .bar--series6',
            'attributes': {
                'fill': colours.area[5]
            }
        }, {
            'selector': '.column--series7, .bar--series7',
            'attributes': {
                'fill': colours.area[6]
            }
        }, {
            'selector': 'path.accent, line.accent, rect.accent',
            'attributes': {
                'stroke': colours.accent
            }
        }, {
            'selector': '.series text.null-label',
            'attributes': {
                'text-anchor': 'middle',
                'font-size': 10,
                'fill': 'rgba(0, 0, 0, 0.4)'
            }
        },

        //text
        {
            'selector': '.chart-title text, .chart-title tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 18,
                'fill': 'rgba(0, 0, 0, 0.8)'
            }
        }, {
            'selector': '.chart-subtitle text, .chart-subtitle tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }, {
            'selector': '.chart-source text, .chart-source tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 10,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }, {
            'selector': '.chart-footnote text, .chart-footnote tspan',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }, {
            'selector': 'text.key__label',
            'attributes': {
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12,
                'fill': 'rgba(0, 0, 0, 0.5)'
            }
        }
    ];
    if (!keepD3Styles) {
        (g || d3).selectAll('*').attr('style', null);
    }
    styleList.forEach(function (style, i) {
        (g || d3).selectAll(style.selector).attr(style.attributes);
    });
    return true;
}

module.exports = applyAttributes;
