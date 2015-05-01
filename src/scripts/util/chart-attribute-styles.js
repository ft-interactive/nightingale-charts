// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied

var d3 = require('d3');

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
            'selector': '.y.axis path.domain, .secondary path.domain, .secondary .tick line',
            'attributes': {
                'stroke': 'none'
            }
        },

        {
            'selector': '.y.axis .tick line',
            'attributes': {
                'stroke-dasharray': '2 2'
            }
        },
        {
            'selector': '.y.axis .origin line',
            'attributes': {
                'stroke': '#333',
                'stroke-dasharray': 'none'
            }
        }, {
            'selector': '.y.axis .origin.tick line',
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
            'selector': '.x.axis .primary path.domain',
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
                'stroke': '#af516c'
            }
        }, {
            'selector': '.line--series2',
            'attributes': {
                'stroke': '#ecafaf'
            }
        }, {
            'selector': '.line--series3',
            'attributes': {
                'stroke': '#d7706c'
            }
        }, {
            'selector': '.line--series4',
            'attributes': {
                'stroke': '#76acb8'
            }
        }, {
            'selector': '.line--series5',
            'attributes': {
                'stroke': '#81d0e6'
            }
        }, {
            'selector': '.line--series6',
            'attributes': {
                'stroke': '#4086b6'
            }
        }, {
            'selector': '.line--series7',
            'attributes': {
                'stroke': '#b8b1a9'
            }
        }, {
            'selector': 'path.accent, line.accent',
            'attributes': {
                'stroke': 'rgb(184,177,169)'
            }
        },
        //Columns
        {
            'selector': '.column, .key__column',
            'attributes': {
                'stroke': 'none'
            }
        }, {
            'selector': '.column--series1',
            'attributes': {
                'fill': '#af516c'
            }
        }, {
            'selector': '.column--series2',
            'attributes': {
                'fill': '#ecafaf'
            }
        }, {
            'selector': '.column--series3',
            'attributes': {
                'fill': '#d7706c'
            }
        }, {
            'selector': '.column--series4',
            'attributes': {
                'fill': '#76acb8'
            }
        }, {
            'selector': '.column--series5',
            'attributes': {
                'fill': '#81d0e6'
            }
        }, {
            'selector': '.column--series6',
            'attributes': {
                'fill': '#4086b6'
            }
        }, {
            'selector': '.column--series7',
            'attributes': {
                'fill': '#b8b1a9'
            }
        }, {
            'selector': 'path.accent, line.accent',
            'attributes': {
                'stroke': 'rgb(184,177,169)'
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
