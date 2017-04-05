const PADDING = 8;
const colours = {
    line: [
        'rgb(180,63,51)', 'rgb(92,141,179)', 'rgb(165,174,103)', 'rgb(238,168,88)', 'rgb(163,91,133)', 'rgb(157,153,151)'
    ],
    bar: [
        'rgb(180,63,51)', 'rgb(92,141,179)', 'rgb(165,174,103)', 'rgb(238,168,88)', 'rgb(163,91,133)', 'rgb(157,153,151)'
    ],
    column: [
        'rgb(180,63,51)', 'rgb(92,141,179)', 'rgb(165,174,103)', 'rgb(238,168,88)', 'rgb(163,91,133)', 'rgb(157,153,151)'
    ],
    accent: '#9e2f50',
    border: 'rgb(243, 236, 228)'
};
const gradients = {
    bar: [
        'url(#hgradient--series1)', 'url(#hgradient--series2)', 'url(#hgradient--series3)', 'url(#hgradient--series4)', 'url(#hgradient--series5)', 'url(#hgradient--series6)'
    ],
    column: [
        'url(#gradient--series1)', 'url(#gradient--series2)', 'url(#gradient--series3)', 'url(#gradient--series4)', 'url(#gradient--series5)', 'url(#gradient--series6)'
    ]
};

function linearGradient(id, start, stop, positions){
    const x1 = positions.x1 || 0;
    const x2 = positions.x2 || 0;
    const y1 = positions.y1 || 0;
    const y2 = positions.y2 || 0;
    return ['<linearGradient id="' + id + '" x1="' + x1 + '" x2="' + x2 + '" y1="' + y1 + '" y2="' + y2 + '">',
        '<stop offset="0%" stop-color="' + start + '"/>',
        '<stop offset="100%" stop-color="' + stop + '"/>',
        '</linearGradient>'].join('');
}

function seriesGradient(chart, idPrefix, series, positions){
    const start = colours[chart][series-1];
    const stop = colours[chart][series-1].replace('rgb','rgba').replace(')',',0.5)');
    return linearGradient(idPrefix + series, start, stop, positions);
}

module.exports.defs = {
    'gradient--series1': seriesGradient('column', 'gradient--series', 1, {y2:1}),
    'gradient--series2': seriesGradient('column', 'gradient--series', 2, {y2:1}),
    'gradient--series3': seriesGradient('column', 'gradient--series', 3, {y2:1}),
    'gradient--series4': seriesGradient('column', 'gradient--series', 4, {y2:1}),
    'gradient--series5': seriesGradient('column', 'gradient--series', 5, {y2:1}),
    'gradient--series6': seriesGradient('column', 'gradient--series', 6, {y2:1}),
    'hgradient--series1': seriesGradient('bar', 'hgradient--series', 1, {x1:1}),
    'hgradient--series2': seriesGradient('bar', 'hgradient--series', 2, {x1:1}),
    'hgradient--series3': seriesGradient('bar', 'hgradient--series', 3, {x1:1}),
    'hgradient--series4': seriesGradient('bar', 'hgradient--series', 4, {x1:1}),
    'hgradient--series5': seriesGradient('bar', 'hgradient--series', 5, {x1:1}),
    'hgradient--series6': seriesGradient('bar', 'hgradient--series', 6, {x1:1})
};

// SPECIAL 'non-svg' ATTRIBUTES:
// padding-x: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding-y: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding:   applied to 'text' elements (dressing/index.js does this)
// align:     applied to 'text' elements (dressing/index.js does this)
// background:applied to 'text' elements (dressing/index.js does this)
// position:  absolute. applied to 'text' elements (dressing/index.js does this). means the height isnt accumulated.
// border:    applied to 'line' and 'path' elements (dressing/index.js does this)

module.exports.theme = [
    //general
    {
        'selector': 'path.accent, line.accent, rect.accent',
        'attributes': {
            'stroke': colours.accent
        }
    },
    {
        'id': 'svg',
        'attributes': {
            'padding-x': 52,
            'padding-y': 25,
            'background': 'rgb(229,216,196)'
        }
    },
    { 'id': 'chart',
        'attributes': {
            'padding': PADDING
        }
    },
    { 'id': 'chart-logo',
        'attributes': {
            'display': 'none'
        }
    },

    //lines
    {
        'id': 'lines',
        'attributes': {
            'border': colours.border,
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
        }
    },
    //Columns
    { 'id': 'columns',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 2
        }
    },
    //bars
    { 'id': 'bars',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 2
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
    { 'id': 'chart-title',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 20,
            'padding': PADDING,
            'font-weight': '600',
            'fill': '#ffffff',
            'background': 'rgb(124,120,119)'
        }
    },
    { 'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 14,
            'line-height': 14,
            'fill': '#43423e',
            'padding': PADDING
        }
    },
    { 'id': 'key',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 14,
            'line-height': 16,
            'font-weight': '600',
            'fill': '#43423e',
            'padding': PADDING
        }
    },
    { 'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 12,
            'line-height': 14,
            'fill': '#43423e',
            float: 'right',
            'padding-x': PADDING
        }
    },
    { 'id': 'chart-footnote',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': '#43423e',
            align: 'left',
            'padding-x': PADDING
        }
    },
    { 'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#ffffff',
            'stroke-width': 2
        }
    },
    { 'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#ffffff',
            'stroke-width': 2
        }
    },
    { 'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#ffffff',
            'stroke-width': 2
        }
    },
    // position plot lines, options: 'front', 'back'
    { 'id': 'axis-layer',
        'attributes': {
            'position': 'back'
        }
    },
    {
        'id': 'axis-text',
        'attributes': {
            'font-size': 14,
            'font-family': 'MetricWebSemiBold, sans-serif',
            'stroke': 'none',
            'font-weight': '600',
            'fill': '#43423e'
        }
    },
    {
        'id': 'axis-secondary-text',
        'attributes': {
            'font-size': 12,
            'font-weight': '600',
            'fill': '#43423e'
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
    }
];

module.exports.theme.colours = colours;
module.exports.theme.gradients = gradients;
