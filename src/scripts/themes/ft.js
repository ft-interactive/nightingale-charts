var colours = {
    line: [
        '#af516c', '#ecafaf', '#d7706c', '#76acb8', '#7fd8f5', '#3d7ab3', '#b8b1a9'
    ],
    column: [
        '#bb6d82', '#ecafaf', '#d7706c', '#cb9f8c', '#b07979', '#ccc2c2', '#8f7d95', '#b8b1a9'
    ],
    bar: [
        '#bb6d82', '#ecafaf', '#d7706c', '#cb9f8c', '#b07979', '#ccc2c2', '#8f7d95', '#b8b1a9'
    ],
    accent: '#9e2f50'
};

module.exports.theme = [
    //general
    {
        'id': 'svg',
        'selector': 'svg',
        'attributes': {
            'background': '#fff1e0'
        }
    },
    {
        'selector': 'svg text',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
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
        'id': 'axis-text',
        'selector': '.axis text',
        'attributes': {
            'font-size': 12,
            'font-family': 'BentonSans, sans-serif',
            'stroke': 'none',
            'fill': '#757470'
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
    }, {
        'selector': '.axis .secondary text',
        'attributes': {
            'font-size': 10,
            'fill': '#757470'
        }
    },
    //lines
    {
        'id': 'lines',
        'selector': 'path.line, line.key__line',
        'attributes': {
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
        }
    },
    ////Columns
    //{   'id': 'columns',
    //    'selector': '.column, .key__column',
    //    'attributes': {
    //        'stroke': 'none'
    //    }
    //},
    ////Bars
    //{   'id': 'bars',
    //    'selector': '.column, .key__column',
    //    'attributes': {
    //        'stroke': 'none'
    //    }
    //},
    {
        'selector': 'path.accent, line.accent, rect.accent',
        'attributes': {
            'stroke': colours.accent
        }
    }, {
        'id': 'null-label',
        'selector': '.series text.null-label',
        'attributes': {
            'text-anchor': 'middle',
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 0.4)'
        }
    },

    //text
    {   'id': 'chart-title',
        'selector': '.chart-title text',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 18,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'selector': '.chart-subtitle text',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'chart-source',
        'selector': '.chart-source text',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'chart-footnote',
        'selector': '.chart-footnote text',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 15,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'key',
        'selector': '.key',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': 'rgba(0, 0, 0, 0.5)',
            'padding-y': 8
        }
    }
];
module.exports.theme.colours = colours;
