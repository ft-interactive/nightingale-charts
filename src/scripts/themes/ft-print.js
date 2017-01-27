var PADDING = 0;
var colours = {
    line: [
        "#004b6c","#c99b2d","#bac9b8","#4988ad","#8d221f", "#dee3dd"
    ],
    bar: [
        '#003149', '#006791', '#5288a5', '#80a9ac', '#bac9b8', '#d3e2eb'
    ],
    column: [
        '#003149', '#006791', '#5288a5', '#80a9ac', '#bac9b8', '#d3e2eb'
    ],
    accent: 'rgb(221,183,49)',
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
        'attributes': {
            'padding-x': 8,
            'padding-y': 10,
            background: 'none'
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
    //Columns
    {   'id': 'columns',
        'attributes': {
            'stroke-width': 0
        }
    },
    //bars
    {   'id': 'bars',
        'attributes': {
            'stroke-width': 0
        }
    },
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
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 12,
            'line-height': 12,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 10,
            'line-height': 10,
            'font-weight': 400,
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 10,
            'line-height': 16,
            'font-weight': 300,
            'padding': 3,
            'background': 'white',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 7,
            'line-height': 10,
            'font-weight': 400
        }
    }, {
        'id': 'chart-footnote',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 12,
            'line-height': 16
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#22190f',
            'stroke-width': 1
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#22190f',
            'stroke-width': 1
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#22190f',
            'stroke-width': 1
        }
    },
    // position plot lines, options: 'front', 'back'
    {   'id': 'axis-layer',
        'attributes': {
            'position': 'back'
        }
    },
    {   'id': 'axis-text',
        'attributes': {
            'font-size': '9.6pt',
            'font-family': 'MetricWeb, sans-serif',
            'stroke': 'none',
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'axis-secondary-text',
        'attributes': {
            'font-size': 10,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {
        'id': 'x-axis-text',
        'attributes': {
            'text-anchor': 'start'
        }
    },
    {
        'id': 'y-axis-text',
        'attributes': {
            'text-anchor': 'end'
        }
    },
    {   'id': 'chart-logo',
        'attributes': {
            'display': 'none'
        }
    }
];
module.exports.theme.colours = colours;
