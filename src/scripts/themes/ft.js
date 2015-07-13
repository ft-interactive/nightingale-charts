var colours = require('./colours');

module.exports = [
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
        'selector': '.axis path, .axis line, .axis .tick',
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
            'stroke-dasharray': '2 2',
            'stroke': 'rgba(0, 0, 0, 0.1)'
        }
    },
    {
        'selector': '.primary .origin line, .axis--independent .primary .tick line',
        'attributes': {
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-dasharray': 'none'
        }
    }, {
        'selector': '.axis',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'fill': 'none',
            'stroke': 'rgba(0, 0, 0, 0.5)'
        }
    }, {
        'selector': '.axis text',
        'attributes': {
            'stroke': 'none',
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    }, {
        'selector': '.x.axis.axis--category text',
        'attributes': {
            'text-anchor': 'middle'
        }
    }, {
        'selector': '.y.axis text',
        'attributes': {
            'text-anchor': 'end'
        }
    }, {
        'selector': '.x.axis.axis--number text, .x.axis.axis--date text, .y.axis.right text',
        'attributes': {
            'text-anchor': 'start'
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
    {   'id': 'chart-title',
        'selector': '.chart-title text, .chart-title tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 18,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'selector': '.chart-subtitle text, .chart-subtitle tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'dressing-source',
        'selector': '.chart-source text, .chart-source tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'dressing-footnote',
        'selector': '.chart-footnote text, .chart-footnote tspan',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 15,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'key-label',
        'selector': 'text.key__label',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': 'rgba(0, 0, 0, 0.5)'
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
    }
];
