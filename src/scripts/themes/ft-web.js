var colours = {
    line: [
        '#0f5499', '#EB5E8D', '#70DCE6', '#9dbf57', '#7f062e', '#c2b7af', '#ce3140'
    ],
    column: [
        '#1E558C', '#9EE5F3', '#1E8FCC', '#B3325D', '#FF75A3', '#D9CCC3', '#AECC70', '#F34D5B'
    ],
    bar: [
        '#1E558C', '#9EE5F3', '#1E8FCC', '#B3325D', '#FF75A3', '#D9CCC3', '#AECC70', '#F34D5B'
    ],
    accent: '#9e2f50'
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
            'background': 'transparent',
            'padding-y': 14,
            'padding-x': 0
        }
    },
    {
        'id': 'svg-borders',
        'attributes': {
          'width': 60,
          'stroke-width': '4',
          'top': true,
          'bottom': false,
          'left': false,
          'right': false
        }
    },
    //lines
    {
        'id': 'lines',
        'selector': 'path.line, line.key__line',
        'attributes': {
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'square'
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
            'font-size': 16,
            'fill': 'rgba(0, 0, 0, 0.4)'
        }
    },

    //text
    {   'id': 'chart-title',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 22,
            'font-weight': 400,
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 18,
            'fill': 'rgba(102, 96, 92, 1)',
            'padding-y': 5
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 16,
            'fill': 'rgba(102, 96, 92, 1)',
            'line-height': 14,
            'padding-y': -4
        }
    },
    {   'id': 'chart-footnote',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 16,
            'fill': 'rgba(102, 96, 92, 1)',
            'line-height': 14
        }
    },
    {   'id': 'chart-plot',
        'attributes': {
            'full-width': true,
            'padding-x': 0.05
        }
    },
    {   'id': 'chart-logo',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 16,
            'font-style': 'italic',
            'fill': 'rgba(102, 96, 92, 1)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 16,
            'line-height': 16,
            'fill': '#66605C',
            'padding-y': 8
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#e6d9ce',
            'stroke-opacity':'1',
            'stroke-dasharray': 'none'
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#e6d9ce',
            'stroke-opacity':'1',
            'stroke-dasharray': 'none'
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#e6d9ce',
            'stroke-opacity':'1',
            'stroke-dasharray': 'none'
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
            'font-size': 16,
            'font-family': 'MetricWeb, sans-serif',
            'stroke': 'none',
            'fill': '#66605C'
        }
    },
    {   'id': 'axis-secondary-text',
        'selector': '.axis .secondary text',
        'attributes': {
            'font-size': 16,
            'font-family': 'MetricWeb, sans-serif',
            'fill': '#66605C'
        }
    },
    {
        'id': 'x-axis-secondary-text',
        'attributes': {
            'text-anchor': 'middle'
        }
    },
    {
        'id': 'x-axis-text',
        'attributes': {
            'text-anchor': 'middle'
        }
    },
    {
        'id': 'y-axis-line',
        'attributes': {
            'x1': 0
        }
    },
    {
        'id': 'y-axis-text',
        'attributes': {
            'text-anchor': 'end',
            'transform': 'translate( 0, 0 )'
        }
    }
];
module.exports.theme.colours = colours;
