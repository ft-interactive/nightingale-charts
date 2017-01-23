var PADDING = 0;
var colours = {
    line: [
        'rgb(0,75,108)', 'rgb(221,183,49)', 'rgb(197,214,203)', 'rgb(172,29,32)', 'rgb(79,163,199)', 'rgb(221,223,240)'
    ],
    bar: [
        'rgb(0,75,108)', 'rgb(0,123,166)', 'rgb(99,163,193)', 'rgb(147,191,197)', 'rgb(197,214,203)', 'rgb(221,223,240)'
    ],
    column: [
        'rgb(0,75,108)', 'rgb(0,123,166)', 'rgb(99,163,193)', 'rgb(147,191,197)', 'rgb(197,214,203)', 'rgb(221,223,240)'
    ],
    accent: 'rgb(221,183,49)'
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
            background: 'rgba(255,255,255,1)'
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
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 1
        }
    },
    //bars
    {   'id': 'bars',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 1
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
            'line-height': 14,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'font-weight': '600',
            'padding': 3,
            'background': 'white',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 8,
            'line-height': 10
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
            'stroke': 'rgba(54, 51, 52, 1)',
            'stroke-width': 1
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(54, 51, 52, 1)',
            'stroke-width': 1
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(54, 51, 52, 1)',
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
            'font-size': 12,
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
    {   'id': 'chart-logo',
        'attributes': {
            'display': 'none'
        }
    }
];
module.exports.theme.colours = colours;
