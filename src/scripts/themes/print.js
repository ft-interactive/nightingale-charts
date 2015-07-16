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

module.exports.colours = colours;
module.exports.theme = [
    //general
    {
        'id': 'svg',
        'selector': 'svg',
        'attributes': {
            'padding-x': 8,
            'padding-y': 10,
            background: 'rgba(255,255,255,1)'
        }
    },
    {
        'selector': 'svg text',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)',
            'stroke': 'none'
        }
    },
    {   'id': 'chart-logo',
        'selector': '.chart-logo',
        'attributes': {
            'display': 'none'
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
        'id': 'axis-tick',
        'selector': '.axis--dependent .tick line, .primary .origin line, .axis--independent .primary .tick line',
        'attributes': {
            'stroke-dasharray': 'none',
            'stroke': 'rgba(54, 51, 52, 1)',
            'stroke-width': 1
        }
    }, {
        'id': 'axis-text',
        'selector': '.axis text',
        'attributes': {
            'font-size': 12,
            'font-family': 'MetricWeb, sans-serif',
            'stroke': 'none',
            'fill': 'rgba(0, 0, 0, 0.8)'
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
        'selector': '.column, .key__column',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 1
        }
    },
    //bars
    {   'id': 'bars',
        'selector': '.bar, .key__bar',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 1
        }
    },
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
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 12,
            'line-height': 14,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'selector': '.chart-subtitle text',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'key',
        'selector': '.key',
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
        'selector': '.chart-source text',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 8,
            'line-height': 10
        }
    }, {
        'id': 'chart-footnote',
        'selector': '.chart-footnote text',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 12,
            'line-height': 16
        }
    }, {
        'selector': '.primary .tick text',
        'attributes': {
            'font-size': 12,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    }, {
        'selector': '.secondary .tick text',
        'attributes': {
            'font-size': 10,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    }
];
module.exports.theme.colours = colours;
