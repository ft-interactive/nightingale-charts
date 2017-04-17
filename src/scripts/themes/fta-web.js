var colours = {
    line: [
        '#ff9246'
    ],
    column: [
        '#ff9246'
    ],
    bar: [
        '#ff9246'
    ],
    accent: '#ff9246'
};

// SPECIAL 'non-svg' ATTRIBUTES:
// padding-x: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding-y: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding:   applied to 'text' elements (dressing/index.js does this)
// align:     applied to 'text' elements (dressing/index.js does this)
// background:applied to 'text' elements (dressing/index.js does this)
// border:    applied to 'line' and 'path' elements (dressing/index.js does this)

module.exports.theme = [
    {
        'selector': 'path.accent, line.accent, rect.accent',
        'attributes': {
            'stroke': colours.accent
        }
    },
    {
        'id': 'svg',
        'selector': 'svg',
        'attributes': {
            'background': '#ffffff'
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
    //    'attributes': {
    //        'stroke': 'none'
    //    }
    //},
    ////Bars
    //{   'id': 'bars',
    //    'attributes': {
    //        'stroke': 'none'
    //    }
    //},
    {
        'id': 'null-label',
        'attributes': {
            'text-anchor': 'middle',
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 0.4)'
        }
    },

    //text
    {   'id': 'chart-title',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 18,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'chart-footnote',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 15,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': 'rgba(0, 0, 0, 0.5)',
            'padding-y': 8
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-dasharray': 'none'
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.1)',
            'stroke-dasharray': '2 2'
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-dasharray': 'none'
        }
    },
    {   'id': 'axis-text',
        'attributes': {
            'font-size': 12,
            'font-family': 'BentonSans, sans-serif',
            'stroke': 'none',
            'fill': '#757470'
        }
    },
    {   'id': 'axis-secondary-text',
        'selector': '.axis .secondary text',
        'attributes': {
            'font-size': 10,
            'fill': '#757470'
        }
    }
];
module.exports.theme.colours = colours;
